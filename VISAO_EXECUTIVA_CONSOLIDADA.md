# 🌾 LuraFarm: Visão Executiva Consolidada
**Data:** 05 de Dezembro de 2025  
**Documento:** Executive Summary & Product Blueprint  
**Audiência:** Stakeholders, Investidores, Equipe de Desenvolvimento

---

## 📊 RESUMO EXECUTIVO (30 Segundos)

**O Quê?** Uma plataforma de Inteligência Artificial que transforma smartphones em "Extensionistas Digitais" para pequenos agricultores em Moçambique e África.

**Para Quem?** Agricultores com 1-50 hectares, baixa literacia digital, conectividade intermitente, que precisam de orientação técnica mas não têm acesso a agrônomos.

**Como?** Interface voice-first (voz > texto), visão computacional para diagnóstico de pragas via foto, e dashboards simplificados que monitoram a safra em tempo real.

**Modelo de Negócio?** Freemium SaaS com assinaturas mensais (R$49-129) + SMS premium + comissões no marketplace.

**Tração?** MVP funcional com chatbot multimodal ativo. Próximo: Dashboard dinâmico e PWA.

---

## 🎯 CATEGORIA DA PLATAFORMA

### Classificação Principal: **AgriTech Super App (Vertical SaaS)**

A LuraFarm não é apenas um software - é uma categoria híbrida única que combina:

| Categoria | % Peso | Descrição | Concorrentes Diretos |
|-----------|--------|-----------|---------------------|
| **FMIS** (Farm Management) | 40% | Sistema de gestão digital da fazenda (registros, calendário, custos) | Agrivi, FarmLogs, Conserv |
| **AI Advisory Platform** | 35% | Consultoria técnica automatizada via IA (diagnóstico, recomendações) | Plantix, FarmBot, AgroStar |
| **Digital Marketplace** | 15% | Conexão B2B entre produtores e compradores | Twiga Foods, FarmCrowdy |
| **Precision Agriculture** | 10% | Dados para otimização (clima, solo, satélite) | Climate FieldView, Cropio |

### Posicionamento Único (Diferencial Competitivo)

```
┌─────────────────────────────────────────────────────────────┐
│ MAPA COMPETITIVO                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Alta Tecnologia (Satélite, IoT, Drones)                   │
│         │                                                   │
│         │  ❌ Climate FieldView                            │
│         │  (US$ 50.000+/ano - Grandes fazendas)            │
│         │                                                   │
│         │                                                   │
│  ────────┼──────────────────────────────────────           │
│         │                    ✅ LURAFARM                   │
│         │          (Tecnologia Avançada + UX Simples)      │
│         │              - IA Multimodal                      │
│         │              - R$ 49-129/mês                      │
│         │              - Voice-First                        │
│  ────────┼──────────────────────────────────────           │
│         │                                                   │
│         │  ❌ WhatsApp + Excel                             │
│         │  (Grátis mas sem inteligência)                   │
│         │                                                   │
│  Baixa Tecnologia (Papel, Planilhas)                       │
│                                                             │
│  ◄────────── Simplicidade ────────── Complexidade ►        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

NOSSA ZONA: Tecnologia de ponta com interface de WhatsApp
```

**Benchmark Internacional:**
- **Plantix (Índia):** Similar em diagnóstico de pragas, mas sem gestão end-to-end.
- **FarmLogs (EUA):** Gestão completa, mas interface complexa e preço alto.
- **Digital Green (África):** Foco em vídeos educativos, não em IA interativa.

**Vantagem Competitiva da LuraFarm:**
1. **Única com IA Multimodal em Português:** Gemini Vision + Voz + RAG.
2. **Design Inclusivo:** Voice-first, ícones literais, navegação linear.
3. **End-to-End:** Do planejamento à venda (concorrentes fazem só uma parte).
4. **Precificação Acessível:** 10x mais barato que soluções de precision agriculture tradicionais.

---

## 🧩 ARQUITETURA FUNCIONAL (Os 6 Pilares)

