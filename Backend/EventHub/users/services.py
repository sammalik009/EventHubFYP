from events.api.serializers import EventsSerializer, ImageTableSerializer
from events.models import Event, ImageTable
from .models import User, Request, Organizer, OrganizerRequest
from rest_framework.response import Response
from users.api.serializers import RequestSerializer, OrganizerSerializer, UsersSerializer, OrganizerRequestSerializer
from notification import services
from events import services as event_services
from allauth.account.models import EmailAddress
from django.db.models import Q


def change_status2(e, status):
    events = Event.objects.all()
    if e.self is None:
        e.status = status
        e.save()
    for e1 in events:
        if e1.self == e:
            if e1.status == "APPROVED":
                e1.status = "UPDATED"
                e1.save()
            change_status2(e1, status)
            break


def add_registrations_to_event2(e, event):
    events = Event.objects.all()
    for e1 in events:
        if e1.self == event:
            if e1.status == "DISAPPROVED" or e1.status == "CANCELED":
                add_registrations_to_event2(e, e1)
            else:
                for i in e1.imagetable_set.all():
                    i.event = e
                    i.save()
                for r in e1.registration_set.all():
                    r.event = e
                    r.save()
            break


def add_registrations_to_event(e):
    events = Event.objects.all()
    for e1 in events:
        if e1.self == e:
            if e1.status == "DISAPPROVED" or e1.status == "CANCELED":
                add_registrations_to_event2(e, e1)
            else:
                for i in e1.imagetable_set.all():
                    i.event = e
                    i.save()
                for r in e1.registration_set.all():
                    r.event = e
                    r.event_title = e.title
                    r.save()
            break


def get_requests(request):
    event_services.check_events_happened()
    requests = Request.objects.filter(Q(user__pk__gt=request.data['user']) | Q(user__pk__lt=request.data['user'])).order_by('-id')
    serializer = RequestSerializer(requests, many=True)
    return Response(serializer.data)


def get_requests_type(request):
    event_services.check_events_happened()
    requests = Request.objects.filter(Q(user__pk__gt=request.data['user']) | Q(user__pk__lt=request.data['user'])
                                      , status=request.data['type'])
    serializer = RequestSerializer(requests, many=True)
    return Response(serializer.data)


def approve_request(id):
    event_services.check_events_happened()
    req = Request.objects.get(id=id)
    if req.type == "UPDATE":
        add_registrations_to_event(req.event)
        change_status2(req.event, "APPROVED")
        services.set_notification("CONGRATULATIONS YOUR REQUEST FOR UPDATE HAS BEEN APPROVED BY THE ADMIN OF "
                                  "THIS SITE!", req.id, "ORGANIZER")
        services.notify_all_updated("The Event "+req.event_title+" has been updated by the organizer "
                                                                 "of the event", req.event, "USER")
    elif req.type == "DELETE":
        add_registrations_to_event(req.event)
        change_status2(req.event, "DELETED")
        services.set_notification("CONGRATULATIONS YOUR REQUEST FOR DELETE HAS BEEN APPROVED BY THE ADMIN OF "
                                  "THIS SITE!", req.id, "ORGANIZER")
        services.notify_all_updated("Sorry To Inform you the event " + req.event_title +
                                    " has been deleted by the organizer. Your Payment will be refunded "
                                    "by the organizer as soon as Possible", req.event, "USER")
    elif req.type == "NEW":
        event = req.event
        event.status = "APPROVED"
        event.save()
        services.set_notification("CONGRATULATIONS YOUR REQUEST HAS BEEN APPROVED BY THE ADMIN OF THIS SITE!",
                                  req.id, "ORGANIZER")
        services.notify_all("A new Event Has Been Added That Might Be Of Your Interest! \nClick To Regist"
                            "er As Soon As Possible!", req.event, "USER")
    req.status = "APPROVED"
    req.save()
    return get_requests()


