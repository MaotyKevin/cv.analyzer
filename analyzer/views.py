import os
import json
import requests
from pathlib import Path
from google import genai
from google.genai import types
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from dotenv import load_dotenv
from .models import UserProfile

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT_PATH = Path(__file__).resolve().parent / "prompts" / "system_prompt.txt"
SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8").strip()

@api_view(['POST'])
def analyze_cv(request):
    cv = request.data.get('cv', '').strip()
    job_description = request.data.get('job_description', '').strip()

    if not cv or not job_description:
        return Response(
            {'error': 'Both cv and job_description are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

        # Usage gate
    if profile.has_reached_limit():
        return Response({
            'error': 'limit_reached',
            'message': 'You have used all your free analyses.',
            'analyses_used': profile.analyses_used,
            'free_limit': UserProfile.FREE_LIMIT,
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        user_message = f"CV:\n{cv}\n\nJob Description:\n{job_description}"

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
            ),
            contents=user_message
        )

        raw = response.text.strip()

        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        result = json.loads(raw)

        # Increment usage only on success
        with transaction.atomic():
            profile.analyses_used += 1
            profile.save()

        result['analyses_used'] = profile.analyses_used
        result['free_limit'] = UserProfile.FREE_LIMIT
        result['is_paid'] = profile.is_paid

        return Response(result, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response(
            {'error': 'AI returned invalid JSON. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ── Auth endpoints ──────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    if not username or not password:
        return Response({'error': 'Username and password are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(user=user)

    return Response({'message': 'Account created successfully.'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    return Response({
        'username': request.user.username,
        'email': request.user.email,
        'analyses_used': profile.analyses_used,
        'free_limit': UserProfile.FREE_LIMIT,
        'is_paid': profile.is_paid,
        'has_reached_limit': profile.has_reached_limit(),
    })