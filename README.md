# BiblioTech
Master Project M1

# Prérequis :
- VSCode : installer l'extension "Javascript and Typescript Nightly"
- Les versions les plus anciennes du projet nécéssitaient l'installation d'une extension Chrome pour altérer le CORS origin, les versions actuelles ne sont plus concernées par ce prérequis.

Pour chaque service, vous retrouverez plus d'informations dans le README.md du dossier correspondant.

# Executer le front :
- exécuter les lignes (npm i en mode admin peut être nécessaire) :
```zsh
cd ./my-app
npm i
npm start
```

# Executer le back :
- setup la bdd (voir fichier README.md dans le dossier server)
- exécuter dans un terminal la ligne :
```zsh
cd ./server
npm i
npm start
```

# Executer le service de traitement d'images :
- Installer les dépendances pour la première fois :
```zsh
pip install -r ./ImageProcessingService/requirements.txt
```
- Exécuter dans un terminal :
```zsh
cd ./ImageProcessingService
python server.py
```
Note: le premier lancement nécessitera entre 5 et 10 minutes d'attente avant de démarrer le service afin de télécharger les modèles requis (environ 3Gb).

# Executer l'algorithme de recommandation :
- Télécharger les données additionnelles requises manuellement et setup la bdd (voir fichier README.md dans le dossier recommendation)
- Installer les dépendances pour la première fois :
```zsh
pip install -r ./recommendation/requirements.txt
```
- exécuter dans un terminal les lignes :
```zsh
cd ./recommendation
python server.py
```
