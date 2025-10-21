from django.urls import path
from .views import MediaNewsGetFileView

urlpatterns = [
    path("news/<str:filename>", MediaNewsGetFileView.as_view(), name="news-file-get"),
]
