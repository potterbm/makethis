# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Design',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to=b'')),
                ('comp_file', models.FileField(upload_to=b'', blank=True)),
                ('views', models.IntegerField(default=0, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('like', models.ManyToManyField(related_name='design_likes', to=settings.AUTH_USER_MODEL, blank=True)),
                ('project', models.ForeignKey(related_name='designs', to='project.Project')),
                ('star', models.ManyToManyField(related_name='design_stars', to=settings.AUTH_USER_MODEL, blank=True)),
                ('user', models.ForeignKey(related_name='designs', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
