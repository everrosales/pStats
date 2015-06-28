# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Cycle', models.CharField(max_length=4)),
                ('FECCandID', models.CharField(max_length=9)),
                ('CID', models.CharField(max_length=9)),
                ('FirstLastP', models.CharField(max_length=50)),
                ('Party', models.CharField(max_length=1)),
                ('DistIDRunFor', models.CharField(max_length=4)),
                ('DistIDCurr', models.CharField(max_length=4)),
                ('CurrCand', models.CharField(max_length=1)),
                ('CycleCand', models.CharField(max_length=1)),
                ('CRPICO', models.CharField(max_length=1)),
                ('RecipCode', models.CharField(max_length=2)),
                ('NoPacs', models.CharField(max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='Committee',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Cycle', models.CharField(max_length=4)),
                ('CmteID', models.CharField(max_length=9)),
                ('PACShort', models.CharField(max_length=50)),
                ('Affiliate', models.CharField(max_length=50, null=True, blank=True)),
                ('Ultorg', models.CharField(max_length=50, null=True, blank=True)),
                ('RecipID', models.CharField(max_length=9)),
                ('RecipCode', models.CharField(max_length=2)),
                ('FECCandID', models.CharField(max_length=9)),
                ('Party', models.CharField(max_length=1)),
                ('PrimCode', models.CharField(max_length=5, null=True, blank=True)),
                ('Source', models.CharField(max_length=10, null=True, blank=True)),
                ('Sensitive', models.CharField(max_length=1, null=True, blank=True)),
                ('Foreign', models.IntegerField(null=True, blank=True)),
                ('Active', models.IntegerField(null=True, blank=True)),
            ],
        ),
    ]
