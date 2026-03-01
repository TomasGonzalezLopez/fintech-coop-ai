from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from api.services.ocr_service import OCRService

ocr_service = OCRService()

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