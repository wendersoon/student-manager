from django.db import models
from django.contrib.auth import get_user_model

from django.core.validators import FileExtensionValidator

User = get_user_model()


class Student(models.Model):
    GENDER_CHOICES = (
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    bitrh_date = models.DateField()
    sexo = models.CharField(max_length=1, choices=GENDER_CHOICES)
    phone = models.CharField(max_length=20)
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=10)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=9)
    county = models.CharField(max_length=255, default='Brasil')
    
    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student'

        verbose_name = 'Aluno'
        verbose_name_plural = 'Alunos'

class Document(models.Model):
    DOCUMENT_TYPES = [
        ('rg', 'RG'),
        ('cpf', 'CPF'),
        ('diploma', 'Diploma'),
        ('historico', 'Histórico'),
        ('outros', 'Outros'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    document_archive = models.FileField(upload_to='documents/', validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
            )
        ]
    )
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    observation = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'document'

        ordering = ['upload_date']
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
