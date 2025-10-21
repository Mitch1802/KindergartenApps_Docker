from django.urls import path

from .views import BackupGetPostView, RestorePostView, BackupGetFileView, BackupDeleteView

urlpatterns = [
    path("", BackupGetPostView.as_view(), name="backup-list-create"),
    path("restore/", RestorePostView.as_view(), name="backup-restore"),
    path("file/", BackupGetFileView.as_view(), name="backup-get"),
    path("delete/", BackupDeleteView.as_view(), name="backup-delete"),
]
