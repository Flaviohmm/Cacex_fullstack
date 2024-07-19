from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from .models import Setor, Municipio, Atividade, RegistroFuncionarios, Historico
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from .utils import calcular_valores, exibir_modal_prazo_vigencia, dia_trabalho_total
from .templatetags.custom_filters import format_currency
from .serializers import SetorSerializer, MunicipioSerializer, AtividadeSerializer, HistoricoSerializer
from rest_framework import viewsets
from datetime import datetime
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
            'oge_ogu': f'R${registro.oge_ogu:,.2f}',
            'cp_prefeitura': f'R${registro.cp_prefeitura:,.2f}',
            'valor_total': f'R${registro.valor_total:,.2f}',
            'valor_liberado': f'R${registro.valor_liberado:,.2f}',
            'falta_liberar': f'R${registro.falta_liberar:,.2f}',
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

        print("Registros anexados atualizados:", request.session['registros_anexados'])

    print("Registros Anexados na Sessão após modificação:", request.session.get('registros_anexados'))
    return JsonResponse({'message': 'Registro anexado com sucesso'})

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
                oge_ogu=registro_dict['oge_ogu'].replace('R$', '').replace('.', '').replace(',', '.').strip(),
                cp_prefeitura=registro_dict['cp_prefeitura'].replace('R$', '').replace('.', '').replace(',', '.').strip(),
                valor_liberado=registro_dict['valor_liberado'].replace('R$', '').replace('.', '').replace(',', '.').strip(),
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
    print("Contexto para o retorno:", context)

    return JsonResponse(context)

@csrf_exempt
def verificar_sessao(request):
    # Log e retorno da sessão completa para depuração
    print("Conteúdo Completo da Sessão:", dict(request.session))
    return JsonResponse(dict(request.session.items()))