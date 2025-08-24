#!/usr/bin/env python3
"""
Script de Teste para o Chatbot Agrícola Inteligente
Testa todas as funcionalidades implementadas do sistema AgroAlerta
"""

import requests
import json
import time

# Configurações
BASE_URL = "http://127.0.0.1:8000/api"

def testar_endpoint(endpoint, dados=None, metodo="GET"):
    """Testa um endpoint da API"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if metodo == "POST":
            response = requests.post(url, json=dados)
        else:
            response = requests.get(url, params=dados)
        
        print(f"✅ {metodo} {endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            resultado = response.json()
            print(f"Resposta: {json.dumps(resultado, indent=2, ensure_ascii=False)}")
        else:
            print(f"Erro: {response.text}")
        
        print("-" * 80)
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Erro ao testar {endpoint}: {e}")
        print("-" * 80)
        return False

def main():
    """Executa todos os testes do Chatbot Agrícola Inteligente"""
    
    print("🌱 TESTE DO CHATBOT AGRÍCOLA INTELIGENTE AGROALERTA 🌱")
    print("=" * 80)
    
    # 1. Teste de Recomendações Contextuais - Plantio
    print("\n1️⃣ TESTE: Recomendações para Plantio de Milho")
    testar_endpoint(
        "/recomendacoes/gerar-resposta/",
        {
            "pergunta": "Como plantar milho em Maputo durante a época chuvosa?",
            "contexto": {
                "localizacao": "Maputo",
                "epoca": "chuvosa",
                "cultura": "milho"
            }
        },
        "POST"
    )
    
    # 2. Teste de Recomendações - Pragas
    print("\n2️⃣ TESTE: Identificação e Controle de Pragas")
    testar_endpoint(
        "/recomendacoes/gerar-resposta/",
        {
            "pergunta": "Minhas plantas de tomate estão com manchas amarelas nas folhas. O que pode ser?",
            "contexto": {
                "cultura": "tomate",
                "sintomas": "manchas amarelas",
                "parte_afetada": "folhas"
            }
        },
        "POST"
    )
    
    # 3. Teste de Recomendações - Irrigação
    print("\n3️⃣ TESTE: Recomendações de Irrigação")
    testar_endpoint(
        "/recomendacoes/gerar-resposta/",
        {
            "pergunta": "Qual o melhor sistema de irrigação para feijão em Gaza?",
            "contexto": {
                "localizacao": "Gaza",
                "cultura": "feijão",
                "tipo": "irrigacao"
            }
        },
        "POST"
    )
    
    # 4. Teste de Recomendações - Fertilização
    print("\n4️⃣ TESTE: Recomendações de Fertilização")
    testar_endpoint(
        "/recomendacoes/gerar-resposta/",
        {
            "pergunta": "Que fertilizantes usar para aumentar a produção de amendoim?",
            "contexto": {
                "cultura": "amendoim",
                "objetivo": "aumento_producao"
            }
        },
        "POST"
    )
    
    # 5. Teste de Informações de Mercado
    print("\n5️⃣ TESTE: Informações de Mercado")
    testar_endpoint(
        "/recomendacoes/gerar-resposta/",
        {
            "pergunta": "Qual o melhor preço para vender mandioca em Nampula?",
            "contexto": {
                "localizacao": "Nampula",
                "cultura": "mandioca",
                "tipo": "mercado"
            }
        },
        "POST"
    )
    
    # 6. Teste de Alertas Inteligentes
    print("\n6️⃣ TESTE: Alertas Inteligentes")
    testar_endpoint(
        "/notificacoes/alertas-inteligentes/",
        {
            "localizacao": "Tete",
            "culturas": ["milho", "algodão"],
            "tipo_alertas": ["clima", "pragas", "mercado"]
        },
        "POST"
    )
    
    # 7. Teste de Questões Contextuais
    print("\n7️⃣ TESTE: Questões Contextuais Automáticas")
    testar_endpoint(
        "/recomendacoes/gerar-resposta/",
        {
            "pergunta": "Quero começar a plantar",
            "contexto": {
                "localizacao": "Inhambane"
            }
        },
        "POST"
    )
    
    print("\n🎉 TESTES CONCLUÍDOS!")
    print("Verifique os resultados acima para confirmar que o Chatbot Agrícola Inteligente está funcionando corretamente.")

if __name__ == "__main__":
    main()
