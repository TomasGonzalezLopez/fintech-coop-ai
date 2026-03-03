import os
import sys
import django
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    print("Conexión exitosa")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

from api.models import Socio, Solicitud
from faker import Faker

fake = Faker('es_ES')

def run_seed():
    print("Creando usuarios y préstamos de prueba....")
    
    barrios = ["San Vicente", "Sajonia", "Centro", "Lambaré", "Villa Morra", "Trinidad"]

    for i in range(50):
        s = Socio.objects.create(
            nombre=fake.first_name(),
            apellido=fake.last_name(),
            cedula=str(random.randint(500000, 7000000)),
            telefono="0981" + str(random.randint(100000, 999999)),
            ciudad="Asunción",
            barrio=random.choice(barrios),
            direccion=f"Calle {fake.street_name()} {fake.building_number()}",
            estado=random.choice(["Activo", "Pendiente"])
        )

        Solicitud.objects.create(
            nombre=f"{s.nombre} {s.apellido}",
            cedula=s.cedula,
            monto=random.randint(5000000, 50000000),
            plazo=random.choice([12, 24, 36, 48]),
            cuota=random.randint(400000, 1500000),
            ingresos=random.randint(4000000, 12000000),
            gastos=random.randint(1000000, 4000000),
            tipo_credito=random.choice(["Consumo", "Vivienda"]),
            estado=random.choice(["Pendiente", "Aprobado", "Rechazado"])
        )
        
        if (i + 1) % 10 == 0:
            print(f"  - Procesados {i + 1}/50...")

    print("Base de datos funciono correctamente")

if __name__ == "__main__":
    run_seed()