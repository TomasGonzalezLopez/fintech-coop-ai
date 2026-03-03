from django.contrib import admin
from .models import Socio, Solicitud

@admin.register(Socio)
class SocioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'cedula', 'telefono', 'ciudad', 'estado','barrio')
    list_filter = ('estado', 'fecha_solicitud')
    search_fields = ('nombre', 'apellido', 'cedula')
    ordering = ('-fecha_solicitud',)

@admin.register(Solicitud)
class SolicitudAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cedula', 'monto', 'plazo', 'cuota', 'tipo_credito', 'estado')
    list_filter = ('estado', 'tipo_credito')
    search_fields = ('nombre', 'cedula')