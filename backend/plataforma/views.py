from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from .models import Setor, Municipio, Atividade
from .serializers import SetorSerializer, MunicipioSerializer, AtividadeSerializer
from rest_framework import viewsets

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