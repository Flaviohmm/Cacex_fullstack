from django.contrib import admin
from .models import Setor, Municipio, Atividade, RegistroFuncionarios, RegistroAdminstracao

# Register your models here.
admin.site.register(Setor)
admin.site.register(Municipio)
admin.site.register(Atividade)
admin.site.register(RegistroFuncionarios)
admin.site.register(RegistroAdminstracao)