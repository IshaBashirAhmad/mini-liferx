from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from api.core.base import TimeStamp




class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)





class User(AbstractUser):
    username = None
    ROLE_CHOICES = [
        ("patient", "Patient"),
        ("provider", "Provider"),
        ("staff", "Staff"),
    ]
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="patient")

    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    

class Patient(TimeStamp):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_profile")
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.user.email

class Provider(User):
    specialization = models.CharField(max_length=255)
    
    def __str__(self):
        return self.username

class Staff(User):
    position = models.CharField(max_length=255)
    
    def __str__(self):
        return self.username