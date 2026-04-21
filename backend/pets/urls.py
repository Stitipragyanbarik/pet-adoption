from django.urls import path
from .views import (
    CreateAdoptionPetView,
    ListAdoptablePetsView,
    PetDetailView,
    CreateAdoptionRequestView,
    OwnerAdoptionRequestsView,
    UpdateAdoptionRequestStatusView,
    UpdatePetView,
    DeletePetView,

    CreateLostFoundReportView,
    ActiveReportsView,
    LostFoundDetailView,
    UpdateReportStatusView,
    CreateLostFoundResponseView,
    OwnerLostFoundResponsesView,
    UpdateLostFoundResponseStatusView,

    UserPetsView,
    UserReportsView,
    FavoritesView,

    AdminReportsView,
    AdminAnalyticsView,

    DistanceMatrixView,
)

urlpatterns = [

    path("adoption/", ListAdoptablePetsView.as_view()),
    path("adoption/create/", CreateAdoptionPetView.as_view()),
    path("adoption/<int:pk>/", PetDetailView.as_view()),
    path("adoption/<int:pet_id>/update/", UpdatePetView.as_view()),
    path("adoption/<int:pet_id>/delete/", DeletePetView.as_view()),
    path("adoption/<int:pet_id>/request/", CreateAdoptionRequestView.as_view()),
    path("adoption/requests/owner/", OwnerAdoptionRequestsView.as_view()),
    path("adoption/request/<int:request_id>/update/", UpdateAdoptionRequestStatusView.as_view()),

    path("report/create/", CreateLostFoundReportView.as_view()),
    path("reports/active/", ActiveReportsView.as_view()),
    path("reports/<int:pk>/", LostFoundDetailView.as_view()),
    path("reports/<int:report_id>/update-status/", UpdateReportStatusView.as_view()),
    path("reports/<int:report_id>/respond/", CreateLostFoundResponseView.as_view()),
    path("reports/responses/owner/", OwnerLostFoundResponsesView.as_view()),
    path("reports/response/<int:response_id>/update/", UpdateLostFoundResponseStatusView.as_view()),

    path("user/<int:user_id>/pets/", UserPetsView.as_view()),
    path("reports/user/<int:user_id>/", UserReportsView.as_view()),
    path("favorites/", FavoritesView.as_view()),

    path("reports/admin/", AdminReportsView.as_view()),
    path("admin/analytics/", AdminAnalyticsView.as_view()),

    path("pets/distances/", DistanceMatrixView.as_view()),
]
