from rest_framework import viewsets
from attendee.models import Attendee
from .serializers import AttendeeSerializer
from rest_framework.decorators import action
from attendee import services


class AttendeeViewSet(viewsets.ModelViewSet):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

    @action(detail=False, methods=['post'])
    def add_attendees(self, request):
        return services.add_attendees(request)

    @action(detail=False, methods=['post'])
    def check_feedback(self, request):
        return services.check_feedback(request)

    @action(detail=False, methods=['post'])
    def save_feedback(self, request):
        return services.save_feedback2(request)