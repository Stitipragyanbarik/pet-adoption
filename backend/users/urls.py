from django.urls import path
from .views import(
    RegisterView,
    LoginView,
    UserDashboardView,
    UserAvatarView,
    UserProfileView,
    ChangePasswordView,
    DeleteAccountView,
    )

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path("dashboard/", UserDashboardView.as_view()),
    path("avatar/", UserAvatarView.as_view(), name="user-avatar"),
    path("profile/", UserProfileView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
    path("delete-account/", DeleteAccountView.as_view()),
]
