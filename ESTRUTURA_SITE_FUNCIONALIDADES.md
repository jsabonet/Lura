# 🏗️ LuraFarm: Estrutura do Site & Funcionalidades (Sitemap PWA)
**Data:** 02 de Dezembro de 2025
**Tipo:** Arquitetura de Informação (Next.js App Router)
**Foco:** Navegação Simplificada para Agricultores (Mobile-First)

---

## 1. 🗺️ Mapa do Site (Rotas Principais)

A estrutura de navegação é "rasa" (poucos cliques para chegar ao destino).

| Rota (URL) | Nome na Interface | Ícone | Função Principal |
| :--- | :--- | :--- | :--- |
| `/` | **Dia de Hoje** | 🏠 Casa | Feed inteligente de tarefas e alertas. |
| `/campos` | **Meus Campos** | 🌾 Planta | Galeria visual das plantações. |
| `/campos/[id]` | **Painel do Campo** | 📊 Gráfico | Dashboard dinâmico de um projeto específico. |
| `/novo-projeto` | **Novo Plantio** | ➕ Mais | Wizard (passo-a-passo) para criar plano. |
| `/lura` | **Falar com Lura** | 💬 Balão | Chatbot IA (Voz/Imagem). |
| `/negocios` | **Negócios** | 💰 Cifrão | Marketplace e Controle Financeiro. |
| `/perfil` | **Minha Conta** | 👤 Usuário | Configurações e Assinatura. |

---

## 2. 📱 Detalhamento das Funcionalidades por Página

### 🏠 A. Página Inicial: "O Dia de Hoje" (`/`)
*O painel de controle diário. O que o agricultor precisa saber AGORA.*

1.  **Widget de Clima (Topo):**
    *   Temperatura atual + Ícone grande (Sol/Chuva).
    *   Previsão para as próximas 24h (ex: "Chuva às 14h").
    *   *Ação:* "Não aplicar defensivos hoje."
2.  **Cards de Alerta (Prioridade Alta):**
    *   Avisos críticos (Pragas na região, risco de geada).
    *   Cor vermelha ou amarela para chamar atenção.
3.  **Lista de Tarefas (Checklist):**
    *   Tarefas agendadas para hoje (ex: "Adubação no Milho Norte").
    *   Botão gigante: **[✅ JÁ FIZ]**.
4.  **Resumo Rápido:**
    *   "Sua safra está 85% saudável."
    *   "Saldo estimado: 15.000 MT."

### 🌾 B. Meus Campos (`/campos`)
*A visão geral da propriedade.*

1.  **Galeria de Cards:**
    *   Cada projeto é um card com foto real do campo.
    *   Barra de progresso visual (ex: "Dia 45 de 120").
    *   Status semafórico (🟢 Bem, 🟡 Atenção, 🔴 Risco).
2.  **Botão Flutuante (FAB):**
    *   "Novo Plantio" (Leva para o Wizard).

### 📊 C. Painel do Campo (`/campos/[id]`)
*O "Dashboard Dinâmico" detalhado de um projeto específico.*

**Sub-abas (Tabs):**
1.  **Visão Geral:** Cronograma, fase atual, checklist futuro.
2.  **Diário:** Timeline de atividades (histórico). Botão "Adicionar Registro".
3.  **Galeria:** Fotos do crescimento (Antes/Depois).
4.  **Custos:** Gráfico simples (Orçado vs Gasto).

### ➕ D. Novo Projeto (`/novo-projeto`)
*O "Gerador de Projetos" transformado em conversa.*

*   **Formato:** Wizard (Passo-a-passo), uma pergunta por tela.
*   **Inputs:**
    1.  "O que vai plantar?" (Ícones grandes: Milho, Tomate, Feijão).
    2.  "Onde?" (GPS automático).
    3.  "Qual tamanho?" (Slider ou digitação).
    4.  "Quanto quer gastar?" (Input numérico).
*   **Saída:** Gera o plano e redireciona para o Dashboard `/campos/[id]`.

### 💬 E. Falar com Lura (`/lura`)
*A interface central de Inteligência Artificial.*

1.  **Botão de Microfone (Gigante):**
    *   Pressionar para falar. Transcrição em tempo real.
2.  **Botão de Câmera:**
    *   Tirar foto de praga/doença.
    *   Análise imediata com visão computacional.
3.  **Histórico de Chat:**
    *   Conversa estilo WhatsApp.
    *   Respostas curtas e diretas.
    *   Sugestões de ação (ex: "Agendar aplicação?").

### 💰 F. Negócios (`/negocios`)
*Onde o dinheiro entra e sai.*

1.  **Aba Vender (Marketplace):**
    *   Botão "Anunciar Colheita".
    *   Lista de compradores interessados.
    *   Chat de negociação.
2.  **Aba Finanças:**
    *   Livro Caixa Simplificado (Entradas vs Saídas).
    *   Botão de Voz: "Gastei 500 com sementes".

---

## 3. 🧩 Componentes Globais (Layout)

### Mobile (PWA)
*   **Bottom Navigation Bar:** Fixa no rodapé. Contém: Início, Campos, [LURA], Negócios.
*   **Lura FAB:** O botão da IA "flutua" no centro da barra, maior que os outros.
*   **Header Simplificado:** Apenas título da página e foto do perfil (pequena).

### Desktop (Web)
*   **Sidebar Lateral:** Menu vertical à esquerda com todas as opções.
*   **Área de Conteúdo:** Expande para mostrar tabelas e gráficos detalhados (DataGrids).

---

## 4. 🛠️ Funcionalidades Técnicas (PWA)

1.  **Instalação (Add to Home Screen):**
    *   Banner automático: "Instalar LuraFarm".
    *   Ícone próprio no celular.
2.  **Modo Offline:**
    *   Cache das páginas visitadas.
    *   Permite ver tarefas e diário mesmo sem internet.
    *   Sincroniza dados quando a conexão voltar.
3.  **Notificações Push:**
    *   Alertas de clima e tarefas mesmo com o app fechado.

---

## 5. 🔄 Fluxo de Navegação Típico

1.  **Entrada:** Abre o app ➝ Cai no **Dia de Hoje**.
2.  **Verificação:** Vê alerta de chuva ➝ Clica no card.
3.  **Ação:** Decide não adubar. Clica em **Meus Campos**.
4.  **Gestão:** Entra no "Milho Norte". Vê que está atrasado.
5.  **Consulta:** Clica no botão **Lura**. Pergunta: "Posso adubar amanhã?".
6.  **Registro:** Lura confirma. Ele clica em "Registrar Atividade" no chat mesmo.
7.  **Saída:** Fecha o app.

---

**Resumo:** O site é estruturado não como um portal de informações, mas como uma **ferramenta de trabalho diário**. Cada tela tem uma ação clara e um botão grande para executá-la.
