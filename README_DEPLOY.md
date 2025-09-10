# Desenvolvimento Local + Deploy Automático

## 🎯 **Fluxo de Trabalho Recomendado**

### **1. Desenvolvimento Local** 
```bash
# Frontend (Terminal 1)
cd frontend
npm run dev

# Backend (Terminal 2) 
cd backend
python manage.py runserver

# Trabalhar normalmente no código...
```

### **2. Quando Pronto para Deploy**
```bash
# Commit suas mudanças
git add .
git commit -m "feat: nova funcionalidade"

# Push para main (dispara deploy automático)
git push origin main
```

### **3. Deploy Automático**
- GitHub Actions detecta push para `main`
- Executa testes automaticamente
- Se testes passam → Deploy automático na DigitalOcean
- Aplicação atualizada em produção!

## 🔧 **Configurações Necessárias**

### **GitHub Secrets (Configurar no repo)**
```
DO_HOST=your-server-ip
DO_USERNAME=root
DO_SSH_KEY=your-private-ssh-key
```

### **Arquivos Criados**
- ✅ `docker-compose.yml` - Orquestração dos containers
- ✅ `frontend/Dockerfile` - Container Next.js
- ✅ `backend/Dockerfile` - Container Django  
- ✅ `nginx.conf` - Proxy reverso
- ✅ `.github/workflows/deploy.yml` - CI/CD automático
- ✅ `.env.example` - Template de variáveis

## 🚀 **Vantagens desta Estratégia**

1. **Desenvolvimento Local Inalterado**: Continue trabalhando normalmente
2. **Deploy Automático**: Push para main = deploy automático
3. **Rollback Fácil**: Se algo der errado, reverter é simples
4. **Ambiente Isolado**: Produção não afeta desenvolvimento
5. **Escalabilidade**: Fácil de escalar na DigitalOcean

## 📋 **Próximos Passos**

1. **Criar Droplet na DigitalOcean** (Ubuntu 22.04)
2. **Seguir DEPLOY_GUIDE.md** para configuração inicial
3. **Configurar GitHub Secrets** para CI/CD
4. **Fazer primeiro push** para main → Deploy automático!

## 💡 **Dicas**

- Use branches para features grandes: `git checkout -b feature/nova-funcionalidade`
- Teste localmente antes do push para main
- Monitore logs após deploy: `docker-compose logs -f`
- Backup regular do banco: comandos no DEPLOY_GUIDE.md
