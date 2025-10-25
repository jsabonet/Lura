# 🔍 GUIA DE DEBUG - PROBLEMA DE SALVAMENTO DE CONVERSAS

## 🎯 SITUAÇÃO
- Backend 100% funcional (teste automático salvou conversa ID 15 com sucesso)
- Usuário consegue conversar com a IA (logo está autenticado)
- MAS as conversas não estão sendo salvas no banco de dados

## 📋 PASSO A PASSO PARA DIAGNOSTICAR

### **PASSO 1: Iniciar Monitor do Backend** (Terminal 1)

```powershell
cd d:\Projectos\Lura
python monitor_backend_realtime.py
```

Este monitor mostrará **em tempo real** quando:
- ✅ Uma nova conversa é criada no banco
- ✅ Uma nova mensagem é salva no banco
- ❌ Nada acontece (indica que frontend não está enviando dados)

Deixe este terminal aberto e visível!

---

### **PASSO 2: Abrir Página de Debug do Frontend**

1. Abra no navegador: `d:\Projectos\Lura\debug_chatbot_requests.html`
2. Esta página interceptará TODAS as requisições feitas pelo frontend
3. Deixe a página aberta em uma aba separada

---

### **PASSO 3: Fazer Login no Sistema**

1. Vá para: `http://localhost:3000/login`
2. Use as credenciais:
   - **Usuário**: `joelantonio`
   - **Senha**: `testpass123`
3. Após login, vá para: `http://localhost:3000/chatbot`

---

### **PASSO 4: Abrir Console do Navegador (F12)**

Pressione `F12` e vá na aba **Console**. Você deve ver logs como:
```
🔄 [LOAD] Iniciando carregamento de conversas...
📡 [LOAD] Fazendo requisição GET /ai/conversations/
📊 [LOAD] Status: 200
✅ [LOAD] Recebidas X conversas do backend
```

---

### **PASSO 5: Fazer uma Conversa com a IA**

1. Digite: "Olá! Como plantar milho?"
2. Envie a mensagem
3. **OBSERVE ATENTAMENTE** os 3 lugares:

#### A) Console do Navegador (F12)
Deve aparecer:
```
🚀 [SUBMIT] Enviando mensagem na conversa X
💾 [SUBMIT] Salvando mensagem do usuário...
📡 [SAVE] POST /ai/conversations/X/add_message/
📊 [SAVE] Status: 201
✅ [SUBMIT] Mensagem do usuário salva com ID Y
💾 [SUBMIT] Salvando resposta da IA...
📡 [SAVE] POST /ai/conversations/X/add_message/
📊 [SAVE] Status: 201
✅ [SUBMIT] Resposta da IA salva com ID Z
```

**SE NÃO APARECER ESSES LOGS**: O problema está no frontend!

#### B) Página de Debug (debug_chatbot_requests.html)
Deve mostrar:
- 📡 Requisições POST para `/ai/conversations/X/add_message/`
- ✅ Status 200 ou 201 (sucesso)
- 📤 Request Body com `role` e `content`
- 📥 Response com `id` da mensagem salva

**SE APARECER ERROS 4XX/5XX**: O problema está na comunicação!

#### C) Monitor do Backend (terminal)
Deve aparecer:
```
💾 [HH:MM:SS] NOVA MENSAGEM SALVA!
   ID: Y
   Conversa: #X - Nova Conversa
   Usuário: joelantonio
   Role: 👤 user
   Conteúdo: Olá! Como plantar milho?
```

**SE NÃO APARECER**: Backend não está recebendo as requisições!

---

## 🔍 CENÁRIOS POSSÍVEIS

### ✅ CENÁRIO 1: Tudo funciona (logs em todos os lugares)
- **Problema**: Conversas estão sendo salvas, mas não aparecem ao recarregar
- **Solução**: Verificar função `loadConversationsFromBackend`

### ❌ CENÁRIO 2: Logs no console, mas sem requisição na página de debug
- **Problema**: `fetch` não está sendo executado (talvez erro silencioso)
- **Solução**: Verificar try-catch em `saveMessageToBackend`

### ❌ CENÁRIO 3: Requisição enviada, mas erro 401 (não autenticado)
- **Problema**: Token expirado ou inválido
- **Solução**: Fazer logout e login novamente

### ❌ CENÁRIO 4: Requisição enviada, mas erro 404 (não encontrado)
- **Problema**: URL incorreta ou conversa não existe
- **Solução**: Verificar `ensureBackendConversation`

### ❌ CENÁRIO 5: Requisição enviada com sucesso (200/201), mas monitor do backend não detecta
- **Problema**: Requisição está indo para OUTRO backend (porta diferente?)
- **Solução**: Verificar variável `NEXT_PUBLIC_API_URL` em `.env.local`

### ❌ CENÁRIO 6: Nenhum log aparece no console
- **Problema**: Função `saveMessageToBackend` não está sendo chamada
- **Solução**: Verificar fluxo em `handleSubmitWithStreaming`

---

## 📊 ANÁLISE DOS LOGS

### **Logs esperados no Console:**

```javascript
// Ao enviar mensagem do usuário:
💾 [SAVE] Salvando mensagem user na conversa 15...
📝 [SAVE] Conteúdo: Olá! Como plantar milho?
📡 [SAVE] POST /ai/conversations/15/add_message/
📊 [SAVE] Status: 201
✅ [SAVE] Mensagem salva: ID 17

// Ao receber resposta da IA:
💾 [SAVE] Salvando mensagem assistant na conversa 15...
📝 [SAVE] Conteúdo: Olá! A melhor época para plantar milho...
📡 [SAVE] POST /ai/conversations/15/add_message/
📊 [SAVE] Status: 201
✅ [SAVE] Mensagem salva: ID 18
```

### **Se aparecer:**
```javascript
⚠️  [SAVE] Sem token, não salvando no backend
```
**PROBLEMA**: Não está autenticado (mas isso seria estranho porque consegue conversar)

### **Se aparecer:**
```javascript
❌ [SAVE] Erro: 404 - Not Found
```
**PROBLEMA**: Conversa não existe no backend

### **Se aparecer:**
```javascript
⚠️  [SUBMIT] Nenhuma conversa ativa para salvar mensagem
```
**PROBLEMA**: `ensureBackendConversation` retornou `null`

---

## 🎯 PONTOS DE VERIFICAÇÃO NO CÓDIGO

### 1. Verificar se `saveMessageToBackend` está sendo chamada:

Buscar em `page.tsx`:
- Linha ~550: `await saveMessageToBackend(ensuredConversationId, 'user', trimmedInput);`
- Linha ~685: `await saveMessageToBackend(ensuredConversationId, 'assistant', accumulatedText, finalHtml);`

### 2. Verificar se `ensureBackendConversation` retorna ID válido:

Deve retornar string numérica (ex: `"15"`, `"16"`)
NÃO deve retornar `null`, `undefined`, ou `"conv_..."` (ID local temporário)

### 3. Verificar estrutura dos dados enviados:

```json
{
  "role": "user",
  "content": "Olá! Como plantar milho?",
  "metadata": {}
}
```

**SE metadata estiver ausente ou for `undefined`**: PROBLEMA!

### 4. Verificar URL da API:

Abrir `.env.local` e verificar:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

NÃO deve ter barra final `/` depois de `api`!

---

## 🚀 PRÓXIMOS PASSOS

1. Execute o monitor do backend
2. Abra a página de debug
3. Faça login
4. Envie UMA mensagem
5. **TIRE PRINTS** de:
   - Console do navegador (F12)
   - Página de debug (debug_chatbot_requests.html)
   - Terminal do monitor
6. **ME ENVIE OS PRINTS** para análise detalhada!

---

## 💡 TESTE RÁPIDO

Se quiser testar se o problema é só no chatbot, execute:

```powershell
python simular_conversa_completa.py
```

Isso vai fazer uma conversa via API direta e confirmar que backend funciona.

---

**IMPORTANTE**: Não feche os monitores! Eles são essenciais para ver o que está acontecendo em tempo real! 🔍
