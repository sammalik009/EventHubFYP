from rest_framework import serializers
from events.models import Event, Registration, ImageTable


class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'event_date', 'venue', 'total_tickets', 'price_ticket', 'category', 'status',
                  'limit_for_tickets', 'sold_tickets', 'description', 'user', 'is_active', 'created_at', 'updated_at'
                  , 'remaining_tickets', 'user_name')


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ('id', 'number_of_tickets', 'voucher_code', 'price', 'total_price', 'has_attended', 'event', 'user',
                  'payment', 'is_active', 'created_at', 'updated_at', 'event_title')


class ImageTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageTable
        fields = ('id', 'image', 'event')
