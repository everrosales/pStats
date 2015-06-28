# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0004_auto_20150628_0808'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expenditure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Cycle', models.CharField(max_length=4)),
                ('TransID', models.CharField(max_length=20)),
                ('CRPFilerid', models.CharField(max_length=9)),
                ('Recipcode', models.CharField(max_length=2)),
                ('Pacshort', models.CharField(max_length=50)),
                ('CRPRecipname', models.CharField(max_length=90)),
                ('Expcode', models.CharField(max_length=3)),
                ('Amount', models.FloatField()),
                ('Date', models.DateField()),
                ('City', models.CharField(max_length=30)),
                ('State', models.CharField(max_length=2)),
                ('Zip', models.CharField(max_length=5)),
                ('CmteID_EF', models.CharField(max_length=9)),
                ('Candid', models.CharField(max_length=9)),
                ('Type', models.CharField(max_length=3)),
                ('Descrip', models.CharField(max_length=100)),
                ('PG', models.CharField(max_length=5)),
                ('ElecOther', models.CharField(max_length=20)),
                ('EntType', models.CharField(max_length=3)),
                ('Source', models.CharField(max_length=5)),
            ],
        ),
    ]
