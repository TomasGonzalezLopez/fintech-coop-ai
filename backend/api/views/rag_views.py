import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.services.rag_service import CooperativaAdvancedRAG

logger = logging.getLogger(__name__)

try:
    print("--- Cargando modelos de IA a la memoria (FAISS + Embeddings + CrossEncoder) ---")
    rag_system = CooperativaAdvancedRAG()
    print("--- Sistema RAG listo para recibir consultas ---")
except Exception as e:
    logger.error(f"Error crítico inicializando RAG: {e}")
    rag_system = None

class ChatCooperativaView(APIView):
    def post(self, request):
        pregunta = request.data.get('question')
        historial = request.data.get('history', [])
        
        if not pregunta:
            return Response(
                {"error": "Debes enviar una pregunta."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not rag_system:
            return Response(
                {"error": "El servicio de IA no está disponible en este momento."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            respuesta = rag_system.query(
                question=pregunta, 
                chat_history=historial
            )
            
            return Response({"answer": respuesta}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error en consulta RAG para la pregunta '{pregunta}': {e}")
            return Response(
                {"error": "Ocurrió un error al procesar tu consulta con la IA."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )