from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404

from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from .models import User

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.exclude(role__in=['aluno', 'professor', 'monitor'])
    serializer_class = UserSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def list(self, request):
        """
        Lista todos os usuários, excluindo aqueles com papéis 'aluno', 'professor' e 'monitor'.
        """
        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """
        Cria um novo usuário com os dados fornecidos na requisição, respeitando regras de permissão:
        - Admin pode criar qualquer usuário.
        - Coordenador pode criar qualquer um, exceto Admin e Coordenador.
        - Colaborador pode criar apenas Aluno.
        - Aluno, Professor e Monitor não podem criar usuários.
        """
        current_user = request.user  # Usuário autenticado que está fazendo a requisição

        # Impedir usuários com função aluno, professor e monitor de criar usuários
        if current_user.role in ['aluno', 'professor', 'monitor']:
            return Response(
                {"detail": "Você não tem permissão para criar usuários."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            new_user_role = serializer.validated_data.get('role')  # Obtendo a função do novo usuário

            # Verifica permissões para criação de usuários com base no papel do usuário autenticado
            if current_user.role == 'coordenador' and new_user_role in ['admin', 'coordenador']:
                return Response(
                    {"detail": "Coordenadores não podem criar Admins ou outros Coordenadores."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if current_user.role == 'colaborador' and new_user_role != 'aluno':
                return Response(
                    {"detail": "Colaboradores só podem criar usuários do tipo Aluno."},
                    status=status.HTTP_403_FORBIDDEN
                )

            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Retorna os detalhes de um usuário específico pelo ID (pk).
        """
        user = get_object_or_404(self.get_queryset(), pk=pk)  
        serializer = self.get_serializer(user) 
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
        """
        Atualiza parcialmente um usuário respeitando as regras de permissão:
        - Admin pode editar qualquer usuário.
        - Coordenador pode editar qualquer um, exceto Admin e Colaborador.
        - Colaborador só pode editar usuários do tipo Aluno.
        - Aluno, Professor e Monitor não podem editar nenhum usuário.
        """
        current_user = request.user  # Usuário autenticado que está fazendo a requisição
        user_to_update = get_object_or_404(self.get_queryset(), pk=pk)  # Busca usuário ou retorna 404

        # Impedir usuários sem permissão de editar qualquer usuário
        if current_user.role in ['aluno', 'professor', 'monitor']:
            return Response(
                {"detail": "Você não tem permissão para editar usuários."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Impedir coordenador de editar Admins e Colaboradores
        if current_user.role == 'coordenador' and user_to_update.role in ['admin', 'coordenador']:
            return Response(
                {"detail": "Coordenadores não podem editar Admins ou Coordenadores."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Impedir colaborador de editar qualquer usuário que não seja Aluno
        if current_user.role == 'colaborador' and user_to_update.role != 'aluno':
            return Response(
                {"detail": "Colaboradores só podem editar usuários do tipo Aluno."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Se passou nas verificações, realiza a atualização parcial
        serializer = self.get_serializer(user_to_update, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, pk=None):
        """
        Exclui um usuário respeitando as regras de permissão:
        - Admin pode deletar qualquer usuário, exceto a si mesmo, e deve haver pelo menos um Admin no sistema.
        - Coordenador pode deletar qualquer um, exceto Admin e outros Coordenadores.
        - Colaborador só pode deletar usuários do tipo Aluno.
        - Aluno, Professor e Monitor não podem excluir nenhum usuário.
        """
        current_user = request.user  # Usuário autenticado que está fazendo a requisição
        user_to_delete = get_object_or_404(self.get_queryset(), pk=pk)  # Busca usuário ou retorna 404

        # Impedir usuários sem permissão de excluir qualquer usuário
        if current_user.role in ['aluno', 'professor', 'monitor']:
            return Response(
                {"detail": "Você não tem permissão para excluir usuários."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Impedir coordenador de excluir Admins e outros Coordenadores
        if current_user.role == 'coordenador' and user_to_delete.role in ['admin', 'coordenador']:
            return Response(
                {"detail": "Coordenadores não podem excluir Admins ou outros Coordenadores."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Impedir colaborador de excluir qualquer usuário que não seja Aluno
        if current_user.role == 'colaborador' and user_to_delete.role != 'aluno':
            return Response(
                {"detail": "Colaboradores só podem excluir usuários do tipo Aluno."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Impedir Admin de excluir a si mesmo
        if current_user.role == 'admin' and current_user.id == user_to_delete.id:
            return Response(
                {"detail": "Você não pode excluir a si mesmo."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Impedir que o último Admin seja excluído
        if user_to_delete.role == 'admin' and User.objects.filter(role='admin').count() <= 1:
            return Response(
                {"detail": "Não é possível excluir o último usuário Admin do sistema."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Se passou nas verificações, exclui o usuário
        user_to_delete.delete()
        return Response({"detail": "Usuário excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)