def get_user_events(request):
    event_services.check_events_happened()
    user = User.objects.get(id=request.data['user'])
    events = user.event_set.filter(Q(status="HAPPENING TODAY") | Q(status="HAPPENED") | Q(status="APPROVED"))\
        .order_by('-id')
    l2 = []
    """
    for e in user.event_set.all().exclude(status="UPDATED").exclude(status="DELETED").exclude(status="CANCELED")\
            .exclude(status="REQUESTED").exclude(status="DISAPPROVED").order_by('-id'):  #   user.event_set.all():
        if e.status == "APPROVED" or e.status == "HAPPENING TODAY" or e.status == "HAPPENED":
            l.append(event_services.get_last_event(e))
    l.sort(key=lambda x: x.id, reverse=True)
    print(l)
    """
    for i in events:
        try:
            l2.append(i.imagetable_set.all()[0])
        except IndexError:
            l2.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(events, many=True)
    serializer2 = ImageTableSerializer(l2, many=True)
    return Response({'events':serializer.data, 'images': serializer2.data})


def get_user_event(request):
    event_services.check_events_happened()
    user = User.objects.get(id=request.data['user'])
    event = user.event_set.get(pk=request.data['event'])
    event = event_services.get_last_event(event)
    images = event.imagetable_set.all()
    """
    images = None
    try:
        print(images)
    except AttributeError:
        images = []
        images.append(ImageTable.objects.get(pk=4))
        print(images)
    """
    serializer = EventsSerializer(event, many=False)
    serializer2 = ImageTableSerializer(images, many=True)
    return Response({'event': serializer.data, 'images': serializer2.data})


def get_user_events_category(request):
    event_services.check_events_happened()
    user = User.objects.get(id=request.data['user'])
    l = []
    events = user.event_set.filter(Q(status="HAPPENING TODAY") | Q(status="HAPPENED") | Q(status="APPROVED"),
                                   category=request.data['category']).order_by('-id')
    for i in events:
        try:
            l.append(i.imagetable_set.all()[0])
        except IndexError:
            l.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(events, many=True)
    serializer2 = ImageTableSerializer(l, many=True)
    return Response({'events': serializer.data, 'images': serializer2.data})


def disapprove_request(request):
    event_services.check_events_happened()
    event_services.check_events_happened()
    req = Request.objects.get(id=request.data['id'])
    req.status = "DISAPPROVED"
    req.save()
    event = req.event
    event.status = "DISAPPROVED"
    event.save()
    services.set_notification("SORRY YOUR REQUEST HAS BEEN DISAPPROVED BY THE ADMIN OF THIS SITE!\n"
                              "BETTER LUCK NEXT TIME", req.id)
    return get_requests(request)


def add_organizer(request):
    event_services.check_events_happened()
    user = User.objects.get(id=request.data['user'])
    o = Organizer()
    o.address = request.data['address']
    o.cnic = request.data['cnic']
    o.phone_number = request.data['phone_number']
    o.save()
    req = OrganizerRequest()
    req.status = 'PENDING'
    req.user = user
    req.user_name = user.username
    req.organizer = o
    req.save()
    return Response({'status': 'OK'})


def get_organizer(request):
    event_services.check_events_happened()
    organizer = Organizer.objects.all()
    user = User.objects.get(pk=request.data['user'])
    o1 = {}
    for o in organizer:
        if o.user == user:
            o1 = o
    serializer = OrganizerSerializer(o1, many=False)
    context = serializer.data
    return Response(context)


def activate(request):
    user = User.objects.get(pk=request.data['user'])
    user.active = True
    user.is_verified = True
    user.save()
    email = EmailAddress.objects.get(user=user)
    email.verified = True
    email.save()
    serializer = UsersSerializer(User.objects.get(pk=request.data['user']), many=False)
    return Response({'status': 'T',
                     'user': serializer.data})


def get_user(request):
    event_services.check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    if user.is_organizer:
        organizer = user.organizer
    else:
        organizer = None
    serializer = UsersSerializer(user, many=False)
    serializer2 = OrganizerSerializer(organizer, many=False)
    return Response({'user': serializer.data, 'organizer': serializer2.data})


def get_user_requests(request):
    event_services.check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    req = user.request_set.all().order_by('-id')
    serializer = RequestSerializer(req, many=True)
    return Response(serializer.data)


def get_user_requests_type(request):
    event_services.check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    requests = user.request_set.filter(status=request.data['type'])
    serializer = RequestSerializer(requests, many=True)
    return Response(serializer.data)


