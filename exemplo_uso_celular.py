#!/usr/bin/env python3
"""
Exemplo de Uso - Sistema de Torres Celulares para AgroAlerta
============================================================

Este script demonstra como usar o sistema de leitura de torres celulares
em diferentes cenários práticos do AgroAlerta.
"""

import json
import time
import asyncio
from datetime import datetime
from modem_4g_reader import ModemATReader, CellTowerInfo, format_for_google_geolocation

class AgroAlertaCellService:
    """Serviço integrado para o AgroAlerta"""
    
    def __init__(self, modem_port='COM3', google_api_key=None):
        self.modem_port = modem_port
        self.google_api_key = google_api_key
        self.modem = None
    
    async def initialize(self):
        """Inicializa conexão com modem"""
        self.modem = ModemATReader(port=self.modem_port)
        if self.modem.connect():
            print(f"✅ Conectado ao modem na porta {self.modem_port}")
            return True
        else:
            print(f"❌ Falha ao conectar na porta {self.modem_port}")
            return False
    
    def get_location_data(self):
        """Coleta dados completos de localização"""
        if not self.modem:
            return None
        
        cell_info = self.modem.get_complete_cell_info()
        
        # Dados para logging e análise
        location_data = {
            'timestamp': cell_info.timestamp,
            'cell_tower': {
                'mcc': cell_info.mcc,
                'mnc': cell_info.mnc,
                'lac': cell_info.lac,
                'cid': cell_info.cid,
                'tac': cell_info.tac
            },
            'signal_quality': {
                'rssi': cell_info.rssi,
                'rsrp': cell_info.rsrp,
                'rsrq': cell_info.rsrq,
                'sinr': cell_info.sinr
            },
            'network_info': {
                'operator': cell_info.operator,
                'technology': cell_info.technology,
                'band': cell_info.band
            }
        }
        
        return location_data
    
    def get_coordinates_from_google(self, cell_info):
        """Obtém coordenadas usando Google Geolocation API"""
        if not self.google_api_key:
            print("⚠️ Google API key não configurada")
            return None
        
        import requests
        
        try:
            payload = format_for_google_geolocation(cell_info)
            url = f"https://www.googleapis.com/geolocation/v1/geolocate?key={self.google_api_key}"
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'latitude': data['location']['lat'],
                    'longitude': data['location']['lng'],
                    'accuracy': data.get('accuracy', 1000)
                }
            else:
                print(f"❌ Erro Google API: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Erro ao chamar Google API: {e}")
            return None
    
    def monitor_field_location(self, duration_minutes=60):
        """Monitora localização de campo por período determinado"""
        print(f"🌾 Monitorando localização de campo por {duration_minutes} minutos...")
        
        start_time = time.time()
        readings = []
        
        while (time.time() - start_time) < (duration_minutes * 60):
            try:
                # Coleta dados
                location_data = self.get_location_data()
                if location_data:
                    readings.append(location_data)
                    
                    # Log básico
                    signal_info = location_data['signal_quality']
                    network_info = location_data['network_info']
                    
                    print(f"📍 [{datetime.now().strftime('%H:%M:%S')}] "
                          f"Operadora: {network_info['operator']} "
                          f"| RSSI: {signal_info['rssi']}dBm "
                          f"| Tech: {network_info['technology']}")
                
                # Aguarda próxima leitura (5 minutos)
                time.sleep(300)
                
            except KeyboardInterrupt:
                print("\n⏹️ Monitoramento interrompido pelo usuário")
                break
            except Exception as e:
                print(f"❌ Erro durante monitoramento: {e}")
                time.sleep(60)  # Aguarda 1 minuto em caso de erro
        
        # Salva dados coletados
        if readings:
            filename = f"field_monitoring_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(filename, 'w') as f:
                json.dump(readings, f, indent=2)
            print(f"💾 {len(readings)} leituras salvas em {filename}")
        
        return readings

