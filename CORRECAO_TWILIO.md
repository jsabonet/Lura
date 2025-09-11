# 🚨 Correção Imediata - Erro Twilio

## ❌ **Erro Identificado:**
```
ModuleNotFoundError: No module named 'twilio'
```

## ✅ **Solução no Servidor:**

### **Opção 1: Correção Rápida (Recomendada)**
```bash
# 1. Atualizar código
git pull origin main

# 2. Rebuild apenas o backend
docker-compose build --no-cache backend

# 3. Reiniciar backend
docker-compose up -d backend

# 4. Aguardar container subir
sleep 15

# 5. Tentar migrações novamente
docker-compose exec backend python manage.py migrate
```

### **Opção 2: Reinstalar Dependências Manualmente**
```bash
# Se a opção 1 não funcionar:
docker-compose exec backend pip install twilio==8.10.0 Pillow==10.0.1
docker-compose exec backend python manage.py migrate
```

### **Opção 3: Rebuild Completo**
```bash
# Se persistir erro:
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

## 📦 **Dependências Adicionadas:**
- ✅ `twilio==8.10.0` - Notificações SMS
- ✅ `Pillow==10.0.1` - Processamento de imagens
- 📊 Total: **12 dependências** (era 10)

## 🔍 **Verificar Status:**
```bash
# Ver se backend está saudável
docker-compose ps

# Ver logs do backend
docker-compose logs backend

# Testar se dependências foram instaladas
docker-compose exec backend pip list | grep -i twilio
docker-compose exec backend pip list | grep -i pillow
```

## 🎯 **Próximos Passos Após Correção:**
```bash
# 1. Executar migrações
docker-compose exec backend python manage.py migrate

# 2. Coletar estáticos
docker-compose exec backend python manage.py collectstatic --noinput

# 3. Verificar aplicação
curl http://localhost/health
```

---
💡 **Nota**: O erro ocorreu porque as dependências `twilio` e `Pillow` são importadas no código mas não estavam no `requirements.txt` otimizado.
