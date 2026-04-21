import base64
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from django.conf import settings

from .gmail_auth import get_gmail_credentials


def send_email(to_email: str, subject: str, message: str) -> bool:
    """
    Send an email using Gmail API
    """

    try:
        creds = get_gmail_credentials()
        service = build("gmail", "v1", credentials=creds)

        email_message = MIMEText(message, "plain", "utf-8")
        email_message["To"] = to_email
        email_message["From"] = settings.EMAIL_HOST_USER
        email_message["Subject"] = subject

        raw_message = base64.urlsafe_b64encode(
            email_message.as_bytes()
        ).decode("utf-8")

        service.users().messages().send(
            userId="me",
            body={"raw": raw_message}
        ).execute()

        return True

    except Exception as e:
        print("❌ Gmail send failed:", e)
        return False
