from rest_framework.permissions import BasePermission, SAFE_METHODS

class HasAnyRolePermission(BasePermission):
    """
    Erlaubt Zugriff, wenn der Benutzer mindestens eine der angegebenen Rollen hat.
    Verwendung: HasAnyRolePermission.with_roles("ADMIN", "BUCHHALTUNG")
    """

    def __init__(self, *roles):
        self.allowed_roles = roles

    def has_permission(self, request, view):
        user = request.user
        allowed = getattr(self, "allowed_roles", ())
        result = (
            user.is_authenticated
            and hasattr(user, "has_any_role")
            and user.has_any_role(*allowed)
        )
        return result

    @classmethod
    def with_roles(cls, *roles):
        return type(
            f"HasAnyRole_{'_'.join(roles)}_Permission",
            (cls,),
            {
                "__init__": lambda self: cls.__init__(self, *roles),
            },
        )


class IsAdminPermission(HasAnyRolePermission.with_roles("ADMIN")):
    """
    Spezielle Permission für ADMIN User. Nur für Settings oder globalen Einsatz gedacht.
    """
    pass

class HasReadOnlyRolePermission(BasePermission):
    """
    Erlaubt NUR Lesezugriff (GET, HEAD, OPTIONS), und das nur für Benutzer mit bestimmten Rollen.
    Schreibzugriff wird immer verweigert.
    Verwendung:
        HasReadOnlyRolePermission.with_roles("STEUERBERATER")
    """

    def __init__(self, *roles):
        self.allowed_roles = roles

    def has_permission(self, request, view):
        user = request.user

        # Nur Lesezugriffe prüfen
        if request.method in SAFE_METHODS:
            return (
                user.is_authenticated
                and hasattr(user, "has_any_role")
                and user.has_any_role(*self.allowed_roles)
            )

        # Schreibzugriff nie erlaubt
        return False

    @classmethod
    def with_roles(cls, *roles):
        return type(
            f"HasReadOnlyRole_{'_'.join(roles)}_Permission",
            (cls,),
            {
                "__init__": lambda self: cls.__init__(self, *roles),
            },
        )

def any_of(*permission_classes):
    """
    Gibt eine Permission-Klasse zurück, die TRUE ist, wenn mindestens
    eine der gegebenen Permission-Klassen TRUE ist (logisches ODER).
    Kann in DRF's permission_classes-Liste verwendet werden.
    """
    class _AnyOf(BasePermission):
        def has_permission(self, request, view):
            # jede Klasse wird hier instanziiert (ohne Argumente)
            return any(perm().has_permission(request, view) for perm in permission_classes)

        def has_object_permission(self, request, view, obj):
            # wenn eine Klasse kein object-level prüft, behandeln wir das als True,
            # damit die Entscheidung von has_permission dominiert, sofern nötig
            def _obj_ok(perm):
                inst = perm()
                if hasattr(inst, "has_object_permission"):
                    return inst.has_object_permission(request, view, obj)
                return True
            return any(_obj_ok(perm) for perm in permission_classes)

    _AnyOf.__name__ = "AnyOf_" + "_OR_".join(p.__name__ for p in permission_classes)
    return _AnyOf