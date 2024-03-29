# Generated by Django 4.2.4 on 2023-12-03 14:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('list_companion', '0002_list_list_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='List_item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('list_item_name', models.CharField(max_length=30)),
                ('list_item_done', models.BooleanField(default=False)),
                ('list_item_date_created', models.DateTimeField(auto_now_add=True)),
                ('list_item_related_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='list_items', to='list_companion.list')),
            ],
        ),
    ]