def mark_attendence(request):
    user = User.objects.get(pk=request.data['user'])
    event = Event.objects.get(pk=request.data['event'])
    reg = user.registration_set.filter(event=event)
    for r in reg:
        r.has_attended = True
        r.save()


def get_organizer_requests():
    event_services.check_events_happened()
    requests = OrganizerRequest.objects.all().order_by('-id')
    serializer = OrganizerRequestSerializer(requests, many=True)
    return Response(serializer.data)


def approve_organizer_request(id):
    event_services.check_events_happened()
    req = OrganizerRequest.objects.get(id=id)
    req.status = "APPROVED"
    req.save()
    organizer = req.organizer
    organizer.user = req.user
    organizer.save()
    user = req.user
    user.is_organizer = True
    user.save()
    services.set_notification2("CONGRATULATIONS YOUR REQUEST TO BECOME AN ORGANIZER HAS BEEN APPROVED BY THE ADMIN\n",
                              req.id, 'PROFILE')
    return get_organizer_requests()


def disapprove_organizer_request(id):
    event_services.check_events_happened()
    req = OrganizerRequest.objects.get(id=id)
    req.status = "DISAPPROVED"
    req.save()
    services.set_notification2("SORRY YOUR REQUEST TO BECOME AN ORGANIZER HAS BEEN DISAPPROVED BY THE ADMIN\n",
                              req.id, 'PROFILE')
    return get_organizer_requests()


def get_organizer_request(id):
    user = User.objects.get(id=id)
    req = user.organizerrequest_set.all()
    if req.__len__() == 0:
        return Response({'status': 'NO'})
    else:
        return Response({'status': 'YES'})


def delete_organizer_request(id):
    user = User.objects.get(id=id)
    req = user.organizerrequest_set.all()
    for r in req:
        organizer = r.organizer
        organizer.delete()
        r.delete()
    return Response({'status': 'YES'})


def get_organizer_requests_type(request):
    event_services.check_events_happened()
    requests = OrganizerRequest.objects.filter(Q(user__pk__gt=request.data['user']) |
                                               Q(user__pk__lt=request.data['user']),
                                               status=request.data['type'])
    serializer = OrganizerRequestSerializer(requests, many=True)
    return Response(serializer.data)


def update_organizer(request):
    user = User.objects.get(pk=request.data['user'])
    o = user.organizer
    o1 = Organizer()
    o1.phone_number = request.data['phone_number']
    o1.phone_number = request.data['address']
    o1.phone_number = request.data['cnic']
    o1.save()
    user.organizer = o1
    user.save()
    o.delete()
    return Response({'status': 'OK'})


def get_admin_organizers(request):
    users = User.objects.filter(is_organizer=True, is_admin=False)
    reg = []
    attendees = []
    ratio = []
    organized = []
    sold = []
    rating = []
    count3 = 0
    for u in users:
        reg.append(u.registration_set.all().__len__())
        attendees.append(u.attendee_set.all().__len__())
        count3 = count3 + 1
        try:
            ratio.append(float(u.attendee_set.all().__len__())/float(u.registration_set.all().__len__()))
        except ZeroDivisionError:
            ratio.append(0.0)
        organized.append(u.event_set.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY") | Q(status="HAPPENED"))
                         .__len__())
        total = 0
        sold2 = 0
        count2 = 0
        sum2 = 0.0
        for event in u.event_set.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY") | Q(status="HAPPENED")):
            total = total + event.total_tickets
            sold2 = sold2 + event.sold_tickets
            attendees2 = event.attendee_set.all()
            count = 0
            sum = 0
            for a in attendees2:
                if a.feedback and a.feedback > 0:
                    sum = sum + a.feedback
                    count = count + 1
            if count==0:
                average = 0
            else:
                average = float(sum) / float(count)
            sum2 = sum2 + average
            count2 = count2 + 1
        if count2 == 0:
            rating.append(0)
        else:
            rating.append(float(sum2)/float(count2))
        if total == 0:
            sold.append(0.0)
        else:
            sold.append((float(sold2)/float(total))*100)
    serializer = UsersSerializer(users, many=True)
    return Response({'users': serializer.data, 'registered': list(reg), 'attended': list(attendees),
                     'ratios': list(ratio), 'organized': list(organized), 'sold': list(sold), 'rating': list(rating)})


