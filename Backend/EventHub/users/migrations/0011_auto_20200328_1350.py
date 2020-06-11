# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-03-28 08:50
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_organizerrequest_organizer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organizer',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
