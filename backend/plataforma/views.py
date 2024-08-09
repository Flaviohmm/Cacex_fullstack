from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from .models import (
    Setor, 
    Municipio, 
    Atividade, 
    RegistroFuncionarios, 
    Historico, 
    Status, 
    RegistroAdminstracao, 
    FuncionarioPrevidencia,
    FGTS
)
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.models import User
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from .utils import calcular_valores, exibir_modal_prazo_vigencia, dia_trabalho_total
from .templatetags.custom_filters import format_currency
from .serializers import (
    SetorSerializer, 
    MunicipioSerializer, 
    AtividadeSerializer, 
    HistoricoSerializer, 
    RegistroFuncionariosSerializer, 
    RegistroAdministracaoSerializer, 
    FuncionarioSerializer,
    FGTSSerializer
)
from rest_framework import viewsets
from datetime import datetime
import json
import traceback

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
                prazo_vigencia = registro.prazo_vigencia.strftime('%d/%m/%Y')
                dias_restantes = (registro.prazo_vigencia - timezone.now().date()).days
                exibir_modal_prazo_vigencia = dias_restantes <= 30

                serialized_registro = {
                    'id': registro.id,
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
                    'prazo_vigencia': prazo_vigencia,
                    'dias_restantes_prazo_vigencia': dias_restantes,
                    'exibir_modal_prazo_vigencia': exibir_modal_prazo_vigencia,
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


@api_view(['GET'])
def listar_registro_por_id(request, id):
    if request.method == 'GET':
        try:
            registro = get_object_or_404(RegistroFuncionarios, id=id)
            prazo_vigencia = registro.prazo_vigencia.strftime('%Y-%m-%d')
            dias_restantes = (registro.prazo_vigencia - timezone.now().date()).days
            exibir_modal_prazo_vigencia = dias_restantes <= 30

            def format_currency(value):
                return f'R${value:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')

            serialized_registro = {
                'id': registro.id,
                'nome': registro.nome.username,
                'orgao_setor': registro.orgao_setor.orgao_setor,
                'municipio': registro.municipio.municipio,
                'atividade': registro.atividade.atividade,
                'num_convenio': registro.num_convenio,
                'parlamentar': registro.parlamentar,
                'objeto': registro.objeto,
                'oge_ogu': format_currency(registro.oge_ogu),
                'cp_prefeitura': format_currency(registro.cp_prefeitura),
                'valor_total': format_currency(calcular_valores(registro)[0]),
                'valor_liberado': format_currency(registro.valor_liberado),
                'falta_liberar': format_currency(calcular_valores(registro)[1]),
                'prazo_vigencia': prazo_vigencia,
                'dias_restantes_prazo_vigencia': dias_restantes,
                'exibir_modal_prazo_vigencia': exibir_modal_prazo_vigencia,
                'situacao': registro.situacao,
                'providencia': registro.providencia,
                'status': registro.status,
                'data_recepcao': registro.data_recepcao.strftime('%Y-%m-%d'),
                'data_inicio': registro.data_inicio.strftime('%Y-%m-%d') if registro.data_inicio else None,
                'documento_pendente': registro.documento_pendente,
                'documento_cancelado': registro.documento_cancelado,
                'data_fim': registro.data_fim.strftime('%Y-%m-%d') if registro.data_fim else None,
                'duracao_dias_uteis': dia_trabalho_total(registro.data_inicio, registro.data_fim),
            }

            return JsonResponse(serialized_registro, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def dados_atuais_registro(registro):
    dados_atuais = {
        'nome': registro.nome.username,
        'orgao_setor': registro.orgao_setor.orgao_setor,
        'municipio': registro.municipio.municipio,
        'atividade': registro.atividade.atividade,
        'num_convenio': registro.num_convenio,
        'parlamentar': registro.parlamentar,
        'objeto': registro.objeto,
        'oge_ogu': format_currency(registro.oge_ogu),
        'cp_prefeitura': format_currency(registro.cp_prefeitura),
        'valor_total': format_currency(calcular_valores(registro)[0]),
        'valor_liberado': format_currency(registro.valor_liberado),
        'falta_liberar': format_currency(calcular_valores(registro)[1]),
        'prazo_vigencia': registro.prazo_vigencia.strftime("%d/%m/%Y"),
        'situacao': registro.situacao,
        'providencia': registro.providencia,
        'status': registro.status,
        'data_recepcao': registro.data_recepcao.strftime("%d/%m/%Y"),
        'data_inicio': registro.data_inicio.strftime("%d/%m/%Y") if registro.data_inicio else "",
        'documento_pendente': 'Sim' if registro.documento_pendente else 'Não',
        'documento_cancelado': 'Sim' if registro.documento_cancelado else 'Não',
        'data_fim': registro.data_fim.strftime("%d/%m/%Y") if registro.data_fim else "",
        'duracao_dias_uteis': registro.duracao_dias_uteis
    }

    return dados_atuais

def comparar_valores(historico_dados_anteriores, historico_dados_atuais):
    diff = []
    for key, value_anterior in historico_dados_anteriores.items():
        if key in historico_dados_atuais:
            value_atual = historico_dados_atuais[key]
            if value_atual != value_anterior:
                diff.append((key, value_anterior, value_atual))
    return diff

@api_view(['PUT'])
def editar_registro(request, id):
    registro = get_object_or_404(RegistroFuncionarios, id=id)

    # Consulte o histórico
    historico_registros = Historico.objects.filter(registro=registro).order_by('data')

    # Obtenha os dados atuais do registro antes de qualquer alteração
    dados_atuais = dados_atuais_registro(registro)

    if request.method == 'PUT':
        try:
            data = json.loads(request.body)

            # Guarde os dados atuais antes das alterações
            dados_anteriores = dados_atuais

            # Exiba ou manipule os dados anteriores conforme necessário
            for historico in historico_registros:
                historico.dados_anteriores = dados_anteriores

            registro.nome = User.objects.get(id=data.get('username'))
            registro.orgao_setor = Setor.objects.get(id=data.get('orgao_setor'))
            registro.municipio = Municipio.objects.get(id=data.get('municipio'))
            registro.atividade = Atividade.objects.get(id=data.get('atividade'))
            registro.num_convenio = data.get('num_convenio')
            registro.parlamentar = data.get('parlamentar')
            registro.objeto = data.get('objeto')

            oge_ogu_str = data.get('oge_ogu', 0).replace('R$', '').replace('.', '').replace(',', '.')
            registro.oge_ogu = float(oge_ogu_str)

            cp_prefeitura_str = data.get('cp_prefeitura', 0).replace('R$', '').replace('.', '').replace(',', '.')
            registro.cp_prefeitura = float(cp_prefeitura_str)

            valor_liberado_str = data.get('valor_liberado', 0).replace('R$', '').replace('.', '').replace(',', '.')
            registro.valor_liberado = float(valor_liberado_str)

            registro.prazo_vigencia = datetime.strptime(data.get('prazo_vigencia'), '%Y-%m-%d').date()
            registro.situacao = data.get('situacao')
            registro.providencia = data.get('providencia')
            registro.data_recepcao = datetime.strptime(data.get('data_recepcao'), '%Y-%m-%d').date()
            registro.data_inicio = datetime.strptime(data.get('data_inicio'), '%Y-%m-%d').date() if data.get('data_inicio') else None
            registro.documento_pendente = data.get('documento_pendente', False)
            registro.documento_cancelado = data.get('documento_cancelado', False)
            registro.data_fim = datetime.strptime(data.get('data_fim'), '%Y-%m-%d').date() if data.get('data_fim') else None

            # Salve o registro atualizado
            registro.save()

            # Registre a atividade no histórico, incluindo os dados anteriores
            Historico.objects.create(
                usuario=request.user,
                acao='editar',
                dados_anteriores=dados_anteriores,
                dados_atuais=dados_atuais_registro(registro),
                dados_alterados=comparar_valores(dados_anteriores, dados_atuais),
                data=timezone.now(),
                registro=registro
            )

            for historico in historico_registros:
                historico.dados_atuais = dados_atuais_registro(registro)
                
            # Atualize os valores calculados e formatados, conforme necessário
            registro.valor_total, registro.falta_liberar = calcular_valores(registro)
            exbir_modal, dias_restantes = exibir_modal_prazo_vigencia(registro)
            registro.duracao_dias_uteis = dia_trabalho_total(registro.data_inicio, registro.data_fim)

            registro.oge_ogu = f'R${registro.oge_ogu:,.2f}'
            registro.cp_prefeitura = f'R${registro.cp_prefeitura:,.2f}'
            registro.valor_liberado = f'R${registro.valor_liberado:,.2f}'
            registro.valor_total = f'R${registro.valor_total:,.2f}'
            registro.falta_liberar = f'R${registro.falta_liberar:,.2f}'

            return Response({'success': 'Registro atualizado com sucesso'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['DELETE'])
def excluir_registro(request, id):
    if request.method == 'DELETE':
        try:
            registro = RegistroFuncionarios.objects.get(id=id)
            registro.delete()

            return Response({'success': 'Registro excluído com sucesso'}, status=status.HTTP_200_OK)
        
        except RegistroFuncionarios.DoesNotExist:
            return Response({'error': 'Registro não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class HistoricoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Historico.objects.all().order_by('-data')
    serializer_class = HistoricoSerializer

    def list(self, request, *args, **kwargs):
        historico_registros = self.get_queryset()
        serializer = self.get_serializer(historico_registros, many=True)
        return Response(serializer.data)
    
    def comparar_valores(dados_anteriores, dados_atuais):
        alteracoes = {}
        for key in dados_anteriores.keys():
            if dados_anteriores[key] != dados_atuais[key]:
                alteracoes[key] = {
                    'antes': dados_anteriores[key],
                    'depois': dados_atuais[key],
                }
        return alteracoes

def historico_detail(request, registro_id):
    # Obtenha o registro específico ou retorne um 404 se não existir
    registro = get_object_or_404(RegistroFuncionarios, id=registro_id)

    # Obtém os registros do histórico relacionados ao registro específico
    historico_registros = Historico.objects.filter(registro_id=registro).order_by('-data')

    # Inicializa a lista de diferenças como vazia
    registros = []

    for hist in historico_registros:
        reg = {
            'acao': hist.acao,
            'data': hist.data,
            'usuario': {
                'id': hist.usuario.id,
                'username': hist.usuario.username,
            },
            'dados_anteriores': hist.dados_anteriores,
            'dados_atuais': hist.dados_atuais,
            'dados_alterados': comparar_valores(hist.dados_anteriores, hist.dados_atuais)
        }
        registros.append(reg)

    return JsonResponse({'historico_registros': registros})

@ensure_csrf_cookie
def get_csrf_token(request):
    """ Retorna o token CSRF """
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE')})

@csrf_exempt
@require_POST
def anexar_registro(request, registro_id):
    registro = get_object_or_404(RegistroFuncionarios, id=registro_id)

    registros_anexados = request.session.get('registros_anexados', [])
    registros_desanexados = request.session.get('registros_desanexados', [])

    if not any(r['id'] == registro_id for r in registros_anexados):
        registro.valor_total, registro.falta_liberar = calcular_valores(registro)
        registro.duracao_dias_uteis = dia_trabalho_total(registro.data_inicio, registro.data_fim)

        registro_dict = {
            'id': registro.id,
            'nome': registro.nome.username,
            'orgao_setor': registro.orgao_setor.orgao_setor,
            'municipio': registro.municipio.municipio,
            'atividade': registro.atividade.atividade,
            'num_convenio': registro.num_convenio,
            'parlamentar': registro.parlamentar,
            'objeto': registro.objeto,
            'oge_ogu': float(registro.oge_ogu),
            'cp_prefeitura': float(registro.cp_prefeitura),
            'valor_total': float(registro.valor_total),
            'valor_liberado': float(registro.valor_liberado),
            'falta_liberar': float(registro.falta_liberar),
            'prazo_vigencia': registro.prazo_vigencia.strftime('%d/%m/%Y'),
            'situacao': registro.situacao,
            'providencia': registro.providencia,
            'status': registro.status,
            'data_recepcao': registro.data_recepcao.strftime('%d/%m/%Y'),
            'data_inicio': registro.data_inicio.strftime('%d/%m/%Y') if registro.data_inicio else None,
            'documento_pendente': registro.documento_pendente,
            'documento_cancelado': registro.documento_cancelado,
            'data_fim': registro.data_fim.strftime('%d/%m/%Y') if registro.data_fim else None,
            'duracao_dias_uteis': registro.duracao_dias_uteis,
        }

        registros_anexados.append(registro_dict)

        if registro_id in registros_desanexados:
            registros_desanexados.remove(registro_id)

        request.session['registros_anexados'] = registros_anexados
        request.session['registros_desanexados'] = registros_desanexados
        request.session.modified = True

        registro.delete()

        print("Registros anexados atualizados:", request.session['registros_anexados'])

    print("Registros Anexados na Sessão após modificação:", request.session.get('registros_anexados'))

    response_data = {
        'message': 'Registro anexado com sucesso',
        'registros_anexados': [
            {
                'id': r['id'],
                'nome': r['nome'],
                'orgao_setor': r['orgao_setor'],
                'municipio': r['municipio'],
                'atividade': r['atividade'],
                'num_convenio': r['num_convenio'],
                'parlamentar': r['parlamentar'],
                'objeto': r['objeto'],
                'oge_ogu': f'R${r["oge_ogu"]:,.2f}',
                'cp_prefeitura': f'R${r["cp_prefeitura"]:,.2f}',
                'valor_total': f'R${r["valor_total"]:,.2f}',
                'valor_liberado': f'R${r["valor_liberado"]:,.2f}',
                'falta_liberar': f'R${r["falta_liberar"]:,.2f}',
                'prazo_vigencia': r['prazo_vigencia'],
                'situacao': r['situacao'],
                'providencia': r['providencia'],
                'status': r['status'],
                'data_recepcao': r['data_recepcao'],
                'data_inicio': r['data_inicio'],
                'documento_pendente': r['documento_pendente'],
                'documento_cancelado': r['documento_cancelado'],
                'data_fim': r['data_fim'],
                'duracao_dias_uteis': r['duracao_dias_uteis'],
            } for r in registros_anexados
        ]
    }
    return JsonResponse(response_data)

@csrf_exempt
def desanexar_registro(request, registro_id):
    # Obtenha a lista de registros anexados e desanexados da sessão
    registros_anexados = request.session.get('registros_anexados', [])
    registros_desanexados = request.session.get('registros_desanexados', [])

    # Verifique se o registro já está desanexado
    if registro_id not in registros_desanexados:
        # Obtenha o registro a ser desanexado a partir da lista de registros anexados
        registro_dict = next((registro for registro in registros_anexados if registro['id'] == registro_id), None)

        if registro_dict:
            # Crie uma instância de Nome (substitua 'Nome' pelo seu modelo real)
            nome_instance = User.objects.get(username=registro_dict['nome'])
            orgao_setor_instance = Setor.objects.get(orgao_setor=registro_dict['orgao_setor'])
            municipio_instance = Municipio.objects.get(municipio=registro_dict['municipio'])
            atividade_instance = Atividade.objects.get(atividade=registro_dict['atividade'])

            # Converta o registro_dict para um objeto RegistroFuncionarios
            novo_registro = RegistroFuncionarios(
                nome=nome_instance,
                orgao_setor=orgao_setor_instance,
                municipio=municipio_instance,
                atividade=atividade_instance,
                num_convenio=registro_dict['num_convenio'],
                parlamentar=registro_dict['parlamentar'],
                objeto=registro_dict['objeto'],
                oge_ogu=registro_dict['oge_ogu'],
                cp_prefeitura=registro_dict['cp_prefeitura'],
                valor_liberado=registro_dict['valor_liberado'],
                prazo_vigencia=datetime.strptime(registro_dict['prazo_vigencia'], '%d/%m/%Y').date(),
                situacao=registro_dict['situacao'],
                providencia=registro_dict['providencia'],
                data_recepcao=datetime.strptime(registro_dict['data_recepcao'], '%d/%m/%Y').date(),
                data_inicio=None if registro_dict['data_inicio'] is None else datetime.strptime(registro_dict['data_inicio'], '%d/%m/%Y').date(),
                documento_pendente=registro_dict['documento_pendente'],
                documento_cancelado=registro_dict['documento_cancelado'],
                data_fim=None if registro_dict['data_fim'] is None else datetime.strptime(registro_dict['data_fim'], '%d/%m/%Y').date(),
            )

            # Salve o novo registro na tabela original
            novo_registro.save()

            # Adicione o registro novamente à tabela original
            registros_anexados.append(registro_dict)

            # Remova o registro da lista de registros anexados
            registros_anexados = [r for r in registros_anexados if r['id'] != registro_id]

            # Atualize a lista de registros anexados e desanexados na sessão
            request.session['registros_anexados'] = registros_anexados

            # Adicione o registro à lista de registros desanexados
            registros_desanexados.append(registro_id)

            # Atualize a lista de registros desanexados na sessão
            request.session['registros_desanexados'] = registros_desanexados

    return JsonResponse({'message': 'Registro desanexado com sucesso'})

@ensure_csrf_cookie
def mostrar_registros_anexados(request):
    registros_anexados = request.session.get('registros_anexados', [])
    registros_desanexados = request.session.get('registros_desanexados', [])

    context = {
        'registros_anexados': registros_anexados,
        'registros_desanexados': registros_desanexados
    }

    # Verifique os dados armazenados na sessão e no objeto de resposta JSON
    print("Registros Anexados na Sessão:", registros_anexados)
    print("Registros Desanexados na Sessão:", registros_desanexados)
    print("Contexto para o retorno:", context)

    return JsonResponse(context)

@csrf_exempt
def verificar_sessao(request):
    # Log e retorno da sessão completa para depuração
    print("Conteúdo Completo da Sessão:", dict(request.session))
    return JsonResponse(dict(request.session.items()))


@require_GET
def tabela_filtrada(request):
    # Obtenha os registros filtrados como antes
    nomes = User.objects.all()
    orgaos_setores = Setor.objects.all()
    municipios = Municipio.objects.all()

    nome_id = request.GET.get('nome')
    orgao_setor_id = request.GET.get('orgao_setor')
    municipio_id = request.GET.get('municipio')
    num_convenio = request.GET.get('num_convenio')
    parlamentar = request.GET.get('parlamentar')
    prazo_vigencia = request.GET.get('prazo_vigencia')
    status = request.GET.get('status')

    registros_filtrados = RegistroFuncionarios.objects.all()

    if nome_id:
        registros_filtrados = registros_filtrados.filter(nome__id=nome_id)

    if orgao_setor_id:
        registros_filtrados = registros_filtrados.filter(orgao_setor__id=orgao_setor_id)

    if municipio_id:
        registros_filtrados = registros_filtrados.filter(municipio__id=municipio_id)

    if num_convenio:
        registros_filtrados = registros_filtrados.filter(num_convenio__icontains=num_convenio)

    if parlamentar:
        registros_filtrados = registros_filtrados.filter(parlamentar__icontains=parlamentar)

    if prazo_vigencia:
        registros_filtrados = registros_filtrados.filter(status__icontains=status)

    # Serialização dos registros filtrados
    registros_data = [
        {
            'id': registro.id,
            'nome': str(registro.nome.username),
            'orgao_setor': str(registro.orgao_setor.orgao_setor),
            'municipio': str(registro.municipio.municipio),
            'num_convenio': registro.num_convenio,
            'parlamentar': registro.parlamentar,
            'prazo_vigencia': registro.prazo_vigencia,
            'status': registro.status
        } for registro in registros_filtrados
    ]

    return JsonResponse({
        'registros_filtrados': registros_data,
        'nomes': list(nomes.values()),
        'orgaos_setores': list(orgaos_setores.values()),
        'municipios': list(municipios.values())
    })


@api_view(['GET'])
def tabela_caixa_api(request):
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='CAIXA')
    municipios = Municipio.objects.all()

    # Serializando os dados
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)
    municipios_serializados = MunicipioSerializer(municipios, many=True)

    data = {
        'registros': registros_serializados.data,
        'municipios': municipios_serializados.data,
    }

    return Response(data)


@api_view(['GET'])
def selecionar_municipio_api(request, municipio_id):
    try:
        municipio = Municipio.objects.get(id=municipio_id)
    except Municipio.DoesNotExist:
        return Response({'error': 'Municipio not found'}, status=404)
    
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='CAIXA', municipio=municipio)

    # Serializando os dados
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)
    municipios_serializados = MunicipioSerializer(municipio)

    data = {
        'registros': registros_serializados.data,
        'municipio': {
            'id': municipio.id,
            'municipio': municipio.municipio,
        },
        'municipios': municipios_serializados.data,
    }

    return Response(data)


