from django.db import models
from django.contrib.auth.models import User
from plataforma.models import Setor


class UsuarioSetor(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    setor = models.ForeignKey(Setor, on_delete=models.CASCADE)