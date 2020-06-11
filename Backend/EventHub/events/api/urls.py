from .views import EventViewSet, RegistrationViewSet, ImageTableViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Events', EventViewSet, basename='event')
router.register('Registrations', RegistrationViewSet, basename='registration')
router.register('Images', ImageTableViewSet, basename='registration')
urlpatterns = router.urls
