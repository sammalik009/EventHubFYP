# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-02-11 06:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendee', '0002_auto_20200107_2020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendee',
            name='feedback',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]