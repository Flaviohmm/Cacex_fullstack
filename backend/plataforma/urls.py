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
    path('listar_setores/', views.ListSetores.as_view(), name='listar_setores'),
    path('listar_municipios/', views.ListMunicipios.as_view(), name='listar_municipios'),
    path('listar_atividades/', views.ListAtividades.as_view(), name='listar_atividades'),
    path('listar_registros/', views.listar_registros, name='listar_registros'),
    path('listar_registro/<int:id>/', views.listar_registro_por_id, name='listar_registro_por_id'),
    path('editar_registro/<int:id>/', views.editar_registro, name='editar_registro'),
    path('excluir_registro/<int:id>/', views.excluir_registro, name='excluir_registro'),
    # path('historico/', views.historico, name='historico'),
    path('historico/<int:id>/', views.historico_detail, name='historico_detail'),
    path('', include(router.urls)),
]
