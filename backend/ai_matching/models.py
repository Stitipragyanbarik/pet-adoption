from django.db import models


class PetMatch(models.Model):
    """
    Stores AI-based similarity matches between lost and found pet reports.
    """

    lost_report = models.ForeignKey(
        "pets.LostFoundReport",
        on_delete=models.CASCADE,
        related_name="lost_matches",
    )
    found_report = models.ForeignKey(
        "pets.LostFoundReport",
        on_delete=models.CASCADE,
        related_name="found_matches",
    )

    score = models.FloatField()
    matched_on = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)
    admin_verified = models.BooleanField(default=False)

    class Meta:
        unique_together = ("lost_report", "found_report")
        ordering = ("-score", "-matched_on")

    def __str__(self) -> str:
        return f"Match L{self.lost_report_id}-F{self.found_report_id}: {self.score:.2f}"

