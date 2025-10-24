#!/usr/bin/env python3
"""
Script de teste para validar a conversão Markdown → HTML
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from firebase.ai_service import _markdown_to_html

# Exemplo de texto com markdown completo
markdown_test = """
# Cultivo de Milho em Moçambique

## 1. Preparação do Solo

O solo deve ser bem preparado antes do plantio. **Importante**: verificar pH entre 5.5 e 7.0.

### Passos necessários:

1. Limpeza do terreno
2. Aração profunda (20-30 cm)
3. Aplicação de calcário se necessário
4. Nivelamento do solo

## 2. Época de Plantio

*A melhor época* é no início das chuvas (outubro-novembro).

> **Dica Importante**: Aguarde as primeiras chuvas para garantir germinação adequada.

## 3. Variedades Recomendadas

- Variedade precoce: `ZM 309`
- Variedade média: `ZM 521`
- Variedade tardia: `ZM 623`

### Características

- **Resistência**: às principais pragas
- **Produtividade**: 4-6 ton/ha
- **Ciclo**: 90-120 dias

---

## Código de Exemplo

```python
def calcular_espacamento(area, densidade):
    # Densidade recomendada: 50.000 plantas/ha
    return area * densidade / 10000
```

Para mais informações, visite [FAO Mozambique](https://www.fao.org/mozambique).

~~Texto riscado para demonstração~~
"""

if __name__ == '__main__':
    print("=" * 80)
    print("TESTE DE CONVERSÃO MARKDOWN → HTML")
    print("=" * 80)
    print("\n📝 MARKDOWN INPUT:\n")
    print(markdown_test)
    print("\n" + "=" * 80)
    print("🎨 HTML OUTPUT:\n")
    
    html_output = _markdown_to_html(markdown_test)
    print(html_output)
    
    print("\n" + "=" * 80)
    print("✅ CONVERSÃO COMPLETA!")
    print("=" * 80)
    
    # Verificar elementos essenciais
    checks = {
        'Cabeçalhos': '<h1>' in html_output and '<h2>' in html_output,
        'Negrito': '<strong>' in html_output,
        'Itálico': '<em>' in html_output,
        'Listas numeradas': '<ol>' in html_output,
        'Listas não-numeradas': '<ul>' in html_output,
        'Código inline': '<code>' in html_output,
        'Blocos de código': '<pre class="code-block">' in html_output,
        'Citações': '<blockquote>' in html_output,
        'Links': '<a href=' in html_output,
        'Linha horizontal': '<hr>' in html_output,
        'Tachado': '<del>' in html_output,
    }
    
    print("\n📊 VERIFICAÇÃO DE ELEMENTOS:\n")
    for elemento, presente in checks.items():
        status = "✅" if presente else "❌"
        print(f"{status} {elemento}")
    
    total = len(checks)
    passed = sum(checks.values())
    print(f"\n🎯 Score: {passed}/{total} elementos detectados")
    
    if passed == total:
        print("🎉 PERFEITO! Todas as formatações foram convertidas corretamente!")
    elif passed > total * 0.8:
        print("✅ MUITO BOM! Maioria das formatações funcionando.")
    else:
        print("⚠️ ATENÇÃO: Algumas formatações não foram detectadas.")
