from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum
from api.models import Socio, Solicitud

class DashboardStatsView(APIView):
    def get(self, request):
        return Response({
            "total_socios": Socio.objects.count(),
            "solicitudes_pendientes": Solicitud.objects.filter(estado="Pendiente").count(),
            "creditos_aprobados": Solicitud.objects.filter(estado="Aprobado").count(),
            "por_barrio": Socio.objects.values('barrio').annotate(total=Count('id')).order_by('-total')[:5]
        })