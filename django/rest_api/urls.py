from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView
from core_apps.users.views import ForceLogoutView
from django.urls import include, path
from django.conf import settings


urlpatterns = [
    path(settings.API_URL + "auth/login/", LoginView.as_view(), name="rest_login"),
    path(settings.API_URL + "auth/logout/", ForceLogoutView.as_view(), name="force_logout"),
    path(settings.API_URL + "auth/registration/", RegisterView.as_view(), name="rest_register"),
    path(settings.API_URL + "users/", include("core_apps.users.urls")),
    path(settings.API_URL + "konfiguration/", include("core_apps.konfiguration.urls")),
    path(settings.API_URL + "backup/", include("core_apps.backup.urls")),
    path(settings.API_URL + "files/", include("core_apps.media.urls")),
]
