import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.services.rag_service import CooperativaAdvancedRAG

logger = logging.getLogger(__name__)

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