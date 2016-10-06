# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('makethis', '0002_tag'),
        ('project', '0002_project_explanation'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='tag',
            field=models.ManyToManyField(related_name='tagged_projects', to='makethis.Tag', blank=True),
        ),
    ]
