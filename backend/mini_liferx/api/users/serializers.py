from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
 
    class Meta:
        model = User
        fields = ["id", "email", "password", "phone_number"]
 
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
 
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            phone_number=validated_data.get("phone_number", ""),
        )
        return user
 
 
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
 
    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")
        user = authenticate(email=user_obj.email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid credentials.")
 
        data["user"] = user
        return data
 
 
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "phone_number"]