# Deploy Mais Simples - Sem Docker

## 🎯 **Opção Recomendada: Vercel + DigitalOcean App Platform**

### **1. Frontend no Vercel (GRÁTIS + Automático)**

```bash
# 1. Ir para vercel.com
# 2. Conectar GitHub
# 3. Importar repositório Lura
# 4. Configurar:
#    - Framework: Next.js
#    - Root Directory: frontend
#    - Build Command: npm run build
#    - Output Directory: .next
```

**Vantagens:**
- ✅ Deploy automático (push = deploy)
- ✅ SSL grátis
- ✅ CDN global
- ✅ Domínio grátis (.vercel.app)
- ✅ Zero configuração

### **2. Backend no DigitalOcean App Platform**

```yaml
# Criar app.yaml no root do projeto
name: agroalerta-backend
services:
  - name: api
    source_dir: /backend
    github:
      repo: jsabonet/Lura
      branch: main
      deploy_on_push: true
    
    run_command: |
      python manage.py migrate
      python manage.py collectstatic --noinput
      gunicorn agroalerta.wsgi:application --bind 0.0.0.0:8080
    
    environment_slug: python
    instance_count: 1
    instance_size_slug: basic-xxs
    
    envs:
    - key: DEBUG
      value: "False"
    - key: ALLOWED_HOSTS
      value: ".ondigitalocean.app,localhost"
    - key: DATABASE_URL
      value: ${db.DATABASE_URL}

databases:
  - name: db
    engine: PG
    version: "15"
    size: basic-xs
```

### **3. Configuração Passo a Passo**

#### **Frontend (Vercel)**
1. Acesse [vercel.com](https://vercel.com)
2. "Import Git Repository"
3. Selecione seu repo `Lura`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
5. Click "Deploy"

**Variáveis de Ambiente (Vercel):**
```
NEXT_PUBLIC_API_URL=https://sua-app-digitalocean.ondigitalocean.app
```

#### **Backend (DigitalOcean App Platform)**
1. Acesse [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. "Create App"
3. Conecte GitHub → selecione repo `Lura`
4. Configure service:
   - **Source Directory**: `backend`
   - **Run Command**: Ver app.yaml acima
5. Adicione banco PostgreSQL
6. Deploy!

### **4. Custo Total**
- **Frontend (Vercel)**: $0/mês
- **Backend (DO App Platform)**: ~$12/mês
- **Banco PostgreSQL**: ~$7/mês
- **Total**: ~$19/mês

### **5. Variáveis de Ambiente Backend**

```bash
# No painel DigitalOcean App Platform
DEBUG=False
SECRET_KEY=sua-chave-super-secreta
ALLOWED_HOSTS=.ondigitalocean.app,.vercel.app
DATABASE_URL=postgresql://... # Auto-configurado
OPENWEATHER_API_KEY=sua-chave
CORS_ALLOWED_ORIGINS=https://sua-app.vercel.app
```

## 🚀 **Deploy em 10 Minutos**

### **Passo 1: Preparar Código**
```bash
# Verificar se build funciona
cd frontend
npm run build  # ✅ Deve funcionar

cd ../backend  
python manage.py check  # ✅ Deve funcionar
```

### **Passo 2: Deploy Frontend**
```bash
# 1. Push código para GitHub
git add .
git commit -m "deploy: preparando para produção"
git push origin main

# 2. Ir para Vercel → Import → Deploy (2 minutos)
```

### **Passo 3: Deploy Backend**
```bash
# 1. Criar app.yaml (já criado)
# 2. DigitalOcean → Create App → Configure (5 minutos)
# 3. Aguardar deploy (3 minutos)
```

### **Passo 4: Conectar Frontend ↔ Backend**
```bash
# No Vercel, adicionar variável:
NEXT_PUBLIC_API_URL=https://sua-app-do.ondigitalocean.app
```

## 🎁 **Vantagens desta Abordagem**

1. **Mais Simples**: Sem Docker, containers, configurações complexas
2. **Deploy Automático**: Push = deploy em ambos ambientes  
3. **Separação Clara**: Frontend e backend independentes
4. **Escalabilidade**: Cada parte escala independente
5. **Custo-Benefício**: ~$19/mês vs ~$24/mês com Docker
6. **Manutenção Zero**: Plataformas gerenciam infraestrutura

## 🤔 **Quando Usar Docker?**

- **Microserviços complexos** (múltiplos backends)
- **Controle total** da infraestrutura
- **Ambiente híbrido** (local + cloud)
- **Compliance rigoroso**
- **Equipe DevOps experiente**

**Para seu caso (desenvolvimento ativo + deploy simples), Vercel + DO App Platform é mais eficiente!**
