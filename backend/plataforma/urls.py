from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'setores', views.SetorViewSet)
router.register(r'municipios', views.MunicipioViewSet)
router.register(r'atividades', views.AtividadeViewSet)

urlpatterns = [
    path('adicionar_setor/', views.adicionar_setor, name='adicionar_setor'),
    path('adicionar_municipio/', views.adicionar_municipio, name='adicionar_municipio'),
    path('adicionar_atividade/', views.adicionar_atividade, name='adicionar_atividade'),
    path('listar_setores/', views.ListSetores.as_view(), name='listar_setores'),
    path('listar_municipios/', views.ListMunicipios.as_view(), name='listar_municipios'),
    path('listar_atividades/', views.ListAtividades.as_view(), name='listar_atividades'),
    path('', include(router.urls)),
]
