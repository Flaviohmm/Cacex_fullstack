# Generated by Django 5.0.7 on 2024-10-30 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plataforma', '0008_ativo_passivo_balancopatrimonial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProcessoJudicial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('processo', models.CharField(max_length=20)),
                ('tipo_acao', models.CharField(max_length=100)),
                ('autor', models.CharField(max_length=100)),
                ('reu', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=50)),
                ('data_abertura', models.DateField()),
            ],
        ),
    ]
