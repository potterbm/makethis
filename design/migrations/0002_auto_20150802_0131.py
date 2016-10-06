# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('design', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='design',
            name='image',
            field=models.ImageField(upload_to=b'', blank=True),
            preserve_default=True,
        ),
    ]
