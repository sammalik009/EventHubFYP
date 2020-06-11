from .views import PaymentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Payments', PaymentViewSet, basename='payment')
urlpatterns = router.urls
# from django.urls import path
# from . import views

# urlpatterns = [
#     path('Payments/', views.PaymentListView.as_view(), name=''),
#    path('Payments/<pk>/', views.PaymentDetailView.as_view(), name=''),
# ]
