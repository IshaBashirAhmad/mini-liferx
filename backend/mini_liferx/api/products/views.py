from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

from .models import Product, Question, UserAnswer
from .serializers import ProductSerializer, QuestionSerializer, UserAnswerSubmitSerializer


class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.select_related("service").all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.select_related("service").get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)



class QuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service_id = request.query_params.get("service_id")

        if not service_id:
            return Response(
                {"error": "service_id query param are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questions = Question.objects.filter(service_id=service_id)

        if not questions.exists():
            return Response(
                {"error": "no question found for this service."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitAnswersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserAnswerSubmitSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        answers_data = serializer.validated_data["answers"]
        user = request.user

        saved_answers = []
        for item in answers_data:
            question_id = item["question_id"]
            answer_text = item["answer"]

            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                return Response(
                    {"error": f"Question ID {question_id} does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )
            obj, created = UserAnswer.objects.update_or_create(
                user=user,
                question=question,
                defaults={"answer": answer_text}
            )
            saved_answers.append({
                "question_id": question_id,
                "answer": answer_text
            })

        return Response(
            {
                "message": "Answers saved",
                "answers": saved_answers
            },
            status=status.HTTP_201_CREATED
        )

