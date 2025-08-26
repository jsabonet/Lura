#!/usr/bin/env python3
"""
Sistema de Simulação de Torres Celulares 4G/LTE - AgroAlerta
============================================================

Este script simula a comunicação com modems 4G/LTE para desenvolvimento
e demonstração sem necessidade de hardware físico.

Baseado no sistema real modem_4g_reader.py, mas com dados simulados
para facilitar testes e desenvolvimento.
"""

import json
import time
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict

# Simula dados reais de torres celulares em Moçambique
MOZAMBIQUE_CELL_TOWERS = {
    "maputo": {
        "mcc": "643",
        "mnc": "01",  # mCel
        "lac": "2A4B",
        "cid": "5C8D",
        "tac": "7E9F",
        "operator": "mCel",
        "region": "Província de Maputo",
        "technology": "LTE",
        "band": "1800",
        "coordinates": {"lat": -25.9692, "lng": 32.5732}
    },
    "gaza": {
        "mcc": "643",
        "mnc": "02",  # Vodacom
        "lac": "3B5C",
        "cid": "6D9E",
        "tac": "8F1A",
        "operator": "Vodacom",
        "region": "Província de Gaza",
        "technology": "LTE",
        "band": "900",
        "coordinates": {"lat": -24.0322, "lng": 33.6315}
    },
    "inhambane": {
        "mcc": "643",
        "mnc": "03",  # Movitel
        "lac": "4C6D",
        "cid": "7E0F",
        "tac": "9A2B",
        "operator": "Movitel",
        "region": "Província de Inhambane",
        "technology": "LTE",
        "band": "2100",
        "coordinates": {"lat": -23.8648, "lng": 35.3830}
    },
    "sofala": {
        "mcc": "643",
        "mnc": "01",  # mCel
        "lac": "5D7E",
        "cid": "8F1A",
        "tac": "0B3C",
        "operator": "mCel",
        "region": "Província de Sofala",
        "technology": "LTE",
        "band": "800",
        "coordinates": {"lat": -19.8433, "lng": 34.8387}
    },
    "manica": {
        "mcc": "643",
        "mnc": "02",  # Vodacom
        "lac": "6E8F",
        "cid": "9A2B",
        "tac": "1C4D",
        "operator": "Vodacom",
        "region": "Província de Manica",
        "technology": "LTE",
        "band": "1800",
        "coordinates": {"lat": -18.9442, "lng": 32.8732}
    }
}

@dataclass
class SimulatedCellTowerInfo:
    """Estrutura simulada para informações da torre celular"""
    mcc: str = None
    mnc: str = None
    lac: str = None
    cid: str = None
    tac: str = None
    rssi: int = None
    rsrp: int = None
    rsrq: int = None
    sinr: int = None
    operator: str = None
    technology: str = None
    band: str = None
    channel: str = None
    region: str = None
    coordinates: Dict[str, float] = None
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

class SimulatedModemReader:
    """Classe simulada para demonstração sem hardware físico"""
    
    def __init__(self, simulated_location="maputo"):
        """
        Inicializa simulador
        
        Args:
            simulated_location: Localização simulada em Moçambique
        """
        self.simulated_location = simulated_location
        self.is_connected = False
        self.current_tower = None
        self.signal_variation = 0  # Para simular variação do sinal
        
        print(f"🧪 Simulador inicializado para região: {simulated_location}")
    
    def connect(self) -> bool:
        """Simula conexão com modem"""
        print("🔌 Simulando conexão com modem 4G/LTE...")
        time.sleep(1)  # Simula delay de conexão
        
        if self.simulated_location in MOZAMBIQUE_CELL_TOWERS:
            self.is_connected = True
            self.current_tower = MOZAMBIQUE_CELL_TOWERS[self.simulated_location].copy()
            print(f"✅ Conectado à torre simulada em {self.current_tower['region']}")
            return True
        else:
            print(f"❌ Localização '{self.simulated_location}' não encontrada")
            return False
    
    def disconnect(self):
        """Simula desconexão"""
        self.is_connected = False
        print("🔌 Desconectado do modem simulado")
    
    def get_signal_quality(self) -> Tuple[int, int]:
        """Simula qualidade do sinal com variação realística"""
        if not self.is_connected:
            return None, None
        
        # Simula RSSI base com variação
        base_rssi = random.randint(-85, -65)
        self.signal_variation += random.randint(-5, 5)
        self.signal_variation = max(-15, min(15, self.signal_variation))
        
        rssi = base_rssi + self.signal_variation
        ber = random.randint(0, 7)  # Bit Error Rate
        
        return rssi, ber
    
    def get_operator_info(self) -> str:
        """Retorna operadora simulada"""
        if not self.is_connected:
            return None
        return self.current_tower['operator']
    
    def get_network_registration(self) -> Dict[str, str]:
        """Simula informações de registro na rede"""
        if not self.is_connected:
            return {'lac': None, 'cid': None, 'technology': None}
        
        return {
            'lac': self.current_tower['lac'],
            'cid': self.current_tower['cid'], 
            'technology': self.current_tower['technology']
        }
    
    def get_complete_cell_info(self) -> SimulatedCellTowerInfo:
        """Coleta informações completas simuladas"""
        if not self.is_connected:
            return SimulatedCellTowerInfo()
        
        # Simula dados dinâmicos
        rssi, ber = self.get_signal_quality()
        
        # Simula outros parâmetros de qualidade
        rsrp = rssi - random.randint(5, 15)
        rsrq = random.randint(-15, -5)
        sinr = random.randint(0, 25)
        
        # Simula canal/frequência
        channel = str(random.randint(100, 6000))
        
        cell_info = SimulatedCellTowerInfo(
            mcc=self.current_tower['mcc'],
            mnc=self.current_tower['mnc'],
            lac=self.current_tower['lac'],
            cid=self.current_tower['cid'],
            tac=self.current_tower['tac'],
            rssi=rssi,
            rsrp=rsrp,
            rsrq=rsrq,
            sinr=sinr,
            operator=self.current_tower['operator'],
            technology=self.current_tower['technology'],
            band=self.current_tower['band'],
            channel=channel,
            region=self.current_tower['region'],
            coordinates=self.current_tower['coordinates']
        )
        
        return cell_info