def simulate_agricultural_scenarios():
    """Simula diferentes cenários agrícolas"""
    print("🚜 SIMULAÇÃO DE CENÁRIOS AGRÍCOLAS")
    print("=" * 50)
    
    # Cenário 1: Fazendeiro em campo remoto
    print("\n📍 CENÁRIO 1: Fazendeiro em Campo Remoto")
    print("-" * 40)
    
    service = AgroAlertaCellService(modem_port='COM3')
    
    # Simula inicialização
    print("1. Inicializando sistema...")
    # await service.initialize()  # Em produção
    
    print("2. Coletando dados de localização...")
    # location_data = service.get_location_data()  # Em produção
    
    # Dados simulados para demonstração
    location_data = {
        'timestamp': datetime.now().isoformat(),
        'cell_tower': {
            'mcc': '643',  # Moçambique
            'mnc': '01',   # mCel
            'lac': '1A2B',
            'cid': '3C4D',
            'tac': '5E6F'
        },
        'signal_quality': {
            'rssi': -75,
            'rsrp': -85,
            'rsrq': -12,
            'sinr': 8
        },
        'network_info': {
            'operator': 'mCel',
            'technology': 'LTE',
            'band': '1800'
        }
    }
    
    print("✅ Dados coletados:")
    for key, value in location_data.items():
        print(f"   {key}: {value}")
    
    # Cenário 2: Alerta climático baseado em localização
    print("\n🌩️ CENÁRIO 2: Sistema de Alertas por Localização")
    print("-" * 45)
    
    # Simula análise de localização para alertas
    cell_info = location_data['cell_tower']
    signal_info = location_data['signal_quality']
    
    # Determina região baseada em MCC/MNC
    if cell_info['mcc'] == '643':  # Moçambique
        if cell_info['mnc'] == '01':    # mCel
            region = "Província de Maputo"
        elif cell_info['mnc'] == '02':  # Vodacom
            region = "Província de Gaza"
        else:
            region = "Província Desconhecida"
    
    print(f"📍 Região detectada: {region}")
    print(f"📶 Qualidade do sinal: {signal_info['rssi']} dBm")
    
    # Simula alerta baseado em localização
    if signal_info['rssi'] > -80:
        print("✅ Sinal bom - Alertas em tempo real disponíveis")
    else:
        print("⚠️ Sinal fraco - Alertas via SMS recomendados")
    
    # Cenário 3: Dados de mercado por região
    print("\n💰 CENÁRIO 3: Preços de Mercado Regionais")
    print("-" * 38)
    
    print(f"🏪 Buscando preços para região: {region}")
    print("📊 Produtos disponíveis na região:")
    
    # Simula dados de mercado baseados na localização
    market_data = {
        'milho': {'preco': 45.5, 'tendencia': 'alta', 'mercado': 'Mercado Central'},
        'tomate': {'preco': 78.2, 'tendencia': 'estavel', 'mercado': 'Feira Local'},
        'cebola': {'preco': 92.1, 'tendencia': 'baixa', 'mercado': 'Grossista Regional'}
    }
    
    for produto, info in market_data.items():
        emoji = "📈" if info['tendencia'] == 'alta' else "📊" if info['tendencia'] == 'estavel' else "📉"
        print(f"   {emoji} {produto.capitalize()}: {info['preco']} MT/kg ({info['mercado']})")

def test_modem_communication():
    """Testa comunicação básica com modem"""
    print("🔧 TESTE DE COMUNICAÇÃO COM MODEM")
    print("=" * 40)
    
    # Lista portas disponíveis
    import serial.tools.list_ports
    
    print("📡 Portas seriais disponíveis:")
    ports = []
    for port in serial.tools.list_ports.comports():
        ports.append(port.device)
        print(f"   {port.device}: {port.description}")
    
    if not ports:
        print("❌ Nenhuma porta serial encontrada")
        print("💡 Verifique se o modem está conectado")
        return
    
    # Testa primeira porta
    test_port = ports[0]
    print(f"\n🔌 Testando comunicação na porta {test_port}...")
    
    modem = ModemATReader(port=test_port)
    
    try:
        if modem.connect():
            print("✅ Comunicação estabelecida!")
            
            # Testa comandos básicos
            print("\n📋 Testando comandos AT básicos:")
            
            # Teste de sinal
            rssi, ber = modem.get_signal_quality()
            if rssi:
                signal_level = "📶 Excelente" if rssi > -60 else "📶 Bom" if rssi > -80 else "📶 Fraco"
                print(f"   📶 RSSI: {rssi} dBm ({signal_level})")
            else:
                print("   ❌ Não foi possível obter RSSI")
            
            # Teste de operadora
            operator = modem.get_operator_info()
            if operator:
                print(f"   📱 Operadora: {operator}")
            else:
                print("   ❌ Não foi possível obter operadora")
            
            # Teste de registro na rede
            reg_info = modem.get_network_registration()
            if reg_info['lac']:
                print(f"   📍 LAC: {reg_info['lac']}, CID: {reg_info['cid']}")
                print(f"   🌐 Tecnologia: {reg_info['technology']}")
            else:
                print("   ❌ Não foi possível obter informações de rede")
            
        else:
            print("❌ Falha na comunicação")
            print("💡 Verifique:")
            print("   - Modem está ligado?")
            print("   - Drivers instalados?")
            print("   - Porta serial correta?")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        modem.disconnect()

