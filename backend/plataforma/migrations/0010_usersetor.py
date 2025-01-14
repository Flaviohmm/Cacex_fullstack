# Generated by Django 5.0.7 on 2025-01-14 15:57

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("plataforma", "0009_processojudicial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="UserSetor",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "setor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="plataforma.setor",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["user", "setor"], name="plataforma__user_id_2ae0c5_idx"
                    )
                ],
                "unique_together": {("user", "setor")},
            },
        ),
    ]
