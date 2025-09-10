# Script de Deploy para DigitalOcean

## 🚀 **Configuração Inicial no Servidor**

### 1. **Conectar ao Droplet**
```bash
ssh root@your-server-ip
```

### 2. **Instalar Docker e Docker Compose**
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### 3. **Configurar Projeto**
```bash
# Criar diretório
mkdir -p /var/www/agroalerta
cd /var/www/agroalerta

# Clonar repositório
git clone https://github.com/jsabonet/Lura.git .

# Configurar variáveis de ambiente
cp .env.example .env
nano .env  # Editar com suas configurações
```

### 4. **Deploy Inicial**
```bash
# Build e iniciar containers
docker-compose build
docker-compose up -d

# Executar migrações
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic --noinput

# Criar superusuário (opcional)
docker-compose exec backend python manage.py createsuperuser
```

### 5. **Configurar SSL (Certbot)**
```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obter certificado
certbot --nginx -d your-domain.com

# Renovação automática
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

## 🔄 **Comandos de Manutenção**

### **Atualizar Aplicação**
```bash
cd /var/www/agroalerta
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### **Ver Logs**
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Backup Database**
```bash
docker-compose exec db pg_dump -U postgres agroalerta > backup_$(date +%Y%m%d).sql
```

### **Restaurar Database**
```bash
docker-compose exec -T db psql -U postgres agroalerta < backup_file.sql
```

## 📊 **Monitoramento**

### **Status dos Containers**
```bash
docker-compose ps
```

### **Uso de Recursos**
```bash
docker stats
```

### **Reiniciar Serviços**
```bash
# Reiniciar tudo
docker-compose restart

# Reiniciar serviço específico
docker-compose restart backend
```
