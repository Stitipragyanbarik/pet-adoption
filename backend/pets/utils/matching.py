import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from pets.models import LostFoundReport
from notifications.services import send_notification
from notifications.gmail_service import send_email

SIMILARITY_THRESHOLD = 0.85

def similarity(v1, v2):
    return cosine_similarity(
        np.array(v1).reshape(1, -1),
        np.array(v2).reshape(1, -1)
    )[0][0]

def match_report(report):
    if not report.embedding:
        return

    opposite_type = "found" if report.report_type == "lost" else "lost"

    candidates = LostFoundReport.objects.filter(
        report_type=opposite_type,
        embedding__isnull=False,
        status="active"
    )

    for candidate in candidates:
        score = similarity(report.embedding, candidate.embedding)

        if score >= SIMILARITY_THRESHOLD:
            notify_users(report, candidate, score)

def notify_users(r1, r2, score):
    send_notification(
        user=r1.user,
        title="Possible Pet Match Found 🐾",
        message=(
            f"We found a pet that looks similar to your report.\n"
            f"Match confidence: {score:.2f}"
        )
    )

    send_notification(
        user=r2.user,
        title="Possible Pet Match Found 🐾",
        message=(
            f"A report closely matches your pet.\n"
            f"Match confidence: {score:.2f}"
        )
    )

    try:
        send_email(
            to_email=r1.user.email,
            subject="Possible Match for Your Pet",
            message="We found a report that may match your pet. Please check PetRescue."
        )
    except:
        pass