def simulate_field_monitoring():
    """Simula monitoramento de campo em tempo real"""
    print("🌾 SIMULAÇÃO: Monitoramento de Campo")
    print("=" * 45)
    
    # Simula movimento entre diferentes torres
    locations = list(MOZAMBIQUE_CELL_TOWERS.keys())
    current_location = random.choice(locations)
    
    modem = SimulatedModemReader(current_location)
    
    if modem.connect():
        print(f"📍 Iniciando monitoramento em {modem.current_tower['region']}")
        print("⏰ Coletando dados a cada 30 segundos (simulado)...")
        print("🔄 Pressione Ctrl+C para parar\n")
        
        readings = []
        
        try:
            for i in range(10):  # 10 leituras simuladas
                # Simula movimento ocasional
                if random.random() < 0.2:  # 20% chance de trocar torre
                    new_location = random.choice(locations)
                    modem.disconnect()
                    modem = SimulatedModemReader(new_location)
                    modem.connect()
                    print(f"🚶 Moveu para {modem.current_tower['region']}")
                
                cell_info = modem.get_complete_cell_info()
                readings.append(asdict(cell_info))
                
                # Display em tempo real
                timestamp = datetime.now().strftime("%H:%M:%S")
                print(f"[{timestamp}] "
                      f"📍 {cell_info.region} | "
                      f"📶 {cell_info.rssi}dBm | "
                      f"🏢 {cell_info.operator} | "
                      f"📡 {cell_info.technology}")
                
                time.sleep(2)  # Simula intervalo de 30s (acelerado para demo)
                
        except KeyboardInterrupt:
            print("\n⏹️ Monitoramento interrompido")
        
        # Salva dados
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"simulacao_campo_{timestamp}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(readings, f, indent=2, ensure_ascii=False)
        
        print(f"💾 {len(readings)} leituras salvas em {filename}")
        modem.disconnect()

def simulate_agricultural_alerts():
    """Simula sistema de alertas agrícolas baseado em localização"""
    print("🚨 SIMULAÇÃO: Sistema de Alertas Agrícolas")
    print("=" * 45)
    
    # Simula diferentes regiões e seus alertas específicos
    for location_key, tower_data in MOZAMBIQUE_CELL_TOWERS.items():
        print(f"\n📍 Região: {tower_data['region']}")
        print(f"📱 Operadora: {tower_data['operator']}")
        
        # Simula alertas baseados na região
        region_alerts = generate_regional_alerts(tower_data['region'])
        
        if region_alerts:
            print("🚨 Alertas ativos:")
            for alert in region_alerts:
                emoji = "🌧️" if "chuva" in alert['tipo'].lower() else "💨" if "vento" in alert['tipo'].lower() else "🌡️"
                urgencia_color = "🔴" if alert['urgencia'] == 'Alta' else "🟡" if alert['urgencia'] == 'Média' else "🟢"
                print(f"   {emoji} {alert['tipo']} - {urgencia_color} {alert['urgencia']}")
                print(f"      💬 {alert['mensagem']}")
        else:
            print("✅ Nenhum alerta ativo para esta região")
        
        # Simula preços de mercado local
        market_prices = generate_market_prices(tower_data['region'])
        print("💰 Preços de mercado locais:")
        for produto, preco in market_prices.items():
            trend = random.choice(["📈", "📊", "📉"])
            print(f"   {trend} {produto.capitalize()}: {preco} MT/kg")

