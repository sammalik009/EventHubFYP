from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()

"""
class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'email')  # 'first_name', 'last_name')
        read_only_fields = ('email', )
"""


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'is_organizer', 'is_admin', 'is_verified')
        read_only_fields = ('email', )
