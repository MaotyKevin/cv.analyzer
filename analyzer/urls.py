from django.urls import path
from . import views

urlpatterns = [
    path('analyze-cv/', views.analyze_cv, name='analyze_cv'),
]