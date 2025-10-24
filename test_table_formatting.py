#!/usr/bin/env python3
"""
Teste de formatação de tabelas markdown
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from firebase.ai_service import _markdown_to_html

def test_table_formatting():
    """Testa formatação de tabelas markdown"""
    
    print("=" * 80)
    print("TESTE DE FORMATAÇÃO DE TABELAS MARKDOWN")
    print("=" * 80)
    
    # Exemplo de tabela da agricultura
    table_text = """Faça uma tabela simples no seu caderno para cada produto da lista:

| Critério de Análise | Produto A (Ex: Tomate) | Produto B (Ex: Couve) | Produto C (Ex: Gergelim) |
| :--- | :--- | :--- | :--- |
| Precisa de muita água? | Sim, muita. Precisa de rega. | Sim, precisa de rega regular. | Não, é muito tolerante à seca. |
| Precisa de solo rico/adubo? | Sim, é muito exigente. | Sim, gosta de composto e estrume. | Não, produz bem em solos mais fracos. |
| É sensível a pragas/doenças?| Sim, muito! Alto risco. | Médio risco, atacado por pulgões. | Baixo risco, muito resistente. |
| Precisa de muito trabalho? | Sim, mondas, tutoragem, pulverização. | Sim, rega diária e colheita regular. | Não, só na sementeira e colheita. |
| Quanto tempo até à colheita?| Rápido (3-4 meses). | Rápido (2-3 meses). | Médio (4-5 meses). |
| Posso guardar a colheita? | Não, estraga-se muito rápido. | Não, tem de ser vendida fresca. | Sim, pode ser guardado por meses. |

Esta tabela vai ajudar a comparar facilmente os três produtos."""
    
    print("\n📝 Input (Tabela Markdown):")
    print(table_text[:200] + "...\n")
    
    # Converter para HTML
    html = _markdown_to_html(table_text)
    
    print("✅ Output (HTML Gerado):")
    print(html)
    print("\n" + "=" * 80)
    
    # Validações
    validations = []
    
    if '<table>' in html:
        validations.append("✅ Tag <table> encontrada")
    else:
        validations.append("❌ Tag <table> não encontrada")
    
    if '<thead>' in html:
        validations.append("✅ Tag <thead> encontrada (cabeçalhos)")
    else:
        validations.append("❌ Tag <thead> não encontrada")
    
    if '<tbody>' in html:
        validations.append("✅ Tag <tbody> encontrada (dados)")
    else:
        validations.append("❌ Tag <tbody> não encontrada")
    
    if '<th>' in html:
        validations.append("✅ Tags <th> encontradas (células de cabeçalho)")
    else:
        validations.append("❌ Tags <th> não encontradas")
    
    if '<td>' in html:
        validations.append("✅ Tags <td> encontradas (células de dados)")
    else:
        validations.append("❌ Tags <td> não encontradas")
    
    if html.count('<th>') >= 4:
        validations.append(f"✅ Múltiplas colunas detectadas ({html.count('<th>')} cabeçalhos)")
    else:
        validations.append("⚠️  Poucas colunas detectadas")
    
    if html.count('<tr>') >= 7:
        validations.append(f"✅ Múltiplas linhas detectadas ({html.count('<tr>')} linhas)")
    else:
        validations.append("⚠️  Poucas linhas detectadas")
    
    if 'table-wrapper' in html:
        validations.append("✅ Wrapper para scroll horizontal presente")
    else:
        validations.append("❌ Wrapper para scroll horizontal ausente")
    
    print("VALIDAÇÕES:")
    print("=" * 80)
    for v in validations:
        print(v)
    
    print("\n" + "=" * 80)
    print("RESULTADO FINAL:")
    print("=" * 80)
    
    success_count = sum(1 for v in validations if v.startswith("✅"))
    total = len(validations)
    
    if success_count == total:
        print(f"🎉 PERFEITO! {success_count}/{total} validações passaram!")
        print("✅ Tabelas markdown estão sendo convertidas corretamente para HTML")
        print("✅ Pronto para renderizar no frontend com estilos CSS")
        return 0
    elif success_count >= total * 0.7:
        print(f"✅ BOM! {success_count}/{total} validações passaram")
        print("⚠️  Algumas melhorias podem ser necessárias")
        return 0
    else:
        print(f"❌ FALHOU! Apenas {success_count}/{total} validações passaram")
        return 1

if __name__ == '__main__':
    exit(test_table_formatting())
