from comments.api.serializers import CommentsSerializer
from django.db.models import Q
from users.models import User
from .models import Comment
from rest_framework.response import Response
from events.models import Event
from notification import services as notification_services


def get_list_user_for_comment(l1):
    str1 = ''
    if l1.__len__() > 3:
        str1 = str1 + '<a href=\'/user_profile/' + str(l1[0].id) + '/\' > ' + l1[0].username + '</a>'
        str1 = str1 + ',<a href=\'/user_profile/' + str(l1[1].id) + '/\' > ' + l1[1].username + '</a>'
        str1 = str1 + ',<a href=\'/user_profile/' + str(l1[2].id) + '/\' > ' + l1[2].username + '</a>'
        str1 = str1 + ' and ' + str(l1.__len__() - 3) + ' others'
    elif l1.__len__() <= 3:
        if l1.__len__() >= 1:
            str1 = str1 + '<a href=\'/user_profile/' + str(l1[0].id) + '/\' > ' + l1[0].username + '</a>'
        if l1.__len__() >= 2:
            str1 = str1 + ',<a href=\'/user_profile/' + str(l1[1].id) + '/\' > ' + l1[1].username + '</a>'
        if l1.__len__() == 3:
            str1 = str1 + ',<a href=\'/user_profile/' + str(l1[2].id) + '/\' > ' + l1[2].username + '</a>'
    """
    elif l1.__len__() == 3:
        str1 = str1 + '<a href=\'/user_profile/' + str(l1[0].id) + '/\' > ' + l1[0].username + '</a>'
        str1 = str1 + ',<a href=\'/user_profile/' + str(l1[1].id) + '/\' > ' + l1[1].username + '</a>'
        str1 = str1 + ',<a href=\'/user_profile/' + str(l1[2].id) + '/\' > ' + l1[2].username + '</a>'
    """
    return str1


def add_comment(request):
    event = Event.objects.get(pk=request.data['event'])
    user = User.objects.get(pk=request.data['user'])
    c = Comment()
    c.event = event
    c.user = user
    c.username = user.username
    c.text = request.data['text']
    c.save()
    user2 = event.user
    l = []
    if user != user2:
        comments = event.comment_set.filter(~Q(user__pk=user2.pk)).order_by('-id')
        for c1 in comments:
            if c1.user not in l:
                l.append(c1.user)
        notification_services.set_comment_notifications(get_list_user_for_comment(l) +
                                                        ' commented on your event : ' + str(event.title),
                                                        event, user2, 'COMMENT_1')
    """
    notification_services.set_comment_notifications(str(l.__len__()) +
                                                    ' people commented on your event : ' + str(event.title),
                                                    event, user2, 'COMMENT_1')
    """
    return Response({'status': 'OK'})


def add_reply(request):
    event = Event.objects.get(pk=request.data['event'])
    user = User.objects.get(pk=request.data['user'])
    comment = Comment.objects.get(pk=request.data['comment'])
    c = Comment()
    c.event = event
    c.user = user
    c.username = user.username
    c.text = request.data['text']
    c.c_self = comment
    c.save()
    comments = Comment.objects.filter(event__pk=request.data['event'], user__pk=comment.user.pk, c_self=None)\
        .order_by('-id')
    user2 = event.user
    l1 = []
    if user != user2:
        comments = event.comment_set.filter(~Q(user__pk=user2.pk)).order_by('-id')
        for c1 in comments:
            if c1.user not in l1:
                l1.append(c1.user)
        notification_services.set_comment_notifications(get_list_user_for_comment(l1) + ' commented on your event : '
                                                        + str(event.title), event,
                                                        user2, 'COMMENT_1')
    """
    notification_services.set_comment_notifications(str(l1.__len__()) + ' people commented on'
                                                                        ' your event : ' + str(event.title), event,
                                                    user2, 'COMMENT_1')
    """
    if user != comment.user and comment.user != user2:
        l = []
        for c2 in comments:
            for c1 in c2.comment_set.all():
                if c1.user not in l and c1.user != comment.user:
                    l.append(c1.user)
        """
        notification_services.set_comment_notifications(str(l.__len__()) +
                                                        ' people replied to your comments on event : '
                                                        + str(event.title), event, comment.user, 'COMMENT_2')
        """
        notification_services.set_comment_notifications(get_list_user_for_comment(l) +
                                                        ' replied to your comments on event : '
                                                        + str(event.title), event, comment.user, 'COMMENT_2')
    elif comment.user == user2:
        l = []
        for c2 in comments:
            for c1 in c2.comment_set.all():
                if c1.user not in l and c1.user != comment.user:
                    l.append(c1.user)
        notification_services.set_comment_notifications(get_list_user_for_comment(l) +
                                                        ' replied to your comments on your event : '
                                                        + str(event.title), event, comment.user, 'COMMENT_2')
    """
    notification_services.set_comment_notifications(str(l.__len__()) +
                                                    ' people replied to your comments on your event : '
                                                    + str(event.title), event, comment.user, 'COMMENT_2')
    """
    return Response({'status': 'OK'})


def get_comments(request):
    event = Event.objects.get(pk=request.data['event'])
    comments = event.comment_set.filter(c_self=None)
    l = []
    for c in comments:
        l.append(CommentsSerializer(c.comment_set.all(), many=True).data)
    serializer = CommentsSerializer(comments, many=True)
    return Response({'comments': serializer.data, 'replies': list(l)})
