from rest_framework import serializers
from .models import Question, Service, Product


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
