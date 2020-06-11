from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import User, Organizer, Request, OrganizerRequest
from .serializers import RequestSerializer, UsersSerializer, OrganizerSerializer, OrganizerRequestSerializer
from users import services as user_services
"""
from allauth.account.models import EmailAddress
from events import services as event_services
from events.api.serializers import EventsSerializer
"""


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    @action(detail=False, methods=['post'])
    def get_requests(self, request):
        return user_services.get_requests(request)

    @action(detail=False, methods=['post'])
    def approve_request(self, request):
        return user_services.approve_request(request.data['id'])

    @action(detail=False, methods=['post'])
    def disapprove_request(self, request):
        return user_services.disapprove_request(request)

    @action(detail=False, methods=['post'])
    def get_requests_type(self, request):
        return user_services.get_requests_type(request)

    @action(detail=False, methods=['post'])
    def get_user_requests(self, request):
        return user_services.get_user_requests(request)

    @action(detail=False, methods=['post'])
    def get_user_requests_type(self, request):
        return user_services.get_user_requests_type(request)


class OrganizerViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizerSerializer
    queryset = Organizer.objects.all()

    @action(detail=False, methods=['post'])
    def add_organizer(self, request):
        return user_services.add_organizer(request)

    @action(detail=False, methods=['post'])
    def get_organizer(self, request):
        return user_services.get_organizer(request)

    @action(detail=False, methods=['post'])
    def update_organizer(self, request):
        return user_services.update_organizer(request)


class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UsersSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['post'])
    def get_user_event(self, request):
        return user_services.get_user_event(request)

    @action(detail=False, methods=['post'])
    def get_user_events(self, request):
        return user_services.get_user_events(request)

    @action(detail=False, methods=['post'])
    def get_user_events_category(self, request):
        return user_services.get_user_events_category(request)

    @action(detail=False)
    def get_admin_organizers(self, request):
        return user_services.get_admin_organizers(request)

    @action(detail=False)
    def get_admin_users(self, request):
        return user_services.get_admin_users(request)

    @action(detail=False, methods=['post'])
    def get_complete_user_data(self, request):
        return user_services.get_complete_user_data(request)

    @action(detail=False)
    def get_admins(self, request):
        return user_services.get_admins(request)

    @action(detail=False, methods=['post'])
    def activate(self, request):
        """
        user = User.objects.get(pk=request.data['user'])
        user.active = True
        user.save()
        email = EmailAddress.objects.get(user=user)
        email.verified = True
        email.save()
        serializer = self.get_serializer(User.objects.get(pk=request.data['user']), many=False)
        return Response({'status': 'T',
                         'user': serializer.data})
        """
        return user_services.activate(request)

    @action(detail=False, methods=['post'])
    def get_user(self, request):
        return user_services.get_user(request)

    @action(detail=False, methods=['post'])
    def check_verification(self, request):
        return user_services.check_verification(request)

    @action(detail=False, methods=['post'])
    def check_login(self, request):
        user = User.objects.all()
        for u in user:
            if u.name == request.data['username'] and u.password == request.data['password']:
                return Response({'status': 'password valid'})
        return Response({'status': 'password invalid'})

    @action(detail=False, methods=['post'])
    def mark_attendence(self, request):
        user_services.mark_attendence(request)

    @action(detail=False, methods=['post'])
    def signup(self, request):
        users = User.objects.all()
        for user in users:
            if user.email == request.data['email'] or user.name == request.data['username']:
                return Response({'status': 'invalid'})
        u = User()
        u.name = request.data['username']
        u.password = request.data['password']
        u.email = request.data['email']
        u.save()
        return Response({'status': 'password valid'})

    @action(detail=False)
    def login(self, request):
        request.session['name'] = 'usama'
        request.session['password'] = 'usama'
        return Response('Logged In')

    @action(detail=False)
    def logout(self, request):
        request.session.flush()
        return Response("Logged Out")


class OrganizerRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = OrganizerRequest.objects.all()

    @action(detail=False)
    def get_requests(self, request):
        return user_services.get_organizer_requests()

    @action(detail=False, methods=['post'])
    def get_requests_type(self, request):
        return user_services.get_organizer_requests_type(request)

    @action(detail=False, methods=['post'])
    def approve_request(self, request):
        return user_services.approve_organizer_request(request.data['id'])

    @action(detail=False, methods=['post'])
    def disapprove_request(self, request):
        return user_services.disapprove_organizer_request(request.data['id'])

    @action(detail=False, methods=['post'])
    def get_organizer_request(self, request):
        return user_services.get_organizer_request(request.data['user'])

    @action(detail=False, methods=['post'])
    def delete_organizer_request(self, request):
        return user_services.delete_organizer_request(request.data['user'])
