from . import views
from django.conf.urls import url, include

urlpatterns = [
    url('api/', include('notification.api.urls')),
]
