from django.contrib import admin

# Register your models here.

from .models import Product, Service, Question, UserAnswer, Order
admin.site.register(Product)
admin.site.register(Service)
admin.site.register(Question)
admin.site.register(UserAnswer)
admin.site.register(Order)