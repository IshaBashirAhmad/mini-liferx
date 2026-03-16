from rest_framework import serializers
from .models import Option, Order, Question, Service, Product, UserAnswer


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

class SubmitAnswerSerializer(serializers.ModelSerializer):
    selected_options = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, default=list
    )

    class Meta:
        model = UserAnswer
        fields = ["id", "question", "text_answer", "file_answer", "selected_options"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "question": {"write_only": True},
            "text_answer": {"required": False, "allow_blank": True},
            "file_answer": {"required": False},
        }

    def validate(self, attrs):
        question = attrs["question"]
        question_type = question.question_type

        if question_type == "text":
            text = attrs.get("text_answer", "").strip()
            if not text:
                raise serializers.ValidationError({"text_answer": "text_answer is required."})
            attrs["text_answer"] = text

        elif question_type == "file_upload":
            if not attrs.get("file_answer"):
                raise serializers.ValidationError({"file_answer": "file_answer is required."})

        elif question_type in ["single_select", "multi_select"]:
            selected_ids = attrs.get("selected_options", [])
            if not selected_ids:
                raise serializers.ValidationError({"selected_options": "selected_options are required."})

            if question_type == "single_select" and len(selected_ids) > 1:
                raise serializers.ValidationError({"selected_options": "Only one option allowed for single select."})

            options = Option.objects.filter(id__in=selected_ids, question=question)
            if options.count() != len(selected_ids):
                raise serializers.ValidationError({"selected_options": "Some options do not belong to this question."})

            attrs["resolved_options"] = options

        return attrs

    def create(self, validated_data):
        patient = self.context["request"].user.patient_profile
        question = validated_data["question"]
        question_type = question.question_type

        resolved_options = validated_data.pop("resolved_options", None)
        validated_data.pop("selected_options", None) 

        answer_obj, _ = UserAnswer.objects.get_or_create(
            patient=patient,
            question=question,
            defaults=validated_data
        )

        field_map = {
            "text": ("text_answer", None),
            "file_upload": ("file_answer", None),
            "single_select": ("selected_options", resolved_options),
            "multi_select": ("selected_options", resolved_options),
        }

        field, options = field_map.get(question_type, (None, None))

        if options is not None:
            answer_obj.selected_options.set(options)
        elif field:
            setattr(answer_obj, field, validated_data.get(field))

        answer_obj.save()
        return answer_obj

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
