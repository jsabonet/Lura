# 🚀 Deploy AgroAlerta na DigitalOcean - Guia Completo

## 🎯 **Configuração Otimizada para IA/ML**

### **Droplet Recomendado**
```
Inicial (MVP): 
- 4GB RAM / 2 vCPUs / 80GB SSD
- Ubuntu 22.04 LTS
- $24/mês

Futuro (com IA):
- 16GB RAM / 8 vCPUs / 200GB SSD  
- Block Storage adicional: 100GB para modelos
- $96/mês + $10/mês storage
```

## 📋 **Passo a Passo Completo**

### **1. Criar Droplet na DigitalOcean**

```bash
# 1. Acesse: https://cloud.digitalocean.com/droplets/new
# 2. Configurações:
Region: New York 3 (mais próximo do Brasil)
Image: Ubuntu 22.04 (LTS) x64
Size: Regular - 4GB / 2 vCPUs / 80GB SSD ($24/mês)
Authentication: SSH Key (mais seguro) ou Password
Hostname: agroalerta-prod
Monitoring: ✅ Ativado
Backups: ✅ Ativado (+$4.80/mês)

# 3. Aguardar criação (2-3 minutos)
# 4. Anotar IP público: XXX.XXX.XXX.XXX
```

### **2. Configuração Inicial do Servidor**

```bash
# Conectar ao servidor
ssh root@SEU_IP_SERVIDOR

# Executar script de setup automático
curl -fsSL https://raw.githubusercontent.com/seu-repo/Lura/main/setup_server.sh | bash

# OU configuração manual:
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar ferramentas
apt install -y git htop nginx certbot python3-certbot-nginx fail2ban ufw

# Configurar firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Configurar fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### **3. Configurar Projeto**

```bash
# Criar diretório
mkdir -p /var/www/agroalerta
cd /var/www/agroalerta

# Clonar repositório
git clone https://github.com/jsabonet/Lura.git .

# Configurar variáveis de ambiente
cp .env.example .env
nano .env
```

**Editar .env com suas configurações:**
```bash
# .env
POSTGRES_PASSWORD=SuaSenhaPostgresMuitoSegura123!
SECRET_KEY=django-secret-key-muito-segura-aqui-50-caracteres
OPENWEATHER_API_KEY=sua-chave-openweather-aqui
GOOGLE_MAPS_API_KEY=sua-chave-google-maps-aqui

# URLs (substituir pelo seu domínio)
ALLOWED_HOSTS=seudominio.com,www.seudominio.com,localhost
CORS_ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

### **4. Deploy Inicial**

```bash
# Build e iniciar containers
docker-compose build --no-cache
docker-compose up -d

# Aguardar containers subirem (30-60 segundos)
docker-compose ps

# Executar migrações
docker-compose exec backend python manage.py migrate

# Coletar arquivos estáticos
docker-compose exec backend python manage.py collectstatic --noinput

# Criar superusuário (opcional)
docker-compose exec backend python manage.py createsuperuser

# Verificar se tudo está funcionando
curl http://localhost/health
```

### **5. Configurar Domínio e SSL**

```bash
# 1. Apontar seu domínio para o IP do servidor (DNS)
# A record: seudominio.com → SEU_IP_SERVIDOR
# A record: www.seudominio.com → SEU_IP_SERVIDOR

# 2. Aguardar propagação DNS (pode levar até 24h)
# Verificar: dig seudominio.com

# 3. Configurar SSL com Let's Encrypt
# Primeiro, editar nginx_production.conf com seu domínio
nano nginx_production.conf
# Substituir "seudominio.com" pelo seu domínio real

# Recriar container nginx
docker-compose down
docker-compose up -d

# Obter certificado SSL
certbot --nginx -d seudominio.com -d www.seudominio.com

# Configurar renovação automática
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### **6. Configurar CI/CD Automático**

```bash
# 1. No GitHub, ir em Settings → Secrets and variables → Actions
# 2. Adicionar secrets:

DO_HOST=SEU_IP_SERVIDOR
DO_USERNAME=root
DO_SSH_KEY=sua-chave-ssh-privada-completa

