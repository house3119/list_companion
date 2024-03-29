# Generated by Django 4.2.4 on 2023-12-05 12:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('list_companion', '0003_list_item'),
    ]

    operations = [
        migrations.CreateModel(
            name='log_entry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('log_action', models.CharField(choices=[('ADD', 'added item'), ('DEL', 'deleted item'), ('DON', 'marked as done'), ('UND', 'marked as undone')], max_length=3)),
                ('log_date', models.DateTimeField(auto_now_add=True)),
                ('log_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item_logs', to='list_companion.list_item')),
                ('log_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='list_logs', to='list_companion.list')),
                ('log_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_logs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
