# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('user', models.OneToOneField(primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('avatar', models.ImageField(upload_to=b'', blank=True)),
                ('designer', models.BooleanField(default=False)),
                ('developer', models.BooleanField(default=False)),
                ('birthday', models.DateField(blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
