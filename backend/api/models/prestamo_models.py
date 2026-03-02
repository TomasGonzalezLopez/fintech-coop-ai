from django.db import models

class Solicitud(models.Model):
    cedula = models.CharField(max_length=20)
    nombre = models.CharField(max_length=100)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    plazo = models.IntegerField()
    cuota = models.DecimalField(max_digits=10, decimal_places=2)
    ingresos = models.DecimalField(max_digits=10, decimal_places=2)
    gastos = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_credito = models.CharField(max_length=20)
    estado = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre
