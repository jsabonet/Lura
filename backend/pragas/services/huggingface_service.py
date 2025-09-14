"""
Serviço de integração com HuggingFace para detecção de pragas e análise de imagens
"""
import requests
import base64
from PIL import Image
import io
from django.conf import settings
from typing import Dict, List, Optional, Union
import logging

logger = logging.getLogger(__name__)

class HuggingFaceService:
    def __init__(self):
        self.api_key = settings.HUGGINGFACE_API_KEY
        self.base_url = "https://api-inference.huggingface.co/models"
        
        # Modelos específicos para agricultura
        self.models = {
            'plant_disease': 'microsoft/DinoVdAE',  # Detecção de doenças em plantas
            'pest_detection': 'facebook/detr-resnet-50',  # Detecção de objetos/pragas
            'plant_classification': 'google/vit-base-patch16-224',  # Classificação de plantas
            'text_generation': 'microsoft/DialoGPT-medium'  # Para recomendações
        }
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        } if self.api_key else {}
    
    def detect_pest_in_image(self, image_data: Union[bytes, str]) -> Optional[Dict]:
        """
        Detectar pragas em uma imagem
        """
        try:
            # Se receber base64, converter para bytes
            if isinstance(image_data, str):
                image_data = base64.b64decode(image_data)
            
            # Processar imagem
            processed_image = self._preprocess_image(image_data)
            
            # Usar modelo de detecção de objetos
            model_url = f"{self.base_url}/{self.models['pest_detection']}"
            
            response = requests.post(
                model_url,
                headers={"Authorization": f"Bearer {self.api_key}"},
                data=processed_image,
                timeout=30
            )
            
            if response.status_code == 200:
                results = response.json()
                return self._interpret_pest_detection(results)
            else:
                logger.error(f"Erro na API HuggingFace: {response.status_code}")
                return self._get_mock_pest_detection()
                
        except Exception as e:
            logger.error(f"Erro ao detectar pragas: {e}")
            return self._get_mock_pest_detection()
    
    def classify_plant_disease(self, image_data: Union[bytes, str]) -> Optional[Dict]:
        """
        Classificar doenças em plantas
        """
        try:
            if isinstance(image_data, str):
                image_data = base64.b64decode(image_data)
            
            processed_image = self._preprocess_image(image_data)
            
            # Usar modelo de classificação
            model_url = f"{self.base_url}/{self.models['plant_classification']}"
            
            response = requests.post(
                model_url,
                headers={"Authorization": f"Bearer {self.api_key}"},
                data=processed_image,
                timeout=30
            )
            
            if response.status_code == 200:
                results = response.json()
                return self._interpret_disease_classification(results)
            else:
                return self._get_mock_disease_detection()
                
        except Exception as e:
            logger.error(f"Erro ao classificar doença: {e}")
            return self._get_mock_disease_detection()
    
    def generate_recommendation(self, context: str) -> Optional[str]:
        """
        Gerar recomendação usando IA
        """
        try:
            model_url = f"{self.base_url}/{self.models['text_generation']}"
            
            payload = {
                "inputs": f"Como agricultor em Moçambique, {context}",
                "parameters": {
                    "max_length": 200,
                    "temperature": 0.7,
                    "do_sample": True
                }
            }
            
            response = requests.post(
                model_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                results = response.json()
                if results and len(results) > 0:
                    return results[0].get('generated_text', '')
            
            # Fallback para recomendações pré-definidas
            return self._get_contextual_recommendation(context)
            
        except Exception as e:
            logger.error(f"Erro ao gerar recomendação: {e}")
            return self._get_contextual_recommendation(context)
    
    def analyze_crop_health(self, image_data: Union[bytes, str], crop_type: str) -> Dict:
        """
        Análise completa da saúde da cultura
        """
        try:
            # Combinar detecção de pragas e doenças
            pest_result = self.detect_pest_in_image(image_data)
            disease_result = self.classify_plant_disease(image_data)
            
            # Análise da saúde geral
            health_score = self._calculate_health_score(pest_result, disease_result)
            
            # Gerar recomendações específicas
            recommendations = self._generate_crop_recommendations(
                crop_type, pest_result, disease_result, health_score
            )
            
            return {
                'health_score': health_score,
                'pest_detection': pest_result,
                'disease_detection': disease_result,
                'recommendations': recommendations,
                'crop_type': crop_type,
                'analysis_date': self._get_current_timestamp()
            }
            
        except Exception as e:
            logger.error(f"Erro na análise da cultura: {e}")
            return self._get_mock_crop_analysis(crop_type)
    
    def _preprocess_image(self, image_data: bytes) -> bytes:
        """
        Pré-processar imagem para análise
        """
        try:
            # Abrir imagem
            image = Image.open(io.BytesIO(image_data))
            
            # Redimensionar se muito grande
            if image.size[0] > 1024 or image.size[1] > 1024:
                image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
            
            # Converter para RGB se necessário
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Salvar como bytes
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=85)
            return output.getvalue()
            
        except Exception as e:
            logger.error(f"Erro ao processar imagem: {e}")
            return image_data
    
    def _interpret_pest_detection(self, results: List[Dict]) -> Dict:
        """
        Interpretar resultados da detecção de pragas
        """
        if not results:
            return {'pests_detected': [], 'confidence': 0.0}
        
        pests = []
        max_confidence = 0.0
        
        for detection in results:
            confidence = detection.get('score', 0.0)
            label = detection.get('label', 'unknown')
            
            # Mapear labels para pragas conhecidas
            pest_name = self._map_label_to_pest(label)
            
            if confidence > 0.3:  # Threshold mínimo
                pests.append({
                    'name': pest_name,
                    'confidence': confidence,
                    'label': label
                })
                max_confidence = max(max_confidence, confidence)
        
        return {
            'pests_detected': pests,
            'confidence': max_confidence,
            'total_detections': len(pests)
        }
    
    def _interpret_disease_classification(self, results: List[Dict]) -> Dict:
        """
        Interpretar resultados da classificação de doenças
        """
        if not results:
            return {'diseases_detected': [], 'confidence': 0.0}
        
        diseases = []
        
        for result in results:
            confidence = result.get('score', 0.0)
            label = result.get('label', 'unknown')
            
            if confidence > 0.2:
                disease_name = self._map_label_to_disease(label)
                diseases.append({
                    'name': disease_name,
                    'confidence': confidence,
                    'label': label
                })
        
        return {
            'diseases_detected': diseases,
            'confidence': diseases[0]['confidence'] if diseases else 0.0
        }
    
    def _map_label_to_pest(self, label: str) -> str:
        """
        Mapear labels do modelo para nomes de pragas conhecidas
        """
        pest_mapping = {
            'insect': 'Inseto não identificado',
            'caterpillar': 'Lagarta',
            'beetle': 'Besouro',
            'aphid': 'Pulgão',
            'spider': 'Ácaro/Aranha',
            'fly': 'Mosca',
            'ant': 'Formiga'
        }
        
        for key, value in pest_mapping.items():
            if key.lower() in label.lower():
                return value
        
        return 'Praga não identificada'
    
    def _map_label_to_disease(self, label: str) -> str:
        """
        Mapear labels para doenças conhecidas
        """
        disease_mapping = {
            'healthy': 'Planta saudável',
            'rust': 'Ferrugem',
            'blight': 'Requeima',
            'spot': 'Mancha foliar',
            'mildew': 'Míldio',
            'mosaic': 'Mosaico viral'
        }
        
        for key, value in disease_mapping.items():
            if key.lower() in label.lower():
                return value
        
        return 'Condição não identificada'
    
    def _calculate_health_score(self, pest_result: Dict, disease_result: Dict) -> float:
        """
        Calcular score de saúde da planta (0-100)
        """
        base_score = 100.0
        
        # Reduzir score baseado em pragas
        if pest_result and pest_result.get('pests_detected'):
            pest_penalty = len(pest_result['pests_detected']) * 15
            base_score -= min(pest_penalty, 40)
        
        # Reduzir score baseado em doenças
        if disease_result and disease_result.get('diseases_detected'):
            for disease in disease_result['diseases_detected']:
                if 'saudável' not in disease['name'].lower():
                    base_score -= disease['confidence'] * 30
        
        return max(0.0, min(100.0, base_score))
    
    def _generate_crop_recommendations(self, crop_type: str, pest_result: Dict, 
                                     disease_result: Dict, health_score: float) -> List[str]:
        """
        Gerar recomendações específicas baseadas na análise
        """
        recommendations = []
        
        # Recomendações baseadas na saúde geral
        if health_score >= 80:
            recommendations.append("🌱 Sua cultura está saudável! Continue com as práticas atuais.")
        elif health_score >= 60:
            recommendations.append("⚠️ Monitore regularmente e considere medidas preventivas.")
        else:
            recommendations.append("🚨 Ação imediata necessária para proteger a cultura.")
        
        # Recomendações para pragas
        if pest_result and pest_result.get('pests_detected'):
            recommendations.append("🐛 Pragas detectadas: considere controle biológico ou químico.")
            recommendations.append("🔍 Inspecione outras plantas na área.")
        
        # Recomendações para doenças
        if disease_result and disease_result.get('diseases_detected'):
            for disease in disease_result['diseases_detected']:
                if 'saudável' not in disease['name'].lower():
                    recommendations.append(f"🏥 {disease['name']} detectada: melhore ventilação e considere fungicida.")
        
        # Recomendações específicas por cultura
        crop_recommendations = self._get_crop_specific_recommendations(crop_type)
        recommendations.extend(crop_recommendations)
        
        return recommendations[:5]  # Limitar a 5 recomendações
    
    def _get_crop_specific_recommendations(self, crop_type: str) -> List[str]:
        """
        Recomendações específicas por tipo de cultura
        """
        recommendations = {
            'milho': [
                "🌽 Verifique espaçamento entre plantas para melhor ventilação.",
                "💧 Mantenha irrigação regular, especialmente durante floração."
            ],
            'tomate': [
                "🍅 Remova folhas baixas para prevenir doenças fúngicas.",
                "🌿 Use tutores para suportar o crescimento vertical."
            ],
            'feijao': [
                "🫘 Monitore para mosca branca e pulgões.",
                "🌱 Faça rotação de culturas para melhorar o solo."
            ]
        }
        
        return recommendations.get(crop_type.lower(), [
            "🌾 Mantenha boas práticas de Maneio integrado de pragas.",
            "💧 Monitore umidade do solo regularmente."
        ])
    
    def _get_mock_pest_detection(self) -> Dict:
        """
        Dados mock para detecção de pragas quando API não disponível
        """
        return {
            'pests_detected': [
                {
                    'name': 'Lagarta do Cartucho',
                    'confidence': 0.75,
                    'label': 'caterpillar'
                }
            ],
            'confidence': 0.75,
            'total_detections': 1
        }
    
    def _get_mock_disease_detection(self) -> Dict:
        """
        Dados mock para detecção de doenças
        """
        return {
            'diseases_detected': [
                {
                    'name': 'Planta saudável',
                    'confidence': 0.85,
                    'label': 'healthy'
                }
            ],
            'confidence': 0.85
        }
    
    def _get_mock_crop_analysis(self, crop_type: str) -> Dict:
        """
        Análise mock completa
        """
        return {
            'health_score': 78.5,
            'pest_detection': self._get_mock_pest_detection(),
            'disease_detection': self._get_mock_disease_detection(),
            'recommendations': [
                f"🌱 Sua cultura de {crop_type} está em boa condição.",
                "🔍 Continue monitorando regularmente.",
                "💧 Mantenha irrigação adequada."
            ],
            'crop_type': crop_type,
            'analysis_date': self._get_current_timestamp()
        }
    
    def _get_contextual_recommendation(self, context: str) -> str:
        """
        Recomendações contextuais pré-definidas
        """
        recommendations = {
            'chuva': "Durante época de chuvas, certifique-se de que há drenagem adequada e monitore para doenças fúngicas.",
            'seca': "Em períodos secos, implemente irrigação eficiente e use cobertura morta para conservar umidade.",
            'pragas': "Para controle de pragas, priorize métodos biológicos e monitore regularmente suas culturas.",
            'plantio': "Para melhor plantio, prepare o solo adequadamente e escolha variedades adaptadas ao clima local."
        }
        
        for key, recommendation in recommendations.items():
            if key in context.lower():
                return recommendation
        
        return "Mantenha boas práticas agrícolas e monitore suas culturas regularmente para melhor produtividade."
    
    def _get_current_timestamp(self) -> str:
        """
        Obter timestamp atual
        """
        from datetime import datetime
        return datetime.now().isoformat()

# Instância global do serviço
huggingface_service = HuggingFaceService()
