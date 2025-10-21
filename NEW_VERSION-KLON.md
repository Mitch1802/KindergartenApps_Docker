# Neue Version

## Zu ändernde Datein
- .env
- frontend/package.json
- frontend/src/environments/environment.ts
- frontend/src/environments/environment.prod.ts
- install/app_manager.sh

# Neuer Klon
## Anpassungen Datein
- frontend/src/app/_service/global-data.service.ts -> Name WebApp
- frontend/src/assets/images/... -> Logos austauschen
- frontend/src/environments/environment.ts -> API Version anpassen
- frontend/src/environments/environment.prod.ts -> URL und API Version anpassen
- frontend/src/index.html -> Titel anpassen
- frontend/src/theme.sass -> Name Theme
- frontend/package.json -> Versionsanpassung
- install/... -> Readme, App_Manager und Docker-Compose anpassen
- .env -> Version, API Version, Docker Repo anpassen
- README.md

## Github Actions Secrets neu setzen
- DOCKERHUB_USERNAME
- DOCKERHUB_PASSWORD
