# Alternativas de Deploy (Sem Docker)

## 🚀 **Opção 1: Deploy Tradicional (Mais Simples)**

### **Frontend (Next.js) - Vercel/Netlify**
```bash
# 1. Deploy automático no Vercel (GRÁTIS)
# - Conectar GitHub ao Vercel
# - Push para main = deploy automático
# - SSL automático, CDN global

# 2. Ou build manual
npm run build
npm start  # Produção
```

### **Backend (Django) - DigitalOcean App Platform**
```bash
# 1. Usar App Platform da DigitalOcean
# - Interface visual
# - Deploy automático via GitHub
# - Banco PostgreSQL incluído
# - SSL automático

# 2. Ou droplet tradicional
sudo apt update
sudo apt install python3-pip nginx postgresql
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
gunicorn agroalerta.wsgi:application
```

## 🎯 **Opção 2: Platform as a Service (PaaS)**

### **Heroku (Mais Fácil)**
```bash
# Frontend + Backend juntos
echo "web: npm start" > Procfile
echo "release: python manage.py migrate" >> Procfile
git push heroku main
```

### **Railway (Moderno)**
```bash
# Connect GitHub, deploy automático
# Suporte Docker + tradicional
# Preços competitivos
```

### **DigitalOcean App Platform**
```yaml
# app.yaml
name: agroalerta
services:
- name: backend
  source_dir: /backend
  github:
    repo: jsabonet/Lura
    branch: main
  run_command: gunicorn agroalerta.wsgi:application
  
- name: frontend  
  source_dir: /frontend
  github:
    repo: jsabonet/Lura
    branch: main
  run_command: npm start
```

## 🔧 **Opção 3: VPS Manual (Mais Controle)**

### **Script de Setup Automático**
```bash
#!/bin/bash
# setup_server.sh

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y python3-pip python3-venv nodejs npm nginx postgresql postgresql-contrib

# Configurar banco
sudo -u postgres createuser agroalerta
sudo -u postgres createdb agroalerta
sudo -u postgres psql -c "ALTER USER agroalerta WITH PASSWORD 'senha123';"

# Configurar backend
cd /var/www/agroalerta/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Configurar frontend
cd /var/www/agroalerta/frontend
npm install
npm run build

# Configurar Nginx
sudo cp nginx_config /etc/nginx/sites-available/agroalerta
sudo ln -s /etc/nginx/sites-available/agroalerta /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Configurar serviços systemd
sudo cp backend.service /etc/systemd/system/
sudo systemctl enable backend
sudo systemctl start backend
```

## 📊 **Comparação Rápida**

| Método | Facilidade | Custo | Controle | Escalabilidade |
|--------|------------|-------|----------|----------------|
| **Docker** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Vercel + App Platform** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Heroku** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **VPS Manual** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🎯 **Recomendação por Fase**

### **Desenvolvimento/MVP (Agora)**
```bash
# Frontend: Vercel (grátis, fácil)
# Backend: DigitalOcean App Platform ($12/mês)
# Total: ~$12/mês + facilidade máxima
```

### **Crescimento (Futuro)**
```bash
# Docker na DigitalOcean
# Mais controle, mesmos custos
# Facilidade de escalar
```

### **Escala (Longo prazo)**
```bash
# Kubernetes + múltiplos servidores
# Load balancers, auto-scaling
# Infraestrutura profissional
```
