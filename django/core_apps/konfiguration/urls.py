from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BackupRollenGetView


from .views import BackupRollenGetView

urlpatterns = [
    path("", BackupRollenGetView.as_view(), name="backup-rollen-list"),
]