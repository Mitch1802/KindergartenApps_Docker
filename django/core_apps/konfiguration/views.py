import os
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from core_apps.common.permissions import HasAnyRolePermission
from core_apps.backup.views import backup_path
from core_apps.users.models import Role
from core_apps.users.serializers import RoleSerializer
    
    
class BackupRollenGetView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasAnyRolePermission.with_roles("ADMIN")]

    def get(self, request, *args, **kwargs):
        backups = os.listdir(backup_path)
        rollen = RoleSerializer(Role.objects.all(), many=True).data
        return Response({"backups": backups, "rollen": rollen})
