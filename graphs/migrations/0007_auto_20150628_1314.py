# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0006_auto_20150628_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='committee',
            name='RecipID',
            field=models.CharField(max_length=20),
        ),
    ]
