from rest_framework import serializers
from comments.models import Comment


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'active', 'c_self', 'user', 'event', 'is_active', 'created_at', 'updated_at',
                  'username')

