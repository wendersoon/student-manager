# Generated by Django 5.1.6 on 2025-02-25 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
