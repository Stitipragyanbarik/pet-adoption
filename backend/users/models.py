from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
    bio = models.TextField(blank=True)
    

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="users_custom",
        blank=True,
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="users_custom_permissions",
        blank=True,
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True
    )


    def __str__(self):
        return self.username
