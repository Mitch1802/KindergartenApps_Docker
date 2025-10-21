from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class BackupConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.backup"
    verbose_name = _("Backup")
