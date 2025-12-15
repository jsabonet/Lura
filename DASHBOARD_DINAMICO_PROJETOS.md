# 🚜 LuraFarm: Dashboard Dinâmico de Acompanhamento de Projetos
**Data:** 02 de Dezembro de 2025
**Status:** Proposta de Evolução de Feature (Core Product)
**Objetivo:** Transformar o "Gerador de Projetos" de um PDF estático para um Sistema Operacional Agrícola Vivo.

---

## 1. 🎯 Conceito & Visão

### A Evolução: Do Papel para o Digital Vivo
Atualmente, a ideia era gerar um PDF estático com o plano de safra. Embora útil, o papel vai para a gaveta e o agricultor esquece.
**A Nova Proposta:** Um **Dashboard Interativo** que acompanha o agricultor dia-a-dia, servindo como o "cérebro" da operação agrícola.

**Diferença Chave:**
*   **Antes (PDF):** "Aqui está o plano, boa sorte." (Transacional)
*   **Agora (Dashboard):** "Vamos executar este plano juntos, passo a passo." (Relacional/Contínuo)

---

## 2. 📱 Arquitetura do Dashboard (Visão Geral)

O Dashboard é o hub central onde o agricultor gerencia sua safra. Ele é composto por **8 Módulos Integrados**:

1.  **📊 Central de Comando (Overview):** Status, progresso e próximas ações.
2.  **📝 Diário de Campo Digital:** Registro de atividades, fotos e notas de voz.
3.  **🖼️ Galeria Evolutiva:** Timeline visual do crescimento da planta.
4.  **💰 Gestão Financeira:** Controle de custos (orçado vs realizado) em tempo real.
5.  **🔔 Alertas Inteligentes:** Avisos proativos de clima, pragas e mercado.
6.  **📈 Benchmarking:** Comparação de performance com a região.
7.  **💬 Assistente Lura (IA):** Chat contextualizado com os dados do projeto.
8.  **📥 Central de Relatórios:** Exportação de dados e certificados.

---

## 3. 🛠️ Detalhamento Funcional dos Módulos

### 3.1. 📊 Central de Comando (A Tela Principal)
O "Home" do projeto. Focado em responder: "Como estou?" e "O que devo fazer hoje?".

**Funcionalidades:**
*   **Barra de Progresso da Safra:** Visualização clara da fase atual (Plantio, Vegetativo, Maturação, Colheita).
*   **Checklist Inteligente:** Tarefas geradas pela IA baseadas no plano original e ajustadas pelo clima/atrasos reais.
*   **Resumo de Saúde:** Score de 0-100 da saúde da lavoura baseado nos inputs recentes.

**Wireframe Conceitual:**
```text
PROJETO: Milho Talhão Norte 2026
Status: 🟢 EM PROGRESSO (38%) | Colheita: 20 Jan (102 dias restantes)

[ FASE 1: PLANTIO ✅ ] ── [ FASE 2: DESENVOLVIMENTO (Atual) ] ── [ FASE 3... ]

🎯 PRÓXIMAS AÇÕES (Checklist):
☐ [HOJE] Aplicar adubação nitrogenada (Recomendação IA: Clima favorável)
☐ [EM 3 DIAS] Capina manual (Marco 2 do projeto)
☐ [ATRASADO] Monitoramento de pragas semanal
```

### 3.2. 📝 Diário de Campo Digital
A ferramenta de input diário. Deve ser extremamente fácil de usar (mobile-first).

**Funcionalidades:**
*   **Input Multimodal:** Texto, Voz (transcrito por IA) e Fotos.
*   **Categorização Automática:** A IA detecta se é "Adubação", "Praga" ou "Clima" pelo texto/foto.
*   **Timeline:** Histórico cronológico de tudo que aconteceu no campo.

**Wireframe Conceitual:**
```text
[ + NOVA ATIVIDADE ]
Tipo: [ Adubação ]
Descrição: "Apliquei 50kg de Uréia hoje cedo."
Custo: R$ 180,00
Fotos: [ 📸 Foto_Saco.jpg ] [ 📸 Foto_Campo.jpg ]
🎙️ [ Gravar Nota de Voz ]

HISTÓRICO RECENTE:
• Ontem: Chuva forte (40mm)
• 28/11: Capina manual (R$ 120,00)
```

### 3.3. 🖼️ Galeria Evolutiva (Visão Computacional)
Transforma fotos aleatórias em dados agronômicos.

**Funcionalidades:**
*   **Timeline Visual:** Slider "Antes e Depois" para ver o crescimento.
*   **Análise de IA:** Ao subir uma foto, a IA analisa:
    *   Altura estimada da planta.
    *   Coloração (Deficiência nutricional?).
    *   Sintomas visíveis de pragas/doenças.
*   **Gráfico de Crescimento:** Curva real vs Curva ideal da cultura.

### 3.4. 💰 Gestão Financeira (Custos)
Controle financeiro simplificado para quem não é contador.

