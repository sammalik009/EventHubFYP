from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser

from events.models import Event, Registration, ImageTable
from .serializers import RegistrationSerializer, EventsSerializer, ImageTableSerializer
from events import services as event_services
"""
from rest_framework.response import Response
from decimal import Decimal
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import *
from payment.api.serializers import PaymentSerializer
from payment.models import Payment
from users.models import User, Request
"""


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventsSerializer

    @action(detail=False, methods=['post'])
    def get_events_category(self, request):
        return event_services.get_events_category(request.data['category'])

    @action(detail=False, methods=['post'])
    def search(self, request):
        return event_services.search(request)

    @action(detail=False, methods=['post'])
    def get_event(self, request):
        return event_services.get_event(request)

    @action(detail=False)
    def get_events(self, request):
        return event_services.get_events()

    @action(detail=False, methods=['post'])
    def delete_event(self, request):
        return event_services.delete_event(request)

    @action(detail=False, methods=['post'])
    def update_event(self, request):
        return event_services.update_event(request)

    @action(detail=False, methods=['post'])
    def add_event(self, request):
        return event_services.add_event(request)

    @action(detail=False, methods=['post'])
    def get_event_registrations(self, request):
        return event_services.get_event_registrations(request)

    @action(detail=False, methods=['post'])
    def get_event_registrations_and_payments(self, request):
        return event_services.get_event_registrations_and_payments(request)

    @action(detail=False, methods=['post'])
    def get_event_attendees(self, request):
        return event_services.get_event_attendees(request)

    @action(detail=False, methods=['post'])
    def get_type_events(self, request):
        return event_services.get_type_events(request)

    @action(detail=False)
    def get_admin_events(self, request):
        return event_services.get_admin_events(request)

    @action(detail=False, methods=['post'])
    def get_event_payments(self, request):
        event = Event.objects.get(pk=request.data['event'])
        return event_services.get_event_payments(event)

    @action(detail=False, methods=['post'])
    def get_history(self, request):
        event = Event.objects.get(pk=request.data['event'])
        return event_services.get_history(event)

    @action(detail=False, methods=['post'])
    def get_request_data(self, request):
        return event_services.get_request_data(request)

    @action(detail=False)
    def get_admin_events_happened(self, request):
        return event_services.get_admin_events_happened(request)

    @action(detail=False)
    def get_admin_events_approved(self, request):
        return event_services.get_admin_events_approved(request)

    @action(detail=False)
    def get_admin_events_happening_today(self, request):
        return event_services.get_admin_events_happening_today(request)


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    @action(detail=False, methods=['post'])
    def get_registered_events(self, request):
        return event_services.get_registered_events(request)

    @action(detail=False, methods=['post'])
    def get_registered_events_category(self, request):
        return event_services.get_registered_events_category(request)

    @action(detail=False, methods=['post'])
    def get_registration(self, request):
        return event_services.get_registration(request)

    @action(detail=False, methods=['post'])
    def get_registrations(self, request):
        return event_services.get_registrations(request)

    @action(detail=False, methods=['post'])
    def get_registrations_category(self, request):
        return event_services.get_registrations_category(request)

    @action(detail=False, methods=['post'])
    def add_registration(self, request):
        return event_services.add_registration(request)


class ImageTableViewSet(viewsets.ModelViewSet):
    queryset = ImageTable.objects.all()
    serializer_class = ImageTableSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=False, methods=['post'])
    def add_images(self, request):
        """
        i = ImageTable()
        i.image = request.data['image']
        i.event = Event.objects.get(pk=request.data['event'])
        i.save()
        return Response({'status': 'OK'})
        """
        return event_services.add_images(request)