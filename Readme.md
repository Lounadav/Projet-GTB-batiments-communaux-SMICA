# Projet GTB pour Bâtiments Communaux - SMICA (Session 2026)

## Présentation Générale
Le SMICA (Syndicat Mixte) souhaite proposer un service de **Gestion Technique du Bâtiment (GTB)** à ses adhérents (mairies, écoles) afin de suivre et réduire les coûts énergétiques.

Le système s'appuie sur des capteurs et passerelles industrielles communiquant en **LoRaWAN**.

### Objectifs du Système
* **Surveillance :** Consommation d'énergie, température, humidité, qualité de l'air (CO2) et présence.
* **Commande :** Pilotage de l'éclairage et du chauffage.
* **Interface :** Visualisation des données pour les élus et pilotage pour les responsables.

## Architecture Technique
L'infrastructure est composée de :
- **Réseau de capteurs :** Milesight UG65, AM103, UC300.
- **Backend :** Serveur Node.js sous Docker.
- **Frontend :** Interface Web (HTML/CSS/JS).
- **Sécurité/Réseau :** Pare-feu StormShield, OPNSense, Wazuh (SIEM).

## Organisation du Dépôt
- `/IoT` : Configuration gateway et Node-Red.
- `/Frontend` : Code source de l'interface utilisateur.
- `/Backend` : API, Base de données et supervision.
- `/Reseau` : Configurations réseau, pare-feu et Docker.

**Établissement :** Lycée CARNUS - Rodez 