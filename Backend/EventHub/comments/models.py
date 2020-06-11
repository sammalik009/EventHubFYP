from django.db import models
from users.models import User
from events.models import Event


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


class Comment(BaseModel):
    text = models.CharField(max_length=255)
    active = models.BooleanField(default=False)
    username = models.CharField(max_length=255)
    c_self = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.text
