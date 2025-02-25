from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta

import pytest

from .models import Class, User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="admin@example.com", 
        password="adminpass", 
        name="Admin",
        lastName="User",
        role="admin"
    )

@pytest.fixture
def coordenador_user(db):
    return User.objects.create_user(
        email="coordenador@example.com", 
        password="coordpass", 
        name="Coordenador",
        lastName="User",
        role="coordenador"
    )

@pytest.fixture
def colaborador_user(db):
    return User.objects.create_user(
        email="colaborador@example.com", 
        password="colabpass", 
        name="Colaborador",
        lastName="User",
        role="colaborador"
    )

@pytest.fixture
def aluno_user(db):
    return User.objects.create_user(
        email="aluno@example.com", 
        password="alunopass", 
        name="Aluno",
        lastName="User",
        role="aluno"
    )

@pytest.fixture
def professor_user(db):
    return User.objects.create_user(
        email="professor@example.com", 
        password="professorpass", 
        name="Professor",
        lastName="User",
        role="professor"
    )

@pytest.fixture
def monitor_user(db):
    return User.objects.create_user(
        email="monitor@example.com", 
        password="monitorpass", 
        name="Monitor",
        lastName="User",
        role="monitor"
    )

@pytest.fixture
def test_class(db, admin_user):
    return Class.objects.create(
        name="Turma Teste",
        description="Descrição da turma de teste",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=90),
        created_by=admin_user
    )

