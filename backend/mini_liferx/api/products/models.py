from django.db import models
from django.conf import settings

# Create your models here.


class TimeStamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True



class Service(TimeStamp):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Product(TimeStamp):
    name = models.CharField(max_length=255)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="products", default=1)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Question(TimeStamp):
    Category_Choices = [
        ("general", "General"),
        ("heart_decise", "Heart_Decise"),
        ("hair_loss", "Hair_Loss"),
    ]
    category = models.CharField(max_length=20, choices=Category_Choices, default="general")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()

    def __str__(self):
        return self.question_text
    

class UserAnswer(TimeStamp):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.TextField()


class Order(TimeStamp):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    Status_Choices = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    city = models.CharField(max_length=255)
    address = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status_Choices, default="pending")