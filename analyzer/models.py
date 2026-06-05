from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    analyses_used = models.IntegerField(default=0)
    is_paid = models.BooleanField(default=False)

    FREE_LIMIT = 3

    def has_reached_limit(self):
        return not self.is_paid and self.analyses_used >= self.FREE_LIMIT

    def __str__(self):
        return f"{self.user.username} — {self.analyses_used} analyses"