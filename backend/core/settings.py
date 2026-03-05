"""
Django settings for core project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-yfg#m4w$m&#igix9$bx87f#*gxsd=(l#y_i@ig16-5ug^g3a-k')

# SECURITY WARNING: don't run with debug turned on in production!
# En Hugging Face, si no pones la variable DEBUG=True en Settings, será False por defecto.
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# --- CONFIGURACIÓN DE HOSTS (Crucial para evitar Bad Request) ---
ALLOWED_HOSTS = [
    'localhost', 
    '127.0.0.1', 
    '.hf.space',           # Para Hugging Face
    '.onrender.com',       # Para Render (si lo usas)
    'fintech-coop-ai.onrender.com'
]

# Application definition
INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',        
    'corsheaders',           
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Siempre primero
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (WhiteNoise)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CONFIGURACIÓN DE CORS (Para conectar con Vercel) ---
CORS_ALLOW_ALL_ORIGINS = True # Permite conexiones desde cualquier origen (Vercel, Local, etc.)
CORS_ALLOW_HEADERS = ["*"]

# --- CONFIGURACIÓN DE CSRF (Para formularios y POST) ---
CSRF_TRUSTED_ORIGINS = [
    "https://fintech-coop-ai.vercel.app",
    "https://fintech-coop-or6mski9z-tomasgonzalezpy-4881s-projects.vercel.app",
    "https://*.hf.space"
]