**Funcionalidades:**
*   **Orçado vs Realizado:** Compara o gasto atual com o que foi previsto no Gerador de Projetos.
*   **Categorias:** Insumos, Mão de obra, Maquinário, Outros.
*   **Custo de Produção:** Cálculo automático do custo por hectare e custo por kg (estimado).

**Wireframe Conceitual:**
```text
💰 GASTOS TOTAIS: R$ 12.500 (94% do Orçamento)
Status: ✅ DENTRO DA META

DETALHE:
🌱 Insumos:     R$ 7.200 (54%)
👥 Mão de Obra: R$ 3.200 (24%)
🚜 Máquinas:    R$ 1.800 (14%)

[ + Adicionar Despesa ] [ 🧾 Escanear Nota Fiscal ]
```

### 3.5. 🔔 Alertas Inteligentes (Proativos)
O sistema "cuida" do agricultor, avisando antes dos problemas acontecerem.

**Tipos de Alerta:**
*   **Climáticos:** "Chuva forte amanhã, não aplique adubo hoje."
*   **Fitossanitários:** "Alerta de Lagarta do Cartucho na sua região (3km). Monitore hoje!"
*   **Mercado:** "Preço do milho subiu 8%. Considere vender contratos futuros."
*   **Operacionais:** "Você está 5 dias atrasado na adubação de cobertura."

### 3.6. 📈 Benchmarking (Comparativo)
Gamificação e contexto regional.

**Funcionalidades:**
*   **Eu vs Região:** "Sua produtividade estimada está 15% acima da média de Maputo."
*   **Ranking:** "Você está no Top 25% dos produtores mais eficientes em custo."
*   **Dicas de Otimização:** Baseado no que os melhores estão fazendo.

---

## 4. 🏗️ Arquitetura Técnica Proposta

### Modelo de Dados (Backend Django)

```python
class ProjectDashboard(models.Model):
    """O objeto central que conecta tudo"""
    project = ForeignKey(Project)
    user = ForeignKey(User)
    status = CharField(choices=['planning', 'active', 'harvested', 'sold'])
    current_phase = CharField()
    progress_percent = IntegerField()
    health_score = FloatField() # 0-100 calculado pela IA
    
class FieldActivity(models.Model):
    """Cada entrada no diário"""
    dashboard = ForeignKey(ProjectDashboard)
    activity_type = CharField(choices=['input', 'labor', 'harvest', 'scouting'])
    description = TextField()
    cost = DecimalField()
    date = DateField()
    voice_note = FileField(null=True) # Audio original
    
class FieldPhoto(models.Model):
    """Fotos com metadados de IA"""
    activity = ForeignKey(FieldActivity)
    image = ImageField()
    ai_analysis_json = JSONField() # Resultado da visão computacional (altura, pragas, etc)
    gps_coords = PointField()
```

### Integração IA (Gemini 1.5 Flash)

*   **Análise de Imagem:** Endpoint que recebe a foto do campo e retorna JSON com `plant_height`, `health_status`, `pest_probability`.
*   **Chat Contextual:** O prompt do chat recebe o JSON do `ProjectDashboard` como contexto. O Lura sabe que "o milho está com 45 dias" sem o usuário precisar falar.

---

## 5. 🔄 Jornada do Usuário (Fluxo Diário)

1.  **Manhã:** Agricultor recebe SMS/Push: "Bom dia! Previsão de sol. Ótimo dia para a capina planejada."
2.  **No Campo:** Ele vê uma folha amarelada. Abre o App ➝ Diário ➝ Tira Foto.
3.  **Processamento:** IA analisa a foto em segundos: "Possível deficiência de Nitrogênio detectada."
4.  **Ação:** App sugere: "Adicionar Uréia na próxima aplicação? [Sim/Não]".
5.  **Registro:** Ele confirma. O sistema adiciona a tarefa no checklist e atualiza a previsão de custos.
6.  **Noite:** Ele olha o Dashboard. "Saúde: 92%". "Custo: Dentro da meta". Dorme tranquilo.

---

## 6. 💎 Valor Estratégico para LuraFarm

| Aspecto | Modelo Antigo (PDF) | Modelo Novo (Dashboard) |
| :--- | :--- | :--- |
| **Retenção** | Baixa (Usa 1x no início) | **Altíssima** (Usa diariamente) |
| **Dados** | Estáticos e teóricos | **Reais e valiosos** (Big Data Agrícola) |
| **Monetização** | Venda única ou assinatura frágil | **Assinatura robusta** (SaaS indispensável) |
| **Barreira de Saída** | Baixa (Só um arquivo) | **Alta** (Todo o histórico e gestão está lá) |
| **Upsell** | Difícil | **Fácil** (Vender insumo quando o estoque acaba no app) |

---

## 7. ✅ Próximos Passos Recomendados

1.  **Backend:** Criar os modelos `ProjectDashboard` e `FieldActivity`.
2.  **IA:** Desenvolver o prompt de visão computacional para análise de saúde de plantas (Milho/Tomate inicial).
3.  **Frontend:** Criar a tela "Central de Comando" (Mobile First).
4.  **Integração:** Conectar o fluxo de criação de projeto para gerar automaticamente o Dashboard inicial.
