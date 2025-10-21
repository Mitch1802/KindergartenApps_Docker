from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
            return True
        except ValidationError:
            raise ValueError(_("Die Email ist nicht gültig!"))

    def create_user(
        self,
        username,
        first_name,
        last_name,
        password,
        email=None,
        roles=None,
        **extra_fields
    ):
        if not username:
            raise ValueError(_("Benutzer müssen einen Benutzernamen haben!"))
        if not first_name:
            raise ValueError(_("Benutzer müssen einen Vornamen haben!"))
        if not last_name:
            raise ValueError(_("Benutzer müssen einen Nachnamen haben!"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)

        extra_fields.setdefault("is_superuser", False)

        user = self.model(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)

        # Rollen setzen, falls übergeben (über self.model.Role zugreifen)
        if roles:
            Role = self.model.roles.rel.model  # Zugriff auf Role-Modell über User.roles
            role_objs = Role.objects.filter(key__in=roles)
            user.roles.set(role_objs)

        return user

    def create_superuser(
        self,
        username,
        first_name,
        last_name,
        password,
        email=None,
        **extra_fields
    ):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser müssen is_superuser=True haben!"))
        if not password:
            raise ValueError(_("Superuser müssen ein Passwort haben!"))

        return self.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email,
            roles=["ADMIN"],
            **extra_fields
        )
