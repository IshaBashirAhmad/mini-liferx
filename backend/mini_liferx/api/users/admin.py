from django.contrib import admin

# Register your models here.

from .models import Patient, User
admin.site.register(User)
admin.site.register(Patient)