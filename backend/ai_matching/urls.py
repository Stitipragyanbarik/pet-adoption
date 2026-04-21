from django.urls import path

from .views import RunAIMatchView, ListMatchesView, ConfirmMatchView, NotifyMatchView


urlpatterns = [
    path("run/", RunAIMatchView.as_view(), name="ai_run_match"),
    path("matches/", ListMatchesView.as_view(), name="ai_list_matches"),
    path("matches/<int:match_id>/confirm/", ConfirmMatchView.as_view(), name="ai_confirm_match"),
    path("matches/<int:match_id>/notify/", NotifyMatchView.as_view(), name="ai_notify_match"),
]

