from .views import NotificationViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Notifications', NotificationViewSet, basename='notification')
urlpatterns = router.urls
# from django.urls import path
# from . import views

# urlpatterns = [
#    path('Notifications/', views.NotificationListView.as_view(), name=''),
#    path('Notifications/<pk>/', views.NotificationDetailView.as_view(), name=''),
# ]
