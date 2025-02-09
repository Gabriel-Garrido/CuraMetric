from rest_framework import serializers
from .models import Patient, wound, wound_care

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class WoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = wound
        fields = '__all__'

class WoundCareSerializer(serializers.ModelSerializer):
    class Meta:
        model = wound_care
        fields = '__all__'