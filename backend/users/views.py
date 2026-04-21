from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import(
    RegisterSerializer,
    UserSerializer,
    UserProfileSerializer,
    DeleteAccountSerializer,
)
from pets.models import Pet, LostFoundReport
from pets.serializers import PetListSerializer, LostFoundReportSerializer

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth import logout

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        tokens = get_tokens_for_user(user)

        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            **tokens
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = get_tokens_for_user(user)

        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            **tokens
        })


class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pets = Pet.objects.filter(owner=request.user)
        reports = LostFoundReport.objects.filter(user=request.user)

        return Response({
            "pets": PetListSerializer(pets, many=True).data,
            "reports": LostFoundReportSerializer(reports, many=True).data,
        })

class UserAvatarView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        if user.avatar:
            return Response({
                "avatar": request.build_absolute_uri(user.avatar.url)
            })
        return Response({"avatar": None})

    def post(self, request):
        avatar = request.FILES.get("avatar")

        if not avatar:
            return Response(
                {"error": "No avatar file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.avatar = avatar
        request.user.save()

        return Response({
            "avatar": request.build_absolute_uri(request.user.avatar.url)
        }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import authenticate

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"})

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        serializer = DeleteAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        password = serializer.validated_data.get("password")

        if password:
            if not request.user.check_password(password):
                return Response(
                    {"error": "Incorrect password"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        user = request.user
        logout(request)
        user.delete()

        return Response(
            {"message": "Account deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
