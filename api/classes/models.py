from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Class(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    
    start_date = models.DateField()
    end_date = models.DateField()

    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True, 
        related_name='classes_created')

    class Meta:
        db_table = 'turmas'

        verbose_name = 'Turma'
        verbose_name_plural = 'Turmas'
