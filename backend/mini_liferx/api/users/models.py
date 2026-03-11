from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Roles(models.TextChoices):
        PROVIDER = "provider", "Provider"
        STAFF = "staff", "Staff"
        PATIENT = "patient", "Patient"

    email = models.EmailField(unique=True, blank=False, null=False)
    phone_number = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.PATIENT)

    def __str__(self):
        return self.username