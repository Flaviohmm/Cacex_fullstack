from rest_framework import serializers
from .models import Setor, Municipio, Atividade, RegistroFuncionarios, Historico


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
    orgao_setor = SetorSerializer()
    municipio = MunicipioSerializer()
    atividade = AtividadeSerializer()

    # Adicionar campos calculados
    valor_total = serializers.SerializerMethodField()
    falta_liberar = serializers.SerializerMethodField()

    class Meta:
        model = RegistroFuncionarios
        fields = '__all__'
        depth = 1 # Isso inclui relacionamentos de chave estrangeira como objetos completos

    def get_valor_total(self, obj):
        # Chama o método para calcular o valor total
        valor_total, _ = obj.calcular_valores()
        return valor_total
    
    def get_falta_liberar(self, obj):
        _, falta_liberar = obj.calcular_valores()
        return falta_liberar

    # Use to_representation para transformar o ID (chave primária) de um objeto relacionado
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['nome'] = instance.nome.username # Se nome for uma FK
        return ret
    
def comparar_valores(historico_dados_anteriores, historico_dados_atuais):
    diff = []
    for key, value_anterior in historico_dados_anteriores.items():
        if key in historico_dados_atuais:
            value_atual = historico_dados_atuais[key]
            if value_atual != value_anterior:
                diff.append((key, value_anterior, value_atual))
    return diff 
   
class HistoricoSerializer(serializers.ModelSerializer):
    dados_alterados = serializers.SerializerMethodField()

    class Meta:
        model = Historico
        fields = ['id', 'acao', 'data', 'usuario', 'dados_anteriores', 'dados_atuais', 'dados_alterados']

    def get_dados_alterados(self, obj):
        return comparar_valores(obj.dados_anteriores, obj.dados_atuais)  
