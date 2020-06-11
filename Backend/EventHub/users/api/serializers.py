from rest_framework import serializers
from users.models import Organizer, User, Request, OrganizerRequest


class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizer
        fields = ('id', 'address', 'cnic', 'phone_number', 'is_active', 'created_at', 'updated_at')


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_organizer', 'is_admin', 'organizer',
                  'is_active', 'created_at', 'updated_at')


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ('id', 'type', 'status', 'event', 'user', 'is_active', 'created_at', 'updated_at', 'event_title')


class OrganizerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerRequest
        fields = ('id', 'status', 'user', 'is_active', 'created_at', 'updated_at', 'user_name')
