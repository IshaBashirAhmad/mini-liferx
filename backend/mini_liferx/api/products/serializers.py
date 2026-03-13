from rest_framework import serializers
from .models import Option, Order, Question, Service, Product


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name"]


class ProductSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "service"]


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "option_text"]


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "question_text", "question_type", "order", "options"]


class SingleAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    text_answer = serializers.CharField(required=False, allow_blank=True)
    selected_options = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list
    )



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
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "email",
            "product_name",
            "city",
            "address",
            "price",
            "status",
            "created_at",
        ]
