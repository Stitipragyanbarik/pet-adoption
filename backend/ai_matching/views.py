from django.utils import timezone
from django.db import transaction
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status

from pets.models import LostFoundReport, LostFoundImage
from notifications.services import send_notification
from notifications.gmail_service import send_email

from .models import PetMatch
from .serializers import PetMatchSerializer
from .services import match_pet_images
from .services import auto_confirm_match_if_needed


class RunAIMatchView(APIView):
    """
    Admin endpoint to run AI image matching between
    active LOST and FOUND reports that contain images.
    """

    permission_classes = [IsAdminUser]

    def post(self, request):
        lost_reports = (
            LostFoundReport.objects.filter(
                report_type="lost",
                status="active",
                images__isnull=False,
            )
            .distinct()
        )

        found_reports = (
            LostFoundReport.objects.filter(
                report_type="found",
                status="active",
                images__isnull=False,
            )
            .distinct()
        )

        processed_matches = []

        with transaction.atomic():
            for lost in lost_reports:
                lost_image = lost.images.first()
                if not lost_image:
                    continue

                for found in found_reports:
                    found_image = found.images.first()
                    if not found_image:
                        continue

                    score, is_match = match_pet_images(
                        lost_image.image.path,
                        found_image.image.path,
                    )

                    if score <= 0:
                        continue

                    pet_match, _ = PetMatch.objects.update_or_create(
                        lost_report=lost,
                        found_report=found,
                        defaults={
                            "score": score,
                            "matched_on": timezone.now(),
                        },
                    )

                    auto_confirm_match_if_needed(pet_match)
                    processed_matches.append(pet_match)

        matches = (
            PetMatch.objects.filter(pk__in=[m.pk for m in processed_matches])
            .order_by("-score", "-matched_on")
        )

        return Response(PetMatchSerializer(matches, many=True).data)


class ListMatchesView(APIView):
    """
    Admin endpoint to list all AI-generated matches.
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        matches = PetMatch.objects.all().order_by("-score", "-matched_on")
        return Response(PetMatchSerializer(matches, many=True).data)


class ConfirmMatchView(APIView):
    """
    Admin endpoint to confirm a match.
    """

    permission_classes = [IsAdminUser]

    def post(self, request, match_id):
        try:
            pet_match = PetMatch.objects.select_related(
                "lost_report__user",
                "found_report__user",
            ).get(pk=match_id)
        except PetMatch.DoesNotExist:
            return Response(
                {"detail": "Match not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        pet_match.admin_verified = True
        pet_match.save(update_fields=["admin_verified"])

        lost = pet_match.lost_report
        found = pet_match.found_report

        lost.match_status = "matched"
        found.match_status = "matched"
        lost.matched_report = found
        found.matched_report = lost
        lost.match_score = pet_match.score
        found.match_score = pet_match.score

        lost.save(update_fields=["match_status", "matched_report", "match_score"])
        found.save(update_fields=["match_status", "matched_report", "match_score"])

        return Response(
            {"detail": "Match confirmed successfully."},
            status=status.HTTP_200_OK,
        )

class NotifyMatchView(APIView):
    """
    Admin endpoint to notify BOTH users involved in a confirmed AI match.
    """

    permission_classes = [IsAdminUser]

    def post(self, request, match_id: int):
        try:
            pet_match = PetMatch.objects.select_related(
                "lost_report__user",
                "found_report__user",
            ).get(pk=match_id)
        except PetMatch.DoesNotExist:
            return Response(
                {"detail": "Match not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not pet_match.admin_verified:
            return Response(
                {"detail": "Match must be verified before notifying users."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        lost = pet_match.lost_report
        found = pet_match.found_report

        lost_user = lost.user
        found_user = found.user

        lost_phone = lost_user.phone or "Not provided"
        found_phone = found_user.phone or "Not provided"

        # ==========================
        # IN-APP NOTIFICATIONS
        # ==========================

        lost_message = (
            f"A verified match has been found for your lost pet.\n\n"
            f"Pet: {lost.pet_name or 'Your pet'}\n"
            f"Found Location: {found.location_found}\n"
            f"Match Confidence: {pet_match.score:.2%}\n\n"
            "Please reach out to the finder to proceed."
        )

        found_message = (
            f"🐾 Match confirmed!\n\n"
            f"A pet you reported appears to match a lost pet.\n\n"
            f"Pet Name: {lost.pet_name or 'Unknown'}\n"
            f"Lost Location: {lost.location_found}\n"
            f"Match Confidence: {pet_match.score:.2%}\n\n"
            f"Owner Contact:\n"
            f"Name: {lost_user.username}\n"
            f"Email: {lost_user.email}\n"
            f"Phone: {lost_phone}\n\n"
            "Please contact the owner to help reunite the pet."
        )

        send_notification(
            user=lost_user,
            title="🐾 PetRescue Match Found",
            message=lost_message,
        )

        send_notification(
            user=found_user,
            title="🐾 PetRescue Match Found",
            message=found_message,
        )

        if lost_user.email:
            send_email(
                lost_user.email,
                "🐾 PetRescue: Match Found for Your Lost Pet",
                lost_message,
            )

        if found_user.email:
            send_email(
                found_user.email,
                "🐾 PetRescue: Match Confirmed",
                found_message,
            )

        pet_match.notified = True
        pet_match.save(update_fields=["notified"])

        return Response(
            {"detail": "Both users notified successfully."},
            status=status.HTTP_200_OK,
        )
