from rest_framework import serializers

from .models import Konfiguration


class KonfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Konfiguration
        fields = '__all__'
