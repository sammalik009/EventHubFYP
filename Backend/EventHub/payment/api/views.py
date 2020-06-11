from rest_framework import viewsets
# from rest_framework.generics import ListAPIView, RetrieveAPIView
from payment.models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()


# class PaymentListView(ListAPIView):
#    queryset = Payment.objects.all()
#    serializer_class = PaymentSerializer


# class PaymentDetailView(RetrieveAPIView):
#    queryset = Payment.objects.all()
#    serializer_class = PaymentSerializer
