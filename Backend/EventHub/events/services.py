from django.db.models import Q
from decimal import Decimal
from events.api.serializers import EventsSerializer, RegistrationSerializer, ImageTableSerializer
from payment.api.serializers import PaymentSerializer
from users.models import User, Request
from .models import Event, Registration, ImageTable
from datetime import *
from rest_framework.response import Response
from payment.models import Payment
from attendee.api.serializers import AttendeeSerializer
from notification import services
from users.api.serializers import RequestSerializer,UsersSerializer


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


def check_events_happened():
    a = Event.objects.all()
    l = []
    for a1 in a:
        if a1.user not in l:
            l.append(a1.user)
    events2 = Event.objects.filter(status="APPROVED", event_date__lt=date.today())
    for e in events2:
        e.status = "HAPPENED"
        e.save()
        services.notify_all_updated("The Event " + e.title + " has Happened", e, "USER")
    events = Event.objects.filter(status="APPROVED", event_date=date.today())
    for e in events:
        e.status = "HAPPENING TODAY"
        e.save()
        services.notify_all_updated("Reminder : The Event "+e.title+" is Happening Today", e, "USER")
    events2 = Event.objects.filter(status="HAPPENING TODAY", event_date__lt=date.today())
    for e in events2:
        e.status = "HAPPENED"
        e.save()
        a = e.attendee_set.all()
        l = []
        for a1 in a:
            if a1.user not in l:
                l.append(a1.user)
        services.set_notification3("HOW WAS THE EVENT\nGIVE FEEDBACK BY CLICKING THIS NOTIFICATION!", l, e, "USER")
        # services.notify_all_updated("The Event "+e.title+" has Happened Yesterday", e, "USER")


def approve_request(id):
    check_events_happened()
    req = Request.objects.get(id=id)
    if req.type == "UPDATE":
        add_registrations_to_event(req.event)
        change_status2(req.event, "APPROVED")
        services.set_notification("YOU HAVE SUCCESSFULLY UPDATED YOUR EVENT!", req.id, "ORGANIZER")
        services.notify_all_updated("The Event "+req.event_title+" has been updated by the organizer "
                                                                 "of the event", req.event, "USER")
    elif req.type == "DELETE":
        add_registrations_to_event(req.event)
        change_status2(req.event, "DELETED")
        services.set_notification("YOU HAVE SUCCESSFULLY DELETED YOUR EVENT!", req.id, "ORGANIZER")
        services.notify_all_updated("Sorry To Inform you the event " + req.event_title +
                                    " has been deleted by the organizer. If you had any payment then your"
                                    " Payment will be refunded "
                                    "by the organizer as soon as Possible", req.event, "USER")
    elif req.type == "NEW":
        event = req.event
        event.status = "APPROVED"
        event.save()
        services.set_notification("YOU HAVE SUCCESSFULLY CREATED A NEW EVENT!",
                                  req.id, "ORGANIZER")
        services.notify_all("A new Event Has Been Added That Might Be Of Your Interest! \nClick To Regist"
                            "er As Soon As Possible!", req.event, "USER")
    req.status = "APPROVED"
    req.save()


def get_events_category(category):
    check_events_happened()
    events = Event.objects.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY"), event_date__gte=date.today(),
                                  category=category).order_by('-id')
    l = []
    for i in events:
        try:
            l.append(i.imagetable_set.all()[0])
        except IndexError:
            l.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(events, many=True)
    serializer2 = ImageTableSerializer(l, many=True)
    return Response({'events':serializer.data, 'images': serializer2.data})


def get_events():
    check_events_happened()
    events = Event.objects.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY"), event_date__gte=date.today())\
        .order_by('-id')
    l = []
    for i in events:
        try:
            l.append(i.imagetable_set.all()[0])
        except IndexError:
            l.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(events, many=True)
    serializer2 = ImageTableSerializer(l, many=True)
    return Response({'events': serializer.data, 'images': serializer2.data})


def update_e(event, e):
    if event.self is None:
        event.self = e
        event.save()
    else:
        update_e(event.self, e)


def has_requested(e1):
    if e1.status == "REQUESTED":
        req = Request.objects.all()
        for r in req:
            if r.event == e1:
                r.status = "CANCELED"
                r.save()
        e1.status = "CANCELED"
        e1.save()
        if e1.self is not None:
            has_requested(e1.self)
    else:
        if e1.self is not None:
            has_requested(e1.self)


