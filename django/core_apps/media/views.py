import os
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework import permissions
from rest_framework.views import APIView


class BaseMediaGetFileView(APIView):
    """Basisklasse für den Dateiabruf von Mediendateien."""
    permission_classes = [permissions.IsAuthenticated]
    subdirectory = ""

    def get(self, request, filename, *args, **kwargs):
        file_path = os.path.join(settings.MEDIA_ROOT, self.subdirectory, filename)

        if not os.path.exists(file_path):
            raise Http404("Datei nicht gefunden!")

        return FileResponse(open(file_path, "rb"), as_attachment=True, filename=filename)


class MediaNewsGetFileView(BaseMediaGetFileView):
    """Abruf von News-Mediendateien."""
    subdirectory = "news"