@api_view(['GET'])
def tabela_estado(request):
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='ESTADO')
    municipios = Municipio.objects.all()
    
    # Serializando os registros
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)

    # Converte o queryset em uma lista de dicionários
    municipios_data = list(municipios.values())

    response_data = {
        'municipios': municipios_data,
        'registros': registros_serializados.data,
    }

    return JsonResponse(response_data)


@api_view(['GET'])
def tabela_fnde(request):
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='FNDE')
    municipios = Municipio.objects.all()

    # Serializando os registros
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)

    # Converte o queryset em uma lista de dicionários
    municipios_data = list(municipios.values())

    response_data = {
        'municipios': municipios_data,
        'registros': registros_serializados.data,
    }

    return JsonResponse(response_data)


@api_view(['GET'])
def tabela_simec(request):
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='SIMEC')
    municipios = Municipio.objects.all()

    # Serializando os registros
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)

    # Converte o queryset em uma lista de dicionários
    municipios_data = list(municipios.values())

    response_data = {
        'municipios': municipios_data,
        'registros': registros_serializados.data,
    }

    return JsonResponse(response_data)


@api_view(['GET'])
def tabela_fns(request):
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='FNS')
    municipios = Municipio.objects.all()

    # Serializando os registros
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)

    # Converte o queryset em uma lista de dicionários
    municipios_data = list(municipios.values())

    response_data = {
        'municipios': municipios_data,
        'registros': registros_serializados.data,
    }

    return JsonResponse(response_data)


