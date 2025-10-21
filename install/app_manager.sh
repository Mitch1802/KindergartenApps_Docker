#!/usr/bin/env bash
set -euo pipefail

#############################################
# FESTE VARIABLEN
#############################################
INSTALL_PATH="/srv/kindergartenapps"
DOCKER_USER="mitch122"
API_VERSION="api/v1/"
SOFTWARE_NAME="kindergartenapps"
NETWORK_NAME="kindergartenapps_nw"
DEBUG=False

ACTION=${1:-""}
VERSION=${2:-"1.0.0"}
DOMAIN=${3:-"kindergarten-apps.at"}
PORT=${4:-"1220"}

if [ "$ACTION" != "install" ] && [ "$ACTION" != "update" ]; then
    echo "Usage: app_manager.sh [install|update] [VERSION]"
    echo "Beispiel für Update einer neuen Version: ./app_manager.sh update 1.0.0"
    exit 1
fi

#############################################
# FUNKTION: Installation
#############################################
function do_install() {
    echo "----------------------------------------"
    echo "INSTALLATION WIRD GESTARTET (Version: $VERSION)"
    echo "----------------------------------------"

    # Ordner anlegen
    if [ ! -d "$INSTALL_PATH" ]; then
        mkdir -p "$INSTALL_PATH"
        echo "Ordner $INSTALL_PATH wurde angelegt."
    fi

    # Env-Dateien generieren
    DJANGO_SECRET_KEY=$(openssl rand -hex 32)
    POSTGRES_PASSWORD=$(openssl rand -hex 16)

    mkdir -p "$INSTALL_PATH/.envs"

    cat <<EOF > "$INSTALL_PATH/.env"
DOMAIN=$DOMAIN
NAME=$SOFTWARE_NAME
VERSION=$VERSION
HOST_PORT=$PORT
EOF

    # Zusätzliche Hilfsvariable, die ggf. '-demo' entfernt:
    VERSION_CLEAN=${VERSION/-demo/}

    cat <<EOF > "$INSTALL_PATH/.envs/.django"
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DJANGO_DEBUG=$DEBUG
DJANGO_API_URL=$API_VERSION
VERSION=$VERSION_CLEAN
EOF

    DB_URL="postgres://sh17vFE9ttPIuk1:$POSTGRES_PASSWORD@postgres:5432/app-live"

    cat <<EOF > "$INSTALL_PATH/.envs/.postgres"
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=app-live
POSTGRES_USER=sh17vFE9ttPIuk1
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DATABASE_URL=$DB_URL
EOF

    echo "ENV-Dateien erstellt unter $INSTALL_PATH."

    # Docker Compose File holen
    echo "Lade docker-compose.yml ..."
    curl -sSL -o "$INSTALL_PATH/docker-compose.yml" \
        "https://raw.githubusercontent.com/Mitch1802/KindergartenApps_Docker/main/install/docker-compose.yml" || {
        echo "Fehler beim Herunterladen der docker-compose.yml"
        exit 1
    }
    echo "docker-compose.yml wurde heruntergeladen."

    # Netzwerk erstellen (falls nicht vorhanden)
    if [ -z "$(docker network ls --filter name=^$NETWORK_NAME$ --format='{{ .Name }}')" ]; then
        docker network create "$NETWORK_NAME"
        echo "Netzwerk $NETWORK_NAME erstellt."
    else
        echo "Netzwerk $NETWORK_NAME existiert bereits."
    fi

    cd "$INSTALL_PATH"
    echo "Ziehe Docker Images (pull) ..."
    docker compose pull

    # Container neu starten
    docker compose up -d

    echo "Warte 30 Sekunden, damit alles initialisiert ..."
    sleep 30

    # Django Superuser: Passwort generieren und setzen
    SUPERUSER_PASSWORD=$(openssl rand -hex 4)
    echo "Erstelle Django-Superuser und Rollen (ADMIN, MITGLIED)"

    # (Optional, aber empfohlen) Migrations sicherheitshalber ausführen
    docker compose exec api python manage.py migrate --noinput

    docker compose exec api python manage.py shell -c "\
from django.contrib.auth import get_user_model; \
from core_apps.users.models import Role; \
User = get_user_model(); \
# Superuser anlegen/aktualisieren
u, _ = User.objects.get_or_create(username='admin', defaults={'first_name': 'Created', 'last_name': 'Superuser'}); \
u.is_superuser = True; \
u.is_staff = True; \
u.set_password('$SUPERUSER_PASSWORD'); \
u.save(); \
# Rollen anlegen, falls nicht vorhanden
r_admin, _ = Role.objects.get_or_create(key='ADMIN', defaults={'verbose_name': 'ADMIN'}); \
r_member, _ = Role.objects.get_or_create(key='MITGLIED', defaults={'verbose_name': 'MITGLIED'}); \
# Nur ADMIN-Rolle zuweisen
u.roles.set([r_admin]); \
u.save(); \
print('Admin-Passwort gesetzt: $SUPERUSER_PASSWORD'); \
print('Rollen zugewiesen:', [r.key for r in u.roles.all()])"

    echo "----------------------------------------"
    echo "INSTALLATION ABGESCHLOSSEN."
    echo "----------------------------------------"
}

#############################################
# FUNKTION: Update
#############################################
function do_update() {
    echo "----------------------------------------"
    echo "UPDATE WIRD GESTARTET (Version: $VERSION)"
    echo "----------------------------------------"

    if [ ! -d "$INSTALL_PATH" ]; then
        echo "Fehler: Installationspfad $INSTALL_PATH existiert nicht."
        echo "Bitte zuerst install ausführen, oder Pfad anpassen."
        exit 1
    fi
    cd "$INSTALL_PATH"

    # Container stoppen
    docker compose down

    # Docker-Compose neu herunterladen
    echo "Aktualisiere docker-compose.yml aus GitHub ..."
    curl -sSL -o "docker-compose.yml" \
        "https://raw.githubusercontent.com/Mitch1802/KindergartenApps_Docker/main/install/docker-compose.yml" || {
        echo "Fehler beim Herunterladen der docker-compose.yml"
        exit 1
    }

    # Versions-Eintrag in Env-Files aktualisieren
    echo "Aktualisiere Versionseintrag auf $VERSION in Env-Files ..."
    sed -i "s/^VERSION=.*/VERSION=$VERSION/" .env
    # Hier die bereinigte Version für .envs/.django:
    sed -i "s/^VERSION=.*/VERSION=${VERSION/-demo/}/" .envs/.django

    # Neue Images holen
    echo "Ziehe neue Images (docker compose pull) ..."
    docker compose pull

    # Container neu starten
    docker compose up -d

    # Ungenutzte Volumes entfernen
    docker volume prune -f

    echo "----------------------------------------"
    echo "UPDATE ABGESCHLOSSEN."
    echo "----------------------------------------"
}

# Hauptablauf
case "$ACTION" in
    install)
        do_install
        ;;
    update)
        do_update
        ;;
    *)
        echo "Falscher Parameter. Usage: $0 [install|update] [VERSION]"
        exit 1
        ;;
esac
