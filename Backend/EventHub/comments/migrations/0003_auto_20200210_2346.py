# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-02-10 18:46
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0002_auto_20200107_2020'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='self',
            new_name='c_self',
        ),
    ]