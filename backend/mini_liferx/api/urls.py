from django.urls import path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

from api.users.views import SignupView, LoginView
from api.products.views import OrderViewSet, ProductViewSet, QuestionViewSet, SubmitAnswerViewSet


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"questions", QuestionViewSet, basename="question")
router.register(r"answers", SubmitAnswerViewSet, basename="answers")
router.register(r"orders", OrderViewSet, basename="orders")

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]+ router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)