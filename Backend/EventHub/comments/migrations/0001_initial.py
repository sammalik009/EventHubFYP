# -*- coding: utf-8 -*-
# Generated by Django 1.11.27 on 2020-01-07 15:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=False)),
                ('text', models.CharField(max_length=1000)),
                ('active', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
