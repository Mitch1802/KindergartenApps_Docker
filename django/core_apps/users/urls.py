from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserListView,
    UserRetrieveUpdateDestroyView,
    ChangePasswordView,
    RoleViewSet,
)

router = DefaultRouter()
router.register("rolle", RoleViewSet, basename="role")

urlpatterns = [
    path("", UserListView.as_view(), name="user-list"),
    path("<uuid:id>/", UserRetrieveUpdateDestroyView.as_view(), name="user-retrieve-update-destroy"),
    path("change_password/<uuid:id>/", ChangePasswordView.as_view(), name="user-change-password"),
    path("", include(router.urls)),
]
