from django.contrib import admin
from .models import (
    Setor, 
    Municipio, 
    Atividade, 
    RegistroFuncionarios, 
    RegistroAdminstracao,
    FuncionarioPrevidencia,
    FGTS,
    Empregado,
    IndividualizacaoFGTS,
    ReceitaFederal,
    Ativo,
    Passivo,
    ProcessoJudicial
)

# Register your models here.
admin.site.register(Setor)
admin.site.register(Municipio)
admin.site.register(Atividade)
admin.site.register(RegistroFuncionarios)
admin.site.register(RegistroAdminstracao)
admin.site.register(FuncionarioPrevidencia)
admin.site.register(FGTS)
admin.site.register(Empregado)
admin.site.register(IndividualizacaoFGTS)
admin.site.register(ReceitaFederal)
admin.site.register(Ativo)
admin.site.register(Passivo)
admin.site.register(ProcessoJudicial)
