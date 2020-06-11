from django.db import models
from users.models import User
from events.models import Event


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


class Notification(BaseModel):
    event_title = models.CharField(max_length=20)
    description = models.CharField(max_length=1000)
    read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, blank=True, null=True)
