# 📦 Dependências Otimizadas - AgroAlerta

## 🎯 **Versões Disponíveis**

### **Versão Mínima (Recomendada para início)**
- **docker-compose-minimal.yml**: 4 containers (frontend, backend, db, nginx)
- **requirements.txt**: Apenas 8 dependências essenciais
- **Tamanho**: ~300MB total
- **Build**: ~2-3 minutos
- **RAM**: ~1GB

### **Versão Completa (Para futuro com IA)**
- **docker-compose.yml**: 7 containers (+ redis, celery, portainer)
- **requirements_full.txt**: 131 dependências (TensorFlow, PyTorch, etc.)
- **Tamanho**: ~2GB total
- **Build**: ~15-20 minutos
- **RAM**: ~4GB

## 📋 **Dependências Removidas (Temporariamente)**

### **Bibliotecas IA/ML (não usadas ainda)**
- tensorflow==2.15.0
- torch==2.1.1
- numpy==1.26.4
- scikit-learn
- transformers
- huggingface-hub

### **Ferramentas Desenvolvimento**
- django-debug-toolbar
- django-extensions
- flake8, black (formatação)
- pytest (testes)

### **Infraestrutura Avançada**
- celery (processamento assíncrono)
- redis (cache)
- channels (WebSockets)

### **APIs não essenciais**
- beautifulsoup4
- httpx
- google-auth

## 🚀 **Como Usar**

### **Deploy Mínimo (Recomendado)**
```bash
# Usar versão otimizada
./fix_deploy.sh

# OU manualmente
docker-compose -f docker-compose-minimal.yml up -d
```

### **Deploy Completo (Quando precisar de IA)**
```bash
# Restaurar dependências completas
cp backend/requirements_full.txt backend/requirements.txt

# Usar versão completa
docker-compose up -d
```

## 💾 **Benefícios da Versão Mínima**

1. **Build 85% mais rápido**: 3min vs 20min
2. **75% menos espaço**: 300MB vs 2GB  
3. **50% menos RAM**: 1GB vs 4GB
4. **Deploy mais confiável**: Menos dependências = menos problemas
5. **Inicialização mais rápida**: Containers leves

## 🔄 **Migração para Versão Completa**

### **Quando adicionar IA:**
```bash
# 1. Restaurar dependências
cp backend/requirements_full.txt backend/requirements.txt

# 2. Atualizar compose
mv docker-compose.yml docker-compose-full.yml
mv docker-compose-minimal.yml docker-compose.yml

# 3. Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## 📊 **Comparação Detalhada**

| Aspecto | Mínima | Completa |
|---------|--------|----------|
| **Containers** | 4 | 7 |
| **Dependências Python** | 8 | 131 |
| **Build Time** | 3 min | 20 min |
| **Tamanho Total** | 300 MB | 2 GB |
| **RAM Necessária** | 1 GB | 4 GB |
| **Funcionalidades** | CRUD + APIs | + IA/ML |

## ✅ **Funcionalidades Mantidas na Versão Mínima**

- ✅ Frontend Next.js completo
- ✅ Backend Django + API REST
- ✅ Autenticação JWT
- ✅ CRUD completo (usuários, clima, pragas, etc.)
- ✅ APIs externas (OpenWeather, Google Maps)
- ✅ Upload de imagens
- ✅ PostgreSQL
- ✅ Nginx + SSL

## 🚫 **Funcionalidades Removidas (Temporariamente)**

- ❌ Processamento IA de imagens
- ❌ Cache Redis
- ❌ Processamento assíncrono
- ❌ WebSockets em tempo real
- ❌ Ferramentas de debug avançadas

**💡 Estas funcionalidades podem ser restauradas a qualquer momento!**