def generate_regional_alerts(region: str) -> List[Dict]:
    """Gera alertas regionais simulados"""
    possible_alerts = [
        {"tipo": "Chuva intensa", "urgencia": "Alta", "mensagem": "Chuvas fortes previstas nas próximas 6 horas"},
        {"tipo": "Vento forte", "urgencia": "Média", "mensagem": "Ventos de até 60 km/h - proteja culturas"},
        {"tipo": "Temperatura baixa", "urgencia": "Baixa", "mensagem": "Temperaturas abaixo de 15°C durante a madrugada"},
        {"tipo": "Seca prolongada", "urgencia": "Alta", "mensagem": "Sem chuva há 15 dias - irrigação recomendada"},
        {"tipo": "Pragas detectadas", "urgencia": "Média", "mensagem": "Lagarta do cartucho reportada na região"}
    ]
    
    # Diferentes regiões têm diferentes probabilidades de alertas
    if "Maputo" in region:
        alert_probability = 0.7
    elif "Gaza" in region:
        alert_probability = 0.5
    else:
        alert_probability = 0.6
    
    active_alerts = []
    for alert in possible_alerts:
        if random.random() < alert_probability:
            active_alerts.append(alert)
    
    return active_alerts[:random.randint(0, 3)]  # Máximo 3 alertas ativos

def generate_market_prices(region: str) -> Dict[str, float]:
    """Gera preços de mercado simulados por região"""
    base_prices = {
        "milho": 35.0,
        "tomate": 65.0,
        "cebola": 80.0,
        "feijão": 90.0,
        "batata": 45.0
    }
    
    # Variação de preços por região
    regional_multiplier = {
        "Província de Maputo": 1.1,  # Preços mais altos na capital
        "Província de Gaza": 0.9,
        "Província de Inhambane": 0.95,
        "Província de Sofala": 1.0,
        "Província de Manica": 0.85
    }
    
    multiplier = regional_multiplier.get(region, 1.0)
    
    regional_prices = {}
    for produto, preco_base in base_prices.items():
        # Aplica multiplicador regional + variação aleatória
        variation = random.uniform(0.8, 1.2)
        final_price = round(preco_base * multiplier * variation, 1)
        regional_prices[produto] = final_price
    
    return regional_prices

def test_google_api_simulation():
    """Simula integração com Google Geolocation API"""
    print("🌍 SIMULAÇÃO: Google Geolocation API")
    print("=" * 40)
    
    modem = SimulatedModemReader("maputo")
    
    if modem.connect():
        cell_info = modem.get_complete_cell_info()
        
        # Simula payload para Google API
        google_payload = {
            "considerIp": False,
            "cellTowers": [{
                "cellId": int(cell_info.cid, 16),
                "locationAreaCode": int(cell_info.lac, 16),
                "mobileCountryCode": int(cell_info.mcc),
                "mobileNetworkCode": int(cell_info.mnc),
                "signalStrength": cell_info.rssi
            }]
        }
        
        print("📤 Payload para Google API:")
        print(json.dumps(google_payload, indent=2))
        
        # Simula resposta da Google API
        simulated_response = {
            "location": cell_info.coordinates,
            "accuracy": random.randint(500, 2000)
        }
        
        print("\n📥 Resposta simulada da Google API:")
        print(json.dumps(simulated_response, indent=2))
        
        print(f"\n📍 Coordenadas obtidas:")
        print(f"   Latitude: {simulated_response['location']['lat']}")
        print(f"   Longitude: {simulated_response['location']['lng']}")
        print(f"   Precisão: ±{simulated_response['accuracy']} metros")
        
        modem.disconnect()

def interactive_demo():
    """Demo interativo do sistema simulado"""
    print("🌾 AgroAlerta - Sistema Simulado de Torres Celulares")
    print("=" * 55)
    print("📍 Demonstração sem necessidade de hardware físico")
    print()
    
    while True:
        print("\n📋 MENU DE SIMULAÇÃO:")
        print("1. 🧪 Testar coleta de dados simulados")
        print("2. 🌾 Monitoramento de campo simulado")
        print("3. 🚨 Sistema de alertas regionais")
        print("4. 🌍 Integração Google API (simulada)")
        print("5. 📊 Relatório completo de região")
        print("6. ❌ Sair")
        
        choice = input("\nEscolha uma opção (1-6): ").strip()
        
        if choice == '1':
            test_single_tower()
        elif choice == '2':
            simulate_field_monitoring()
        elif choice == '3':
            simulate_agricultural_alerts()
        elif choice == '4':
            test_google_api_simulation()
        elif choice == '5':
            generate_complete_regional_report()
        elif choice == '6':
            print("\n👋 Obrigado por testar o AgroAlerta!")
            break
        else:
            print("❌ Opção inválida. Tente novamente.")

