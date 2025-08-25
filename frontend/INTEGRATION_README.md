# AgroAlerta Frontend - Integração Completa

## 🎉 Integrações Implementadas

### ✅ Sistema de Autenticação
- **Login e Registro**: Modais responsivos com validação
- **Context API**: Gerenciamento global do estado de autenticação
- **JWT Tokens**: Integração com backend Django para tokens de acesso
- **Proteção de Rotas**: Redirecionamento automático para usuários não autenticados

### ✅ Serviços de API
- **Base API Service**: Configuração centralizada para todas as chamadas HTTP
- **Auth Service**: Login, registro, atualização de perfil, refresh tokens
- **Clima Service**: Clima atual, previsões, alertas climáticos, histórico
- **Pragas Service**: Detecção por IA, histórico, recomendações

### ✅ Páginas Principais

#### 🏠 Homepage
- Design moderno e responsivo
- Navegação inteligente (diferente para usuários logados/não logados)
- Cards interativos para cada funcionalidade
- Modais de login/registro integrados

#### 📊 Dashboard
- Visão geral personalizada para agricultores
- Widgets de clima atual e alertas
- Estatísticas de detecções e recomendações
- Ações rápidas para todas as funcionalidades

#### 🌤️ Página de Clima
- Exibição do clima atual com dados detalhados
- Previsão para 7 dias
- Sistema de alertas climáticos com níveis de severidade
- Seleção de cidade/região

#### 🐛 Página de Pragas
- Upload e preview de imagens
- Detecção por IA integrada com backend
- Recomendações personalizadas com níveis de urgência
- Histórico de detecções
- Lista de pragas comuns

#### 💰 Página de Mercado
- Interface preparada para dados de mercado
- Design consistente com o resto da aplicação

### ✅ Componentes Reutilizáveis
- **AppHeader**: Navegação principal com indicação de página ativa
- **LoginModal**: Modal de login com validação
- **RegisterModal**: Modal de registro completo com dados do agricultor
- **AuthContext**: Gerenciamento de estado global de autenticação

### ✅ Configurações
- **TypeScript**: Tipagem completa para todas as APIs
- **Tailwind CSS**: Design system consistente com tema agrícola
- **Environment Variables**: Configuração flexível para diferentes ambientes
- **Error Handling**: Tratamento de erros consistente em todas as chamadas

## 🔗 Endpoints Integrados

### Autenticação
- `POST /api/users/login/` - Login de usuário
- `POST /api/users/register/` - Registro de usuário
- `GET /api/users/profile/` - Dados do usuário atual
- `PUT /api/users/profile/` - Atualização de perfil
- `POST /api/users/token/refresh/` - Refresh de token

### Clima
- `GET /api/clima/atual/` - Clima atual
- `GET /api/clima/previsao/` - Previsão do tempo
- `GET /api/clima/alertas/` - Alertas climáticos
- `GET /api/clima/historico/` - Histórico climático

### Pragas
- `POST /api/pragas/detectar/` - Detecção de pragas (upload de imagem)
- `GET /api/pragas/listar/` - Lista de pragas
- `GET /api/pragas/historico/` - Histórico de detecções
- `POST /api/pragas/recomendacao/` - Recomendações de controle

## 🎨 Design System

### Cores Principais
- **Verde Primário**: `green-600` (#059669)
- **Verde Escuro**: `green-800` (#166534)
- **Verde Claro**: `green-50` (#f0fdf4)
- **Acentos**: `emerald-100`, `emerald-800`

### Layout
- **Container**: Máximo 1200px centralizado
- **Spacing**: Sistema consistente baseado em múltiplos de 4px
- **Typography**: Hierarquia clara com tamanhos responsivos
- **Components**: Cards, botões e formulários padronizados

## 🚀 Como Usar

### Pré-requisitos
1. Backend Django rodando em `http://localhost:8000`
2. Node.js 18+ instalado
3. Dependências instaladas: `npm install`

### Executar
```bash
cd frontend
npm run dev
```

### Variáveis de Ambiente
Arquivo `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## 📱 Features Implementadas

### Autenticação
- [x] Login com username/password
- [x] Registro completo com dados do agricultor
- [x] Persistência de sessão com JWT
- [x] Proteção de rotas
- [x] Logout funcional

### Clima
- [x] Visualização do clima atual
- [x] Previsão de 7 dias
- [x] Sistema de alertas
- [x] Seleção de localização

### Pragas
- [x] Upload de imagens
- [x] Detecção por IA
- [x] Exibição de resultados
- [x] Recomendações de controle
- [x] Histórico de detecções

### UI/UX
- [x] Design responsivo
- [x] Dark mode support
- [x] Loading states
- [x] Error handling
- [x] Navegação intuitiva

## 🔄 Próximas Etapas

### Funcionalidades Pendentes
- [ ] Sistema de notificações
- [ ] Chatbot inteligente
- [ ] Dados de mercado em tempo real
- [ ] Página de perfil completa
- [ ] Sistema de favoritos
- [ ] Exportação de relatórios

### Melhorias
- [ ] Testes unitários e de integração
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] PWA features
- [ ] Offline support

## 📖 Documentação das APIs

Todas as APIs estão documentadas nos arquivos de serviço:
- `src/services/auth.ts` - Autenticação e usuários
- `src/services/clima.ts` - Dados climáticos
- `src/services/pragas.ts` - Detecção de pragas

## 🐛 Troubleshooting

### Problemas Comuns
1. **Erro de CORS**: Verificar configuração no Django
2. **Token expirado**: Implementar refresh automático
3. **Upload falha**: Verificar tamanho e formato da imagem
4. **Dados não carregam**: Verificar se o backend está rodando

### Debug
- Abrir DevTools do navegador
- Verificar Network tab para chamadas da API
- Verificar Console para erros JavaScript
- Logs do backend para problemas de servidor
