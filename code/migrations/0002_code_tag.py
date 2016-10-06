# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makethis', '0002_tag'),
        ('code', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='tag',
            field=models.ManyToManyField(related_name='tagged_code', to='makethis.Tag', blank=True),
        ),
    ]
