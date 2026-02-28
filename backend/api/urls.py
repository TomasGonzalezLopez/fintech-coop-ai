from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SocioViewSet, ChatCooperativaView, ExtractCedulaOCRView
router = DefaultRouter()
router.register(r'socios', SocioViewSet)

urlpatterns = [
    path('v1/', include(router.urls)), 
    path('chat/', ChatCooperativaView.as_view(), name='chat-ia'), 
    path('ocr-cedula/', ExtractCedulaOCRView.as_view(), name='ocr-cedula'),
]