@pytest.mark.django_db
def test_list_classes(api_client, admin_user):
    """Testa se um usuário autenticado pode listar as turmas"""
    api_client.force_authenticate(user=admin_user)
    response = api_client.get(reverse('classes-list'))
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_retrieve_class(api_client, admin_user, test_class):
    """Testa se um usuário autenticado pode recuperar detalhes de uma turma específica"""
    api_client.force_authenticate(user=admin_user)
    response = api_client.get(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == test_class.name

@pytest.mark.django_db
def test_create_class_admin(api_client, admin_user):
    """Admin deve conseguir criar uma turma"""
    api_client.force_authenticate(user=admin_user)
    payload = {
        "name": "Nova Turma",
        "description": "Descrição da nova turma",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["name"] == "Nova Turma"
    assert response.data["created_by"] == admin_user.id

@pytest.mark.django_db
def test_create_class_coordenador(api_client, coordenador_user):
    """Coordenador deve conseguir criar uma turma"""
    api_client.force_authenticate(user=coordenador_user)
    payload = {
        "name": "Turma Coordenação",
        "description": "Descrição da turma de coordenação",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["name"] == "Turma Coordenação"
    assert response.data["created_by"] == coordenador_user.id

@pytest.mark.django_db
def test_create_class_colaborador_forbidden(api_client, colaborador_user):
    """Colaborador não deve conseguir criar uma turma"""
    api_client.force_authenticate(user=colaborador_user)
    payload = {
        "name": "Turma Colaborador",
        "description": "Descrição da turma de colaborador",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_create_class_professor_forbidden(api_client, professor_user):
    """Professor não deve conseguir criar uma turma"""
    api_client.force_authenticate(user=professor_user)
    payload = {
        "name": "Turma Professor",
        "description": "Descrição da turma de professor",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_create_class_aluno_forbidden(api_client, aluno_user):
    """Aluno não deve conseguir criar uma turma"""
    api_client.force_authenticate(user=aluno_user)
    payload = {
        "name": "Turma Aluno",
        "description": "Descrição da turma de aluno",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_create_class_monitor_forbidden(api_client, monitor_user):
    """Monitor não deve conseguir criar uma turma"""
    api_client.force_authenticate(user=monitor_user)
    payload = {
        "name": "Turma Monitor",
        "description": "Descrição da turma de monitor",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_partial_update_class_admin(api_client, admin_user, test_class):
    """Admin deve conseguir atualizar uma turma parcialmente"""
    api_client.force_authenticate(user=admin_user)
    payload = {"name": "Turma Atualizada"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Turma Atualizada"

@pytest.mark.django_db
def test_partial_update_class_coordenador(api_client, coordenador_user, test_class):
    """Coordenador deve conseguir atualizar uma turma parcialmente"""
    api_client.force_authenticate(user=coordenador_user)
    payload = {"description": "Nova descrição da turma"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["description"] == "Nova descrição da turma"

@pytest.mark.django_db
def test_partial_update_class_colaborador_forbidden(api_client, colaborador_user, test_class):
    """Colaborador não deve conseguir atualizar uma turma"""
    api_client.force_authenticate(user=colaborador_user)
    payload = {"name": "Turma Colaborador Atualizada"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_partial_update_class_professor_forbidden(api_client, professor_user, test_class):
    """Professor não deve conseguir atualizar uma turma"""
    api_client.force_authenticate(user=professor_user)
    payload = {"name": "Turma Professor Atualizada"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_partial_update_class_aluno_forbidden(api_client, aluno_user, test_class):
    """Aluno não deve conseguir atualizar uma turma"""
    api_client.force_authenticate(user=aluno_user)
    payload = {"name": "Turma Aluno Atualizada"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_partial_update_class_monitor_forbidden(api_client, monitor_user, test_class):
    """Monitor não deve conseguir atualizar uma turma"""
    api_client.force_authenticate(user=monitor_user)
    payload = {"name": "Turma Monitor Atualizada"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_put_method_not_allowed(api_client, admin_user, test_class):
    """Método PUT não deve ser permitido"""
    api_client.force_authenticate(user=admin_user)
    payload = {
        "name": "Turma PUT",
        "description": "Descrição da turma PUT",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.put(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

@pytest.mark.django_db
def test_delete_class_admin(api_client, admin_user, test_class):
    """Admin deve conseguir excluir uma turma"""
    api_client.force_authenticate(user=admin_user)
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_delete_class_coordenador(api_client, coordenador_user, test_class):
    """Coordenador deve conseguir excluir uma turma"""
    api_client.force_authenticate(user=coordenador_user)
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_delete_class_colaborador_forbidden(api_client, colaborador_user, test_class):
    """Colaborador não deve conseguir excluir uma turma"""
    api_client.force_authenticate(user=colaborador_user)
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_delete_class_professor_forbidden(api_client, professor_user, test_class):
    """Professor não deve conseguir excluir uma turma"""
    api_client.force_authenticate(user=professor_user)
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_delete_class_aluno_forbidden(api_client, aluno_user, test_class):
    """Aluno não deve conseguir excluir uma turma"""
    api_client.force_authenticate(user=aluno_user)
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_delete_class_monitor_forbidden(api_client, monitor_user, test_class):
    """Monitor não deve conseguir excluir uma turma"""
    api_client.force_authenticate(user=monitor_user)
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_unauthenticated_access_list(api_client):
    """Usuário não autenticado não deve ter acesso à listagem de turmas"""
    response = api_client.get(reverse('classes-list'))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_unauthenticated_access_create(api_client):
    """Usuário não autenticado não deve ter acesso à criação de turmas"""
    payload = {
        "name": "Turma Não Autenticada",
        "description": "Descrição da turma não autenticada",
        "start_date": date.today().isoformat(),
        "end_date": (date.today() + timedelta(days=90)).isoformat(),
        "is_active": True
    }
    response = api_client.post(reverse('classes-list'), payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_unauthenticated_access_retrieve(api_client, test_class):
    """Usuário não autenticado não deve ter acesso aos detalhes de uma turma"""
    response = api_client.get(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_unauthenticated_access_update(api_client, test_class):
    """Usuário não autenticado não deve ter acesso à atualização de turmas"""
    payload = {"name": "Turma Não Autenticada Atualizada"}
    response = api_client.patch(reverse('classes-detail', args=[test_class.id]), payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_unauthenticated_access_delete(api_client, test_class):
    """Usuário não autenticado não deve ter acesso à exclusão de turmas"""
    response = api_client.delete(reverse('classes-detail', args=[test_class.id]))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
