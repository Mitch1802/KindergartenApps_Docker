from django.db import models
from django.utils.translation import gettext_lazy as _

from core_apps.common.models import TimeStampedModel


class Konfiguration(TimeStampedModel):
    ort = models.CharField(verbose_name=_("Ort"), max_length=255, unique=True)
    plz =  models.CharField(verbose_name=_("PLZ"), max_length=5)

    def __str__(self):
        return f"{self.ort}"
