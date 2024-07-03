from django.urls import path
from . import views

urlpatterns = [
    path('auth/cadastro', views.cadastro, name='cadastro'),
    path('auth/login', views.login, name='login'),
    path('auth/sair', views.sair, name='sair'),
]
