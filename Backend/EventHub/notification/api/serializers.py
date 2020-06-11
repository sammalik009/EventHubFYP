from rest_framework import serializers
from notification.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'description', 'read', 'notification_type', 'user', 'event', 'is_active', 'created_at',
                  'updated_at', 'event_title')
