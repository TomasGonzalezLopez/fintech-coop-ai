FROM python:3.11

# Evitar archivos .pyc y asegurar logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /app

# 1. Instalar dependencias del sistema (necesarias para FAISS y SQLite)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Instalar librerías de Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 3. Copiar todo el proyecto
COPY . .

# 4. Configurar variables de entorno para que Python encuentre tus módulos
ENV PYTHONPATH=/app

# 5. Puerto obligatorio para Hugging Face
EXPOSE 7860

# 6. Comando para arrancar
# Usamos 'core.wsgi' porque tu carpeta de configuración se llama 'core'
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:7860", "--timeout", "120"]