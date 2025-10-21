from allauth.account.adapter import get_adapter
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Role

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(
        many=True,
        slug_field='key',
        queryset=Role.objects.all()
    )

    def update(self, instance, validated_data):
        if instance.is_superuser:
            validated_data.pop("username", None)

        roles = validated_data.pop("roles", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if roles is not None:
            instance.roles.set(roles)

        return instance

    
    def delete(self, instance):
        if instance.is_superuser:
            raise serializers.ValidationError("Admin-Benutzer können nicht gelöscht werden!")
        instance.delete()

    class Meta:
        model = User
        fields = '__all__'

    def to_representation(self, instance):
        representation = super(UserSerializer, self).to_representation(instance)
        if instance.is_superuser:
            representation["admin"] = True
        return representation

class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=False)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    roles = serializers.ListField(
        child=serializers.CharField(), 
        required=True,
        help_text="Liste von Rollen-Keys (z. B. ['ADMIN', 'FMD'])"
    )

    def get_cleaned_data(self):
        super().get_cleaned_data()
        return {
            "username": self.validated_data.get("username", ""),
            "email": self.validated_data.get("email", ""),
            "password1": self.validated_data.get("password1", ""),
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
            "roles": self.validated_data.get("roles", []),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()

        # Basisdaten setzen
        user.username = self.cleaned_data.get("username")
        user.email = self.cleaned_data.get("email")
        user.first_name = self.cleaned_data.get("first_name")
        user.last_name = self.cleaned_data.get("last_name")
        user.set_password(self.cleaned_data.get("password1"))
        user.save()

        # Rollen setzen
        role_keys = self.cleaned_data.get("roles", [])
        role_objs = Role.objects.filter(key__in=role_keys)
        user.roles.set(role_objs)

        return user

class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "roles"]

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('password',)

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'key', 'verbose_name']