from django.contrib import admin
from .models import Event
from .models import Registration, ImageTable


class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category',)


admin.site.register(Event, EventAdmin)
admin.site.register(Registration)
admin.site.register(ImageTable)
