import os
from rest_framework import permissions
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Konfiguration
from .serializers import KonfigurationSerializer
from core_apps.common.permissions import HasAnyRolePermission
from core_apps.backup.views import backup_path
from core_apps.users.models import Role
from core_apps.users.serializers import RoleSerializer
    

class KonfigurationViewSet(ModelViewSet):
    queryset = Konfiguration.objects.all()
    serializer_class = KonfigurationSerializer
    permission_classes = [permissions.IsAuthenticated, HasAnyRolePermission.with_roles("ADMIN")]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    lookup_field = "id"
    pagination_class = None 

    def list(self, request, *args, **kwargs):
        resp = super().list(request, *args, **kwargs)
        backups = os.listdir(backup_path)
        rollen = RoleSerializer(Role.objects.all(), many=True).data
        return Response({"main": resp.data, "backups": backups, "rollen": rollen})
