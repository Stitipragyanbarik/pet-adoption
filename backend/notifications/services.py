from .models import Notification


def send_notification(user, title, message):
    """
    Creates an in-app notification
    """
    Notification.objects.create(
        user=user,
        title=title,
        message=message
    )
