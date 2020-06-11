from rest_framework import viewsets
from rest_framework.decorators import action
from notification import services
from notification.models import Notification
from .serializers import NotificationSerializer
from users.models import User


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    @action(detail=False, methods=['post'])
    def get_notifications(self, request):
        return services.get_notifications(User.objects.get(pk=request.data['user']))

    @action(detail=False, methods=['post'])
    def read_notification(self, request):
        return services.read_notification(Notification.objects.get(pk=request.data['notification']))

    @action(detail=False, methods=['post'])
    def read_all_notifications(self, request):
        return  services.read_all_notifications(request)
