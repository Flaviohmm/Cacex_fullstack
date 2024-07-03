from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
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
            return JsonResponse({'success': 'Login realizado com sucesso.'}, status=200)
        
@csrf_exempt
def sair(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'success': 'Logout realizado com sucesso.'}, status=200)
        return JsonResponse({'error': 'Usuário não está autenticado.'}, status=400)
    
