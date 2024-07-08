from rest_framework import serializers
from .models import Setor, Municipio, Atividade, RegistroFuncionarios

class SetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setor
        fields = ['id', 'orgao_setor']

class MunicipioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipio
        fields = ['id', 'municipio']

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fields = ['id', 'atividade']

class RegistroFuncionariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroFuncionarios
        fields = '__all__'