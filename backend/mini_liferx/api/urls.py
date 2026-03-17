from django.urls import path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from api.users.views import SignupView, LoginView
from api.products.views import CheckoutPreviewView, MyOrdersView, PlaceOrderView, ProductViewSet, QuestionViewSet, SubmitAnswerViewSet


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"questions", QuestionViewSet, basename="question")
router.register(r"answers", SubmitAnswerViewSet, basename="answers")

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),

    path("checkout-page/", CheckoutPreviewView.as_view(), name="checkout-preview"),
    path("place-order/", PlaceOrderView.as_view(), name="place-order"),
    path("my-orders/", MyOrdersView.as_view(), name="my-orders"),
]+ router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)