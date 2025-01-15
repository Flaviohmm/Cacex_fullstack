from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from plataforma.models import Setor, UserSetor
from plataforma.serializers import UsuarioSetorSerializer
import json


@csrf_exempt
def cadastro(request):
    if request.method == "POST":
        body = json.loads(request.body)
        username = body.get('username')
        senha = body.get('senha')

        if not username or not senha:
            return JsonResponse({'error': 'Preencha todos os campos.'}, status=400)
        
        user = User.objects.filter(username=username)

        if user.exists():
            return JsonResponse({'error': 'Já existe um usuário com esse nome cadastrado.'}, status=400)
        
        try:
            user = User.objects.create_user(username=username, password=senha)
            user.save()
            return JsonResponse({'success': 'Cadastro realizado com sucesso.'}, status=201)
        except:
            return JsonResponse({'error': 'Erro interno do sistema.'}, status=500)
     
@csrf_exempt
def login(request):
    if request.method == "POST":
        body = json.loads(request.body)
        username = body.get('username')
        senha = body.get('senha')

        usuario = authenticate(request, username=username, password=senha)

        if not usuario:
            return JsonResponse({'error': 'Usuário ou senha inválidos.'}, status=400)
        else:
            auth_login(request, usuario)
            token, created = Token.objects.get_or_create(user=usuario)
            return JsonResponse({'success': 'Login realizado com sucesso.', 'token': token.key}, status=200)
        
@csrf_exempt
def sair(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'success': 'Logout realizado com sucesso.'}, status=200)
        return JsonResponse({'error': 'Usuário não está autenticado.'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lista_usuarios(request):
    user = request.user
    user_data = {'id': user.id, 'username': user.username, 'nome': user.first_name}
    return Response([user_data], status=status.HTTP_200_OK)


class UserList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = get_object_or_404(User, username=request.user.username)
        user_data = {'id': user.id, 'username': user.username, 'name': user.first_name}
        return Response([user_data])
    
    
@api_view(['POST'])
def associar_usuario_setor(request):
    user = request.user
    setor_ids = request.data.get('setor_ids')

    if not setor_ids:
        return Response({'error': 'Nenhum setor foi fornecido.'}, status=status.HTTP_400_BAD_REQUEST)
    
    success_count = 0
    already_associated = []

    for setor_id in setor_ids:
        try:
            setor = Setor.objects.get(id=setor_id)
            user_setor, created = UserSetor.objects.get_or_create(user=user, setor=setor)

            if created:
                success_count += 1
            else:
                already_associated.append(setor_id)
        except Setor.DoesNotExist:
            return Response({'error': f'Setor com ID {setor_id} não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    response_message = {
        'success': f'{success_count} setor(es) associado(s) com sucesso.'
    }

    if already_associated:
        response_message['message'] = f'O(s) setor(es) com ID(s) {already_associated} já está(ão) associado(s) ao usuário.'

    return Response(response_message, status=status.HTTP_200_OK)


@api_view(['GET'])
def listar_associacoes_usuario(request):
    user = request.user

    # Verificação se o usuário está autenticado
    if not user.is_authenticated:
        return Response({'error': 'Usuário não autenticado.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user_setores = UserSetor.objects.filter(user=user).select_related('setor')
        associacoes = [{
            'id': user_setor.id,
            'orgao_setor': user_setor.setor.orgao_setor,
        } for user_setor in user_setores]

        return Response(associacoes, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def editar_associacao_usuario(request, associacao_id):
    user = request.user
    setor_id = request.data.get('setor_id')

    if setor_id is None:
        # Se setor_id é None, apaga todos os registros de UserSetor do usuário
        try:
            # Exclui todos os setores associados a esse usuário
            UserSetor.objects.filter(user=user).delete()
            return Response({'success': 'Todos os setores associados foram removidos.'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        # Buscar a associação existente
        user_setor = UserSetor.objects.get(id=associacao_id, user=user)
        setor = Setor.objects.get(id=setor_id)

        # Atualizar a associação
        user_setor.setor = setor
        user_setor.save()

        return Response({'success': 'Associação atualizada com sucesso.'}, status=status.HTTP_200_OK)
    
    except UserSetor.DoesNotExist:
        return Response({'error': 'Associação não encontrada ou você não tem permissão para editá-la.'}, status=status.HTTP_404_NOT_FOUND)
    except Setor.DoesNotExist:
        return Response({'error': 'Setor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UsuarioSetorViewSet(viewsets.ModelViewSet):
    queryset=UserSetor.objects.all()
    serializer_class=UsuarioSetorSerializer

    # Endpoint para listar setores associados a um usuário
    @action(methods=['get'], detail=True, url_path='associacoes_usuario')
    def get_associacoes_usuario(self, request, pk=None):
        associacao = self.get_object()
        setores = associacao.setores.all()  # Ajuste conforme os relacionamentos em seu modelo
        setor_ids = [setor.id for setor in setores]
        return Response({'setor_ids': setor_ids}, status=status.HTTP_200_OK)
    
    # Endpoint para editar a associação entre usuário e setores
    @action(methods=['put'], detail=True, url_path='editar_associacao_usuario')
    def editar_associacao_usuario(self, request, pk=None):
        associacao = self.get_object()
        setores_ids = request.data.get('setor_ids', [])

        if not setores_ids:
            return Response({'error': 'Nenhum setor foi fornecido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Supõe que você tenha uma relação ManyToMany
        associacao.setores.clear() # Limpa associações anteriores
        for setor_id in setores_ids:
            associacao.setores.add(setor_id) # Adiciona novos setores

        associacao.save()
        return Response({'success': 'Associação atualizada com sucesso.'}, status=status.HTTP_200_OK)
