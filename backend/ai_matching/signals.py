from django.db.models.signals import post_save
from django.dispatch import receiver

from pets.models import LostFoundReport
from ai_matching.services import match_pet_images
from ai_matching.models import PetMatch
from django.utils import timezone


@receiver(post_save, sender=LostFoundReport)
def auto_run_ai_matching(sender, instance, created, **kwargs):
    """
    Automatically run AI matching when a Lost/Found report
    becomes active or is newly created as active.
    """

    # Only trigger for active reports
    if instance.status != "active":
        return

    # Must have at least one image
    if not instance.images.exists():
        return

    # Decide opposite report type
    opposite_type = "found" if instance.report_type == "lost" else "lost"

    opposite_reports = (
        LostFoundReport.objects
        .filter(
            report_type=opposite_type,
            status="active"
        )
        .exclude(id=instance.id)
        .filter(images__isnull=False)
        .distinct()
    )

    instance_image = instance.images.first()
    if not instance_image:
        return

    for other in opposite_reports:
        other_image = other.images.first()
        if not other_image:
            continue

        score, is_match = match_pet_images(
            instance_image.image.path,
            other_image.image.path
        )

        if score <= 0:
            continue

        if instance.report_type == "lost":
            lost, found = instance, other
        else:
            lost, found = other, instance

        PetMatch.objects.update_or_create(
            lost_report=lost,
            found_report=found,
            defaults={
                "score": score,
                "matched_on": timezone.now(),
            }
        )
