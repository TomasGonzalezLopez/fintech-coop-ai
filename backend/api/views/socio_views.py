from rest_framework import viewsets
from api.models import Socio
from api.serializers import SocioSerializer
from django.db.models.functions import Replace
from django.db.models import Value

class SocioViewSet(viewsets.ModelViewSet):
    serializer_class = SocioSerializer
    queryset = Socio.objects.all()

    def get_queryset(self):
        queryset = Socio.objects.all()
        cedula = self.request.query_params.get('cedula', None)
        
        if cedula:
            cedula_busqueda = cedula.replace('.', '').replace(',', '')
            queryset = queryset.annotate(
                cedula_limpia=Replace('cedula', Value('.'), Value(''))
            ).filter(cedula_limpia=cedula_busqueda)
            
        return queryset