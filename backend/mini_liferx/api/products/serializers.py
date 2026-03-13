from rest_framework import serializers
from .models import Order, Question, Service, Product


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name"]


class ProductSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "service"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "question_text"]


class UserAnswerSubmitSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField()
    )

    def validate_answers(self, value):
        for item in value:
            if "question_id" not in item or "answer" not in item:
                raise serializers.ValidationError(
                    "question_id and answer is required for every answer"
                )
        return value


class CheckoutSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    city = serializers.CharField(max_length=255)
    address = serializers.CharField()

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("This product does not exist.")
        return value


class OrderDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "username",
            "email",
            "product_name",
            "city",
            "address",
            "price",
            "status",
            "created_at",
        ]
