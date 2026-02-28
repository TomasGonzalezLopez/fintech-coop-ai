import os
import json
import logging
import google.generativeai as genai
from PIL import Image

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Socio
from .serializers import SocioSerializer
from .services.rag_service import CooperativaAdvancedRAG
from .services.ocr_service import OCRService

logger = logging.getLogger(__name__)
ocr_service = OCRService()

class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    serializer_class = SocioSerializer

try:
    print("Cargando modelos de IA a la memoria")
    rag_system = CooperativaAdvancedRAG()
except Exception as e:
    logger.error(f"Error inicializando RAG: {e}")
    rag_system = None

class ChatCooperativaView(APIView):
    def post(self, request):
        pregunta = request.data.get('question')
        
        if not pregunta:
            return Response({"error": "Debes enviar una pregunta."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not rag_system:
            return Response({"error": "El servicio de IA no está disponible."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            respuesta = rag_system.query(pregunta)
            return Response({"answer": respuesta}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error en consulta RAG: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExtractCedulaOCRView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if 'cedula_image' not in request.FILES:
            return Response({"error": "No se envió ninguna imagen."}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['cedula_image']
        
        try:
            datos = ocr_service.extract_cedula_data(image_file)
            return Response(datos, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error al procesar la cédula: {str(e)}"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)