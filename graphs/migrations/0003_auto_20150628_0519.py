# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0002_individualcontributions_pactocandidate_pactopac'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pactopac',
            name='ContribLendTrans',
            field=models.CharField(max_length=50),
        ),
    ]
