from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, mixins
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework.exceptions import ValidationError

from api.core.permissions import IsPatient

from .models import Option, Order, Product, Question, UserAnswer
from .serializers import CheckoutSerializer, OrderDetailSerializer, ProductSerializer, QuestionSerializer, SubmitAnswerSerializer



class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.select_related("service").all()
    serializer_class = ProductSerializer


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        service_id = self.request.query_params.get("service_id")

        if not service_id:
            raise ValidationError({"error": "service_id query param is required."})

        queryset = Question.objects.filter(
            service_id=service_id
        ).prefetch_related("options")
        return queryset



class SubmitAnswerViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsPatient] 
    serializer_class = SubmitAnswerSerializer

    def perform_create(self, serializer):
        patient = self.request.user.patient_profile
        serializer.save(patient=patient)


class OrderViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsPatient]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CheckoutSerializer
        return OrderDetailSerializer

    def list(self, request):
        product_id = request.query_params.get("product_id")

        if not product_id:
            return Response(
                {"error": "product_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.select_related("service").get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        return Response({
            "user": {
                "email": user.email,
                "phone_number": user.phone_number,
            },
            "product": {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "service": product.service.name,
            },
        })

    def perform_create(self, serializer):
        product = Product.objects.get(
            id=serializer.validated_data["product_id"]
        )
        patient = self.request.user.patient_profile

        serializer.save(
            patient=patient,
            product=product,
            price=product.price,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                "message": "Order placed successfully!",
                "order": OrderDetailSerializer(serializer.instance).data,
            },
            status=status.HTTP_201_CREATED,
        )