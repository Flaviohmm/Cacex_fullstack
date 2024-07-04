from django.contrib import admin
from .models import Setor, Municipio, RegistroFuncionarios

# Register your models here.
admin.site.register(Setor)
admin.site.register(Municipio)
admin.site.register(RegistroFuncionarios)