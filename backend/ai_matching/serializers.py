from rest_framework import serializers

from pets.models import LostFoundReport
from pets.serializers import LostFoundReportSerializer

from .models import PetMatch


class PetMatchSerializer(serializers.ModelSerializer):
    lost_report = LostFoundReportSerializer(read_only=True)
    found_report = LostFoundReportSerializer(read_only=True)

    class Meta:
        model = PetMatch
        fields = [
            "id",
            "lost_report",
            "found_report",
            "score",
            "matched_on",
            "notified",
            "admin_verified",
        ]

