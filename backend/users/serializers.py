from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, PerfilAgricultor

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'telefone', 'tipo_usuario', 'localizacao', 'provincia', 
            'distrito', 'culturas_interesse', 'receber_sms', 
            'receber_whatsapp', 'data_criacao', 'ativo'
        ]
        read_only_fields = ['id', 'data_criacao']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'telefone', 'first_name', 'last_name', 'localizacao', 
            'provincia', 'distrito', 'culturas_interesse', 
            'receber_sms', 'receber_whatsapp'
        ]

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'telefone', 'tipo_usuario',
            'localizacao', 'provincia', 'distrito', 'culturas_interesse',
            'receber_sms', 'receber_whatsapp'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user

class PerfilAgricultorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PerfilAgricultor
        fields = [
            'user', 'tamanho_propriedade', 'tipo_agricultura',
            'experiencia_anos', 'tem_irrigacao'
        ]
