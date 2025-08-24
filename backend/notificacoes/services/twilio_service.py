"""
Serviço de integração com Twilio para WhatsApp e SMS
"""
from twilio.rest import Client
from django.conf import settings
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)

class TwilioService:
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.phone_number = settings.TWILIO_PHONE_NUMBER
        self.whatsapp_number = f"whatsapp:{self.phone_number}"
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            logger.warning("Credenciais do Twilio não configuradas")
    
    def send_sms(self, to_phone: str, message: str) -> Optional[Dict]:
        """
        Enviar SMS para um número de telefone
        """
        if not self.client:
            logger.error("Cliente Twilio não configurado")
            return None
            
        try:
            # Garantir que o número tenha o código do país
            if not to_phone.startswith('+'):
                to_phone = f"+258{to_phone.lstrip('0')}"
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_phone
            )
            
            return {
                'sid': message_obj.sid,
                'status': message_obj.status,
                'to': to_phone,
                'type': 'sms',
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Erro ao enviar SMS para {to_phone}: {e}")
            return {
                'error': str(e),
                'to': to_phone,
                'type': 'sms',
                'success': False
            }
    
    def send_whatsapp(self, to_phone: str, message: str) -> Optional[Dict]:
        """
        Enviar mensagem via WhatsApp
        """
        if not self.client:
            logger.error("Cliente Twilio não configurado")
            return None
            
        try:
            # Garantir que o número tenha o código do país
            if not to_phone.startswith('+'):
                to_phone = f"+258{to_phone.lstrip('0')}"
            
            # Formato WhatsApp do Twilio
            whatsapp_to = f"whatsapp:{to_phone}"
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.whatsapp_number,
                to=whatsapp_to
            )
            
            return {
                'sid': message_obj.sid,
                'status': message_obj.status,
                'to': to_phone,
                'type': 'whatsapp',
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Erro ao enviar WhatsApp para {to_phone}: {e}")
            return {
                'error': str(e),
                'to': to_phone,
                'type': 'whatsapp',
                'success': False
            }
    
    def send_weather_alert(self, user_data: Dict, alert_data: Dict) -> List[Dict]:
        """
        Enviar alerta climático para o usuário
        """
        results = []
        
        # Criar mensagem personalizada
        message = self._create_weather_alert_message(user_data, alert_data)
        
        # Enviar SMS se habilitado
        if user_data.get('receber_sms') and user_data.get('telefone'):
            sms_result = self.send_sms(user_data['telefone'], message)
            if sms_result:
                results.append(sms_result)
        
        # Enviar WhatsApp se habilitado
        if user_data.get('receber_whatsapp') and user_data.get('telefone'):
            whatsapp_result = self.send_whatsapp(user_data['telefone'], message)
            if whatsapp_result:
                results.append(whatsapp_result)
        
        return results
    
    def send_pest_detection_alert(self, user_data: Dict, pest_data: Dict) -> List[Dict]:
        """
        Enviar alerta de detecção de praga
        """
        results = []
        
        message = self._create_pest_alert_message(user_data, pest_data)
        
        # Enviar SMS se habilitado
        if user_data.get('receber_sms') and user_data.get('telefone'):
            sms_result = self.send_sms(user_data['telefone'], message)
            if sms_result:
                results.append(sms_result)
        
        # Enviar WhatsApp se habilitado
        if user_data.get('receber_whatsapp') and user_data.get('telefone'):
            whatsapp_result = self.send_whatsapp(user_data['telefone'], message)
            if whatsapp_result:
                results.append(whatsapp_result)
        
        return results
    
    def send_market_price_update(self, user_data: Dict, market_data: Dict) -> List[Dict]:
        """
        Enviar atualizações de preços de mercado
        """
        results = []
        
        message = self._create_market_alert_message(user_data, market_data)
        
        # Enviar SMS se habilitado
        if user_data.get('receber_sms') and user_data.get('telefone'):
            sms_result = self.send_sms(user_data['telefone'], message)
            if sms_result:
                results.append(sms_result)
        
        # Enviar WhatsApp se habilitado
        if user_data.get('receber_whatsapp') and user_data.get('telefone'):
            whatsapp_result = self.send_whatsapp(user_data['telefone'], message)
            if whatsapp_result:
                results.append(whatsapp_result)
        
        return results
    
    def _create_weather_alert_message(self, user_data: Dict, alert_data: Dict) -> str:
        """
        Criar mensagem personalizada de alerta climático
        """
        icons = {
            'chuva_forte': '🌧️',
            'calor_extremo': '🌡️',
            'vento_forte': '💨',
            'seca': '☀️',
            'favoravel': '🌱'
        }
        
        icon = icons.get(alert_data.get('tipo_alerta'), '⚠️')
        nome = user_data.get('first_name', 'Agricultor')
        
        message = f"""
{icon} AgroAlerta - {alert_data.get('titulo', 'Alerta Climático')}

Olá {nome}!

{alert_data.get('descricao', 'Condições climáticas importantes detectadas.')}

📍 Localização: {user_data.get('localizacao', 'Sua região')}
🕐 Data: {alert_data.get('data_inicio', 'Hoje')}
📊 Nível: {alert_data.get('nivel', 'Médio').upper()}

🌱 Recomendação: Verifique suas culturas e tome as precauções necessárias.

- AgroAlerta Moçambique
        """.strip()
        
        return message
    
    def _create_pest_alert_message(self, user_data: Dict, pest_data: Dict) -> str:
        """
        Criar mensagem de alerta de praga
        """
        nome = user_data.get('first_name', 'Agricultor')
        
        message = f"""
🐛 AgroAlerta - Detecção de Praga

Olá {nome}!

Foi detectada a presença de {pest_data.get('nome', 'praga desconhecida')} na sua região.

📍 Localização: {pest_data.get('localizacao', 'Sua região')}
🎯 Confiança: {pest_data.get('confidence_score', 0) * 100:.0f}%
🌾 Culturas afetadas: {', '.join(pest_data.get('culturas_afetadas', []))}

💡 Ação recomendada: Verifique suas plantações e considere medidas de controle.

- AgroAlerta Moçambique
        """.strip()
        
        return message
    
    def _create_market_alert_message(self, user_data: Dict, market_data: Dict) -> str:
        """
        Criar mensagem de alerta de mercado
        """
        nome = user_data.get('first_name', 'Agricultor')
        
        message = f"""
💰 AgroAlerta - Preços de Mercado

Olá {nome}!

Atualização de preços para {market_data.get('cultura', 'suas culturas')}:

💵 Preço atual: {market_data.get('preco', 0):.2f} MZN/kg
📈 Tendência: {market_data.get('tendencia', 'Estável')}
📍 Mercado: {market_data.get('mercado', 'Vários locais')}

💡 {market_data.get('recomendacao', 'Monitore os preços para melhor decisão de venda.')}

- AgroAlerta Moçambique
        """.strip()
        
        return message

# Instância global do serviço
twilio_service = TwilioService()
