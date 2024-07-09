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
        depth = 1 # Isso inclui relacionamentos de chave estrangeira como objetos completos

    # Use to_representation para transformar o ID (chave primária) de um objeto relacionado
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['nome'] = instance.nome.id # Se nome for uma FK
        return ret