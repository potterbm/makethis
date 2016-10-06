# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='codepen_author',
            field=models.CharField(max_length=200, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='follows',
            field=models.ManyToManyField(related_name='followers', to='account.Account'),
        ),
        migrations.AddField(
            model_name='account',
            name='user_url',
            field=models.CharField(max_length=20, null=True, blank=True),
        ),
    ]
