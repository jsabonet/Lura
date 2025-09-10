# Preparação Backend para IA

## 🧠 **Configurações Django para IA/ML**

### **1. requirements_ai.txt**
```python
# IA/ML Dependencies (instalar quando necessário)
torch==2.0.1
torchvision==0.15.2
tensorflow==2.13.0
transformers==4.33.2
huggingface-hub==0.16.4
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
opencv-python==4.8.0.76
Pillow==10.0.0
celery==5.3.1
redis==4.6.0

# Agricultura específico
opencv-contrib-python==4.8.0.76  # Processamento de imagem
rasterio==1.3.8  # Dados geoespaciais
geopandas==0.13.2  # Análise geográfica
satellite-image==0.1.0  # Imagens de satélite
```

### **2. Estrutura para IA**
```
backend/
├── ai/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── crop_detection.py
│   │   ├── disease_detection.py
│   │   ├── weather_prediction.py
│   │   └── yield_prediction.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── image_processing.py
│   │   ├── data_preprocessing.py
│   │   └── model_loader.py
│   ├── tasks.py  # Celery tasks
│   └── views.py  # API endpoints
├── models/  # Modelos treinados (volume Docker)
│   ├── crop_detection/
│   ├── disease_detection/
│   └── weather_prediction/
└── media/uploads/  # Imagens enviadas pelos usuários
```

### **3. Celery Configuration**
```python
# backend/agroalerta/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')

app = Celery('agroalerta')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configurações para IA
app.conf.update(
    task_routes={
        'ai.tasks.process_image': {'queue': 'ai_processing'},
        'ai.tasks.predict_weather': {'queue': 'ai_processing'},
        'ai.tasks.analyze_crop': {'queue': 'ai_processing'},
    },
    worker_prefetch_multiplier=1,  # Para tarefas pesadas de IA
    task_time_limit=600,  # 10 minutos timeout
    task_soft_time_limit=480,  # 8 minutos warning
)

app.autodiscover_tasks()
```

### **4. AI Tasks (Celery)**
```python
# backend/ai/tasks.py
from celery import shared_task
import torch
from PIL import Image
import io
import base64

@shared_task(bind=True)
def process_crop_image(self, image_data, user_id):
    """Processar imagem para detecção de doenças/pragas"""
    try:
        # Decodificar imagem
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Carregar modelo (cache em memória)
        model = load_disease_detection_model()
        
        # Processar
        result = model.predict(image)
        
        # Salvar resultado no banco
        from ai.models import ImageAnalysis
        analysis = ImageAnalysis.objects.create(
            user_id=user_id,
            image_data=image_data,
            result=result,
            confidence=result.get('confidence', 0),
            disease_detected=result.get('disease'),
            treatment_recommendation=result.get('treatment')
        )
        
        return {
            'analysis_id': analysis.id,
            'result': result,
            'status': 'completed'
        }
        
    except Exception as exc:
        self.retry(countdown=60, max_retries=3)
        return {'status': 'error', 'error': str(exc)}

@shared_task
def predict_weather_patterns(location_data):
    """Previsão de padrões climáticos com IA"""
    # Implementar modelo de previsão meteorológica
    pass

@shared_task  
def analyze_crop_yield(field_data, satellite_images):
    """Análise de produtividade com dados de satélite"""
    # Implementar análise de produtividade
    pass
```

## 📊 **Monitoramento e Observabilidade**

### **5. Health Checks**
```python
# backend/agroalerta/health.py
from django.http import JsonResponse
from django.db import connection
import redis
import torch

def health_check(request):
    """Health check completo para load balancer"""
    health_status = {
        'status': 'healthy',
        'database': 'healthy',
        'redis': 'healthy',
        'ai_models': 'healthy',
        'timestamp': timezone.now().isoformat()
    }
    
    try:
        # Test database
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            
        # Test Redis
        r = redis.Redis.from_url(settings.REDIS_URL)
        r.ping()
        
        # Test AI availability (quando implementado)
        if torch.cuda.is_available():
            health_status['gpu'] = 'available'
        else:
            health_status['gpu'] = 'cpu_only'
            
    except Exception as e:
        health_status['status'] = 'unhealthy'
        health_status['error'] = str(e)
        return JsonResponse(health_status, status=503)
    
    return JsonResponse(health_status)
```

### **6. Logging para IA**
```python
# backend/agroalerta/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'ai_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/agroalerta/ai.log',
            'maxBytes': 1024*1024*50,  # 50MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'ai': {
            'handlers': ['ai_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

## 🚀 **Script de Deploy Completo**

### **deploy_do.sh**
```bash
#!/bin/bash
# Script completo de deploy na DigitalOcean

# Configurações
SERVER_IP="your_server_ip"
SERVER_USER="deploy"
PROJECT_DIR="/var/www/agroalerta"
BACKUP_DIR="/backups"

echo "🚀 Iniciando deploy do AgroAlerta..."

# 1. Conectar e atualizar código
ssh $SERVER_USER@$SERVER_IP << EOF
    cd $PROJECT_DIR
    
    # Backup database antes do deploy
    echo "📦 Fazendo backup do banco..."
    docker-compose exec -T db pg_dump -U postgres agroalerta > $BACKUP_DIR/backup_\$(date +%Y%m%d_%H%M%S).sql
    
    # Atualizar código
    echo "📥 Atualizando código..."
    git pull origin main
    
    # Rebuild containers
    echo "🐳 Rebuilding containers..."
    docker-compose down
    docker-compose build --no-cache
    
    # Iniciar serviços
    echo "▶️ Iniciando serviços..."
    docker-compose up -d
    
    # Aguardar serviços subirem
    sleep 30
    
    # Executar migrações
    echo "🔄 Executando migrações..."
    docker-compose exec -T backend python manage.py migrate
    
    # Coletar arquivos estáticos
    echo "📁 Coletando arquivos estáticos..."
    docker-compose exec -T backend python manage.py collectstatic --noinput
    
    # Verificar health
    echo "🏥 Verificando saúde dos serviços..."
    docker-compose exec -T backend python manage.py check --deploy
    
    echo "✅ Deploy concluído!"
EOF

# 2. Verificar se aplicação está respondendo
echo "🔍 Verificando aplicação..."
sleep 10
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://seudominio.com/health)

if [ $HTTP_STATUS -eq 200 ]; then
    echo "✅ Aplicação está funcionando! Status: $HTTP_STATUS"
else
    echo "❌ Aplicação com problemas! Status: $HTTP_STATUS"
    exit 1
fi

echo "🎉 Deploy concluído com sucesso!"
```

## 💰 **Estimativa de Custos (Crescimento)**

| Fase | Droplet | Volume | Backup | Total/mês |
|------|---------|--------|--------|-----------|
| **MVP** | $24 (4GB) | $10 (100GB) | $5 | **$39** |
| **Crescimento** | $48 (8GB) | $20 (200GB) | $10 | **$78** |
| **IA Ativa** | $96 (16GB) | $30 (300GB) | $15 | **$141** |
| **Escala** | $192 (32GB) | $50 (500GB) | $25 | **$267** |

**Próximo passo**: Quer que eu ajude com o setup inicial no DigitalOcean? 🚀
