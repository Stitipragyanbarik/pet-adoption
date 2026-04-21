from django.contrib import admin
from .models import Pet, PetImage


class PetImageInline(admin.TabularInline):
    model = PetImage
    extra = 0


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "type",
        "breed",
        "age",
        "location",
        "owner",
        "is_active",
        "created_at",
    )
    list_filter = ("type", "age", "is_active")
    search_fields = ("name", "breed", "location")
    inlines = [PetImageInline]


@admin.register(PetImage)
class PetImageAdmin(admin.ModelAdmin):
    list_display = ("id", "pet", "image")
