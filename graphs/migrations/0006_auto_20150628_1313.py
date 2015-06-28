# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0005_expenditure'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='Zip',
            field=models.CharField(max_length=10),
        ),
    ]
