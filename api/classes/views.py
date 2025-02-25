from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .serializers import ClassSerializer
from .models import Class


class ClassViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    
    def list(self, request):
        classes = self.get_queryset()
        serializer = self.get_serializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        
        current_user = request.user

        if current_user.role in ['colaborador', 'aluno', 'professor', 'monitor']:
            return Response(
                {"detail": "Você não tem permissão para criar turmas."},
                status=status.HTTP_403_FORBIDDEN
            )
                
        # Adiciona o usuário atual como criador da turma
        data = request.data.copy()
        data['created_by'] = current_user.id

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        class_obj = get_object_or_404(Class, pk=pk)
        serializer = self.get_serializer(class_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """
        Método PUT desabilitado. Use PATCH para atualização parcial.
        """
        return Response(
            {"detail": "Método PUT não permitido. Use PATCH para atualizações."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def partial_update(self, request, pk=None):
        current_user = request.user

        if current_user.role in ['colaborador', 'aluno', 'monitor', 'professor']:
            return Response(
                {"detail": "Você não tem permissão para atualizar turmas."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        class_obj = get_object_or_404(Class, pk=pk)

        serializer = self.get_serializer(class_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        current_user = request.user
        
        if current_user.role in ['colaborador', 'aluno', 'professor', 'monitor']:
            return Response(
                {"detail": "Você não tem permissão para excluir turmas."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        class_obj = get_object_or_404(Class, pk=pk)

        class_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
