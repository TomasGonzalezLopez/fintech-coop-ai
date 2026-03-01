from rest_framework import serializers
from api.models import Socio

class SocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Socio
        fields = '__all__'
        