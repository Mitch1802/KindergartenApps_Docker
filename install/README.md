# Workflow ab KindergartenApps V1.0.0

Schritt 1: Herunterladen des Install/Update Skriptes
```
curl -sSL -o app_manager.sh "https://raw.githubusercontent.com/Mitch1802/KindergartenApps_Docker/main/install/app_manager.sh"
```
Schritt2: Schreibrechte vergeben
```
chmod +x app_manager.sh
```
Schritt3 Var1: Installationskript ausführen mit übergebenen Version, Domain, Port
```
./app_manager.sh install 1.0.0 kindergarten-apps.at
```
Schritt3 Var2: Updateskript ausführen mit übergebenen Version
```
./app_manager.sh update 1.0.0 
```
