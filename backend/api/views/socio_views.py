from rest_framework import viewsets
from api.models import Socio
from api.serializers import SocioSerializer

class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    serializer_class = SocioSerializer