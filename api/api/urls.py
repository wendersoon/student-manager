from rest_framework.routers import DefaultRouter

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import (
    SpectacularSwaggerView,
    SpectacularAPIView,
)

from users.views import UserViewSet, CustomTokenObtainPairView
from classes.views import ClassViewSet
from students.views import StudentViewSet

router = DefaultRouter()
router.register(r'api/users', UserViewSet, basename='users')
router.register(r'api/classes', ClassViewSet, basename='classes')
router.register(r'api/students', StudentViewSet, basename='students')

urlpatterns = [

    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('', include(router.urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