@api_view(['GET'])
def tabela_entidade(request):
    registros = RegistroFuncionarios.objects.filter(orgao_setor__orgao_setor='Entidade')
    municipios = Municipio.objects.all()

    # Serializando os registros
    registros_serializados = RegistroFuncionariosSerializer(registros, many=True)

    # Converte o queryset em uma lista de dicionários
    municipios_data = list(municipios.values())

    response_data = {
        'municipios': municipios_data,
        'registros': registros_serializados.data,
    }

    return JsonResponse(response_data)


@api_view(['GET'])
def dashboard_data(request):
    try:
        # Total de atividades
        total_atividades = RegistroFuncionarios.objects.count()

        # Contagem de atividades por status
        concluidos = RegistroFuncionarios.objects.filter(status=Status.CONCLUIDO).count()
        pendentes = RegistroFuncionarios.objects.filter(status=Status.PENDENTE).count()
        em_analise = RegistroFuncionarios.objects.filter(status=Status.EM_ANALISE).count()
        nao_iniciado = RegistroFuncionarios.objects.filter(status=Status.NAO_INICIADO).count()
        suspensos = RegistroFuncionarios.objects.filter(status=Status.SUSPENSO).count()

        # Agrupamento de atividades por orgão/setor
        demanda_geral = RegistroFuncionarios.objects.values('orgao_setor__orgao_setor').annotate(total=Count('id'))

        # Agrupamento de demanda por atividade
        demanda_por_atividade = RegistroFuncionarios.objects.values('atividade__atividade').annotate(total=Count('id'))

        # Preparando os dados para o JSON
        response_data = {
            'total_atividades': total_atividades,
            'atividades_concluidas': concluidos,
            'atividades_com_pendencia': pendentes,
            'atividades_em_analise': em_analise,
            'atividades_nao_iniciadas': nao_iniciado,
            'atividades_suspensas': suspensos,
            'demanda_geral': list(demanda_geral),
            'demanda_por_atividade': list(demanda_por_atividade)
        }

        return Response(response_data, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['POST'])
