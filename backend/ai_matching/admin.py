from django.contrib import admin

from .models import PetMatch


@admin.register(PetMatch)
class PetMatchAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "lost_report",
        "found_report",
        "score",
        "admin_verified",
        "notified",
        "matched_on",
    )
    list_filter = ("admin_verified", "notified")
    search_fields = (
        "lost_report__pet_name",
        "found_report__pet_name",
        "lost_report__user__username",
        "found_report__user__username",
    )

