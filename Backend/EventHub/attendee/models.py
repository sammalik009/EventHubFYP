from django.db import models
from events.models import Registration, Event


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


class Attendee(BaseModel):
    feedback = models.PositiveIntegerField(blank=True, null=True, default=0)
    registration = models.ForeignKey(Registration, on_delete=models.CASCADE)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
