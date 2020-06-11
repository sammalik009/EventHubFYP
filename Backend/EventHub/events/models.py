from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


class Event(BaseModel):
    title = models.CharField(max_length=100)
    event_date = models.DateField()
    venue = models.CharField(max_length=100)
    total_tickets = models.PositiveIntegerField()
    price_ticket = models.DecimalField(max_digits=7, decimal_places=2)
    category = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    limit_for_tickets = models.PositiveIntegerField(blank=True, null=True)
    sold_tickets = models.PositiveIntegerField(default=0)
    remaining_tickets = models.PositiveIntegerField(default=0)
    description = models.CharField(max_length=10000)
    user_name = models.CharField(max_length=255)
    self = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Registration(BaseModel):
    number_of_tickets = models.PositiveIntegerField()
    voucher_code = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    has_attended = models.BooleanField(default=False)
    event_title = models.CharField(max_length=20)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    payment = models.ForeignKey('payment.Payment', on_delete=models.CASCADE)


class ImageTable(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images')
