from django.db import models

class Socio(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=255,default="Asunción")
    cedula = models.CharField(max_length=20,unique=True)
    telefono = models.CharField(max_length=20)
    direccion = models.TextField()
    fecha_solicitud = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=20,default="Pendiente")
    
    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.cedula}"
    
