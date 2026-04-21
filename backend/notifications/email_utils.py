from django.template.loader import render_to_string
from notifications.gmail_service import send_email

def send_html_email(to_email, subject, content):
    html_message = render_to_string(
        "emails/base.html",
        {"content": content}
    )

    send_email(
        to_email=to_email,
        subject=subject,
        message=html_message,
        is_html=True
    )