def get_last_event(event):
    if event is None or event.status == "DELETED":
        return None
    if event.status == "APPROVED" or event.status == "HAPPENED" or event.status == "HAPPENING TODAY":
        return event
    return get_last_event(event.self)


def get_event(request):
    check_events_happened()
    event = Event.objects.get(pk=request.data['event'])
    event = get_last_event(event)
    images = None
    try:
        images = event.imagetable_set.all()
    except AttributeError:
        images = []
        images.append(ImageTable.objects.get(pk=4))
    feedback = 0.0
    if event.status == 'HAPPENED':
        attendees = event.attendee_set.all()
        count = 0
        sum = 0
        for a in attendees:
            if a.feedback and a.feedback > 0:
                sum = sum + a.feedback
                count = count + 1
        if count > 0:
            feedback = (float(sum)) / float(count)
    serializer = EventsSerializer(event, many=False)
    serializer2 = ImageTableSerializer(images, many=True)
    return Response({'event': serializer.data, 'images': serializer2.data, 'feedback': feedback})


def delete_event(request):
    check_events_happened()
    e1 = Event.objects.get(id=request.data['event'])
    has_requested(e1)
    e = Event()
    e.title = e1.title
    e.event_date = e1.event_date
    e.venue = e1.venue
    e.total_tickets = e1.total_tickets
    e.price_ticket = e1.price_ticket
    e.category = e1.category
    e.status = "REQUESTED"
    e.limit_for_tickets = e1.limit_for_tickets
    e.sold_tickets = e1.sold_tickets
    e.remaining_tickets = e1.remaining_tickets
    e.description = e1.description
    e.user = e1.user
    e.user_name = e1.user.username
    e.save()
    req = Request()
    req.type = "DELETE"
    req.status = "PENDING"
    req.user = User.objects.get(pk=request.data['user'])
    req.event = e
    req.event_title = e.title
    req.save()
    update_e(e1, e)
    if e.user.is_admin:
        approve_request(req.id)
    return Response({"status": "OK"})


