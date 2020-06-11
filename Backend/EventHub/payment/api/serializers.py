from rest_framework import serializers
from payment.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'method', 'total_amount', 'received_amount', 'event', 'is_active', 'created_at', 'updated_at')
