# Generated by Django 4.2.4 on 2023-12-05 12:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('list_companion', '0004_log_entry'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log_entry',
            name='log_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='item_logs', to='list_companion.list_item'),
        ),
    ]
