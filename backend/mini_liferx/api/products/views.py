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


class CheckoutPreviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        product_id = request.query_params.get("product_id")

        if not product_id:
            return Response(
                {"error": "product_id query param is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.select_related("service").get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "product not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        return Response(
            {
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
            },
            status=status.HTTP_200_OK,
        )


class PlaceOrderView(APIView):
    permission_classes = [IsPatient]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product_id = serializer.validated_data["product_id"]
        product = Product.objects.get(id=product_id)
        patient = request.user.patient_profile

        order = Order.objects.create(
            patient=patient,
            product=product,
            city=serializer.validated_data["city"],
            address=serializer.validated_data["address"],
            price=product.price,
        )

        return Response(
            {
                "message": "Order placed!",
                "order": OrderDetailSerializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )

class MyOrdersView(APIView):
    permission_classes = [IsPatient] 

    def get(self, request):
        patient = request.user.patient_profile

        orders = Order.objects.filter(
            patient=patient
        ).select_related(
            "product", "product__service"
        ).order_by("-created_at")

        serializer = OrderDetailSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)