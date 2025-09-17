# Firebase AI Service - Backend
# Serviço para integração com Vertex AI usando Firebase Admin SDK

import os
import json
from typing import Dict, List, Optional, Any
from google.cloud import aiplatform
from google.oauth2 import service_account
from decouple import config
from .config import get_firebase_app, is_firebase_configured


class FirebaseAIService:
    """
    Serviço para interação com Vertex AI através do Firebase
    """
    
    def __init__(self):
        self.project_id = config('FIREBASE_PROJECT_ID', default='lura-ai')
        self.location = config('VERTEX_AI_LOCATION', default='us-central1')
        self.firebase_app = get_firebase_app()
        self.is_configured = is_firebase_configured()
        # Modo de desenvolvimento mock: quando true, respostas serão simuladas
        self.dev_mock = config('FIREBASE_AI_DEV_MOCK', default='false').lower() in ('1', 'true', 'yes')
        if self.dev_mock:
            print("⚠️ FIREBASE_AI_DEV_MOCK habilitado: usando respostas simuladas para AI")
        
        # Se estamos no modo mock, não inicializamos Vertex AI
        if not self.dev_mock and self.is_configured:
            self._initialize_vertex_ai()
    
    def _initialize_vertex_ai(self):
        """Inicializa o cliente Google AI"""
        try:
            import google.generativeai as genai
            
            # Configura o cliente com a API key do .env
            api_key = os.getenv('GOOGLE_AI_API_KEY')
            if not api_key:
                raise ValueError("GOOGLE_AI_API_KEY não encontrada nas variáveis de ambiente")
                
            genai.configure(api_key=api_key)
            print("✅ Google AI inicializado com sucesso")
            
        except ImportError as e:
            print(f"❌ Erro ao importar Google Generative AI: {e}")
            self.is_configured = False
        except Exception as e:
            print(f"❌ Erro ao inicializar Google AI: {e}")
            self.is_configured = False

    def _get_generative_model(self, model_name: str = "gemini-pro"):
        """
        Instancia um modelo generativo usando Google's Generative AI.
        Retorna o modelo ou None em caso de erro.
        """
        try:
            import google.generativeai as genai
            
            # Initialize the model
            model = genai.GenerativeModel(model_name)
            print(f"✅ Modelo {model_name} carregado via Google Generative AI")
            return model, model_name
                
        except Exception as e:
            print(f"❌ Erro ao carregar modelo {model_name}: {str(e)}")
            return None, None
    
    async def generate_text(
        self, 
        prompt: str, 
        model_name: str = "gemini-pro",
        max_output_tokens: int = 1024,
        temperature: float = 0.7,
        top_p: float = 0.8,
        top_k: int = 40
    ) -> Dict[str, Any]:
        """
        Gera texto usando Google's Generative AI
        """
        if self.dev_mock:
            # Retornar resposta simulada para desenvolvimento
            return {
                'success': True,
                'text': f"[DEV MOCK] Resposta simulada para: {prompt[:50]}...",
                'model': 'dev-mock',
                'usage': {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}
            }
            
        model, model_name = self._get_generative_model(model_name)
        if not model:
            return {
                'success': False,
                'error': 'Modelo não disponível'
            }
            
        try:
            # Generate content using the model
            response = model.generate_content(
                prompt,
                generation_config={
                    'max_output_tokens': max_output_tokens,
                    'temperature': temperature,
                    'top_p': top_p,
                    'top_k': top_k
                }
            )
            
            return {
                'success': True,
                'text': response.text,
                'model': model_name,
                'usage': {
                    'prompt_tokens': response.prompt_token_count,
                    'completion_tokens': response.candidates[0].token_count,
                    'total_tokens': response.prompt_token_count + response.candidates[0].token_count
                }
            }
            
        except Exception as e:
            print(f"❌ Erro ao gerar texto: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
        """
        Gera texto usando um modelo generativo
        
        Args:
            prompt: Texto de entrada para o modelo
            model_name: Nome do modelo (ex: 'gemini-pro')
            max_output_tokens: Número máximo de tokens na resposta
            temperature: Controla aleatoriedade (0.0-2.0)
            top_p: Controla diversidade (0.0-1.0)
            top_k: Limita o vocabulário considerado
            
        Returns:
            Dicionário com resposta do modelo
        """
        # Modo de desenvolvimento: retornar resposta simulada rápida
        if self.dev_mock:
            sample = f"[MOCK] Resposta simulada para prompt: {prompt[:200]}"
            return {
                'success': True,
                'content': sample,
                'model': 'mock',
                'usage': {
                    'prompt_tokens': len(prompt.split()),
                    'completion_tokens': len(sample.split()),
                },
                'metadata': {
                    'temperature': temperature,
                    'max_tokens': max_output_tokens
                }
            }

        if not self.is_configured:
            return {
                'success': False,
                'error': 'Firebase AI não está configurado'
            }
        
        try:
            # Obter modelo via Firebase AI Logic
            model, model_name = self._get_generative_model("gemini-pro")
            if model is None:
                raise RuntimeError("Não foi possível inicializar o Firebase AI Logic")

            # Configurar parâmetros para o Gemini via Firebase
            params = {
                "max_output_tokens": max_output_tokens,
                "temperature": temperature,
                "top_p": top_p,
            }

            # Gerar texto usando Firebase AI Logic
            response = model.predict(
                instances=[{"prompt": prompt}],
                parameters=params
            )
            
            # Processar resposta do Firebase AI Logic
            if not response or not response.predictions:
                raise RuntimeError("O modelo não gerou resposta")

            content = response.predictions[0].get('content', '')
            if not content:
                raise RuntimeError("Resposta vazia do modelo")

            return {
                'success': True,
                'content': content,
                'model': 'gemini-pro',
                'usage': {
                    'prompt_tokens': len(prompt.split()),  # Aproximação
                    'completion_tokens': len(content.split()),
                    'total_tokens': len(prompt.split()) + len(content.split())
                },
                'metadata': {
                    'temperature': temperature,
                    'max_tokens': max_output_tokens
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'model': model_name
            }
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model_name: str = "gemini-pro",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Chat com contexto de múltiplas mensagens
        
        Args:
            messages: Lista de mensagens [{"role": "user|assistant", "content": "..."}]
            model_name: Nome do modelo
            **kwargs: Parâmetros adicionais para geração
            
        Returns:
            Dicionário com resposta do chat
        """
        # Modo de desenvolvimento: resposta de chat mock
        if self.dev_mock:
            last = messages[-1]['content'] if messages else ''
            sample = f"[MOCK_CHAT] Echo: {last[:300]}"
            return {
                'success': True,
                'content': sample,
                'model': 'mock',
                'conversation_id': 'mock-conv-1',
                'usage': {
                    'prompt_tokens': sum(len(m.get('content','').split()) for m in messages),
                    'completion_tokens': len(sample.split())
                }
            }

        if not self.is_configured:
            return {
                'success': False,
                'error': 'Firebase AI não está configurado'
            }
        
        try:
            # Tentar instanciar modelo com fallback
            model, resolved_name = self._get_generative_model(model_name)
            if model is None:
                raise RuntimeError(f"Modelo de chat não disponível: tried candidates for '{model_name}'")
            
            # Converter mensagens para formato do Vertex AI
            history = []
            for msg in messages[:-1]:  # Todas exceto a última
                role = "user" if msg["role"] == "user" else "model"
                history.append({
                    "role": role,
                    "parts": [{"text": msg["content"]}]
                })
            
            # Iniciar chat com histórico e tentar envio
            try:
                chat = model.start_chat(history=history)
                last_message = messages[-1]["content"]
                response = chat.send_message(last_message)
            except Exception as e:
                # tentar fallbacks de chat
                last_exc = e
                for fb in ["chat-bison@001", "text-bison@001"]:
                    try:
                        from vertexai.generative_models import GenerativeModel
                        fb_model = GenerativeModel(fb)
                        chat = fb_model.start_chat(history=history)
                        last_message = messages[-1]["content"]
                        response = chat.send_message(last_message)
                        model_name = fb
                        model = fb_model
                        break
                    except Exception as e2:
                        last_exc = e2
                        continue

                else:
                    raise last_exc
            
            return {
                'success': True,
                'content': response.text,
                'model': model_name,
                'conversation_id': id(chat),  # ID único da conversa
                'usage': {
                    'prompt_tokens': sum(len(msg["content"].split()) for msg in messages),
                    'completion_tokens': len(response.text.split()) if response.text else 0,
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'model': model_name
            }
    
    async def agriculture_assistant(
        self,
        query: str,
        context: Optional[Dict[str, str]] = None,
        language: str = "pt"
    ) -> Dict[str, Any]:
        """
        Assistente especializado em agricultura
        
        Args:
            query: Pergunta do usuário
            context: Contexto adicional (localização, cultura, etc.)
            language: Idioma da resposta
            
        Returns:
            Resposta especializada em agricultura
        """
        system_prompt = {
            "pt": """Você é um assistente especializado em agricultura e agronegócio, 
            focado em ajudar agricultores em Moçambique. Forneça conselhos práticos, 
            relevantes e baseados em evidências científicas. Considere o clima tropical, 
            as culturas locais e os desafios específicos da região.""",
            
            "en": """You are an agricultural and agribusiness specialist assistant, 
            focused on helping farmers in Mozambique. Provide practical, relevant advice 
            based on scientific evidence. Consider the tropical climate, local crops, 
            and specific challenges of the region."""
        }
        
        prompt = system_prompt.get(language, system_prompt["pt"])
        
        if context:
            prompt += "\n\nContexto:\n"
            for key, value in context.items():
                prompt += f"- {key}: {value}\n"
        
        prompt += f"\n\nPergunta: {query}"
        
        return await self.generate_text(
            prompt,
            temperature=0.7,
            max_output_tokens=1024
        )
    
    async def pest_disease_analysis(
        self,
        description: str,
        crop_type: Optional[str] = None,
        symptoms: Optional[List[str]] = None,
        language: str = "pt"
    ) -> Dict[str, Any]:
        """
        Análise de pragas e doenças
        """
        base_prompts = {
            "pt": "Como especialista em fitopatologia e entomologia, analise:",
            "en": "As a plant pathology and entomology expert, analyze:"
        }
        
        prompt = base_prompts.get(language, base_prompts["pt"])
        prompt += f"\n\nDescrição: {description}"
        
        if crop_type:
            prompt += f"\nCultura: {crop_type}"
        
        if symptoms:
            prompt += f"\nSintomas: {', '.join(symptoms)}"
        
        questions = {
            "pt": [
                "1. Possíveis pragas ou doenças",
                "2. Métodos de diagnóstico",
                "3. Tratamentos recomendados",
                "4. Medidas preventivas",
                "5. Quando buscar ajuda profissional"
            ],
            "en": [
                "1. Possible pests or diseases", 
                "2. Diagnostic methods",
                "3. Recommended treatments",
                "4. Prevention measures",
                "5. When to seek professional help"
            ]
        }
        
        prompt += "\n\nForneça:\n" + "\n".join(questions.get(language, questions["pt"]))
        
        return await self.generate_text(
            prompt,
            temperature=0.5,  # Menos aleatoriedade para análises técnicas
            max_output_tokens=1536
        )
    
    def get_service_status(self) -> Dict[str, Any]:
        """
        Retorna status do serviço Firebase AI
        """
        return {
            'firebase_configured': self.is_configured,
            'project_id': self.project_id,
            'location': self.location,
            'available_models': [
                'gemini-pro',
                'gemini-pro-vision'
            ] if self.is_configured else []
        }