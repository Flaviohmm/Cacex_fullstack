from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'usuario_setor', views.UsuarioSetorViewSet)

urlpatterns = [
    path('auth/cadastro', views.cadastro, name='cadastro'),
    path('auth/login', views.login, name='login'),
    path('auth/sair', views.sair, name='sair'),
    path('usuarios/', views.UserList.as_view(), name='lista_usuarios'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('associar_usuario_setor/', views.associar_usuario_setor, name='associar_usuario_setor'),
    path('listar_associacoes_usuario/', views.listar_associacoes_usuario, name='listar_associacoes_usuario'),
    path('editar_associacao_usuario/<int:associacao_id>/', views.editar_associacao_usuario, name='editar_associacao_usuario'),
    path('', include(router.urls)),
]
