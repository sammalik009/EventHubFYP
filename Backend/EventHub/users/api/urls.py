from .views import UsersViewSet, RequestViewSet, OrganizerViewSet, OrganizerRequestViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Users', UsersViewSet, basename='user')
router.register('Organizers', OrganizerViewSet, basename='organizer')
router.register('Requests', RequestViewSet, basename='request')
router.register('OrganizerRequests', OrganizerRequestViewSet, basename='organizer_request')
urlpatterns = router.urls

# from django.urls import path
# from . import views

# urlpatterns = [
#    path('Users/', views.UserListView.as_view(), name=''),
#    path('Organizers/', views.OrganizerListView.as_view(), name=''),
#    path('Requests/', views.RequestListView.as_view(), name=''),
#    path('Users/<pk>/', views.UserDetailView.as_view(), name=''),
#    path('Organizers/<pk>/', views.OrganizerDetailView.as_view(), name=''),
#    path('Requests/<pk>/', views.RequestDetailView.as_view(), name=''),
#    path('Value/', views.values_return, name=''),
# ]
