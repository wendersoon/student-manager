from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('monitor', 'Monitor'),
        ('professor', 'Professor'),
        ('coordenador', 'Coordenador'),
        ('aluno', 'Aluno'),
        ('colaborador', 'Colaborador'),
    ]

    name = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True,
        verbose_name='Foto de Perfil',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['jpg', 'jpeg', 'png', 'webp'],
                message='Apenas arquivos com extensão .jpg, .jpeg, .png ou .webp são permitidos.'
            )
        ]
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'lastName', 'role']

    objects = CustomUserManager()
    
    class Meta:
        db_table = 'users'

    def save(self, *args, **kwargs):
        # Remove old image file when updating
        if self.pk:
            try:
                old_instance = User.objects.get(pk=self.pk)
                if old_instance.profile_picture and self.profile_picture != old_instance.profile_picture:
                    old_instance.profile_picture.delete(save=False)
            except User.DoesNotExist:
                pass
        super().save(*args, **kwargs)