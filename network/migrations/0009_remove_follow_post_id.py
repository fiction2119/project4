# Generated by Django 3.1.3 on 2021-09-08 14:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_auto_20210805_1519'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='follow',
            name='post_id',
        ),
    ]