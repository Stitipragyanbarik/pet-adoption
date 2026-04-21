from django.apps import AppConfig


class AiMatchingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ai_matching"

    def ready(self):
        import ai_matching.signals
