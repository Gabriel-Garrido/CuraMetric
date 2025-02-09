from rest_framework import serializers
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.serializers import RegisterSerializer

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField()
    is_google_user = serializers.BooleanField(default=False)

    def save(self, request):
        user = super().save(request)
        user.is_google_user = self.validated_data.get('is_google_user', False)
        user.save()
        return user