```
┌───────────────────────────────────────────────────────────────┐
│                      LURAFARM ECOSYSTEM                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ 1. PLANEJAR │→ │ 2. EXECUTAR │→ │ 3. VENDER   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│        ↓                 ↓                 ↓                  │
│  Gerador de      Dashboard        Marketplace               │
│  Projetos        Dinâmico         Integrado                 │
│  (PDF/Wizard)    (Monitoramento)  (B2B)                     │
│                                                               │
│  ┌──────────────────────────────────────────────┐            │
│  │    🤖 CAMADA DE INTELIGÊNCIA (IA)            │            │
│  ├──────────────────────────────────────────────┤            │
│  │ • Chat Multimodal (Gemini 1.5 Flash)         │            │
│  │ • Visão Computacional (Diagnóstico Pragas)   │            │
│  │ • RAG (Base de Conhecimento Agrícola)        │            │
│  │ • Alertas Preditivos (Clima, Mercado)        │            │
│  └──────────────────────────────────────────────┘            │
│                                                               │
│  ┌──────────────────────────────────────────────┐            │
│  │    📱 CAMADA DE EXPERIÊNCIA (UX)             │            │
│  ├──────────────────────────────────────────────┤            │
│  │ • PWA (Funciona Offline)                     │            │
│  │ • Voice-First (Botão de Microfone Grande)    │            │
│  │ • Bottom Navigation (App-like)               │            │
│  │ • Ícones Literais (Evita Abstração)          │            │
│  └──────────────────────────────────────────────┘            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Detalhamento dos 6 Pilares Funcionais

#### 1. 🎯 Gerador de Projetos Agrícolas (Planning)
**O Que Faz:** Cria planos de safra profissionais em 5 minutos via wizard.  
**Input:** Cultura, área, orçamento (por voz ou touch).  
**Output:** Dashboard dinâmico + PDF exportável (30 páginas).  
**Tecnologia:** Gemini AI + Templates + Análise de Dados Regionais.  
**Valor:** Transforma intuição em estratégia científica.

#### 2. 📊 Dashboard Dinâmico de Acompanhamento (Execution)
**O Que Faz:** Sistema vivo que monitora o ciclo da safra dia-a-dia.  
**Funcionalidades:**
- Diário de Campo (Timeline de atividades com fotos)
- Controle Financeiro (Orçado vs Realizado em tempo real)
- Galeria Evolutiva (Antes/Depois com análise IA de crescimento)
- Alertas Inteligentes (SMS proativos de clima/pragas)
- Checklist Dinâmico (Tarefas geradas pela IA)

**Valor:** Mantém o agricultor no controle sem planilhas complexas.

#### 3. 💬 Chat Lura (Assistente IA Multimodal)
**O Que Faz:** Consultoria técnica instantânea via texto, voz ou imagem.  
**Casos de Uso:**
- Foto de folha amarela → Diagnóstico: "Deficiência de Nitrogênio"
- Voz: "Quando adubar?" → Resposta contextualizada ao projeto ativo
- Texto: "Preço do milho hoje?" → Dados de mercado em tempo real

**Tecnologia:** Gemini 1.5 Flash (visão) + RAG (ChromaDB) + Speech-to-Text.

#### 4. 🔔 Sistema de Alertas Proativos (Prevention)
**O Que Faz:** Avisa antes que problemas aconteçam.  
**Tipos de Alertas:**
- **Climáticos:** "Chuva forte em 2h - não aplique defensivo"
- **Fitossanitários:** "Lagarta detectada a 3km - monitore hoje"
- **Operacionais:** "Adubação atrasada em 5 dias"
- **Mercado:** "Preço do milho subiu 12% - considere vender"

**Canais:** Push Notification (PWA) + SMS (Twilio - Premium).

#### 5. 💰 Controle Financeiro Simplificado (Finance)
**O Que Faz:** Rastreia gastos e receitas automaticamente.  
**Interface:** Gráfico simples Verde (Lucro) vs Vermelho (Gasto).  
**Input:** Voz: "Gastei 500 com sementes" → Sistema categoriza automaticamente.  
**Output:** ROI calculado, custo por kg, margem de lucro.

#### 6. 🏪 Marketplace Integrado (Commercialization)
**O Que Faz:** Conecta produtores a compradores verificados.  
**Fluxo:**
1. Agricultor lista produção (ex: 2 ton de milho, 45 MT/kg)
2. Compradores fazem ofertas via chat in-app
3. Negociação + Contrato digital
4. Pagamento rastreado (M-Pesa / Stripe)

**Monetização:** 5% de comissão sobre venda fechada.

---

## 🎨 DESIGN DA INTERFACE (UX para Baixa Literacia Digital)

### Filosofia Central: "Invisible Technology"
> "A melhor tecnologia é aquela que você não percebe. O agricultor não deve sentir que está 'usando um software' - deve sentir que está conversando com um amigo agrônomo."

### Princípios de Design (Os 5 Mandamentos)

#### 1. Voice-First (Voz > Tudo)
**Por Que?** 60% dos usuários-alvo têm dificuldade com digitação rápida.  
**Como Implementar:**
- Todo input de texto tem um botão de microfone **DENTRO** do campo.
- FAB (Floating Action Button) central para Lura é um microfone gigante (72px).
- Respostas da IA são lidas em áudio automaticamente.

**Exemplo Visual:**
```
┌─────────────────────────────────────┐
│ O que você precisa hoje?            │
│ ┌───────────────────────────────┐   │
│ │ Digite ou...          🎤      │   │  ← Mic SEMPRE visível
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### 2. Navegação Linear (Túnel, Não Labirinto)
**Por Que?** Menus complexos causam desorientação e abandono.  
**Como Implementar:**
- Bottom Navigation com **4 abas apenas**: Início, Campos, [Lura], Negócios.
- Wizards passo-a-passo (1 pergunta por tela) em vez de formulários longos.
- Breadcrumbs sempre visíveis ("Você está aqui").

