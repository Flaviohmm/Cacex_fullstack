from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'setores', views.SetorViewSet)
router.register(r'municipios', views.MunicipioViewSet)
router.register(r'atividades', views.AtividadeViewSet)
router.register(r'historico', views.HistoricoViewSet)
router.register(r'funcionarios_prev', views.FuncionarioViewSet)
router.register(r'fgts', views.FGTSViewSet)
router.register(r'empregado', views.EmpregadoViewSet)
router.register(r'individualizacao_fgts', views.IndividualizacaoFGTSViewSet)
router.register(r'receita_federal', views.ReceitaFederalViewSet)
router.register(r'processos', views.ProcessoJudicialViewSet)

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
    path('listar_tabela_administrativa/<int:id>', views.listar_tabela_administrativa_por_id, name='listar_tabela_administrativa_por_id'),
    path('editar_registro_administrativo/<int:registro_id>/', views.editar_registro_administrativo, name='editar_registro_administrativo'),
    path('excluir_registro_administrativo/<int:registro_id>/', views.excluir_registro_administrativo, name='excluir_registro_adminstrativo'),
    path('funcionarios_prev/adicionar_previdencia/', views.FuncionarioViewSet.as_view({'post': 'adicionar_previdencia'}), name='adicionar_previdencia'),
    path('funcionarios_prev/listar_previdencia/', views.FuncionarioViewSet.as_view({'get': 'listar_previdencia'}), name='listar_previdencia'),
    path('funcionarios_prev/atualizar_previdencia/<int:pk>/', views.FuncionarioViewSet.as_view({'put': 'atualizar_previdencia'}), name='atualizar_previdencia'),
    path('funcionarios_prev/excluir_previdencia/<int:pk>/', views.FuncionarioViewSet.as_view({'delete': 'excluir_previdencia'}), name='excluir_previdencia'),
    path('balanco/', views.balanco_api, name='balanco'),
    path('add_ativo/', views.add_ativo, name='add_ativo'),
    path('add_passivo/', views.add_passivo, name='add_passivo'),
    path('edit_ativo/<int:id>/', views.edit_ativo, name='edit_ativo'),
    path('fetch_ativo/<int:id>/', views.fetch_ativo, name='fetch_ativo'),
    path('edit_passivo/<int:id>/', views.edit_passivo, name='edit_passivo'),
    path('fetch_passivo/<int:id>/', views.fetch_passivo, name='fetch_passivo'),
    path('ativos/<int:id>/', views.ativo_detail, name='ativo_detail'),
    path('passivos/<int:id>/', views.passivo_detail, name='passivo_detail'),
    path('', include(router.urls)),
]
