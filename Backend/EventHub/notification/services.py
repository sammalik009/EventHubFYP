from rest_framework.response import Response
from notification.api.serializers import NotificationSerializer
from notification.models import Notification
from users.models import Request, OrganizerRequest, User
from events.models import Registration


def get_notifications(user):
    notifications = user.notification_set.all().order_by('-id')
    count = 0
    for n in notifications:
        if not n.read:
            count = count + 1
    serializer = NotificationSerializer(notifications, many=True)
    return Response({'notifications': serializer.data, 'unread': count})


def notify_all_updated(message, event, n_type):
    registrations = event.registration_set.all()
    l = []
    for r in registrations:
        notify = Notification()
        if r.user not in l:
            l.append(r.user)
            notify.user = r.user
            notify.event = event
            notify.event_title = event.title
            notify.description = message
            notify.read = False
            notify.notification_type = n_type
            notify.save()


def read_notification(notification):
    notification.read = True
    notification.save()
    return Response({"status": "OK"})


def set_notification(message, rid, n_type):
    notify = Notification()
    req = Request.objects.get(pk=rid)
    event = req.event
    notify.user = req.user
    notify.event = req.event
    notify.description = message
    notify.event_title = event.title
    notify.read = False
    notify.notification_type = n_type
    notify.save()


def set_notification2(message, rid, n_type):
    notify = Notification()
    req = OrganizerRequest.objects.get(pk=rid)
    notify.user = req.user
    notify.description = message
    notify.event_title = 'Organizer Request'
    notify.read = False
    notify.notification_type = n_type
    notify.save()


def set_notification3(message, l, e, n_type):
    for u in l:
        notify = Notification()
        notify.user = u
        notify.event = e
        notify.description = message
        notify.event_title = 'Feedback'
        notify.read = False
        notify.notification_type = n_type
        notify.save()


def notify_all(message, event, n_type):
    reg = Registration.objects.filter(event__category=event.category)
    l = []
    for r in reg:
        if r.user not in l and r.user != event.user:
            l.append(r.user)
            notify = Notification()
            notify.user = r.user
            notify.event = event
            notify.event_title = event.title
            notify.description = message
            notify.read = False
            notify.notification_type = n_type
            notify.save()
    """
    users = User.objects.all()
    for u in users:
        if u.id is not event.user.id:
            notify = Notification()
            notify.user = u
            notify.event = event
            notify.event_title = event.title
            notify.description = message
            notify.read = False
            notify.notification_type = n_type
            notify.save()
    """


def set_comment_notifications(message, event, user2, n_type):
    notification = Notification.objects.filter(notification_type=n_type, event__pk=event.pk, user__pk=user2.pk)
    if notification.__len__() == 0:
        notify = Notification()
        notify.user = user2
        notify.event = event
        notify.event_title = event.title
        notify.description = message
        notify.read = False
        notify.notification_type = n_type
        notify.save()
    else:
        for n in notification:
            n.delete()
            notify = Notification()
            notify.user = user2
            notify.event = event
            notify.event_title = event.title
            notify.description = message
            notify.read = False
            notify.notification_type = n_type
            notify.save()
    return Response({'status': 'OK'})


def read_all_notifications(request):
    user = User.objects.get(pk=request.data['user'])
    notifications = user.notification_set.filter(read=False)
    for n in notifications:
        n.read = True
        n.save()
    return Response({'status': 'OK'})