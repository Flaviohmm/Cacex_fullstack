from rest_framework import serializers
from .models import (
    Setor, 
    Municipio, 
    Atividade, 
    RegistroFuncionarios, 
    Historico, 
    RegistroAdminstracao, 
    FuncionarioPrevidencia,
    FGTS,
    Empregado,
    IndividualizacaoFGTS,
    ReceitaFederal,
    Ativo,
    Passivo,
)


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
    
class RegistroAdministracaoSerializer(serializers.ModelSerializer):
    municipio = MunicipioSerializer()

    class Meta:
        model = RegistroAdminstracao
        fields = '__all__'

class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuncionarioPrevidencia
        fields = '__all__'

class FGTSSerializer(serializers.ModelSerializer):
    class Meta:
        model = FGTS
        fields = '__all__'

class EmpregadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empregado
        fields = ['id', 'nome', 'cpf', 'pis_pasep']
        extra_kwargs = {
            'nome': {'required': True},
            'cpf': {'required': True},
            'pis_pasep': {'required': True}
        }

class IndividualizacaoFGTSSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualizacaoFGTS
        fields = ['id', 'empregado', 'mes_ano', 'renumeracao_bruta', 'valor_fgts']
        read_only_fields = ['valor_fgts'] # Este campo será calculado automaticamente


class ReceitaFederalSerializer(serializers.ModelSerializer):
    municipio = MunicipioSerializer()

    class Meta:
        model = ReceitaFederal
        fields = '__all__'  # Ou liste os campos manualmente se preferir


class AtivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ativo
        fields = ['id', 'nome', 'valor', 'circulante']


class PassivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passivo
        fields = ['id', 'nome', 'valor', 'circulante']