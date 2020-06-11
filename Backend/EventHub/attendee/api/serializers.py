from rest_framework import serializers
from attendee.models import Attendee


class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = ('id', 'feedback', 'registration', 'user', 'event', 'is_active', 'created_at', 'updated_at')