def update_event(request):
    check_events_happened()
    e1 = Event.objects.get(pk=request.data['event'])
    has_requested(e1)
    e = Event()
    e.title = request.data['title']
    try:
        date_obj = datetime.strptime(request.data['event_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        e.event_date = date_obj.date()
    except ValueError:
        e.event_date = request.data['event_date']
    e.venue = request.data['venue']
    e.total_tickets = request.data['total_tickets']
    e.price_ticket = Decimal(request.data['price_ticket'])
    e.remaining_tickets = e1.remaining_tickets
    e.category = request.data['category'][0]
    e.status = "REQUESTED"
    try:
        e.limit_for_tickets = request.data['limit_for_tickets']
    except KeyError:
        e.limit_for_tickets = None
    e.sold_tickets = request.data['sold_tickets']
    e.description = request.data['description']
    e.user = User.objects.get(pk=request.data['user'])
    e.user_name = e.user.username
    e.save()
    req = Request()
    req.type = "UPDATE"
    req.status = "PENDING"
    req.user = User.objects.get(pk=request.data['user'])
    req.event = e
    req.event_title = e.title
    req.save()
    e1 = Event.objects.get(pk=request.data['event'])
    update_e(e1, e)
    if e.user.is_admin:
        approve_request(req.id)
    return Response({"event": e.id})


def add_event(request):
    check_events_happened()
    e = Event()
    e.title = request.data['title']
    date_obj = datetime.strptime(request.data['event_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
    if date_obj.date() < date.today() + timedelta(days=7):
        return Response({'status': "Not OK"})
    e.event_date = date_obj.date()
    e.venue = request.data['venue']
    e.total_tickets = request.data['total_tickets']
    e.price_ticket = Decimal(request.data['price_ticket'])
    e.category = request.data['category'][0]
    e.status = request.data['status']
    e.remaining_tickets = request.data['total_tickets']
    try:
        e.limit_for_tickets = request.data['limit_for_tickets']
    except KeyError:
        e.limit_for_tickets = None
    e.sold_tickets = 0
    e.description = request.data['description']
    e.user = User.objects.get(pk=request.data['user'])
    e.user_name = e.user.username
    e.save()
    req = Request()
    req.type = "NEW"
    req.status = "PENDING"
    req.event_title = e.title
    req.user = User.objects.get(pk=request.data['user'])
    req.event = e
    req.save()
    if e.user.is_admin:
        approve_request(req.id)
    return Response({"event": e.id})


def get_event_registrations(request):
    check_events_happened()
    event = Event.objects.get(pk=request.data['event'])
    r = event.registration_set.all().order_by('-id')
    sold_tickets = 0
    total_payments = Decimal(0)
    for r1 in r:
        sold_tickets = sold_tickets + r1.number_of_tickets
        total_payments = Decimal(total_payments) + Decimal(r1.total_price)
    serializer = RegistrationSerializer(r, many=True)
    return Response({"data": serializer.data, "sold_tickets": sold_tickets, "payments": total_payments})


def get_registered_events(request):
    check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    reg = user.registration_set.all().order_by('-id')
    l = []
    for r in reg:
        l.append(r.event)
    serializer = EventsSerializer(l, many=True)
    return Response(serializer.data)


def get_registered_events_category(request):
    check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    reg = user.registration_set.filter(event__category=request.data['category']).order_by('-id')
    l = []
    for r in reg:
        l.append(r.event)
    serializer = EventsSerializer(l, many=True)
    return Response(serializer.data)


def get_history(event):
    check_events_happened()
    user = event.user
    events = user.event_set.filter(event_date__lt=date.today(), status="HAPPENED")\
        .order_by('-id')
    l = []
    for i in events:
        try:
            l.append(i.imagetable_set.all()[0])
        except IndexError:
            l.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(events, many=True)
    serializer2 = ImageTableSerializer(l, many=True)
    return Response({'events': serializer.data, 'images': serializer2.data})


def get_event_payments(event):
    check_events_happened()
    p = event.payment_set.all()
    serializer = PaymentSerializer(p, many=True)
    return Response(serializer.data)


def get_registrations(request):
    check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    reg = user.registration_set.all().order_by('-id')
    serializer = RegistrationSerializer(reg, many=True)
    return Response(serializer.data)


def get_registrations_category(request):
    check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    regs = user.registration_set.filter(event__category=request.data['category']).order_by('-id')
    serializer = RegistrationSerializer(regs, many=True)
    return Response(serializer.data)


def add_registration(request):
    check_events_happened()
    user = User.objects.get(pk=request.data['user'])
    event = Event.objects.get(pk=request.data['event'])
    p = Payment()
    p.event = event
    try:
        p.method = request.data['method'][0]
        if p.method == 'CashOnSpot':
            r_a = Decimal(0.0)
        else:
            r_a = Decimal(request.data['total_amount'])
    except KeyError:
        p.method = "FREE"
        r_a = Decimal(0.0)
    p.total_amount = Decimal(request.data['total_amount'])
    p.received_amount = r_a
    p.save()
    r = Registration()
    r.event_title = event.title
    r.user = user
    r.event = event
    r.payment = p
    r.number_of_tickets = request.data['number_of_tickets']
    r.price = request.data['price']
    r.voucher_code = ""
    r.total_price = Decimal(request.data['total_amount'])
    r.save()
    if p.method == 'CashOnSpot':
        r.voucher_code = "E" + str(event.id) + "R" + str(r.pk) + "P" + str(p.pk) + 'COS'
    else:
        r.voucher_code = "E"+str(event.id)+"R"+str(r.pk)+"P"+str(p.pk)+p.method[0]
    r.save()
    event.sold_tickets = event.sold_tickets + r.number_of_tickets
    event.remaining_tickets = event.total_tickets - event.sold_tickets
    event.save()
    return Response({'status': 'OK'})


def get_registration(request):
    check_events_happened()
    registration = Registration.objects.get(pk=request.data['id'])
    event = registration.event
    event = get_last_event(event)
    images = None
    try:
        images = event.imagetable_set.all()
    except AttributeError:
        images = []
        images.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(event, many=False)
    serializer2 = ImageTableSerializer(images, many=True)
    serializer3 = RegistrationSerializer(registration, many=False)
    return Response({'event': serializer.data, 'images': serializer2.data, 'registration': serializer3.data})


def get_event_attendees(request):
    check_events_happened()
    event = Event.objects.get(pk=request.data['event'])
    attendees = event.attendee_set.all()
    count = 0
    sum = 0
    for a in attendees:
        if a.feedback and a.feedback > 0:
            sum = sum + a.feedback
            count = count + 1
    try:
        average = float(sum / count)
    except ZeroDivisionError:
        average = 0.0
    l = []
    for a in attendees:
        reg = a.registration
        l.append(reg.payment)
    serializer = AttendeeSerializer(attendees, many=True)
    serializer2 = PaymentSerializer(l, many=True)
    serializer3 = EventsSerializer(event, many=False)
    return Response({'data': serializer.data, 'payments': serializer2.data, 'event': serializer3.data,
                     'feedback': average, 'count': count})


def get_events_2(events):
    l = []
    l2 = []
    for e in events:
        if e.status == "HAPPENING TODAY" or e.status == "APPROVED":
            l.append(e)
            try:
                l2.append(e.imagetable_set.all()[0])
            except IndexError:
                l2.append(ImageTable.objects.get(pk=4))
    serializer = EventsSerializer(l, many=True)
    serializer2 = ImageTableSerializer(l2, many=True)
    return Response({'events': serializer.data, 'images': serializer2.data})


def get_type_events(request):
    check_events_happened()
    if request.data['category'] == 'ALL':
        events = Event.objects.filter(event_date__gte=date.today()).order_by('-id')
    else:
        events = Event.objects.filter(event_date__gte=date.today(), category=request.data['category']).order_by('-id')
    if request.data['type'] == 'ALL':
        return get_events_2(events)
    elif request.data['type'] == 'FREE':
        events = events.filter(price_ticket=Decimal(0)).order_by('-id')
        return get_events_2(events)
    elif request.data['type'] == 'HAPPENING TODAY':
        events = events.filter(status="HAPPENING TODAY").order_by('-id')
        return get_events_2(events)
    elif request.data['type'] == 'WEEK':
        events = events.filter(event_date__lte=date.today()+timedelta(days=7)).order_by('-id')
        return get_events_2(events)


def add_images(request):
    i = ImageTable()
    i.image = request.data['image']
    i.event = Event.objects.get(pk=request.data['event'])
    i.save()
    return Response({'status': 'OK'})


def get_update_event(e):
    events = Event.objects.all()
    for e1 in events:
        if e1.self == e:
            if e1.status == "APPROVED":
                return e1
            return get_update_event(e1)


def get_update_request_events(req):
    event2 = req.event
    event1 = get_update_event(event2)
    images = None
    try:
        images = event1.imagetable_set.all()
    except AttributeError:
        images = []
        images.append(ImageTable.objects.get(pk=4))
    serializer1 = EventsSerializer(event1, many=False)
    serializer2 = EventsSerializer(event2, many=False)
    serializer3 = ImageTableSerializer(images, many=True)
    serializer4 = RequestSerializer(req, many=False)
    return Response({'event1': serializer1.data, 'event2': serializer2.data,
                     'images': serializer3.data, 'request': serializer4.data})


def get_request_data(request):
    req = Request.objects.get(pk=request.data['id'])
    if req.status == 'PENDING':
        if req.type == 'UPDATE':
            return get_update_request_events(req)
        else:
            if req.type == 'NEW':
                event1 = req.event
            else:
                event1 = get_last_event(req.event)
            images = None
            try:
                images = event1.imagetable_set.all()
            except AttributeError:
                images = []
                images.append(ImageTable.objects.get(pk=4))
            serializer1 = EventsSerializer(event1, many=False)
            serializer3 = ImageTableSerializer(images, many=True)
            serializer4 = RequestSerializer(req, many=False)
            return Response({'event1': serializer1.data,
                             'images': serializer3.data, 'request': serializer4.data})
    else:
        event1 = get_last_event(req.event)
        if event1 is None:
            return Response({'status': 'No Data Found'})
        images = None
        try:
            images = event1.imagetable_set.all()
        except AttributeError:
            images = []
            images.append(ImageTable.objects.get(pk=4))
        serializer1 = EventsSerializer(event1, many=False)
        serializer3 = ImageTableSerializer(images, many=True)
        serializer4 = RequestSerializer(req, many=False)
        return Response({'event1': serializer1.data,
                         'images': serializer3.data, 'request': serializer4.data})


def get_event_registrations_and_payments(request):
    check_events_happened()
    event = Event.objects.get(pk=request.data['event'])
    r = event.registration_set.all().order_by('-id')
    l = []
    for r1 in r:
        l.append(r1.payment)
    serializer = RegistrationSerializer(r, many=True)
    serializer2 = PaymentSerializer(l, many=True)
    return Response({"data": serializer.data, "payments": serializer2.data})


def get_admin_events(request):
    events = Event.objects.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY") | Q(status="HAPPENED")).order_by('-id')
    sold = []
    for event in events:
        if event.total_tickets == 0:
            sold.append(str(0))
        else:
            sold.append((float(event.sold_tickets) / float(event.total_tickets)) * 100)
    serializer = EventsSerializer(events, many=True)
    return Response({'events': serializer.data, 'sold': list(sold)})


def get_admin_events_happened(request):
    check_events_happened()
    events = Event.objects.filter(status='HAPPENED')
    sold = []
    sales = []
    feedback = []
    for event in events:
        if event.total_tickets == 0:
            sold.append(0.0)
            sales.append(0.0)
        else:
            sold.append((float(event.sold_tickets) / float(event.total_tickets)) * 100)
            sales.append(float(event.sold_tickets) * float(event.price_ticket))
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
    serializer = EventsSerializer(events, many=True)
    return Response({'events': serializer.data, 'sold': list(sold), 'feedback': list(feedback), 'sales': list(sales)})


def get_admin_events_happening_today(request):
    check_events_happened()
    events = Event.objects.filter(status='HAPPENING TODAY')
    sold = []
    sales = []
    for event in events:
        if event.total_tickets == 0:
            sold.append(0.0)
            sales.append(0.0)
        else:
            sold.append((float(event.sold_tickets) / float(event.total_tickets)) * 100)
            sales.append(float(event.sold_tickets) * float(event.price_ticket))
    serializer = EventsSerializer(events, many=True)
    return Response({'events': serializer.data, 'sold': list(sold), 'sales': list(sales)})


def get_admin_events_approved(request):
    check_events_happened()
    events = Event.objects.filter(status='APPROVED')
    sold = []
    sales = []
    for event in events:
        if event.total_tickets == 0:
            sold.append(0.0)
            sales.append(0.0)
        else:
            sold.append((float(event.sold_tickets) / float(event.total_tickets)) * 100)
            sales.append(float(event.sold_tickets) * float(event.price_ticket))
    serializer = EventsSerializer(events, many=True)
    return Response({'events': serializer.data, 'sold': list(sold), 'sales': list(sales)})


def max1(a, b):
    if a > b:
        return a
    return b


def searchCount(str1, str2):
    arr1 = []
    for i in range(str1.__len__() + 1):
        arr1.append([])
        for j in range(str2.__len__() + 1):
            if i == 0 or j == 0:
                arr1[i].append(0)
            else:
                if str1[i-1] == str2[j-1]:
                    arr1[i].append(arr1[i - 1][j - 1] + 1)
                else:
                    arr1[i].append(max1(arr1[i - 1][j], arr1[i][j - 1]))
    return arr1[str1.__len__()][str2.__len__()]


def search(request):
    str1 = request.data['search']
    user = User.objects.get(pk=int(request.data['user']))
    users = User.objects.all()
    events = Event.objects.filter(Q(status="APPROVED") | Q(status="HAPPENING TODAY") | Q(status="HAPPENED"))
    l1 = []
    l2 = []
    for u in users:
        if u.pk != user.pk:
            l1.append({'count': searchCount(u.username.lower(), str1.lower()), 'user': u})
    for e in events:
        l2.append({'count': searchCount(e.title.lower(), str1.lower()), 'event': e})
    l1.sort(key=lambda x: x['count'], reverse=True)
    l2.sort(key=lambda x: x['count'], reverse=True)
    l3 = []
    l4 = []
    for i in l1[:10]:
        l3.append(i['user'])
    for i in l2[:10]:
        l4.append(i['event'])
    l5 = []
    for i in l4:
        try:
            l5.append(i.imagetable_set.all()[0])
        except IndexError:
            l5.append(ImageTable.objects.get(pk=4))
    serializer1 = EventsSerializer(l4, many=True)
    serializer2 = UsersSerializer(l3, many=True)
    serializer3 = ImageTableSerializer(l5, many=True)
    return Response({'users': serializer2.data, 'events': serializer1.data, 'images':serializer3.data})


