from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

from .models import Option, Order, Product, Question, UserAnswer
from .serializers import CheckoutSerializer, OrderDetailSerializer, ProductSerializer, QuestionSerializer


# class ProductListView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         products = Product.objects.select_related("service").all()
#         serializer = ProductSerializer(products, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# class ProductDetailView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request, product_id):
#         try:
#             product = Product.objects.select_related("service").get(id=product_id)
#         except Product.DoesNotExist:
#             return Response(
#                 {"error": "Product not found."},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         serializer = ProductSerializer(product)
#         return Response(serializer.data, status=status.HTTP_200_OK)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.select_related("service").all()
    serializer_class = ProductSerializer


class QuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service_id = request.query_params.get("service_id")

        if not service_id:
            return Response(
                {"error": "service_id query param is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questions = Question.objects.filter(
            service_id=service_id
        ).prefetch_related("options")

        if not questions.exists():
            return Response(
                {"error": "questions does not exist for this service."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitSingleAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question_id = request.data.get("question_id")

        if not question_id:
            return Response(
                {"error": "question_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response(
                {"error": f"Question ID {question_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        answer_obj, _ = UserAnswer.objects.get_or_create(
            user=user,
            question=question
        )

        if question.question_type == "text":
            text = request.data.get("text_answer", "").strip()
            if not text:
                return Response(
                    {"error": "text_answer is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            answer_obj.text_answer = text
            answer_obj.save()

        elif question.question_type == "file_upload":
            file = request.FILES.get("file_answer")
            if not file:
                return Response(
                    {"error": "file_answer is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            answer_obj.file_answer = file
            answer_obj.save()

        elif question.question_type in ["single_select", "multi_select"]:
            selected_ids = request.data.get("selected_options", [])

            if not selected_ids:
                return Response(
                    {"error": "selected_options zaroori hain."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if question.question_type == "single_select" and len(selected_ids) > 1:
                return Response(
                    {"error": "only choose one option in single select"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            options = Option.objects.filter(id__in=selected_ids, question=question)
            if options.count() != len(selected_ids):
                return Response(
                    {"error": "some options are not from this question"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            answer_obj.selected_options.set(options) 
            answer_obj.save()

        return Response(
            {"message": "Answer saved. load next question."},
            status=status.HTTP_201_CREATED
        )


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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product_id = serializer.validated_data["product_id"]
        product = Product.objects.get(id=product_id)

        order = Order.objects.create(
            user=request.user,
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).select_related(
            "product", "product__service"
        ).order_by("-created_at")

        serializer = OrderDetailSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