**Fluxo Típico:**
```
Tela Inicial → Vê Alerta → Clica → Resolve → Volta ao Início
(3 toques, não 10 menus)
```

#### 3. Semiótica Literal (Ícones Reais, Não Abstratos)
**Por Que?** Ícones abstratos confundem usuários sem experiência digital.  
**Como Implementar:**

| ❌ Evitar | ✅ Usar |
|-----------|---------|
| Ícone de "engrenagem" | Texto "Configurações" + Foto de Ferramenta |
| Gráfico de barras | Ilustração de sacola de milho cheia |
| Ícone de "nuvem" para armazenamento | Ícone de chuva literal para clima |

**Cores Semafóricas:**
- 🟢 Verde (#00A86B): Saudável, Seguro, Continuar
- 🟡 Amarelo (#F2C94C): Atenção, Revisar
- 🔴 Vermelho (#EF4444): Perigo, Ação Imediata

#### 4. Feedback Visual Imediato
**Por Que?** Usuários precisam confirmação de que o app "entendeu".  
**Como Implementar:**
- Ao tirar foto: Vibração + Som + "Analisando..." com spinner.
- Ao falar: Transcrição em tempo real aparece na tela.
- Ao completar tarefa: Animação de ✅ verde gigante + Som de sucesso.

#### 5. Design Mobile-First (Polegar-Friendly)
**Por Que?** 95% do uso será em celular, muitas vezes com uma mão.  
**Como Implementar:**
- Botões mínimo 48x48px (área de toque confortável).
- Navegação na parte inferior (alcance do polegar).
- Scroll vertical infinito (não horizontal).

---

## 📱 ESTRUTURA DE TELAS (Sitemap & Fluxo)

### Arquitetura de Informação (IA)

```
┌───────────────────────────────────────────────────────────┐
│                    LURAFARM PWA                            │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  [BOTTOM NAVIGATION - FIXA]                              │
│  ┌─────────┬─────────┬─────────┬─────────┐               │
│  │ 🏠      │ 🌾      │   💬    │ 💰      │               │
│  │ Início  │ Campos  │  [LURA] │ Negócios│               │
│  └─────────┴─────────┴─────────┴─────────┘               │
│                         ▲                                 │
│                         │                                 │
│                    FAB (72px) - Flutuante                 │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Detalhamento das Telas Principais

#### Tela 1: 🏠 "Dia de Hoje" (Home / Feed)
**Rota:** `/`  
**Objetivo:** Responder "O que preciso fazer AGORA?"  
**Conteúdo (Ordem de Prioridade):**

1. **Saudação Personalizada:** "Bom dia, João!"
2. **Widget Clima (Destaque):**
   ```
   ┌─────────────────────────────┐
   │  ☀️  28°C - Sol            │
   │  Bom dia para capinar!      │
   └─────────────────────────────┘
   ```
3. **Cards de Alerta (Se Houver):**
   ```
   ┌─────────────────────────────┐
   │ ⚠️  ATENÇÃO                 │
   │ Lagarta detectada 2km       │
   │ daqui. Verifique seu campo! │
   │ [VER MAIS]                  │
   └─────────────────────────────┘
   ```
4. **Checklist de Tarefas:**
   ```
   ☐ Aplicar adubo no Milho Norte
   ☐ Capina (atrasado 2 dias)
   ✅ Inspeção de pragas (feita)
   ```
5. **Resumo de Saúde:**
   ```
   Sua safra está 85% saudável 🟢
   Colheita em 45 dias
   ```

**Interações:** Toque no card → Abre detalhes ou ação rápida.

---

#### Tela 2: 🌾 "Meus Campos" (Galeria de Projetos)
**Rota:** `/campos`  
**Objetivo:** Visão geral da propriedade.  
**Layout:** Grid de Cards com fotos reais.

```
┌─────────────────────┐  ┌─────────────────────┐
│ [Foto do Milho]     │  │ [Foto do Tomate]    │
│ Milho Norte 2025    │  │ Tomate Sul 2025     │
│ 🌽 3 hectares       │  │ 🍅 1 hectare        │
│ ▓▓▓▓▓░░░░░ 60%     │  │ ▓▓▓░░░░░░░ 30%     │
│ 🟢 Saudável         │  │ 🟡 Precisa de água  │
└─────────────────────┘  └─────────────────────┘

[+ Novo Plantio] ← FAB amarelo no canto
```

**Interação:** Toque no card → Abre Dashboard Detalhado (`/campos/[id]`).

---

#### Tela 3: 📊 "Dashboard do Campo" (Painel Detalhado)
**Rota:** `/campos/[id]`  
**Objetivo:** Acompanhar projeto específico.  
**Layout:** Tabs horizontais (swipe).

```
┌─────────────────────────────────────────┐
│ Milho Norte 2025 - 3 ha                 │
│ Fase: Vegetativo | Dia 45/120           │
│ ▓▓▓▓▓░░░░░░░░░░░░░░ 38%               │
├─────────────────────────────────────────┤
│ [Geral] [Diário] [Galeria] [Custos]    │  ← Tabs
├─────────────────────────────────────────┤
│                                         │
│ (Conteúdo da aba selecionada)          │
│                                         │
│ Tab "Geral":                            │
│  • Próximas ações (Checklist)          │
│  • Health Score: 87/100 🟢             │
│  • Alertas ativos                       │
│                                         │
│ Tab "Diário":                           │
│  • Timeline de atividades              │
│  • [+ Adicionar Registro] (FAB)        │
│                                         │
│ Tab "Galeria":                          │
│  • Slider de fotos (Antes/Depois)      │
│  • Gráfico de crescimento              │
│                                         │
│ Tab "Custos":                           │
│  • Orçado: 10.000 MT                   │
│  • Realizado: 9.500 MT ✅              │
│  • Gráfico pizza (Categorias)          │
│                                         │
└─────────────────────────────────────────┘
```

---

#### Tela 4: 💬 "Falar com Lura" (Chat IA)
**Rota:** `/lura`  
**Objetivo:** Consultoria instantânea.  
**Layout:** Interface de chat (WhatsApp-like).

```
┌─────────────────────────────────────────┐
│ ← Voltar          Lura 🤖               │
├─────────────────────────────────────────┤
│                                         │
│  [Avatar Lura]                          │
│  Olá João! Como posso ajudar hoje?     │
│                                         │
│                    [Bolha do Usuário]   │
│         Tem um bicho na folha do milho  │
│                                         │
│  [Avatar Lura]                          │
│  Vou analisar! Tire uma foto para mim. │
│                                         │
│                    [Foto do Usuário]    │
│                         🖼️              │
│                                         │
│  [Avatar Lura]                          │
│  Isso é lagarta do cartucho.            │
│  Recomendo aplicar [Produto X].         │
│  Quer que eu anote no seu diário?       │
│  [SIM] [NÃO]  ← Botões de ação rápida  │
│                                         │
├─────────────────────────────────────────┤
│ [Digite...]              🎤  📸  📎     │  ← Input
└─────────────────────────────────────────┘
```

**Interações:**
- 🎤 Microfone: Abrir gravação de voz (push-to-talk).
- 📸 Câmera: Tirar foto ou selecionar da galeria.
- 📎 Anexo: Enviar nota fiscal (OCR futuro).

---

#### Tela 5: 💰 "Negócios" (Marketplace + Finanças)
**Rota:** `/negocios`  
**Objetivo:** Vender produção e controlar dinheiro.  
**Layout:** Tabs (Vender | Finanças).

```
┌─────────────────────────────────────────┐
│ Negócios                                │
├─────────────────────────────────────────┤
│ [Vender] [Finanças]  ← Tabs             │
├─────────────────────────────────────────┤
│                                         │
│ Tab "Vender":                           │
│  [+ Anunciar Colheita] ← Botão destaque│
│                                         │
│  Meus Anúncios:                         │
│  ┌───────────────────────────────────┐  │
│  │ Milho Branco - 2.000 kg           │  │
│  │ 45 MT/kg                          │  │
│  │ 🟢 3 ofertas recebidas            │  │
│  └───────────────────────────────────┘  │
│                                         │
│ Tab "Finanças":                         │
│  Saldo Estimado:                        │
│  15.450 MT 🟢                          │
│                                         │
│  Últimas Movimentações:                │
│  • Venda Tomate    +8.500 MT 🟢        │
│  • Sementes        -1.200 MT 🔴        │
│  • Adubo           -3.500 MT 🔴        │
│                                         │
│  [Registrar Gasto] (Voz)               │
│                                         │
└─────────────────────────────────────────┘
```

---

#### Tela 6: ➕ "Novo Projeto" (Wizard)
**Rota:** `/novo-projeto`  
**Objetivo:** Criar plano de safra em 5 minutos.  
**Layout:** Uma pergunta por tela (4 telas sequenciais).

```
Tela 1/4:
┌─────────────────────────────────────────┐
│ ▓░░░ (Progresso 25%)                    │
│                                         │
│ O que vai plantar?                      │
│                                         │
│  ┌─────────────┐ ┌─────────────┐       │
│  │    🌽       │ │    🍅       │       │
│  │   Milho     │ │  Tomate     │       │
│  └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐       │
│  │    🫘       │ │    🥕       │       │
│  │  Feijão     │ │  Cenoura    │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│         [Outro (Digitar)]               │
│                                         │
└─────────────────────────────────────────┘

Tela 2/4:
┌─────────────────────────────────────────┐
│ ▓▓░░ (Progresso 50%)                    │
│                                         │
│ Qual o tamanho da área?                 │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  [____] hectares                  │  │
│  │                              🎤   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  (Ou use o slider)                      │
│  ━━━━━━●━━━━━━━━━━━                     │
│  1 ha          50 ha                    │
│                                         │
│           [Próximo →]                   │
│                                         │
└─────────────────────────────────────────┘

(... Telas 3/4 e 4/4 seguem a mesma lógica)
```

**Resultado Final:** Redireciona para Dashboard do projeto criado.

---

## 🔄 FLUXO DE USO COMPLETO (Dia na Vida do "Seu João")

### Cenário Real: Segunda-feira, 6h da manhã

```
┌────────────────────────────────────────────────────────────┐
│ JORNADA DO USUÁRIO: "Seu João, 52 anos, 5 hectares"       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ 06:00 - Acorda, toma café                                 │
│   ↓                                                        │
│ 06:15 - Abre LuraFarm (ícone na home screen)              │
│   ↓                                                        │
│ 06:16 - App diz (áudio): "Bom dia João!"                  │
│   ↓                                                        │
│ 06:17 - Vê card vermelho de alerta:                       │
│         "☔ Chuva forte às 14h - 40mm esperado"            │
│         "Não aplique defensivo hoje."                     │
│   ↓                                                        │
│ 06:18 - Pensa: "Bom, vou fazer capina então"              │
│   ↓                                                        │
│ 08:00 - No campo, vê folha amarelada                      │
│   ↓                                                        │
│ 08:02 - Clica no botão [Lura] (microfone gigante)         │
│   ↓                                                        │
│ 08:03 - Clica em 📸 Câmera → Tira foto da folha          │
│   ↓                                                        │
│ 08:04 - App vibra + "Analisando..." (spinner)             │
│   ↓                                                        │
│ 08:05 - Lura responde (áudio + texto):                    │
│         "Deficiência de Nitrogênio. Adicione Uréia."      │
│         [Anotar no Diário?] → João toca [SIM]             │
│   ↓                                                        │
│ 08:06 - Volta para a tarefa de capinar                    │
│   ↓                                                        │
│ 12:00 - Termina capina, almoça                            │
│   ↓                                                        │
│ 12:30 - Abre app novamente                                │
│   ↓                                                        │
│ 12:31 - Vai em "Dia de Hoje" → Vê checklist:              │
│         ☐ Capina (HOJE)                                    │
│         Clica em [✅ JÁ FIZ]                              │
│   ↓                                                        │
│ 12:32 - App mostra animação de sucesso + som              │
│         Checklist atualiza: ✅ Capina (Concluída)         │
│   ↓                                                        │
│ 14:00 - Começa a chover (como previsto)                   │
│   ↓                                                        │
│ 14:05 - Recebe SMS:                                        │
│         "🌧️ LuraFarm: Choveu 35mm. Adube amanhã cedo."    │
│   ↓                                                        │
│ 18:00 - Janta e descansa                                  │
│   ↓                                                        │
│ 19:00 - Abre app para ver resumo do dia                   │
│   ↓                                                        │
│ 19:02 - Dashboard mostra:                                 │
│         "Saúde: 87% 🟢"                                    │
│         "Colheita em 42 dias"                             │
│         "Gasto hoje: 0 MT (sem custos)"                   │
│   ↓                                                        │
│ 19:05 - Fecha app satisfeito                              │
│                                                            │
│ RESULTADO: João usou o app 5x no dia, sempre <1 min/uso   │
│            Sem digitar nada. Apenas toque e voz.           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Métricas de Engajamento Esperadas:**
- **DAU (Daily Active Users):** 70% dos usuários com projeto ativo.
- **Sessões por dia:** 3-5 (cada sessão <2 min).
- **Retenção D7:** 60% (vs 20% média de apps agrícolas).
- **NPS (Net Promoter Score):** 70+ (pois resolve problemas reais).

---

## 🎨 MOCKUPS DE REFERÊNCIA (Wireframes de Baixa Fidelidade)

### Tela Home (Dia de Hoje)
```
┌─────────────────────────────────────────┐
│ 🏠 Dia de Hoje                          │
├─────────────────────────────────────────┤
│                                         │
│ Bom dia, João! 👋                      │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ ☀️  28°C - SOL                   │   │
│ │ Bom dia para trabalhar!           │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ ⚠️  ALERTA                        │   │
│ │ Lagarta a 2km. Monitore hoje!    │   │
│ │ [Ver Mapa]                        │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Tarefas de Hoje:                        │
│ ☐ Adubar Milho Norte                    │
│ ☐ Capina (atrasado 2d) 🔴              │
│ ✅ Inspeção feita                       │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ Sua safra: 85% saudável 🟢       │   │
│ │ Colheita em 45 dias               │   │
│ └───────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ 🏠  🌾  💬  💰  ← Bottom Nav            │
└─────────────────────────────────────────┘
```

---

## 📊 MÉTRICAS DE SUCESSO & KPIS

### Fase MVP (Primeiros 3 Meses)
- **100 usuários cadastrados** (Moçambique + Amigos/Família)
- **20 projetos criados** (agricultura real)
- **500 mensagens no chat Lura** (engajamento IA)
- **5 assinaturas Pro pagas** (R$ 245 MRR)
- **Retenção D30:** 40%

### Fase Crescimento (Meses 4-12)
- **2.000 usuários ativos**
- **500 projetos em andamento**
- **50 assinaturas Pro+** (R$ 6.450 MRR)
- **20 vendas via marketplace** (R$ 200k GMV)
- **Retenção D30:** 60%

### Fase Escala (Ano 2)
- **10.000 usuários** (expansão regional)
- **ARR:** R$ 1.5M+
- **Parcerias:** 3 cooperativas integradas
- **Novo mercado:** Zambia/Malawi

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **Esta Semana:** Implementar Bottom Navigation + PWA Config
2. ✅ **Próximas 2 Semanas:** Dashboard Dinâmico (Models + UI)
3. ✅ **Mês 1:** Wizard de Novo Projeto + Alertas SMS
4. ✅ **Mês 2:** Marketplace MVP + Assinaturas
5. ✅ **Mês 3:** Testes de Campo + Launch 🎉

---

**Status:** Pronto para Execução 🟢  
**Primeiro Sprint:** FASE 1 - Navegação & PWA  
**Próxima Decisão Crítica:** Escolher gateway de pagamento (Stripe vs M-Pesa)
