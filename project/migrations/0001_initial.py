# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import makethis.mixins


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to=b'', blank=True)),
                ('views', models.IntegerField(default=0, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('like', models.ManyToManyField(related_name='project_likes', to=settings.AUTH_USER_MODEL, blank=True)),
                ('star', models.ManyToManyField(related_name='project_stars', to=settings.AUTH_USER_MODEL, blank=True)),
                ('user', models.ForeignKey(related_name='projects', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(makethis.mixins.SerializeUserMixin, models.Model),
        ),
    ]
