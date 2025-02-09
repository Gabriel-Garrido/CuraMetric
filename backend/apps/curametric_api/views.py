from rest_framework import viewsets, permissions, filters
from .models import Patient, wound, wound_care
from .serializers import PatientSerializer, WoundSerializer, WoundCareSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email']
    ordering_fields = ['name', 'date_joined']

class WoundViewSet(viewsets.ModelViewSet):
    queryset = wound.objects.all()
    serializer_class = WoundSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient__name', 'description']
    ordering_fields = ['date_created']

class WoundCareViewSet(viewsets.ModelViewSet):
    queryset = wound_care.objects.all()
    serializer_class = WoundCareSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['wound__description', 'care_description']
    ordering_fields = ['date_of_care']