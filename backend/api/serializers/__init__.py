# Expose the serializers so they can be easily imported elsewhere
from .socio_serializers import SocioSerializer
from .prestamos_serializers import SolicitudSerializer

# If you add more serializers later, you just expose them here:
# from .ia_serializers import OcrSerializer