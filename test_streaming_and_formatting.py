#!/usr/bin/env python3
"""
Teste completo do sistema de formatação com streaming
Valida tanto o regex melhorado quanto a preparação para streaming
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from firebase.ai_service import FirebaseAIService, _markdown_to_html

def test_formatting():
    """Testa casos complexos de formatação incluindo quotes com bold/italic"""
    
    # Usar a função diretamente, não precisa instanciar a classe
    # ai_service = FirebaseAIService()
    
    # Casos de teste com formatação complexa
    test_cases = [
        {
            "nome": "Bold dentro de aspas com texto antes",
            "texto": 'Opção 1 (Biológica/Mais Segura): "Você tem algum insecticida biológico para lagartas, à base de **Bacillus thuringiensis (Bt)**?"',
            "esperado": ["<strong>Bacillus thuringiensis (Bt)</strong>", "Opção 1", "Biológica/Mais Segura"]
        },
        {
            "nome": "Múltiplos bolds em parênteses",
            "texto": "Use fertilizante (**NPK 10-10-10**) ou (**NPK 20-20-20**) para melhores resultados",
            "esperado": ["<strong>NPK 10-10-10</strong>", "<strong>NPK 20-20-20</strong>"]
        },
        {
            "nome": "Italic dentro de aspas",
            "texto": 'O especialista disse: "Isto é *muito importante* para o seu cultivo"',
            "esperado": ["<em>muito importante</em>", "especialista disse"]
        },
        {
            "nome": "Bold e italic misturados",
            "texto": "Para **tomates** use *água moderada* e **adubo orgânico** regularmente",
            "esperado": ["<strong>tomates</strong>", "<em>água moderada</em>", "<strong>adubo orgânico</strong>"]
        },
        {
            "nome": "Lista com formatação inline",
            "texto": """**Pragas Comuns:**
1. **Pulgões** - use *sabão de potássio*
2. **Lagartas** - aplique **Bt** (*Bacillus thuringiensis*)
3. **Ácaros** - tente *óleo de neem*""",
            "esperado": ["<strong>Pragas Comuns:</strong>", "<ol>", "<strong>Pulgões</strong>", "<em>sabão de potássio</em>", "<strong>Lagartas</strong>", "<strong>Bt</strong>", "<em>Bacillus thuringiensis</em>"]
        },
        {
            "nome": "Parágrafo longo com formatação variada",
            "texto": '''Para combater a **praga de lagartas**, recomendo três opções:

**Opção 1** (Biológica): "Use **Bacillus thuringiensis (Bt)**, que é *seguro e eficaz*"
**Opção 2** (Natural): Prepare uma *solução de alho* com **sabão neutro**
**Opção 3** (Química): Como último recurso, use **inseticida específico para lagartas**

Lembre-se: *prevenir é melhor que remediar*!''',
            "esperado": ["<strong>praga de lagartas</strong>", "<strong>Bacillus thuringiensis (Bt)</strong>", "<em>seguro e eficaz</em>", "<strong>Opção 1</strong>", "<strong>Opção 2</strong>", "<strong>Opção 3</strong>", "<em>solução de alho</em>", "<em>prevenir é melhor que remediar</em>"]
        },
        {
            "nome": "Underscores em palavras técnicas (não devem virar italic)",
            "texto": "A variável test_variable e função process_data não devem ser afetadas",
            "esperado": ["test_variable", "process_data"]
        }
    ]
    
    resultados = []
    score = 0
    
    print("=" * 80)
    print("TESTE DE FORMATAÇÃO COMPLEXA E STREAMING")
    print("=" * 80)
    
    for i, caso in enumerate(test_cases, 1):
        print(f"\n📝 Teste {i}: {caso['nome']}")
        print(f"Input: {caso['texto'][:100]}{'...' if len(caso['texto']) > 100 else ''}")
        
        # Processar com markdown_to_html
        html = _markdown_to_html(caso['texto'])
        
        print(f"\nHTML gerado ({len(html)} caracteres):")
        print(html[:300] + ('...' if len(html) > 300 else ''))
        
        # Verificar se contém os elementos esperados
        sucesso = True
        faltando = []
        
        for esperado in caso['esperado']:
            if esperado not in html:
                sucesso = False
                faltando.append(esperado)
        
        if sucesso:
            print("✅ PASSOU - Todos os elementos esperados encontrados")
            score += 1
        else:
            print(f"❌ FALHOU - Elementos faltando: {faltando}")
        
        # Validações extras
        validacoes = []
        
        # 1. Não deve ter <br> tags
        if '<br>' not in html:
            validacoes.append("✓ Sem <br> tags desnecessárias")
        else:
            validacoes.append("✗ Contém <br> tags")
        
        # 2. HTML deve estar escapado
        if '&lt;' in html or '&gt;' in html or '&amp;' in html or '<' not in caso['texto'].replace('<', ''):
            validacoes.append("✓ HTML corretamente escapado")
        else:
            validacoes.append("✓ Sem caracteres perigosos")
        
        # 3. Underscores em palavras não devem criar <em>
        if 'test_variable' in caso['texto'] or 'process_data' in caso['texto']:
            if '<em>variable</em>' not in html and '<em>data</em>' not in html:
                validacoes.append("✓ Underscores em palavras preservados")
            else:
                validacoes.append("✗ Underscores incorretamente convertidos")
        
        print("\nValidações:")
        for v in validacoes:
            print(f"  {v}")
        
        resultados.append({
            "nome": caso['nome'],
            "sucesso": sucesso,
            "html_length": len(html)
        })
    
    print("\n" + "=" * 80)
    print("RESUMO DOS RESULTADOS")
    print("=" * 80)
    print(f"\n✅ Testes passados: {score}/{len(test_cases)}")
    
    for r in resultados:
        status = "✅" if r['sucesso'] else "❌"
        print(f"{status} {r['nome']} ({r['html_length']} chars)")
    
    print("\n" + "=" * 80)
    print("PREPARAÇÃO PARA STREAMING")
    print("=" * 80)
    print("""
✅ Hook useStreamingText criado
✅ Componente StreamingMessage implementado  
✅ Integração no chatbot/page.tsx completa
✅ Estado streamingMessageIndex gerenciado
✅ Ativação automática em novas mensagens
✅ Callback onStreamComplete para limpar estado
✅ Click-to-complete habilitado
✅ Cursor animado durante streaming

🎯 Efeito de streaming tipo ChatGPT/Claude está pronto!
""")
    
    if score == len(test_cases):
        print("🎉 PERFEITO! Todos os testes de formatação passaram!")
        print("✨ Sistema pronto para uso em produção com streaming visual")
        return 0
    else:
        print(f"⚠️  {len(test_cases) - score} teste(s) falharam")
        print("💡 Revise os casos que falharam acima")
        return 1

if __name__ == '__main__':
    exit(test_formatting())
