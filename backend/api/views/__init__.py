# Expose the views so urls.py can import them as if they were in a single file
from .socio_views import SocioViewSet
from .rag_views import ChatCooperativaView
from .ocr_views import ExtractCedulaOCRView