# 3. Gerar chave SSH no servidor (se não tiver)
ssh-keygen -t rsa -b 4096 -C "deploy@agroalerta"
cat ~/.ssh/id_rsa  # Copiar chave privada para DO_SSH_KEY
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys  # Autorizar chave
```

**Agora todo push para main fará deploy automático!**

## 🔍 **Verificações e Monitoramento**

### **Comandos Úteis**

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Verificar uso de recursos
docker stats

# Backup manual do banco
docker-compose exec db pg_dump -U postgres agroalerta > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker-compose exec -T db psql -U postgres agroalerta < backup_file.sql

# Reiniciar serviços
docker-compose restart backend
docker-compose restart
```

### **URLs de Acesso**

```bash
# Aplicação principal
https://seudominio.com

# Health check
https://seudominio.com/health

# Admin Django
https://seudominio.com/admin/

# API
https://seudominio.com/api/

# Portainer (monitoring)
https://seudominio.com:9000
```

## 📊 **Monitoramento de Performance**

### **Configurar Alertas Básicos**

```bash
# Script de monitoramento simples
cat > /opt/monitor.sh << 'EOF'
#!/bin/bash
# Monitor básico

# Verificar se containers estão rodando
if [ $(docker-compose ps -q | wc -l) -lt 6 ]; then
    echo "ALERTA: Alguns containers não estão rodando!" | mail -s "AgroAlerta DOWN" seu@email.com
fi

# Verificar uso de disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "ALERTA: Disco com $DISK_USAGE% de uso!" | mail -s "AgroAlerta Disk Full" seu@email.com
fi

# Verificar se aplicação responde
if ! curl -f https://seudominio.com/health >/dev/null 2>&1; then
    echo "ALERTA: Aplicação não está respondendo!" | mail -s "AgroAlerta DOWN" seu@email.com
fi
EOF

chmod +x /opt/monitor.sh

# Executar a cada 5 minutos
echo "*/5 * * * * /opt/monitor.sh" | crontab -
```

## 🚀 **Preparação para IA (Futuro)**

### **Quando Implementar IA:**

```bash
# 1. Upgrade do droplet (4GB → 16GB RAM)
# 2. Adicionar Block Storage para modelos (100GB)
# 3. Instalar dependências IA:

docker-compose exec backend pip install -r requirements_ai.txt

# 4. Ativar Celery para processamento assíncrono
docker-compose up -d celery

# 5. Configurar volume para modelos
# Já configurado no docker-compose.yml → models_volume
```

## 💰 **Estimativa de Custos**

```
Inicial (MVP):
- Droplet 4GB: $24/mês
- Backup automático: $4.80/mês  
- Block Storage (opcional): $10/mês
- Total: ~$29-39/mês

Com IA (futuro):
- Droplet 16GB: $96/mês
- Backup automático: $19.20/mês
- Block Storage 100GB: $10/mês
- Total: ~$125/mês

Domínio: ~$12/ano (separado)
```

## ✅ **Checklist Final**

- [ ] Droplet criado e configurado
- [ ] Docker e Docker Compose instalados
- [ ] Projeto clonado e .env configurado
- [ ] Containers rodando (docker-compose ps)
- [ ] Migrações executadas
- [ ] Domínio apontado para IP
- [ ] SSL configurado (HTTPS funcionando)
- [ ] CI/CD configurado (GitHub Secrets)
- [ ] Backup automático ativo
- [ ] Monitoramento básico configurado

**🎉 Sua aplicação está no ar e pronta para evoluir com IA!**

## 🆘 **Suporte e Troubleshooting**

### **Problemas Comuns:**

```bash
# Container não sobe
docker-compose logs nome_do_container

# Aplicação não responde
docker-compose restart nginx

# Erro de permissão
chown -R 1001:1001 /var/www/agroalerta

# SSL não funciona
certbot certificates
systemctl status nginx

# Performance lenta
docker stats
htop
```

**Em caso de problemas, sempre verificar logs primeiro!** 📝
