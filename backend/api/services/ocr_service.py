import os
import json
import logging
import google.generativeai as genai
from PIL import Image

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        self.api_key = os.environ.get("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            logger.error("GOOGLE_API_KEY not found in environment variables.")

    def extract_cedula_data(self, image_file):
        try:
            if not self.api_key:
                raise ValueError("API Key no funciona.")
            img = Image.open(image_file)

            model = genai.GenerativeModel('gemini-2.5-flash') 
            
            prompt = """
            Eres un sistema OCR experto en documentos paraguayos. 
            Extrae el nombre completo y el número de cédula de identidad de esta imagen.
            
            REGLAS:
            1. Devuelve ÚNICAMENTE un JSON válido.
            2. Estructura: {"nombre": "TOBIAS ELIAN", "cedula": "1.234.567"}
            3. Si el texto no es legible, devuelve los campos vacíos "".
            4. No incluyas explicaciones ni bloques de código markdown.
            """
            
            response = model.generate_content([prompt, img])
            
            texto_limpio = response.text.replace('```json', '').replace('```', '').strip()
            
            return json.loads(texto_limpio)

        except Exception as e:
            logger.error(f"Error en OCRService: {e}")
            raise e