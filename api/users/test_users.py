from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

import pytest

from .models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user(db):
    return User.objects.create_user(email="admin@example.com", password="adminpass", role="admin")

@pytest.fixture
def coordenador_user(db):
    return User.objects.create_user(email="coordenador@example.com", password="coordpass", role="coordenador")

@pytest.fixture
def colaborador_user(db):
    return User.objects.create_user(email="colaborador@example.com", password="colabpass", role="colaborador")

@pytest.fixture
def aluno_user(db):
    return User.objects.create_user(email="aluno@example.com", password="alunopass", role="aluno")

@pytest.fixture
def professor_user(db):
    return User.objects.create_user(email="professor@example.com", password="professorpass", role="professor")

@pytest.fixture
def monitor_user(db):
    return User.objects.create_user(email="monitor@example.com", password="monitorpass", role="monitor")

@pytest.fixture
def usuario_normal(db):
    return User.objects.create_user(email="user@example.com", password="userpass", role="user")

@pytest.fixture
def create_test_user(db):
    def make_user(email, password, role):
        return User.objects.create_user(email=email, password=password, role=role)
    return make_user


@pytest.mark.django_db
def test_list_users(api_client, admin_user):
    """Testa se um admin pode listar os usuários"""
    api_client.force_authenticate(user=admin_user)
    response = api_client.get(reverse('users-list'))
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_create_user_admin(api_client, admin_user):
    """Admin deve conseguir criar qualquer usuário"""
    api_client.force_authenticate(user=admin_user)
    payload = {
        "name": "Novo Usuário",
        "lastName": "Sobrenome",
        "email": "novo_usuario@example.com",
        "password": "testpassword",
        "role": "coordenador"
    }
    response = api_client.post(reverse('users-list'), payload)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["role"] == "coordenador"


@pytest.mark.django_db
def test_create_user_coordenador_cannot_create_admin(api_client, coordenador_user):
    """Coordenador não pode criar Admin nem outro Coordenador"""
    api_client.force_authenticate(user=coordenador_user)
    payload = {
        "name": "Novo Usuário",
        "lastName": "Sobrenome",
        "email": "newadmin@example.com", 
        "password": "adminpass", 
        "role": "admin"
    }
    response = api_client.post(reverse('users-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_create_user_colaborador_cannot_create_professor(api_client, colaborador_user):
    """Colaborador só pode criar Aluno"""
    api_client.force_authenticate(user=colaborador_user)
    payload = {
        "name": "Novo Usuário",
        "lastName": "Sobrenome",
        "email": "newprof@example.com", 
        "password": "profpass", 
        "role": "professor"
    }
    response = api_client.post(reverse('users-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_create_user_aluno_cannot_create_user(api_client, aluno_user):
    """Aluno não pode criar nenhum usuário"""
    api_client.force_authenticate(user=aluno_user)
    payload = {
        "name": "Novo Usuário",
        "lastName": "Sobrenome",
        "email": "newuser@example.com", 
        "password": "userpass", 
        "role": "user"
    }
    response = api_client.post(reverse('users-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_partial_update_user_admin(api_client, admin_user, coordenador_user):
    """Admin pode atualizar qualquer usuário"""
    api_client.force_authenticate(user=admin_user)
    payload = {"name": "Novo Nome"}
    response = api_client.patch(reverse('users-detail', args=[coordenador_user.id]), payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Novo Nome"


@pytest.mark.django_db
def test_partial_update_colaborador_cannot_update_admin(api_client, colaborador_user, admin_user):
    """Colaborador não pode atualizar Professor"""
    api_client.force_authenticate(user=colaborador_user)
    payload = {"name": "Nome Inválido"}
    response = api_client.patch(reverse('users-detail', args=[admin_user.id]), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_delete_user_admin(api_client, admin_user, usuario_normal):
    """Admin pode excluir qualquer usuário, exceto a si mesmo e o último Admin"""
    api_client.force_authenticate(user=admin_user)
    response = api_client.delete(reverse('users-detail', args=[usuario_normal.id]))
    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_delete_last_admin_fails(api_client, admin_user):
    """Não pode excluir o último Admin"""
    api_client.force_authenticate(user=admin_user)
    response = api_client.delete(reverse('users-detail', args=[admin_user.id]))
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_delete_coordenador_cannot_delete_admin(api_client, coordenador_user, admin_user):
    """Coordenador não pode excluir Admin"""
    api_client.force_authenticate(user=coordenador_user)
    response = api_client.delete(reverse('users-detail', args=[admin_user.id]))
    assert response.status_code == status.HTTP_403_FORBIDDEN
