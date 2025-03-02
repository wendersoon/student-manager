from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator
from django.utils.translation import gettext_lazy as _
from datetime import date
from django.core.exceptions import ValidationError

from users.models import User

def validate_birth_date(value):
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    if age < 12:
        raise ValidationError(_('A idade mínima é de 12 anos.'))
    if age > 100:
        raise ValidationError(_('A idade máxima é de 100 anos.'))

class Student(models.Model):
    GENDER_CHOICES = (
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    )
    CHANNEL_CHOICES = (
        ('I', 'Instagram'),
        ('F', 'Indicação'),
        ('Y', 'Youtube'),
        ('S', 'Site'),
        ('A', 'Anuncio'),
        ('E', 'Embaixador'),
        ('P', 'Professor'),
        ('V', 'Prospeccao'),
        ('T', 'Atendimento'),
        ('X', 'Outro'),
    )
    DESIRED_COURSE = (
        ('M', 'Medicina'),
        ('F', 'Farmácia'),
        ('O', 'Odontologia'),
        ('G', 'Gestão da Tecnologia da Informação'),
        ('C', 'Ciência da Computação'),
        ('V', 'Medicina Veterinária'),
        ('D', 'Design'),
        ('R', 'Relações Públicas'),
        ('A', 'Arquitetura e Urbanismo'),
        ('P', 'Publicidade e Propaganda'),
        ('L', 'Letras'),
        ('T', 'Fisioterapia'),
        ('S', 'Sistemas de Informação'),
        ('N', 'Contabilidade'),
        ('E', 'Economia'),
        ('I', 'Engenharia Civil'),
        ('Y', 'Psicologia'),
        ('Q', 'Gestão da Qualidade'),
        ('H', 'Redes de Computadores'),
        ('Z', 'Agronomia'),
        ('X', 'Outro')
    )

    # Lista completa de estados brasileiros
    ESTADOS_CHOICES = (
        ('AC', 'Acre'),
        ('AL', 'Alagoas'),
        ('AP', 'Amapá'),
        ('AM', 'Amazonas'),
        ('BA', 'Bahia'),
        ('CE', 'Ceará'),
        ('DF', 'Distrito Federal'),
        ('ES', 'Espírito Santo'),
        ('GO', 'Goiás'),
        ('MA', 'Maranhão'),
        ('MT', 'Mato Grosso'),
        ('MS', 'Mato Grosso do Sul'),
        ('MG', 'Minas Gerais'),
        ('PA', 'Pará'),
        ('PB', 'Paraíba'),
        ('PR', 'Paraná'),
        ('PE', 'Pernambuco'),
        ('PI', 'Piauí'),
        ('RJ', 'Rio de Janeiro'),
        ('RN', 'Rio Grande do Norte'),
        ('RS', 'Rio Grande do Sul'),
        ('RO', 'Rondônia'),
        ('RR', 'Roraima'),
        ('SC', 'Santa Catarina'),
        ('SP', 'São Paulo'),
        ('SE', 'Sergipe'),
        ('TO', 'Tocantins'),
        ('XX', 'Outro')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    birth_date = models.DateField(validators=[validate_birth_date])
    sexo = models.CharField(max_length=1, choices=GENDER_CHOICES)
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message=_('O número de telefone deve estar no formato: "+999999999". Até 15 dígitos são permitidos.')
            )
        ]
    )
    responsible_name = models.CharField(max_length=60)
    responsible_phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message=_('O número de telefone deve estar no formato: "+999999999". Até 15 dígitos são permitidos.')
            )
        ]
    )
    
    # Adress
    street = models.CharField(max_length=255, validators=[MinLengthValidator(3)])
    number = models.CharField(max_length=6, default="S/N")
    block = models.CharField(max_length=6, default='S/Q')
    city = models.CharField(max_length=255, validators=[MinLengthValidator(2)])
    # Alterado para usar a lista de estados predefinida
    state = models.CharField(
        max_length=2, 
        choices=ESTADOS_CHOICES,
        help_text=_('Selecione o estado brasileiro')
    )
    zip_code = models.CharField(
        max_length=8,
        validators=[
            RegexValidator(
                regex=r'^\d{8}$',
                message=_('O CEP deve conter 8 dígitos numéricos, sem traços ou pontos.')
            )
        ]
    )
    country = models.CharField(max_length=255, default='Brasil')
    
    # Other
    channel = models.CharField(max_length=1, choices=CHANNEL_CHOICES)
    other_channel = models.CharField(max_length=30, null=True, blank=True)
    desired_course = models.CharField(max_length=1, choices=DESIRED_COURSE)
    other_desired_course = models.CharField(max_length=30, null=True, blank=True)
    observations = models.TextField(null=True, blank=True, max_length=120)

    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True, 
        related_name='student_created'
    )
    sold_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True, 
        related_name='student_sold' 
    )

    class Meta:
        db_table = 'student'
        verbose_name = 'Aluno'
        verbose_name_plural = 'Alunos'
        
    def clean(self):
        super().clean()
        # Validar que other_desired_course é preenchido quando desired_course = 'X'
        if self.desired_course == 'X' and not self.other_desired_course:
            raise ValidationError({
                'other_desired_course': _('Por favor, especifique o curso desejado quando "Outro" for selecionado.')
            })
        if self.channel == 'X' and not self.other_channel:
            raise ValidationError({
                'other_channel': _('Por favor, especifique o meio quando "Outro" for selecionado.')
            })
