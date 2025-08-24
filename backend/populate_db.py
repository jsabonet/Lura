"""
Script para popular a base de dados com dados de    farmer2_profile = PerfilAgricultor.objects.create(
        user=farmer2,
        tamanho_propriedade=12.0,
        tipo_agricultura='comercial',
        experiencia_anos=15,
        tem_irrigacao=True,
        principais_culturas=['arroz', 'cana_acucar', 'mandioca']
    )o AgroAlerta
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from users.models import User, PerfilAgricultor
from clima.models import WeatherData, WeatherAlert
from pragas.models import Pest, PestAlert, PestDetection
from mercado.models import Crop, MarketPrice, MarketTrend
from recomendacoes.models import Recommendation
from notificacoes.models import Notification

def create_test_data():
    print("🌱 Criando dados de teste para AgroAlerta...")
    
    # 1. Criar usuários de teste
    print("👥 Criando usuários...")
    
    # Farmer 1
    farmer1 = User.objects.create_user(
        username='jose_farmer',
        email='jose@fazenda.com',
        password='password123',
        first_name='José',
        last_name='Maputo',
        telefone='+258843123456',
        tipo_usuario='agricultor',
        localizacao='Maputo',
        provincia='Maputo',
        distrito='Maputo',
        culturas_interesse=['milho', 'feijao', 'tomate'],
        receber_sms=True,
        receber_whatsapp=True
    )
    
    farmer1_profile = PerfilAgricultor.objects.create(
        user=farmer1,
        tamanho_propriedade=5.5,
        tipo_agricultura='subsistencia',
        experiencia_anos=10,
        tem_irrigacao=True,
        principais_culturas=['milho', 'feijao', 'tomate']
    )
    
    # Farmer 2
    farmer2 = User.objects.create_user(
        username='maria_farmer',
        email='maria@agricultura.com',
        password='password123',
        first_name='Maria',
        last_name='Beira',
        telefone='+258841987654',
        tipo_usuario='agricultor',
        localizacao='Beira',
        provincia='Sofala',
        distrito='Beira',
        culturas_interesse=['arroz', 'cana_acucar', 'mandioca'],
        receber_sms=True,
        receber_whatsapp=True
    )
    
    farmer2_profile = FarmerProfile.objects.create(
        user=farmer2,
        location='Beira',
        farm_size=12.0,
        crops_grown=['arroz', 'cana_acucar', 'mandioca'],
        phone_number='+258841987654',
        whatsapp_number='+258841987654'
    )
    
    # 2. Criar dados climáticos
    print("🌤️ Criando dados climáticos...")
    
    base_date = datetime.now()
    
    # Dados para Maputo
    for i in range(7):
        date = base_date + timedelta(days=i)
        WeatherData.objects.create(
            location='Maputo',
            date=date.date(),
            temperature_max=28 + i,
            temperature_min=18 + i,
            humidity=65 + i*2,
            precipitation=0 if i < 3 else 5 * i,
            wind_speed=15 + i,
            pressure=1013 + i,
            description='Parcialmente nublado' if i < 4 else 'Chuvoso'
        )
    
    # Dados para Beira
    for i in range(7):
        date = base_date + timedelta(days=i)
        WeatherData.objects.create(
            location='Beira',
            date=date.date(),
            temperature_max=32 + i,
            temperature_min=22 + i,
            humidity=75 + i,
            precipitation=0 if i < 2 else 8 * i,
            wind_speed=20 + i,
            pressure=1010 + i,
            description='Ensolarado' if i < 3 else 'Tempestade'
        )
    
    # Alertas climáticos
    WeatherAlert.objects.create(
        location='Beira',
        alert_type='chuva_forte',
        message='Previsão de chuvas intensas nos próximos 3 dias. Proteja suas culturas.',
        severity='high',
        start_date=base_date.date() + timedelta(days=2),
        end_date=base_date.date() + timedelta(days=4)
    )
    
    # 3. Criar pragas e detecções
    print("🐛 Criando dados de pragas...")
    
    # Pragas comuns
    pest1 = Pest.objects.create(
        name='Lagarta do Cartucho',
        scientific_name='Spodoptera frugiperda',
        description='Praga que ataca principalmente o milho, causando danos significativos às folhas.',
        affected_crops=['milho', 'sorgo'],
        symptoms=['furos_folhas', 'excrementos_pretos', 'plantas_murchas'],
        prevention_methods=['rotacao_culturas', 'plantas_armadilha', 'controle_biologico'],
        treatment_methods=['inseticidas_biologicos', 'controle_integrado']
    )
    
    pest2 = Pest.objects.create(
        name='Mosca Branca',
        scientific_name='Bemisia tabaci',
        description='Pequeno inseto que suga a seiva das plantas e transmite vírus.',
        affected_crops=['tomate', 'feijao', 'algodao'],
        symptoms=['folhas_amareladas', 'crescimento_reduzido', 'melada'],
        prevention_methods=['eliminacao_ervas_daninhas', 'uso_telas'],
        treatment_methods=['inseticidas_sistemicos', 'controle_biologico']
    )
    
    # Detecções de pragas
    PestDetection.objects.create(
        farmer=farmer1,
        pest=pest1,
        location='Maputo',
        confidence_score=0.85,
        coordinates='latitude=-25.9692,longitude=32.5732',
        notes='Encontrada em plantação de milho, área de 2 hectares afetada.'
    )
    
    # Alertas de pragas
    PestAlert.objects.create(
        pest=pest2,
        location='Beira',
        severity='medium',
        message='Detecção de Mosca Branca em culturas de tomate. Monitore suas plantas.',
        affected_crops=['tomate', 'feijao']
    )
    
    # 4. Criar culturas e preços de mercado
    print("💰 Criando dados de mercado...")
    
    # Culturas
    crops = [
        {'name': 'Milho', 'variety': 'Branco', 'season': 'seca'},
        {'name': 'Feijão', 'variety': 'Manteiga', 'season': 'chuvas'},
        {'name': 'Tomate', 'variety': 'Roma', 'season': 'todo_ano'},
        {'name': 'Arroz', 'variety': 'Carolino', 'season': 'chuvas'},
    ]
    
    crop_objects = []
    for crop_data in crops:
        crop = Crop.objects.create(**crop_data)
        crop_objects.append(crop)
    
    # Preços de mercado
    markets = ['Mercado Central Maputo', 'Mercado da Baixa Beira', 'Mercado de Nampula']
    
    for crop in crop_objects:
        for market in markets:
            # Preços dos últimos 7 dias
            for i in range(7):
                date = base_date.date() - timedelta(days=i)
                base_price = Decimal('25.00') if crop.name == 'Milho' else Decimal('45.00')
                price = base_price + Decimal(i * 2)
                
                MarketPrice.objects.create(
                    crop=crop,
                    market_location=market,
                    price_per_kg=price,
                    date=date,
                    currency='MZN'
                )
    
    # Tendências de mercado
    MarketTrend.objects.create(
        crop=crop_objects[0],  # Milho
        trend_type='alta',
        percentage_change=Decimal('15.5'),
        period_days=30,
        description='Aumento de preço devido à época seca e alta demanda.'
    )
    
    # 5. Criar recomendações
    print("💡 Criando recomendações...")
    
    Recommendation.objects.create(
        farmer=farmer1,
        category='irrigacao',
        title='Otimização do Sistema de Irrigação',
        content='Com base nos dados climáticos, recomendamos ajustar a irrigação para 3 vezes por semana.',
        priority='medium',
        is_automated=True
    )
    
    Recommendation.objects.create(
        farmer=farmer2,
        category='plantio',
        title='Época Ideal para Plantio de Arroz',
        content='As chuvas previstas indicam que é o momento ideal para o plantio de arroz.',
        priority='high',
        is_automated=True
    )
    
    # 6. Criar notificações
    print("📱 Criando notificações...")
    
    Notification.objects.create(
        user=farmer1,
        title='Alerta de Praga Detectada',
        message='Lagarta do cartucho detectada na sua região. Verifique suas plantações.',
        notification_type='pest_alert',
        delivery_method='sms',
        is_sent=True
    )
    
    Notification.objects.create(
        user=farmer2,
        title='Previsão de Chuva Forte',
        message='Chuvas intensas previstas para os próximos 3 dias. Proteja suas culturas.',
        notification_type='weather_alert',
        delivery_method='whatsapp',
        is_sent=False
    )
    
    print("✅ Dados de teste criados com sucesso!")
    print(f"👥 {User.objects.count()} usuários criados")
    print(f"🌤️ {WeatherData.objects.count()} registros climáticos")
    print(f"🐛 {Pest.objects.count()} pragas cadastradas")
    print(f"💰 {MarketPrice.objects.count()} preços de mercado")
    print(f"💡 {Recommendation.objects.count()} recomendações")
    print(f"📱 {Notification.objects.count()} notificações")

if __name__ == '__main__':
    create_test_data()
