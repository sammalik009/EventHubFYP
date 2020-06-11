from django.conf.urls import url, include
from . import views

urlpatterns = [
    url('api/', include('payment.api.urls')),
]
