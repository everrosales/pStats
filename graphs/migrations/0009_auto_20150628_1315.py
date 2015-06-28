# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0008_auto_20150628_1314'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='CmteID_EF',
            field=models.CharField(max_length=20),
        ),
    ]
