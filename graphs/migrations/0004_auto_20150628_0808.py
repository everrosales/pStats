# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0003_auto_20150628_0519'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='IndividualContributions',
            new_name='IndividualContribution',
        ),
    ]
