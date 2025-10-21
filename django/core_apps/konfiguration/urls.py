from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KonfigurationViewSet


router = DefaultRouter()
router.register(r"", KonfigurationViewSet, basename="konfiguration")

urlpatterns = [
    path("", include(router.urls)),
]