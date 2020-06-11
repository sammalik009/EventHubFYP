from .views import AttendeeViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Attendees', AttendeeViewSet, basename='attendee')
urlpatterns = router.urls
# from django.urls import path
# from . import views

# urlpatterns = [
#    path('Attendees/', views.AttendeeListView.as_view(), name=''),
#    path('Attendees/<pk>/', views.AttendeeDetailView.as_view(), name=''),
# ]
