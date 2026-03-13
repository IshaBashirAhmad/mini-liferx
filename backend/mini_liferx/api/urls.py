from django.urls import path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from api.users.views import SignupView, LoginView
from api.products.views import CheckoutPreviewView, MyOrdersView, PlaceOrderView, ProductViewSet, QuestionListView, SubmitSingleAnswerView


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),

    # path("products/", ProductListView.as_view(), name="product-list"),
    # path("products/<int:product_id>/", ProductDetailView.as_view(), name="product-detail"),

    path("questions/", QuestionListView.as_view(), name="question-list"),
    path("submit/", SubmitSingleAnswerView.as_view(), name="submit-answers"),

    path("checkout/", CheckoutPreviewView.as_view(), name="checkout-preview"),
    path("place/", PlaceOrderView.as_view(), name="place-order"),
    path("my-orders/", MyOrdersView.as_view(), name="my-orders"),
]+ router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)