def main():
    """Função principal"""
    print("🌾 AgroAlerta - Sistema de Torres Celulares 4G/LTE")
    print("=" * 55)
    print("Desenvolvido para agricultura inteligente em Moçambique")
    print()
    
    while True:
        print("\n📋 MENU DE OPÇÕES:")
        print("1. 🔧 Testar comunicação com modem")
        print("2. 🚜 Simular cenários agrícolas")
        print("3. 📡 Monitorar localização em tempo real")
        print("4. 📄 Gerar relatório de exemplo")
        print("5. ❌ Sair")
        
        choice = input("\nEscolha uma opção (1-5): ").strip()
        
        if choice == '1':
            test_modem_communication()
        
        elif choice == '2':
            simulate_agricultural_scenarios()
        
        elif choice == '3':
            service = AgroAlertaCellService()
            print("\n⚠️ Nota: Para demonstração, dados serão simulados")
            print("📍 Em produção, conecte um modem 4G/LTE real")
            # service.monitor_field_location(5)  # 5 minutos para demo
        
        elif choice == '4':
            generate_example_report()
        
        elif choice == '5':
            print("\n👋 Obrigado por usar o AgroAlerta!")
            break
        
        else:
            print("❌ Opção inválida. Tente novamente.")

def generate_example_report():
    """Gera relatório de exemplo"""
    print("\n📄 GERANDO RELATÓRIO DE EXEMPLO")
    print("=" * 35)
    
    # Dados de exemplo
    report_data = {
        'relatorio': {
            'titulo': 'Monitoramento de Campo - Fazenda São José',
            'data': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'duracao': '8 horas',
            'total_leituras': 96
        },
        'localizacao': {
            'regiao': 'Província de Maputo',
            'operadora': 'mCel',
            'tecnologia': 'LTE',
            'coordenadas_aprox': '-25.9692, 32.5732'
        },
        'qualidade_sinal': {
            'rssi_medio': -73,
            'rssi_min': -89,
            'rssi_max': -65,
            'cobertura_estavel': '87%'
        },
        'alertas_recebidos': [
            {'hora': '09:15', 'tipo': 'Chuva prevista', 'urgencia': 'Baixa'},
            {'hora': '14:30', 'tipo': 'Vento forte', 'urgencia': 'Média'},
            {'hora': '18:45', 'tipo': 'Temperatura baixa', 'urgencia': 'Alta'}
        ]
    }
    
    # Salva relatório
    filename = f"relatorio_campo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Relatório salvo: {filename}")
    
    # Exibe resumo
    print("\n📊 RESUMO DO RELATÓRIO:")
    print(f"   🏷️ Título: {report_data['relatorio']['titulo']}")
    print(f"   📅 Data: {report_data['relatorio']['data']}")
    print(f"   ⏱️ Duração: {report_data['relatorio']['duracao']}")
    print(f"   📡 Leituras: {report_data['relatorio']['total_leituras']}")
    print(f"   📍 Região: {report_data['localizacao']['regiao']}")
    print(f"   📶 RSSI Médio: {report_data['qualidade_sinal']['rssi_medio']} dBm")
    print(f"   🚨 Alertas: {len(report_data['alertas_recebidos'])}")

if __name__ == "__main__":
    main()
