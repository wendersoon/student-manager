from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

from rest_framework import serializers

from .models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            if "refresh" in data:
                del data["refresh"]
            data['role'] = self.user.role           
            return data
        except AuthenticationFailed as e:
            # Personalizando a mensagem de erro
            raise AuthenticationFailed(
                detail="As credenciais fornecidas estão incorretas ou a conta não está ativa.",
                code="authorization"
            )

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'lastName', 'role', 'is_active', 'created_at', 'password']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance