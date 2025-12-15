# 🎨 LuraFarm: Identidade Visual & UI System (Mobile-First PWA)
**Data:** 02 de Dezembro de 2025
**Contexto:** Web App com "alma" de Aplicativo Nativo (APK)
**Público:** Agricultores (Uso Outdoor, Baixa Literacia Digital)

---

## 1. 📱 Conceito: "Web App com Sentimento de APK"

Como o projeto é um site (Next.js) mas o uso será predominantemente mobile e em campo, adotaremos a arquitetura **PWA (Progressive Web App)**.

**O que isso significa na prática?**
*   **Sem barra de URL visível:** O site roda em tela cheia (standalone mode).
*   **Navegação de App:** Abas inferiores fixas (Bottom Navigation) em vez de menus de topo.
*   **Toque > Clique:** Botões grandes (48px+) para dedos, não ponteiros de mouse.
*   **Offline-Ready:** Interface carrega mesmo sem internet (esqueletos/cache).

---

## 2. 🎨 Paleta de Cores (Biophilic & High Contrast)

A paleta já existente no código (`globals.css`) é excelente, mas vamos padronizar o uso para garantir **legibilidade sob o sol forte**.

### Cores Primárias (Identidade)
*   **🟢 Lura Jade (Primary):** `#00A86B`
    *   *Uso:* Botões principais (FAB), Cabeçalhos ativos, Ícones de sucesso.
    *   *Significado:* Crescimento, Tecnologia, Esperança.
*   **🟡 Colheita Gold (Accent):** `#F2C94C`
    *   *Uso:* Destaques, Alertas de atenção, Botões secundários, "Dinheiro".
    *   *Significado:* Sol, Milho maduro, Riqueza.

### Cores Funcionais (Interface)
*   **🌑 Night Soil (Background Dark):** `#0F2027` a `#1B2735` (Gradiente)
    *   *Uso:* Fundo principal (reduz brilho excessivo nos olhos à noite/sombra).
*   **☁️ Cloud White (Texto/Ícones):** `#FFFFFF` e `#E0E0E0`
    *   *Uso:* Texto sobre fundos escuros. Contraste máximo.
*   **🔴 Alert Red:** `#EF4444`
    *   *Uso:* Pragas críticas, Erro, Prejuízo.

### ☀️ Modo Outdoor (Alto Contraste)
*   *Recomendação:* Criar um toggle rápido "Modo Sol" que inverte o fundo escuro para **Branco Papel (#F9FAFB)** com texto **Preto Puro (#000000)** para leitura sob sol do meio-dia.

---

## 3. 🔤 Tipografia (Legibilidade Extrema)

O código atual usa `Inter`, `Poppins` e `Manrope`. Vamos unificar para **Manrope** ou **Inter** por serem modernas e extremamente legíveis em telas pequenas.

### Fonte Principal: **Manrope** (Google Fonts)
*   **Por que?** É uma fonte geométrica mas humanista. Os números são muito claros (ótimo para preços e dados).
*   **Pesos:**
    *   **Bold (700):** Títulos e Botões.
    *   **Medium (500):** Texto corrido.
    *   *Evitar Light/Thin:* Difícil de ler em movimento.

### Escala Tipográfica (Mobile Base)
*   **H1 (Títulos de Tela):** 24px (Bold)
*   **H2 (Subtítulos/Cards):** 20px (Bold)
*   **Body (Texto):** 16px (Regular) - *Nunca menor que 16px para evitar zoom indesejado.*
*   **Label (Legendas):** 14px (Medium) - *Uso mínimo.*

---

## 4. 🧩 Componentes de Interface (UI Kit)

### A. Navegação (Bottom Tab Bar)
Em vez de menu hambúrguer no topo, use uma barra fixa embaixo.
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 64px;
  background: #1B2735;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #00A86B;
  z-index: 1000;
}
```
*   **Ícones:** Casa (Início), Planta (Campos), Microfone (Lura), Cifrão (Negócios).
*   **Estado Ativo:** Ícone Verde + Texto Branco.
*   **Estado Inativo:** Ícone Cinza.

### B. Botão de Ação Principal (FAB - Floating Action Button)
O botão de "Falar com Lura" deve "flutuar" no centro da barra inferior, rompendo a linha.
```css
.fab-mic {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00A86B, #3BB273);
  position: absolute;
  bottom: 24px; /* Sobe acima da barra */
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 15px rgba(0, 168, 107, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid #0F2027; /* Cria espaço visual */
}
```

### C. Cards (Cartões de Informação)
Evite tabelas complexas no mobile. Use Cards.
*   **Estilo:** Fundo semi-transparente (Glassmorphism leve) ou Sólido Escuro.
*   **Borda:** Arredondada (Border-radius: 16px).
*   **Conteúdo:** Ícone à esquerda, Título em cima, Dado importante grande à direita.

### D. Inputs (Entrada de Dados)
*   **Altura:** Mínimo 56px (fácil de acertar com dedo grosso).
*   **Label:** Sempre visível (não usar só placeholder).
*   **Botão de Voz:** Todo input de texto deve ter um ícone de microfone dentro, à direita.

---

## 5. 📱 Adaptação Responsiva (PWA)

### Mobile (Default)
*   Layout de coluna única.
*   Scroll vertical infinito.
*   Bottom Navigation visível.

### Desktop / Tablet (Extensionistas)
*   Layout de Dashboard (Grid).
*   Bottom Navigation vira **Sidebar Lateral Esquerda**.
*   Cards se expandem para ocupar a tela.
*   Tabelas completas (DataGrids) aparecem aqui.

---

## 6. 🚀 Checklist de Implementação Técnica

1.  **Manifest.json:** Configurar nome, ícones e `display: standalone` para permitir instalação na Home Screen.
2.  **Meta Viewport:** Garantir `user-scalable=no` (com cuidado) ou design que não quebre com zoom.
3.  **Touch Targets:** Garantir que nenhum botão clicável tenha menos de 44x44px.
4.  **Fontes:** Importar `Manrope` no `layout.tsx`.
5.  **Ícones:** Usar biblioteca `Lucide-React` ou `Phosphor Icons` (versão Bold/Fill para melhor visibilidade).

---

**Resumo:** O site será construído como um aplicativo nativo. O agricultor não sentirá que está "navegando na web", mas sim "usando a ferramenta Lura".
