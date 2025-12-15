# 🚀 LuraFarm: Roadmap Completo de Implementação (Go-to-Market)
**Data:** 02 de Dezembro de 2025
**Objetivo:** Transformar o protótipo atual em um Produto de Mercado (MVP Robusto).
**Prazo Estimado:** 12 Semanas (3 Meses) para Lançamento Oficial.

---

## 🗓️ FASE 1: Fundação & Experiência PWA (Semanas 1-2)
*Transformar o site em um "App" que o agricultor sente confiança em usar.*

### 1.1. Arquitetura PWA (Progressive Web App)
- [ ] **Configurar Manifest.json:** Definir nome ("LuraFarm"), ícones (192px, 512px), cor de fundo (`#0F2027`) e `display: standalone`.
- [ ] **Service Workers:** Configurar cache para funcionamento offline básico (carregar app sem internet).
- [ ] **Meta Tags:** Configurar viewport para impedir zoom acidental e definir cor da barra de status.
- [ ] **Install Prompt:** Criar componente para incentivar o usuário a "Adicionar à Tela Inicial".

### 1.2. Navegação & Layout (Mobile-First)
- [ ] **Bottom Navigation Bar:** Criar componente fixo no rodapé com rotas: Home, Campos, Lura (FAB), Negócios.
- [ ] **Sidebar (Desktop):** Criar versão responsiva que move a navegação para a lateral em telas grandes.
- [ ] **Lura FAB:** Implementar o botão central flutuante com animação e destaque visual.
- [ ] **Header Dinâmico:** Cabeçalho simplificado que muda conforme a página (Título + Perfil).

### 1.3. Identidade Visual (Design System)
- [ ] **Tipografia:** Implementar fonte `Manrope` ou `Inter` globalmente.
- [ ] **Paleta de Cores:** Refinar `globals.css` com as variáveis finais (Lura Jade, Gold, Night Soil).
- [ ] **Componentes Base:** Criar biblioteca de UI:
    - `Card` (Container padrão)
    - `Button` (Variações: Primary, Secondary, Ghost)
    - `Input` (Com ícone de microfone integrado)
    - `Badge` (Status semafóricos)

---

## 🛠️ FASE 2: O "Agri-OS" - Funcionalidades Core (Semanas 3-6)
*O coração do sistema: onde o agricultor gerencia a produção.*

### 2.1. Dashboard Dinâmico (Backend & Frontend)
- [ ] **Modelagem de Dados (Django):**
    - Criar models: `Project`, `ProjectDashboard`, `FieldActivity`, `FieldPhoto`.
- [ ] **API Endpoints:**
    - CRUD para atividades do campo.
    - Endpoint de resumo (progresso, saúde, custos).
- [ ] **Interface do Painel (`/campos/[id]`):**
    - Implementar abas: Visão Geral, Diário, Galeria, Financeiro.
    - Criar widget de "Próximas Ações" (Checklist).

### 2.2. Gerador de Projetos (Wizard)
- [ ] **Fluxo de Criação:** Transformar o formulário atual em um Wizard passo-a-passo (uma pergunta por tela).
- [ ] **Integração IA:** Otimizar prompt para gerar o plano inicial baseado em inputs mínimos (Voz/Texto).
- [ ] **Geração de PDF:** Melhorar o template de exportação do projeto (caso o usuário queira imprimir).

### 2.3. Chat Lura 2.0 (Multimodal)
- [ ] **Interface de Voz:** Integrar API de Speech-to-Text (Web Speech API ou Whisper) para botão de microfone funcionar nativamente.
- [ ] **Visão Computacional:** Refinar o prompt do Gemini Vision para diagnósticos específicos (ex: identificar pragas de milho/tomate).
- [ ] **Contexto:** Injetar dados do projeto atual no prompt do chat (RAG) para a Lura saber sobre o que o usuário está falando.

---

## 💰 FASE 3: Negócios & Operações (Semanas 7-9)
*Monetização e ferramentas financeiras.*

### 3.1. Controle Financeiro
- [ ] **Modelagem:** Criar models `CostEntry` e `RevenueEntry`.
- [ ] **UI de Custos:** Tela simples para lançar gastos (Categorias: Insumos, Mão de obra, etc.).
- [ ] **Gráficos:** Visualização simples "Orçado vs Realizado".

### 3.2. Marketplace (MVP)
- [ ] **Listagem:** Permitir criar um "Anúncio de Venda" a partir de um projeto colhido.
- [ ] **Feed de Compradores:** Tela para compradores verem ofertas (pode ser uma view simplificada pública).
- [ ] **Negociação:** Chat simples entre Vendedor e Comprador (in-app).

### 3.3. Assinaturas & Pagamentos
- [ ] **Planos:** Configurar tiers no Backend (Free, Pro, Pro+).
- [ ] **Gateway:** Integrar Stripe (cartão) e simular integração M-Pesa (mobile money).
- [ ] **Feature Gating:** Bloquear funcionalidades Pro (ex: PDF completo, Marketplace) para usuários Free.

---

## 🔔 FASE 4: Inteligência & Automação (Semanas 10-11)
*O diferencial "mágico" que retém o usuário.*

### 4.1. Sistema de Alertas (Background Jobs)
- [ ] **Worker de Clima:** Job diário que checa OpenWeather e cria alertas de chuva/seca.
- [ ] **Worker de Pragas:** Lógica para alertar regiões vizinhas quando uma praga é detectada.
- [ ] **Canais:** Enviar via Notificação Push (PWA) e SMS (Twilio - apenas para usuários Pro/Add-on).

### 4.2. Relatórios Inteligentes
- [ ] **Relatório de Safra:** Gerar PDF automático ao fim do ciclo com ROI e comparativos.
- [ ] **Certificado:** Gerar "Selo de Qualidade Lura" para produtos monitorados (QR Code).

---

## 🚀 FASE 5: Polimento & Lançamento (Semana 12)
*Garantir que tudo funciona perfeitamente.*

### 5.1. Testes & QA
- [ ] **Testes de Campo:** Simular uso em condições reais (3G, sol forte, celular low-end).
- [ ] **Testes de Carga:** Garantir que o backend aguenta múltiplos uploads de imagem simultâneos.
- [ ] **Correção de Bugs:** Sprint dedicada apenas a fixes.

### 5.2. Performance & SEO
- [ ] **Otimização de Imagens:** Uso de Next/Image e compressão no upload.
- [ ] **SEO:** Configurar meta tags para compartilhamento (Open Graph) no WhatsApp.
- [ ] **Lighthouse:** Buscar score 90+ em Performance e PWA.

### 5.3. Deploy Produção
- [ ] **Banco de Dados:** Migrar para PostgreSQL gerenciado (ex: Supabase/Neon/AWS RDS).
- [ ] **Backend:** Deploy do Django (ex: Railway/Render/AWS EC2).
- [ ] **Frontend:** Deploy do Next.js (Vercel).
- [ ] **Domínio:** Configurar `lurafarm.com` (ou similar).

---

## ✅ Definição de "Pronto" (DoD - Definition of Done)

A plataforma estará pronta para o mercado quando:
1.  Um agricultor conseguir criar uma conta e um projeto apenas usando o celular.
2.  O sistema funcionar offline para consulta de dados.
3.  A IA diagnosticar corretamente uma praga comum via foto.
4.  O fluxo de pagamento (assinatura) estiver funcional.
5.  O marketplace permitir listar um produto e iniciar uma conversa.

---

**Próximo Passo Imediato:** Iniciar a **Fase 1.1 e 1.2** (Configuração PWA e Navegação).
