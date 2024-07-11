from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from .models import Setor, Municipio, Atividade, RegistroFuncionarios
from django.contrib.auth.models import User
from django.http import JsonResponse
from .utils import calcular_valores, exibir_modal_prazo_vigencia, dia_trabalho_total
from .serializers import SetorSerializer, MunicipioSerializer, AtividadeSerializer, RegistroFuncionariosSerializer
from rest_framework import viewsets
import json

@api_view(['POST'])
def adicionar_setor(request):
    if request.method == 'POST':
        serializer = SetorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def adicionar_municipio(request):
    if request.method == 'POST':
        serializer = MunicipioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def adicionar_atividade(request):
    if request.method == 'POST':
        serializer = AtividadeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListSetores(generics.ListAPIView):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer


class ListMunicipios(generics.ListAPIView):
    queryset = Municipio.objects.all()
    serializer_class = MunicipioSerializer


class ListAtividades(generics.ListAPIView):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer


class SetorViewSet(viewsets.ModelViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer

    @action(detail=True, methods=['PUT'])
    def update_setor(self, request, pk=None):
        setor = self.get_object()
        serializer = SetorSerializer(setor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['DELETE'])
    def delete_setor(self, request, pk=None):
        setor = self.get_object()
        setor.delete()
        return Response(status=204)
    

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all()
    serializer_class = MunicipioSerializer

    @action(detail=True, methods=['PUT'])
    def update_municipio(self, request, pk=None):
        municipio = self.get_object()
        serializer = MunicipioSerializer(municipio, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['DELETE'])
    def delete_municipio(self, request, pk=None):
        municipio = self.get_object()
        municipio.delete()
        return Response(status=204)
    

class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer

    @action(detail=True, methods=['PUT'])
    def update_atividade(self, request, pk=None):
        atividade = self.get_object()
        serializer = AtividadeSerializer(atividade, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['DELETE'])
    def delete_atividade(self, request, pk=None):
        atividade = self.get_object()
        atividade.delete()
        return Response(status=204)
    

@api_view(['POST'])
def adicionar_registro(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            nome = User.objects.get(id=data.get('username'))
            orgao_setor = Setor.objects.get(id=data.get('orgao_setor'))
            municipio = Municipio.objects.get(id=data.get('municipio'))
            atividade = Atividade.objects.get(id=data.get('atividade'))
            num_convenio = data.get('num_convenio')
            parlamentar = data.get('parlamentar')
            objeto = data.get('objeto')

            oge_ogu_str = data.get('oge_ogu', 0).replace('R$', '').replace('.', '').replace(',', '.')
            oge_ogu = float(oge_ogu_str)

            cp_prefeitura_str = data.get('cp_prefeitura', 0).replace('R$', '').replace('.', '').replace(',', '.')
            cp_prefeitura = float(cp_prefeitura_str)

            valor_liberado_str = data.get('valor_liberado', 0).replace('R$', '').replace('.', '').replace(',', '.')
            valor_liberado = float(valor_liberado_str)

            prazo_vigencia = data.get('prazo_vigencia')

            situacao = data.get('situacao')
            providencia = data.get('providencia')

            data_recepcao = data.get('data_recepcao')

            data_inicio = data.get('data_inicio')
                
            documento_pendente = data.get('documento_pendente', False)
            documento_cancelado = data.get('documento_cancelado', False)

            data_fim = data.get('data_fim')

            registro = RegistroFuncionarios(
                nome=nome,
                orgao_setor=orgao_setor,
                municipio=municipio,
                atividade=atividade,
                num_convenio=num_convenio,
                parlamentar=parlamentar,
                objeto=objeto,
                oge_ogu=oge_ogu,
                cp_prefeitura=cp_prefeitura,
                valor_liberado=valor_liberado,
                prazo_vigencia=prazo_vigencia,
                situacao=situacao,
                providencia=providencia,
                data_recepcao=data_recepcao,
                data_inicio=data_inicio,
                documento_pendente=documento_pendente,
                documento_cancelado=documento_cancelado,
                data_fim=data_fim,
            )

            # Salve o registro
            registro.save()

            # Chame as funções utilitárias
            registro.valor_total, registro.falta_liberar = calcular_valores(registro)
            exibir_modal, dias_restantes = exibir_modal_prazo_vigencia(registro)
            registro.duracao_dias_uteis = dia_trabalho_total(registro.data_inicio, registro.data_fim)

            # Formate os valores manualmente como moeda (considerando o formato brasileiro)
            registro.oge_ogu = f'R${oge_ogu:,.2f}'
            registro.cp_prefeitura = f'R${cp_prefeitura:,.2f}'
            registro.valor_liberado = f'R${valor_liberado:,.2f}'
            registro.valor_total = f'R${registro.valor_total:,.2f}'
            registro.falta_liberar = f'R${registro.falta_liberar:,.2f}'

            return Response({'success': 'Registro adicionado com sucesso'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def listar_registros(request):
    if request.method == 'GET':
        try:
            registros = RegistroFuncionarios.objects.all()
            serialized_registros = []

            for registro in registros:
                serialized_registro = {
                    'nome': registro.nome.username,
                    'orgao_setor': registro.orgao_setor.orgao_setor,
                    'municipio': registro.municipio.municipio,
                    'atividade': registro.atividade.atividade,
                    'num_convenio': registro.num_convenio,
                    'parlamentar': registro.parlamentar,
                    'objeto': registro.objeto,
                    'oge_ogu': registro.oge_ogu,
                    'cp_prefeitura': registro.cp_prefeitura,
                    'valor_total': calcular_valores(registro)[0],
                    'valor_liberado': registro.valor_liberado,
                    'falta_liberar': calcular_valores(registro)[1],
                    'prazo_vigencia': registro.prazo_vigencia.strftime('%d/%m/%Y'),
                    'situacao': registro.situacao,
                    'providencia': registro.providencia,
                    'status': registro.status,
                    'data_recepcao': registro.data_recepcao.strftime('%d/%m/%Y'),
                    'data_inicio': registro.data_inicio.strftime('%d/%m/%Y') if registro.data_inicio else 'Sem Data de Inicio',
                    'documento_pendente': 'Sim' if registro.documento_pendente else 'Não',
                    'documento_cancelado': 'Sim' if registro.documento_cancelado else 'Não',
                    'data_fim': registro.data_fim.strftime('%d/%m/%Y') if registro.data_fim else 'Sem Data de Termino',
                    'duracao_dias_uteis': dia_trabalho_total(registro.data_inicio, registro.data_fim),
                }

                serialized_registros.append(serialized_registro)

            return JsonResponse(serialized_registros, safe=False, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)