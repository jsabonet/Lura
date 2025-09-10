# 🚀 Deploy Corrigido - Lura AgroTech

## ✅ Correções Aplicadas

### 1. Dependências Otimizadas (10 ao invés de 131)
```
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
dj-database-url==2.1.0
gunicorn==21.2.0
whitenoise==6.6.0
python-decouple==3.8
requests==2.31.0
```

### 2. Dockerfile Otimizado
- ❌ Removido: `collectstatic` (executar apenas após containers rodarem)
- ✅ Build mais rápido: ~85% redução no tempo

### 3. Scripts de Deploy

## 🔧 No Servidor DigitalOcean

### Opção 1: Script Automático
```bash
cd /root/lura-app
chmod +x quick_fix.sh
./quick_fix.sh
```

### Opção 2: Passo a Passo Manual
```bash
# 1. Atualizar código
git pull origin main

# 2. Parar e limpar
docker-compose -f docker-compose-minimal.yml down
docker system prune -f

# 3. Build novo
docker-compose -f docker-compose-minimal.yml build --no-cache

# 4. Iniciar escalonado
docker-compose -f docker-compose-minimal.yml up -d db
sleep 15

docker-compose -f docker-compose-minimal.yml up -d backend
sleep 10

# 5. Comandos Django
docker-compose -f docker-compose-minimal.yml exec backend python manage.py migrate
docker-compose -f docker-compose-minimal.yml exec backend python manage.py collectstatic --noinput

# 6. Finalizar
docker-compose -f docker-compose-minimal.yml up -d frontend nginx
```

## 📊 Status dos Containers
```bash
docker-compose -f docker-compose-minimal.yml ps
```

## 🌐 Acesso
- **Frontend**: http://seu-ip:80
- **Backend API**: http://seu-ip:80/api/
- **Admin Django**: http://seu-ip:80/admin/

## 🔍 Troubleshooting

### Ver logs
```bash
docker-compose -f docker-compose-minimal.yml logs backend
docker-compose -f docker-compose-minimal.yml logs frontend
```

### Reiniciar serviço específico
```bash
docker-compose -f docker-compose-minimal.yml restart backend
```

### Entrar no container
```bash
docker-compose -f docker-compose-minimal.yml exec backend bash
```

## 🎯 Próximos Passos

1. ✅ Deploy funcionando
2. 🔒 Configurar SSL (Let's Encrypt)
3. 🌐 Apontar domínio
4. 📊 Monitoramento
5. 🤖 Reativar IA/ML (quando necessário)

---
💡 **Dica**: Use `docker-compose-minimal.yml` para produção leve
🚀 **Futuro**: `docker-compose.yml` para quando precisar de IA
