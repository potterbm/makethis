# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('design', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Code',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to=b'', blank=True)),
                ('codepen_id', models.CharField(max_length=100)),
                ('views', models.IntegerField(default=0, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('design', models.ForeignKey(related_name='code', blank=True, to='design.Design')),
                ('like', models.ManyToManyField(related_name='code_likes', to=settings.AUTH_USER_MODEL, blank=True)),
                ('project', models.ForeignKey(related_name='code', to='project.Project')),
                ('star', models.ManyToManyField(related_name='code_stars', to=settings.AUTH_USER_MODEL, blank=True)),
                ('user', models.ForeignKey(related_name='code', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
