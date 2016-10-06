# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makethis', '0002_tag'),
        ('design', '0002_auto_20150802_0131'),
    ]

    operations = [
        migrations.AddField(
            model_name='design',
            name='tag',
            field=models.ManyToManyField(related_name='tagged_designs', to='makethis.Tag', blank=True),
        ),
    ]
