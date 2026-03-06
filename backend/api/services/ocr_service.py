import os
import json
import logging
import requests
import base64
import re
from io import BytesIO
from PIL import Image

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        self.api_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
        self.api_url = "https://api-inference.huggingface.co/models/llava-hf/llava-1.5-7b-hf"

    def extract_cedula_data(self, image_file):
        if not self.api_token:
            logger.error("HUGGINGFACEHUB_API_TOKEN not found.")
            return {"nombre": "", "cedula": ""}

        try:
            img = Image.open(image_file).convert("RGB")
            img.thumbnail((800, 800)) 
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

            prompt = (
                "USER: <image>\n"
                "Extract the full name (nombre) and ID number (cédula) from this ID card. "
                "Return ONLY a JSON object like this: {\"nombre\": \"TEXT\", \"cedula\": \"NUMBER\"}. "
                "Do not explain anything. ASSISTANT:"
            )

            headers = {"Authorization": f"Bearer {self.api_token}"}
            payload = {
                "inputs": prompt,
                "parameters": {"image": img_str, "max_new_tokens": 100}
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            generated_text = result[0]['generated_text']
            answer = generated_text.split("ASSISTANT:")[-1].strip()

            json_match = re.search(r'\{.*\}', answer, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
            return json.loads(answer)

        except Exception as e:
            logger.error(f"Error en OCRService (HF Free): {e}")
            return {"nombre": "", "cedula": ""}