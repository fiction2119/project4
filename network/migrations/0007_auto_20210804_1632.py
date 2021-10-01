# Generated by Django 3.1.3 on 2021-08-04 15:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_auto_20210802_1558'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follow', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('like', models.BooleanField(default=False)),
            ],
        ),
        migrations.AlterField(
            model_name='post',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.DeleteModel(
            name='Interact',
        ),
        migrations.AddField(
            model_name='like',
            name='post_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='like', to='network.post'),
        ),
        migrations.AddField(
            model_name='like',
            name='user1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='interactions_user1', to='network.profile'),
        ),
        migrations.AddField(
            model_name='like',
            name='user2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='interactions_user2', to='network.profile'),
        ),
        migrations.AddField(
            model_name='follow',
            name='post_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow', to='network.post'),
        ),
        migrations.AddField(
            model_name='follow',
            name='user1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow_user1', to='network.profile'),
        ),
        migrations.AddField(
            model_name='follow',
            name='user2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow_user2', to='network.profile'),
        ),
    ]