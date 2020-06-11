from django.contrib import admin
from .models import User, Request, Organizer, OrganizerRequest

admin.site.register(User)
admin.site.register(Request)
admin.site.register(Organizer)
admin.site.register(OrganizerRequest)
