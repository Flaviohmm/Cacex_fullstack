from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('auth/cadastro', views.cadastro, name='cadastro'),
    path('auth/login', views.login, name='login'),
    path('auth/sair', views.sair, name='sair'),
    path('usuarios/', views.lista_usuarios, name='lista_usuarios'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]
