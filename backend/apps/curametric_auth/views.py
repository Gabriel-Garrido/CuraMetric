from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get("token")

        try:
            id_info = id_token.verify_oauth2_token(token, requests.Request())

            email = id_info.get("email")
            first_name = id_info.get("given_name")
            last_name = id_info.get("family_name")

            user, created = User.objects.get_or_create(email=email, defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "is_google_user": True,
            })

            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "email": user.email,
                "username": user.username
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
