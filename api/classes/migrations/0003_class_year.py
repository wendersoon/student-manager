# Generated by Django 5.1.6 on 2025-02-26 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0002_class_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='year',
            field=models.IntegerField(default=2025),
        ),
    ]