def adicionar_registro_administrativo(request):
    if request.method == 'POST':
        try:
            # Carregar dados do corpo da requisição
            data = json.loads(request.body)

            # Obter a lista de municípios ou um único município
            municipio_ids = data.get('municipios') # O seu frontend deve enviar como 'municipios'

            if isinstance(municipio_ids, list) and municipio_ids:
                # Obter a lista de municípios ou um único município
                municipio = get_object_or_404(Municipio, id=municipio_ids[0]) # Pegue apenas o primeiro município
            else:
                return Response({'error': 'ID do município inválido.'}, status=status.HTTP_400_BAD_REQUEST)

            # Obter outros dados da requisição
            prazo_vigencia = data.get('prazo_vigencia')
            num_contrato = data.get('num_contrato')
            pub_femurn = data.get('pub_femurn')
            na_cacex = data.get('na_cacex', False)
            na_prefeitura = data.get('na_prefeitura', False)

            if not prazo_vigencia or not num_contrato or pub_femurn is None:
                return Response({'error': 'Dados obrigatórios ausentes.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # No seu método de salvar o registro
                prazo_vigencia = datetime.strptime(prazo_vigencia, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Formato de data inválido para prazo de vigência. Deve ser no formato YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar a instância do registro
            registro = RegistroAdminstracao(
                municipio=municipio,
                prazo_vigencia=prazo_vigencia,
                num_contrato=num_contrato,
                pub_femurn=pub_femurn,
                na_cacex=na_cacex,
                na_prefeitura=na_prefeitura,
            )

            registro.save()

            # Chame as funções utilitárias
            exibir_modal, dias_restantes = exibir_modal_prazo_vigencia(registro)

            print(registro)

            # Retornar uma resposta de sucesso
            return Response({'message': 'Registro adicionado com sucesso!'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(traceback.format_exc())
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'error': 'Método não permitido.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def listar_tabela_administrativa(request):
    registros = RegistroAdminstracao.objects.all()

    registros_data = [
        
        {
            'id': registro.id,
            'municipio': registro.municipio.municipio,
            'prazo_vigencia': registro.prazo_vigencia.strftime('%d/%m/%Y'),
            'num_contrato': registro.num_contrato,
            'pub_femurn': registro.pub_femurn,
            'na_cacex': registro.na_cacex,
            'na_prefeitura': registro.na_prefeitura,
            'dias_restantes': (registro.prazo_vigencia - timezone.now().date()).days,
            'exibir_modal_prazo_vigencia': (registro.prazo_vigencia - timezone.now().date()).days <= 30,
        } for registro in registros
    ]

    return Response(registros_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def listar_tabela_administrativa_por_id(request, id):
    try:
        # Buscando o objeto único pelo id
        registro = RegistroAdminstracao.objects.get(id=id)

        # Serializando o registro (use seu serializer aqui)
        serializer = RegistroAdministracaoSerializer(registro)

        return Response(serializer.data)
    except RegistroAdminstracao.DoesNotExist:
        return Response({'error': 'Registro não encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['PUT'])
def editar_registro_administrativo(request, registro_id):
    try:
        registro = get_object_or_404(RegistroAdminstracao, id=registro_id)
        data = json.loads(request.body)

        # Obter o município selecionado pelo ID
        municipio_id = data.get('municipio') # Assume que município retorna apenas o ID
        if municipio_id:
            municipio = get_object_or_404(Municipio, id=municipio_id)
            registro.municipio = municipio # Atribuir a instância correta do município

        registro.prazo_vigencia = datetime.strptime(data.get('prazo_vigencia', registro.prazo_vigencia.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
        registro.num_contrato = data.get('num_contrato', registro.num_contrato)
        registro.pub_femurn = data.get('pub_femurn', registro.pub_femurn)
        registro.na_cacex = data.get('na_cacex', registro.na_cacex)
        registro.na_prefeitura = data.get('na_prefeitura', registro.na_prefeitura)

        registro.save()

        return Response({'message': 'Registro editado com sucesso!'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['DELETE'])
def excluir_registro_administrativo(request, registro_id):
    try:
        registro = get_object_or_404(RegistroAdminstracao, id=registro_id)
        registro.delete()
        return Response({'message': 'Registro excluído com sucesso!'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = FuncionarioPrevidencia.objects.all()
    serializer_class = FuncionarioSerializer

    def listar_previdencia(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []

        # Adiciona a contribuição a cada funcionário no queryset
        for funcionario in queryset:
            contribuicao = funcionario.calcular_contribuicao()
            data.append({
                'id': funcionario.id,
                'nome': funcionario.nome,
                'salario': f'R$ {funcionario.salario:,.2f}'.replace(',', 'v').replace('.', ',').replace('v', '.'),
                'categoria': funcionario.categoria,
                'contribuicao': f'R$ {contribuicao:,.2f}'.replace(',', 'v').replace('.', ',').replace('v', '.')
            })

        # serializer = self.get_serializer(queryset, many=True)
        return Response(data)
    
    def adicionar_previdencia(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            funcionario = serializer.save()
            # Calcula a contribuição do novo funcionário
            funcionario.contribuicao = funcionario.calcular_contribuicao()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({
            'error': 'Dados inválidos',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def atualizar_previdencia(self, request, pk, *args, **kwargs):
        try:
            funcionario = self.get_object() # Obtém o funcionário baseado no ID
            serializer = self.get_serializer(funcionario, data=request.data)
            if serializer.is_valid():
                funcionario = serializer.save()
                funcionario.contribuicao = funcionario.calcular_contribuicao()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'error': 'Dados inválidos', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except FuncionarioPrevidencia.DoesNotExist:
            return Response({'error': 'Funcionário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
    def excluir_previdencia(self, request, pk, *args, **kwargs):
        try:
            funcionario = self.get_object() # Obtém o funcionário baseado no ID
            funcionario.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FuncionarioPrevidencia.DoesNotExist:
            return Response({'error': 'Funcionário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    

class FGTSViewSet(viewsets.ModelViewSet):
    queryset = FGTS.objects.all()
    serializer_class =  FGTSSerializer

    def create(self, request, *args, **kwargs):
        """ Cria um novo registro de FGTS. """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fgts_instance = serializer.save() # Salva o novo registro

        # Calcula e retorna os dados do FGTS
        dados_fgts = fgts_instance.calcular_fgts()

        return Response({**serializer.data, **dados_fgts}, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        """ Lista todos os registros de FGTS e seus dados calculados. """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calcula os dados do FGTS para cada instância
        dados_fgts_lista = []
        for fgts_instance, serialized_data in zip(queryset, serializer.data):
            dados_fgts = fgts_instance.calcular_fgts()
            dados_fgts_lista.append({**serialized_data, **dados_fgts})

        return Response(dados_fgts_lista)
    
    def update(self, request, *args, **kwargs):
        """ Atualiza um registro de FGTS existente. """
        fgts_instance = self.get_object() # Obtém a instância atual
        serializer = self.get_serializer(fgts_instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        fgts_instance = serializer.save() # Salva as atualizações

        # Calcula e retorna os dados atualizados do FGTS
        dados_fgts = fgts_instance.calcular_fgts()

        return Response({**serializer.data, **dados_fgts}, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        """ Exclui um registro de FGTS. """
        fgts_instance = self.get_object() # Obtém a instancia a ser excluída
        fgts_instance.delete() # Exclui a instância

        return Response(status=status.HTTP_204_NO_CONTENT)