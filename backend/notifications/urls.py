from django.urls import path
from .views import (
    UserNotificationsView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)

urlpatterns = [
    path("", UserNotificationsView.as_view()),
    path("<int:notification_id>/read/", MarkNotificationReadView.as_view()),
    path("read-all/", MarkAllNotificationsReadView.as_view()),
]
