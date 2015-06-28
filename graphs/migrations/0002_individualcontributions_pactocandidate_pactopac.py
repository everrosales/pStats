# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndividualContributions',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Cycle', models.CharField(max_length=4)),
                ('FECTransID', models.CharField(max_length=19)),
                ('ContribID', models.CharField(max_length=12)),
                ('Contrib', models.CharField(max_length=50)),
                ('RecipID', models.CharField(max_length=9)),
                ('Orgname', models.CharField(max_length=50)),
                ('UltOrg', models.CharField(max_length=50)),
                ('RealCode', models.CharField(max_length=5)),
                ('Date', models.DateField()),
                ('Amount', models.FloatField()),
                ('Street', models.CharField(max_length=40)),
                ('City', models.CharField(max_length=30)),
                ('State', models.CharField(max_length=2)),
                ('Zip', models.CharField(max_length=5)),
                ('RecipCode', models.CharField(max_length=2)),
                ('Type', models.CharField(max_length=3)),
                ('CmtelID', models.CharField(max_length=9)),
                ('OtherID', models.CharField(max_length=9)),
                ('Gender', models.CharField(max_length=1)),
                ('Microfilm', models.CharField(max_length=11)),
                ('Occupation', models.CharField(max_length=38)),
                ('Employer', models.CharField(max_length=38)),
                ('Source', models.CharField(max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='PACtoCandidate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Cycle', models.CharField(max_length=4)),
                ('FECRecNo', models.CharField(max_length=19)),
                ('PACID', models.CharField(max_length=9)),
                ('CID', models.CharField(max_length=9)),
                ('Amount', models.FloatField()),
                ('Date', models.DateField()),
                ('RealCode', models.CharField(max_length=5)),
                ('Type', models.CharField(max_length=3)),
                ('DI', models.CharField(max_length=1)),
                ('FECCandID', models.CharField(max_length=9)),
            ],
        ),
        migrations.CreateModel(
            name='PACtoPAC',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Cycle', models.CharField(max_length=4)),
                ('FECRecNo', models.CharField(max_length=19)),
                ('Filerid', models.CharField(max_length=9)),
                ('DonorCmte', models.CharField(max_length=50)),
                ('ContribLendTrans', models.CharField(max_length=30)),
                ('City', models.CharField(max_length=30)),
                ('State', models.CharField(max_length=2)),
                ('Zip', models.CharField(max_length=5)),
                ('FECOccEmp', models.CharField(max_length=38)),
                ('PrimCode', models.CharField(max_length=5)),
                ('Date', models.DateField()),
                ('Amount', models.FloatField()),
                ('RecipID', models.CharField(max_length=9)),
                ('Party', models.CharField(max_length=1)),
                ('Otherid', models.CharField(max_length=9)),
                ('RecipCode', models.CharField(max_length=2)),
                ('RecipPrimcode', models.CharField(max_length=5)),
                ('Amend', models.CharField(max_length=1)),
                ('Report', models.CharField(max_length=3)),
                ('PG', models.CharField(max_length=1)),
                ('Microfilm', models.CharField(max_length=11)),
                ('Type', models.CharField(max_length=3)),
                ('RealCode', models.CharField(max_length=5)),
                ('Source', models.CharField(max_length=5)),
            ],
        ),
    ]
