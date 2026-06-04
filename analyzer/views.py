import os
import json
from pathlib import Path
from google import genai
from google.genai import types
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv

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