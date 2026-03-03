from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from api.models import Socio, Solicitud

class DashboardStatsView(APIView):
    def get(self, request):
        total_socios = Socio.objects.count()
        total_prestamos = Solicitud.objects.count()
        pendientes = Solicitud.objects.filter(estado__iexact="Pendiente").count()
        aprobados = Solicitud.objects.filter(estado__iexact="Aprobado").count()
        
        ultimas_qs = Solicitud.objects.all().order_by('-id')[:5]
        ultimas_solicitudes = [
            {
                "id": s.id,
                "nombre": s.nombre,
                "subtitulo": f"Monto: {s.monto:,} PYG • Estado: {s.estado}"
            } for s in ultimas_qs
        ]

        por_barrio = list(
            Socio.objects.values('barrio')
            .annotate(total=Count('id'))
            .order_by('-total')
        )

        return Response({
            "total_socios": total_socios,
            "total_prestamos": total_prestamos,
            "pendientes": pendientes,
            "creditos_aprobados": aprobados,
            "ultimas_solicitudes": ultimas_solicitudes,
            "por_barrio": por_barrio,
            "ia_stats": {
                "ocr": 98,
                "rag": 85,
                "riesgo": 92
            }
        })