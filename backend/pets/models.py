from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Pet(models.Model):
    PET_TYPES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('rabbit', 'Rabbit'),
        ('other', 'Other'),
    ]

    AGE_CHOICES = [
        ('baby', 'Baby'),
        ('young', 'Young'),
        ('adult', 'Adult'),
        ('senior', 'Senior'),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='pets'
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=PET_TYPES)
    breed = models.CharField(max_length=100)
    age = models.CharField(max_length=20, choices=AGE_CHOICES)
    location = models.CharField(max_length=150)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    vaccination_status = models.CharField(max_length=50, blank=True)
    description = models.TextField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PetImage(models.Model):
    pet = models.ForeignKey(
        Pet,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="pets/")

class AdoptionRequest(models.Model):
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name="requests"
    )
    requester = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="adoption_requests"
    )

    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected")
        ],
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

class LostFoundReport(models.Model):
    REPORT_TYPES = [
        ("lost", "Lost"),
        ("found", "Found"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="pet_reports"
    )

    report_type = models.CharField(max_length=10, choices=REPORT_TYPES)
    pet_name = models.CharField(max_length=100, blank=True)
    pet_type = models.CharField(max_length=50)
    breed = models.CharField(max_length=100, blank=True)
    location_found = models.CharField(max_length=255)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    description = models.TextField()
    embedding = models.JSONField(null=True, blank=True)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    match_score = models.FloatField(null=True, blank=True)

    match_status = models.CharField(
        max_length=20,
        choices=[
            ("unmatched", "Unmatched"),
            ("matched", "Matched"),
        ],
        default="unmatched"
    )

    matched_report = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="matched_with"
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.report_type.upper()} - {self.pet_name or 'Unknown'}"


class LostFoundImage(models.Model):
    report = models.ForeignKey(
        LostFoundReport,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="reports/")


User = settings.AUTH_USER_MODEL

class Favorite(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites"
    )
    pet = models.ForeignKey(
        "Pet",
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "pet")

    def __str__(self):
        return f"{self.user} ❤️ {self.pet}"

class LostFoundResponse(models.Model):
    report = models.ForeignKey(
        LostFoundReport,
        on_delete=models.CASCADE,
        related_name="responses"
    )
    responder = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected")
        ],
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to report {self.report.id}"
