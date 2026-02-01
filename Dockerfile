# Utiliser une image de base Python
FROM python:3.10-slim

# Installer les dependances systeme necessaires
RUN apt-get update && apt-get install -y \
    curl \
    zstd \
    && rm -rf /var/lib/apt/lists/*

# Installer Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Creer et definir le repertoire de travail
WORKDIR /app

# Copier les fichiers de dependances
COPY pyproject.toml .
COPY uv.lock .

# Installer les dependances Python
RUN pip install --no-cache-dir -e .

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port pour Streamlit
EXPOSE 8501

# Commande pour demarrer l'application
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
