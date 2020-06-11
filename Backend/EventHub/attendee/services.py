from events.models import Event, Registration
from .models import Attendee
from users.models import User
from rest_framework.response import Response


def add_attendee(request):
    event = Event.objects.get(pk=request.data['event'])
    registration = Registration.objects.get(voucher_code=request.data['event'])
    registration.has_attended = True
    registration.save()
    attendee = Attendee()
    attendee.registration = registration
    attendee.event = event
    attendee.user = User.objects.get(pk=request.data['event'])
    attendee.save()
    return Response({'status': 'OK'})


def save_feedback(request):
    attendee = Attendee.objects.get(pk=request.data['attendee'])
    attendee.feedback = int(request.data['feedback'])
    attendee.save()
    return Response({'status': 'OK'})


def add_attendees(request):
    l1 = request.data['list1']
    l2 = request.data['list2']
    for i in range(0, l1.__len__()):
        reg = Registration.objects.get(pk=int(l1[i]['id']))
        if reg.has_attended == False and l2[i] == True:
            reg.has_attended = True
            reg.save()
            a = Attendee()
            a.user = reg.user
            a.event = reg.event
            a.registration = reg
            a.save()
            p = reg.payment
            p.recieved_amount = p.total_amount
            p.save()
    return Response({'status': 'OK'})


def check_feedback(request):
    user = User.objects.get(pk=int(request.data['user']))
    l = []
    try:
        reg = user.registration_set.filter(event__pk=int(request.data['event']), has_attended=True)
        for r in reg:
            l = r.attendee_set.all()
            break
    except:
        return Response({'status': 'YES'})
    if l.__len__() == 0:
        return Response({'status': 'YES'})
    else:
        if l[0].feedback is None or l[0].feedback == 0:
            return Response({'status': 'NO'})
        else:
            return Response({'status': 'YES'})


def save_feedback2(request):
    user = User.objects.get(pk=int(request.data['user']))
    l = []
    try:
        reg = user.registration_set.filter(event__pk=int(request.data['event']), has_attended=True)
        for r in reg:
            l.append(r.attendee_set.all())
    except:
        return Response({'status': 'YES'})
    for i1 in l:
        for i2 in i1:
            i2.feedback = int(request.data['feedback'])
            i2.save()
    return Response({'status': 'YES'})
