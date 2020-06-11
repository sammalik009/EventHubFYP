from rest_framework import viewsets
from comments.models import Comment
from .serializers import CommentsSerializer
from rest_framework.decorators import action
from comments import services


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer

    @action(detail=False, methods=['post'])
    def add_comment(self, request):
        return services.add_comment(request)

    @action(detail=False, methods=['post'])
    def get_comments(self, request):
        return services.get_comments(request)

    @action(detail=False, methods=['post'])
    def add_reply(self, request):
        return services.add_reply(request)