def test_single_tower():
    """Testa coleta de dados de uma única torre"""
    print("\n🧪 TESTE DE COLETA DE DADOS SIMULADOS")
    print("=" * 42)
    
    # Permite escolher região
    regions = list(MOZAMBIQUE_CELL_TOWERS.keys())
    print("📍 Regiões disponíveis:")
    for i, region in enumerate(regions, 1):
        tower_data = MOZAMBIQUE_CELL_TOWERS[region]
        print(f"   {i}. {tower_data['region']} ({tower_data['operator']})")
    
    try:
        choice = int(input("\nEscolha uma região (número): ")) - 1
        if 0 <= choice < len(regions):
            selected_region = regions[choice]
        else:
            selected_region = regions[0]
            print(f"⚠️ Opção inválida, usando {MOZAMBIQUE_CELL_TOWERS[selected_region]['region']}")
    except:
        selected_region = regions[0]
        print(f"⚠️ Entrada inválida, usando {MOZAMBIQUE_CELL_TOWERS[selected_region]['region']}")
    
    # Testa coleta
    modem = SimulatedModemReader(selected_region)
    
    if modem.connect():
        print("\n📊 Coletando dados...")
        cell_info = modem.get_complete_cell_info()
        
        print("\n" + "=" * 50)
        print("📍 INFORMAÇÕES DA TORRE CELULAR")
        print("=" * 50)
        
        info_dict = asdict(cell_info)
        for key, value in info_dict.items():
            if value is not None:
                if key == 'coordinates':
                    print(f"{key.upper():15}: Lat {value['lat']}, Lng {value['lng']}")
                else:
                    print(f"{key.upper():15}: {value}")
        
        # JSON formatado
        print("\n" + "=" * 50)
        print("📄 DADOS EM FORMATO JSON")
        print("=" * 50)
        json_data = json.dumps(info_dict, indent=2, ensure_ascii=False)
        print(json_data)
        
        modem.disconnect()

def generate_complete_regional_report():
    """Gera relatório completo de uma região"""
    print("\n📊 RELATÓRIO COMPLETO DE REGIÃO")
    print("=" * 35)
    
    # Escolhe região aleatória para demonstração
    region_key = random.choice(list(MOZAMBIQUE_CELL_TOWERS.keys()))
    tower_data = MOZAMBIQUE_CELL_TOWERS[region_key]
    
    modem = SimulatedModemReader(region_key)
    
    if modem.connect():
        cell_info = modem.get_complete_cell_info()
        
        # Coleta dados adicionais
        alerts = generate_regional_alerts(tower_data['region'])
        market_prices = generate_market_prices(tower_data['region'])
        
        # Monta relatório completo
        report = {
            "relatorio": {
                "titulo": f"Relatório Agrícola - {tower_data['region']}",
                "data_geracao": datetime.now().isoformat(),
                "periodo": "Últimas 24 horas",
                "status": "Simulado"
            },
            "localizacao": {
                "regiao": tower_data['region'],
                "coordenadas": tower_data['coordinates'],
                "operadora": tower_data['operator'],
                "tecnologia": tower_data['technology'],
                "banda": tower_data['band']
            },
            "qualidade_rede": {
                "rssi": cell_info.rssi,
                "rsrp": cell_info.rsrp,
                "rsrq": cell_info.rsrq,
                "sinr": cell_info.sinr,
                "avaliacao": "Excelente" if cell_info.rssi > -70 else "Bom" if cell_info.rssi > -85 else "Regular"
            },
            "alertas_climaticos": alerts,
            "precos_mercado": market_prices,
            "recomendacoes": [
                "Monitorar previsão do tempo nas próximas 48h",
                "Verificar irrigação devido à variação de temperatura",
                "Considerar colheita antecipada se ventos fortes previstos"
            ]
        }
        
        # Salva relatório
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"relatorio_regional_{region_key}_{timestamp}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Exibe resumo
        print(f"✅ Relatório gerado para {tower_data['region']}")
        print(f"📅 Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        print(f"📶 Qualidade rede: {report['qualidade_rede']['avaliacao']} ({cell_info.rssi} dBm)")
        print(f"🚨 Alertas ativos: {len(alerts)}")
        print(f"💰 Produtos monitorados: {len(market_prices)}")
        print(f"💾 Arquivo salvo: {filename}")
        
        modem.disconnect()

if __name__ == "__main__":
    interactive_demo()
