# Guia de Segurança Firebase AI
# Boas práticas para uso seguro do Firebase em produção

## 🔐 Gerenciamento de Credenciais

### Desenvolvimento Local
1. **Arquivo de Credencial**: 
   - Baixe o arquivo JSON do Firebase Console
   - Salve em `backend/firebase/credentials/lura-ai-firebase-adminsdk.json`
   - NUNCA commite este arquivo

2. **Gitignore**:
   ```gitignore
   # Firebase credentials
   *firebase-adminsdk*.json
   .env.local
   firebase-debug.log
   ```

### Produção
1. **Variáveis de Ambiente** (RECOMENDADO):
   ```env
   FIREBASE_PROJECT_ID=lura-ai
   FIREBASE_PRIVATE_KEY_ID=xxx
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@lura-ai.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=xxx
   ```

2. **Serviços de Secrets**:
   - AWS Secrets Manager
   - Google Secret Manager
   - Azure Key Vault
   - Kubernetes Secrets

## 🛡️ Configurações de Segurança

### Firebase Console
1. **Firestore Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // AI Conversations - apenas proprietário pode acessar
       match /ai_conversations/{conversationId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       // AI Usage Stats - apenas proprietário
       match /ai_usage/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

2. **Authentication Rules**:
   - Ativar apenas provedores necessários
   - Configurar domínios autorizados
   - Implementar rate limiting

### Backend Django
1. **CORS Seguro**:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://lurafarm.com",
       "https://www.lurafarm.com",
   ]
   ```

2. **CSRF Protection**:
   ```python
   CSRF_TRUSTED_ORIGINS = [
       "https://lurafarm.com",
   ]
   ```

3. **Rate Limiting** (recomendado):
   ```python
   # settings.py
   INSTALLED_APPS += ['django_ratelimit']
   
   # views.py
   from django_ratelimit.decorators import ratelimit
   
   @ratelimit(key='user', rate='10/m', method='POST')
   def ai_generate_view(request):
       # Limita a 10 requests por minuto por usuário
   ```

## 🔒 Controle de Acesso

### Níveis de Permissão
```python
# models.py
class AIUsageQuota(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    daily_requests = models.IntegerField(default=100)
    monthly_requests = models.IntegerField(default=1000)
    max_tokens_per_request = models.IntegerField(default=2048)
    
# middleware.py
class AIQuotaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.path.startswith('/api/ai/'):
            # Verificar quota do usuário
            pass
        return self.get_response(request)
```

### Validação de Input
```python
# serializers.py
class TextGenerationSerializer(serializers.Serializer):
    prompt = serializers.CharField(
        max_length=4000,  # Limitar tamanho
        validators=[
            # Validador personalizado para conteúdo
            validate_prompt_content,
        ]
    )
    
def validate_prompt_content(value):
    # Verificar conteúdo perigoso
    dangerous_patterns = ['system:', 'ignore previous', 'admin']
    for pattern in dangerous_patterns:
        if pattern.lower() in value.lower():
            raise serializers.ValidationError("Conteúdo não permitido")
    return value
```

## 📊 Monitoramento e Logs

### Logging Seguro
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'ai_usage.log',
            'formatter': 'detailed',
        },
    },
    'formatters': {
        'detailed': {
            'format': '{levelname} {asctime} {name} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'loggers': {
        'ai': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# views.py
import logging
logger = logging.getLogger('ai')

def log_ai_usage(user, request_type, tokens_used, processing_time):
    logger.info(
        f"AI_USAGE user={user.id} type={request_type} "
        f"tokens={tokens_used} time={processing_time:.2f}s"
    )
```

### Métricas de Uso
```python
# monitoring.py
class AIUsageMonitor:
    @staticmethod
    def track_request(user, endpoint, success, error_type=None):
        # Enviar métricas para sistema de monitoramento
        pass
    
    @staticmethod
    def check_abuse_patterns(user):
        # Detectar padrões de uso suspeito
        pass
```

## 🚨 Resposta a Incidentes

### Procedimentos
1. **Detecção de Abuso**:
   - Monitorar requests anômalos
   - Alertas automáticos
   - Rate limiting temporário

2. **Vazamento de Credenciais**:
   - Revogar imediatamente no Firebase Console
   - Gerar novas credenciais
   - Atualizar variáveis de ambiente
   - Verificar logs de acesso

3. **Checklist de Segurança**:
   ```bash
   # Verificação rápida
   □ Credenciais não estão no código
   □ HTTPS ativo em produção
   □ Rate limiting configurado
   □ Logs não contêm dados sensíveis
   □ Backup das configurações
   ```

## 🔧 Scripts de Segurança

### Verificação de Credenciais
```bash
#!/bin/bash
# check_security.sh

echo "🔍 Verificando segurança Firebase..."

# Verificar se não há credenciais no código
if grep -r "private_key" --include="*.py" --include="*.js" --include="*.ts" .; then
    echo "❌ PERIGO: Credenciais encontradas no código!"
    exit 1
fi

# Verificar .gitignore
if ! grep -q "firebase-adminsdk" .gitignore; then
    echo "⚠️  Adicione *firebase-adminsdk*.json ao .gitignore"
fi

echo "✅ Verificação concluída"
```

### Rotação de Credenciais
```python
# rotate_credentials.py
def rotate_firebase_credentials():
    """Script para rotacionar credenciais Firebase"""
    # 1. Gerar novas credenciais no Firebase Console
    # 2. Atualizar variáveis de ambiente
    # 3. Testar conectividade
    # 4. Revogar credenciais antigas
    pass
```

## 📝 Compliance e Auditoria

### LGPD/GDPR
- Implementar direito ao esquecimento
- Anonimizar dados de conversas antigas
- Obter consentimento para uso de AI
- Documentar uso de dados

### Auditoria
- Logs de todas as interações AI
- Rastreabilidade de decisões
- Backup e recuperação de dados
- Testes de segurança regulares

---

**⚠️ LEMBRETE**: Este guia deve ser revisado regularmente e adaptado conforme mudanças na aplicação e novas ameaças de segurança.