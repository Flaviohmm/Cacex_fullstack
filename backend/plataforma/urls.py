from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'setores', views.SetorViewSet)
router.register(r'municipios', views.MunicipioViewSet)
router.register(r'atividades', views.AtividadeViewSet)
router.register(r'historico', views.HistoricoViewSet)

urlpatterns = [
    path('adicionar_setor/', views.adicionar_setor, name='adicionar_setor'),
    path('adicionar_municipio/', views.adicionar_municipio, name='adicionar_municipio'),
    path('adicionar_atividade/', views.adicionar_atividade, name='adicionar_atividade'),
    path('adicionar_registro/', views.adicionar_registro, name='adicionar_registro'),
    path('adicionar_registro_administrativo/', views.adicionar_registro_administrativo, name='adicionar_registro_administrativo'),
    path('listar_setores/', views.ListSetores.as_view(), name='listar_setores'),
    path('listar_municipios/', views.ListMunicipios.as_view(), name='listar_municipios'),
    path('listar_atividades/', views.ListAtividades.as_view(), name='listar_atividades'),
    path('listar_registros/', views.listar_registros, name='listar_registros'),
    path('listar_registro/<int:id>/', views.listar_registro_por_id, name='listar_registro_por_id'),
    path('editar_registro/<int:id>/', views.editar_registro, name='editar_registro'),
    path('excluir_registro/<int:id>/', views.excluir_registro, name='excluir_registro'),
    path('historico/<int:registro_id>/', views.historico_detail, name='historico_detail'),
    path('csrf_token/', views.get_csrf_token, name="csrf_token"),
    path('anexar_registro/<int:registro_id>/', views.anexar_registro, name='anexar_registro'),
    path('desanexar_registro/<int:registro_id>/', views.desanexar_registro, name='desanexar_registro'),
    path('mostrar_registros_anexados/', views.mostrar_registros_anexados, name='mostrar_registros_anexados'),
    path('verificar_sessao/', views.verificar_sessao, name='verificar_sessao'),
    path('tabela_caixa/', views.tabela_caixa_api, name='tabela_caixa_api'),
    path('selecionar_municipio/<int:municipio_id>/', views.selecionar_municipio_api, name='selecionar_municipio_api'),
    path('tabela_estado/', views.tabela_estado, name='tabela_estado'),
    path('tabela_fnde/', views.tabela_fnde, name='tabela_fnde'),
    path('tabela_simec/', views.tabela_simec, name='tabela_simec'),
    path('tabela_fns/', views.tabela_fns, name='tabela_fns'),
    path('tabela_entidade/', views.tabela_entidade, name='tabela_entidade'),
    path('dashboard_data/', views.dashboard_data, name='dashboard_data'), 
    path('listar_tabela_administrativa/', views.listar_tabela_administrativa, name='listar_tabela_administrativa'),
    path('', include(router.urls)),
]
