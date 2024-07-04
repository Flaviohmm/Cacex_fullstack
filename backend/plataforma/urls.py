from django.urls import path
from .views import adicionar_setor

urlpatterns = [
    path('adicionar-setor/', adicionar_setor, name='adicionar_setor'),
]