def get_admin_users(request):
    users = User.objects.filter(is_organizer=False, is_admin=False)
    reg = []
    attendees = []
    ratio = []
    for u in users:
        reg.append(u.registration_set.all().__len__())
        attendees.append(u.attendee_set.all().__len__())
        try:
            ratio.append(float(u.attendee_set.all().__len__())/float(u.registration_set.all().__len__()))
        except ZeroDivisionError:
            ratio.append(0.0)
    serializer = UsersSerializer(users, many=True)
    return Response({'users': serializer.data, 'registered': list(reg), 'attended': list(attendees),
                     'ratios': list(ratio)})


def get_admins(request):
    users = User.objects.filter(is_admin=True)
    reg = []
    attendees = []
    ratio = []
    organized = []
    sold = []
    rating = []
    for u in users:
        reg.append(u.registration_set.all().__len__())
        attendees.append(u.attendee_set.all().__len__())
        try:
            ratio.append(float(u.attendee_set.all().__len__())/float(u.registration_set.all().__len__()))
        except ZeroDivisionError:
            ratio.append(0.0)
        organized.append(u.event_set.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY") | Q(status="HAPPENED"))
                         .__len__())
        total = 0
        sold2 = 0
        count2 = 0
        sum2 = 0.0
        for event in u.event_set.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY") | Q(status="HAPPENED")):
            total = total + event.total_tickets
            sold2 = sold2 + event.sold_tickets
            attendees2 = event.attendee_set.all()
            count = 0
            sum1 = 0
            for a in attendees2:
                if a.feedback and a.feedback > 0:
                    sum1 = sum1 + a.feedback
                    count = count + 1
            if count == 0:
                average = 0
            else:
                average = float(sum1) / float(count)
            sum2 = sum2 + average
            count2 = count2 + 1
        if count2 == 0:
            rating.append(0)
        else:
            rating.append(float(sum2)/float(count2))
        if total == 0:
            sold.append(str(0))
        else:
            sold.append((float(sold2)/float(total))*100)
    serializer = UsersSerializer(users, many=True)
    return Response({'users': serializer.data, 'registered': list(reg), 'attended': list(attendees),
                     'ratios': list(ratio), 'organized': list(organized), 'sold': list(sold), 'rating': list(rating)})


def get_complete_user_data(request):
    user = User.objects.get(pk=request.data['user'])
    serializer = UsersSerializer(user, many=False)
    try:
        ratio = float(user.attendee_set.all().__len__()) / float(user.registration_set.all().__len__())
    except ZeroDivisionError:
        ratio = 0.0
    try:
        user2 = User.objects.get(pk=request.data['user2'])
        flag = True
    except:
        user2 = User()
        flag = False
    if user.is_organizer:
        events = user.event_set.filter(Q(status='APPROVED') | Q(status='HAPPENED') | Q(status='HAPPENING TODAY'))\
            .order_by('-id')
        organizer = user.organizer
        l = []
        feedback = []
        for event in events:
            try:
                l.append(event.imagetable_set.all()[0])
            except IndexError:
                l.append(ImageTable.objects.get(pk=4))
            attendees = event.attendee_set.all()
            count = 0
            sum = 0
            for a in attendees:
                if a.feedback and a.feedback > 0:
                    sum = sum + a.feedback
                    count = count + 1
            if count == 0:
                feedback.append(0.0)
            else:
                feedback.append((float(sum)) / float(count))
        serializer2 = EventsSerializer(events, many=True)
        serializer3 = OrganizerSerializer(organizer, many=False)
        serializer4 = ImageTableSerializer(l, many=True)
        return Response({'events': serializer2.data, 'feedback': list(feedback), 'images': serializer4.data,
                         'organizer': serializer3.data, 'user': serializer.data, 'ratio': ratio})
    elif flag and user2.is_admin and user.organizerrequest_set.filter(status='PENDING').__len__() > 0:
        req = user.organizerrequest_set.filter(status='PENDING')
        serializer2 = OrganizerRequestSerializer(req, many=False)
        return Response({'user': serializer.data, 'ratio': ratio, 'request': serializer2.data})
    return Response({'user': serializer.data, 'ratio': ratio})

