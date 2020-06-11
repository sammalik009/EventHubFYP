import re as regex
from django.views.generic import TemplateView
# import regex as regex
from django.contrib import admin
from django.conf.urls import include, url
from allauth.account.views import confirm_email as allauthemailconfirmation
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    url('api-auth/', include('rest_framework.urls')),
    url('admin/', admin.site.urls),
    url('user/', include('users.urls')),
    url('notification/', include('notification.urls')),
    url('payment/', include('payment.urls')),
    url('attendee/', include('attendee.urls')),
    url('comment/', include('comments.urls')),
    url('event/', include('events.urls')),
    # url('api/token/', TokenObtainPairView.as_view()),
    # url('api/token/refresh/', TokenRefreshView.as_view()),
    url('rest-auth/', include('rest_auth.urls')),
    url('rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/registration/account-confirm-email/(?P<key>{0})/$'.format(regex),
        allauthemailconfirmation, name="account_confirm_email"),
    url("inactive/", views.hello, name="account_inactive"),
    # url(r'^account-confirm-email/(?P<key>[-:\w]+)/$', TemplateView.as_view(),
    #     name='account_confirm_email'),
    url('account/', include('django.contrib.auth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

