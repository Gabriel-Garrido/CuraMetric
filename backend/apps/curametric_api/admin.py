from django.contrib import admin
from .models import Patient, wound, wound_care

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'last_name', 'dob', 'created_at', 'updated_at')
    search_fields = ('name', 'last_name')
    list_filter = ('created_at', 'updated_at')
    ordering = ('created_at',)

@admin.register(wound)
class WoundAdmin(admin.ModelAdmin):
    list_display = ('patient', 'wound_location', 'wound_origin', 'wound_origin_date', 'created_at', 'updated_at')
    search_fields = ('patient__name', 'patient__last_name', 'wound_location')
    list_filter = ('created_at', 'updated_at')
    ordering = ('created_at',)

@admin.register(wound_care)
class WoundCareAdmin(admin.ModelAdmin):
    list_display = ('wound', 'care_date', 'wound_heigh', 'wound_width', 'wound_depth', 'created_at', 'updated_at')
    search_fields = ('wound__patient__name', 'wound__patient__last_name', 'wound__wound_location')
    list_filter = ('created_at', 'updated_at')
    ordering = ('created_at',)