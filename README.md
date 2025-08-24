# AgroAlerta - Sistema Inteligente de Alerta Agrícola

## Visão Geral

O AgroAlerta é um sistema inteligente e gratuito de alerta agrícola desenvolvido especificamente para agricultores de Moçambique. O sistema combina previsões climáticas, detecção de pragas por IA, recomendações agrícolas personalizadas e informações de mercado em tempo real.

## Funcionalidades Principais

### 🌤️ Clima Inteligente (Weather AI)
- Previsões meteorológicas de 7 dias
- Alertas de eventos climáticos extremos
- Integração com OpenWeather API
- Análise de tendências climáticas históricas

### 🐛 Detecção de Pragas e Doenças
- Upload de fotos da lavoura
- Identificação automática usando IA (TensorFlow/HuggingFace)
- Diagnóstico instantâneo com sugestões de controle
- Base de dados de pragas comuns em Moçambique

### 💬 Assistente Agrícola (Chatbot)
- Chatbot inteligente em português
- Recomendações personalizadas por cultura
- Dicas de manejo, irrigação e adubação
- Calendário agrícola interativo

### 💰 Mercado Agrícola
- Preços atualizados de produtos agrícolas
- Tendências de mercado por região
- Alertas de preços personalizados
- Informações de demanda e oferta

### 📱 Sistema de Notificações
- Alertas via SMS e WhatsApp
- Notificações push no aplicativo
- Personalização por cultura e localização
- Acessível mesmo sem smartphones

## Arquitetura Técnica

### Backend (Django Rest Framework)
```
backend/
├── agroalerta/          # Configurações do projeto
├── users/               # Gestão de usuários e autenticação
├── clima/               # API de clima e alertas meteorológicos
├── pragas/              # Detecção de pragas e doenças
├── recomendacoes/       # Recomendações e chatbot
├── mercado/             # Preços e tendências de mercado
├── notificacoes/        # Sistema de alertas e notificações
└── requirements.txt     # Dependências Python
```

### Frontend (Next.js + TypeScript)
```
frontend/
├── src/
│   ├── app/             # Páginas da aplicação
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos React (Auth, etc.)
│   ├── services/        # APIs e serviços externos
│   └── styles/          # Estilos globais
├── public/              # Arquivos estáticos
└── package.json         # Dependências Node.js
```

### Tecnologias Utilizadas

#### Backend
- **Django 4.2** - Framework web Python
- **Django REST Framework** - APIs REST
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **TensorFlow/HuggingFace** - Modelos de IA
- **OpenCV** - Processamento de imagens

#### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **React Query** - Gestão de estado servidor

#### Integrações Externas
- **OpenWeather API** - Dados meteorológicos
- **Twilio/Vonage** - SMS e WhatsApp
- **HuggingFace Models** - IA para pragas e chatbot

## Configuração do Desenvolvimento

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- Git

### Instalação Backend

1. **Criar ambiente virtual**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

2. **Instalar dependências**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Editar .env com suas configurações
```

4. **Configurar banco de dados**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

5. **Executar servidor**
```bash
python manage.py runserver
```

### Instalação Frontend

1. **Instalar dependências**
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente**
```bash
cp .env.example .env.local
# Editar .env.local com suas configurações
```

3. **Executar aplicação**
```bash
npm run dev
```

## APIs e Endpoints

### Autenticação
- `POST /api/users/register/` - Registro de usuário
- `POST /api/users/login/` - Login
- `POST /api/users/token/refresh/` - Refresh token
- `GET /api/users/profile/` - Perfil do usuário

### Clima
- `GET /api/clima/previsao/` - Previsão do tempo
- `GET /api/clima/atual/` - Clima atual
- `GET /api/clima/alertas/` - Alertas climáticos
- `GET /api/clima/historico/` - Histórico climático

### Pragas
- `POST /api/pragas/detectar/` - Detectar praga por imagem
- `GET /api/pragas/culturas/` - Lista de culturas
- `GET /api/pragas/tipos/` - Tipos de pragas
- `POST /api/pragas/relatorio/` - Relatório de ocorrência

### Recomendações
- `GET /api/recomendacoes/` - Lista de recomendações
- `POST /api/recomendacoes/chatbot/` - Interação com chatbot
- `GET /api/recomendacoes/calendario/` - Calendário agrícola

### Mercado
- `GET /api/mercado/precos/` - Preços de mercado
- `GET /api/mercado/tendencias/` - Tendências de preço
- `POST /api/mercado/alertas/` - Criar alerta de preço

## Configuração de APIs Externas

### OpenWeather API
1. Registre-se em https://openweathermap.org/api
2. Obtenha sua API key gratuita
3. Configure em `.env`: `OPENWEATHER_API_KEY=sua_chave_aqui`

### Twilio (SMS/WhatsApp)
1. Registre-se em https://www.twilio.com
2. Configure as credenciais em `.env`:
```
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=seu_numero_twilio
```

### HuggingFace (IA)
1. Registre-se em https://huggingface.co
2. Gere um token de acesso
3. Configure em `.env`: `HUGGINGFACE_API_KEY=seu_token`

## Deployment

### Heroku/Render (Recomendado para MVP)
```bash
# Criar Procfile
echo "web: gunicorn agroalerta.wsgi" > Procfile

# Configurar variáveis de ambiente na plataforma
# Fazer deploy via Git
```

### Docker (Produção)
```dockerfile
# Dockerfile exemplo incluído no projeto
# docker-compose.yml para orquestração
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

- **Email**: suporte@agroalerta.mz
- **Website**: https://agroalerta.mz
- **GitHub**: https://github.com/seu-usuario/agroalerta

## Roadmap

### Versão 1.0 (MVP) - 3 meses
- [x] Estrutura básica backend/frontend
- [x] Sistema de autenticação
- [x] API de clima básica
- [ ] Detecção de pragas por IA
- [ ] Sistema de notificações SMS
- [ ] Interface web responsiva

### Versão 1.1 - 6 meses
- [ ] Chatbot agrícola avançado
- [ ] Preços de mercado em tempo real
- [ ] App mobile nativo
- [ ] Integração WhatsApp Business

### Versão 2.0 - 12 meses
- [ ] IA preditiva para doenças
- [ ] Marketplace agrícola
- [ ] Sistema de cooperativas
- [ ] Analytics avançados para gestores

---

*AgroAlerta - Transformando a agricultura moçambicana através da tecnologia* 🇲🇿
