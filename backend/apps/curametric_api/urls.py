from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, WoundViewSet, WoundCareViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'wounds', WoundViewSet)
router.register(r'wound_cares', WoundCareViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
