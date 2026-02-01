# Fake News Detector

Application de detection de fake news pour les reseaux sociaux utilisant un modele de langage (LLM) pour analyser le contenu des URLs.

## Architecture

![Diagramme d'architecture](./diagramme_projet.jpeg)

## Fonctionnalites

- Analyse du contenu textuel d'une URL via un modele LLM (Ollama)
- Interface web pour soumettre des URLs a analyser
- Extension navigateur pour Bluesky
- Sauvegarde des resultats dans MongoDB

## Prerequis

- Docker
- Git

## Installation

Clonez le repository :

```bash
git clone https://github.com/Thomas-Brvn/Social-Network-Fake-News-Detection.git
cd Social-Network-Fake-News-Detection
```

Construisez l'image Docker :

```bash
docker build -t fake-news-detector .
```

## Utilisation

Lancez le conteneur :

```bash
docker run -p 8000:8000 fake-news-detector
```

Le serveur est accessible sur `http://localhost:8000`

Pour arreter le serveur : `Ctrl + C`

## Stack technique

- Back-end : FastAPI
- LLM : Ollama
- Base de donnees : MongoDB
- Conteneurisation : Docker

## Licence

MIT
