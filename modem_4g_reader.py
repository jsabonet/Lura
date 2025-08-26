#!/usr/bin/env python3
"""
Sistema de Leitura de Dados de Rede Celular 4G/LTE
===================================================

Este script comunica-se com modems 4G/LTE via comandos AT para extrair
informações detalhadas de rede celular que podem ser usadas para geolocalização.

Autor: AgroAlerta Team
Data: 2025-08-26
Versão: 1.0

Dependências:
- pyserial: pip install pyserial
- json: biblioteca padrão Python

Comandos AT Utilizados:
- AT+COPS?: Operadora atual
- AT+CSQ: Qualidade do sinal (RSSI)
- AT+CREG?: Status de registro na rede
- AT+CEREG?: Registro EPS (LTE)
- AT+CGREG?: Registro GPRS
- AT+QENG="servingcell": Informações da célula (Quectel)
- AT+CPSI?: Informações do sistema (SIMCom)
"""

import serial
import json
import time
import re
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import sys

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class CellTowerInfo:
    """Estrutura para informações da torre celular"""
    mcc: Optional[str] = None          # Mobile Country Code
    mnc: Optional[str] = None          # Mobile Network Code  
    lac: Optional[str] = None          # Location Area Code
    cid: Optional[str] = None          # Cell ID
    tac: Optional[str] = None          # Tracking Area Code
    rssi: Optional[int] = None         # Received Signal Strength Indicator
    rsrp: Optional[int] = None         # Reference Signal Received Power
    rsrq: Optional[int] = None         # Reference Signal Received Quality
    sinr: Optional[int] = None         # Signal to Interference plus Noise Ratio
    operator: Optional[str] = None     # Nome da operadora
    technology: Optional[str] = None   # Tecnologia (2G/3G/4G/5G)
    band: Optional[str] = None         # Banda de frequência
    channel: Optional[str] = None      # Canal/EARFCN
    timestamp: str = None              # Timestamp da leitura
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

class ModemATReader:
    """Classe principal para comunicação com modem via comandos AT"""
    
    def __init__(self, port: str = 'COM3', baudrate: int = 115200, timeout: int = 3):
        """
        Inicializa a comunicação com o modem
        
        Args:
            port: Porta serial (COM3, COM4, etc. no Windows)
            baudrate: Taxa de transmissão (115200 é padrão)
            timeout: Timeout para comandos AT em segundos
        """
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.serial_conn = None
        self.modem_model = None
        
    def connect(self) -> bool:
        """
        Estabelece conexão com o modem
        
        Returns:
            bool: True se conectado com sucesso
        """
        try:
            self.serial_conn = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                timeout=self.timeout,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE
            )
            
            logger.info(f"Conectado à porta {self.port} @ {self.baudrate} bps")
            
            # Teste básico de comunicação
            if self._send_at_command("AT"):
                logger.info("Comunicação AT estabelecida com sucesso")
                self._detect_modem_model()
                return True
            else:
                logger.error("Falha na comunicação AT")
                return False
                
        except serial.SerialException as e:
            logger.error(f"Erro ao conectar na porta {self.port}: {e}")
            return False
        except Exception as e:
            logger.error(f"Erro inesperado: {e}")
            return False
    
    def disconnect(self):
        """Fecha a conexão serial"""
        if self.serial_conn and self.serial_conn.is_open:
            self.serial_conn.close()
            logger.info("Conexão serial fechada")
    
    def _send_at_command(self, command: str, wait_time: float = 0.5) -> Optional[str]:
        """
        Envia comando AT e retorna a resposta
        
        Args:
            command: Comando AT para enviar
            wait_time: Tempo de espera após envio
            
        Returns:
            str: Resposta do modem ou None se erro
        """
        if not self.serial_conn or not self.serial_conn.is_open:
            logger.error("Conexão serial não estabelecida")
            return None
        
        try:
            # Limpa buffer de entrada
            self.serial_conn.flushInput()
            
            # Envia comando
            cmd_bytes = f"{command}\r\n".encode('utf-8')
            self.serial_conn.write(cmd_bytes)
            logger.debug(f"Enviado: {command}")
            
            # Aguarda resposta
            time.sleep(wait_time)
            
            # Lê resposta
            response = ""
            while self.serial_conn.in_waiting > 0:
                response += self.serial_conn.read(self.serial_conn.in_waiting).decode('utf-8', errors='ignore')
                time.sleep(0.1)
            
            logger.debug(f"Resposta: {response.strip()}")
            return response.strip()
            
        except Exception as e:
            logger.error(f"Erro ao enviar comando {command}: {e}")
            return None
    
    def _detect_modem_model(self):
        """Detecta o modelo do modem para comandos específicos"""
        response = self._send_at_command("ATI")
        if response:
            if "Quectel" in response:
                self.modem_model = "Quectel"
            elif "SIMCOM" in response or "SIM" in response:
                self.modem_model = "SIMCom"
            elif "Huawei" in response:
                self.modem_model = "Huawei"
            else:
                self.modem_model = "Generic"
            
            logger.info(f"Modelo detectado: {self.modem_model}")
    
    def get_signal_quality(self) -> Tuple[Optional[int], Optional[int]]:
        """
        Obtém qualidade do sinal (RSSI)
        
        Returns:
            Tuple[rssi, ber]: RSSI em dBm e BER (Bit Error Rate)
        """
        response = self._send_at_command("AT+CSQ")
        if not response:
            return None, None
        
        # Procura padrão: +CSQ: <rssi>,<ber>
        match = re.search(r'\+CSQ:\s*(\d+),(\d+)', response)
        if match:
            rssi_raw = int(match.group(1))
            ber = int(match.group(2))
            
            # Converte RSSI para dBm
            if rssi_raw == 99:
                rssi_dbm = None  # Não detectado
            else:
                rssi_dbm = -113 + (rssi_raw * 2)  # Fórmula padrão
            
            logger.info(f"RSSI: {rssi_dbm} dBm, BER: {ber}")
            return rssi_dbm, ber
        
        return None, None
    
    def get_operator_info(self) -> Optional[str]:
        """
        Obtém informações da operadora
        
        Returns:
            str: Nome da operadora
        """
        response = self._send_at_command("AT+COPS?")
        if not response:
            return None
        
        # Procura padrão: +COPS: <mode>,<format>,"<oper>"
        match = re.search(r'\+COPS:\s*\d+,\d+,"([^"]+)"', response)
        if match:
            operator = match.group(1)
            logger.info(f"Operadora: {operator}")
            return operator
        
        return None
    
    def get_network_registration(self) -> Dict[str, Optional[str]]:
        """
        Obtém informações de registro na rede
        
        Returns:
            Dict: Informações de LAC, CID, etc.
        """
        info = {
            'lac': None,
            'cid': None,
            'technology': None
        }
        
        # Tenta diferentes comandos de registro
        commands = [
            ("AT+CREG?", "2G/3G"),
            ("AT+CGREG?", "GPRS"),
            ("AT+CEREG?", "LTE")
        ]
        
        for cmd, tech in commands:
            response = self._send_at_command(cmd)
            if response:
                # Procura padrão: +CREG: <n>,<stat>,<lac>,<ci>
                match = re.search(r'\+C[GRE]+REG:\s*\d+,\d+,"?([0-9A-Fa-f]+)"?,"?([0-9A-Fa-f]+)"?', response)
                if match:
                    info['lac'] = match.group(1)
                    info['cid'] = match.group(2)
                    info['technology'] = tech
                    logger.info(f"LAC: {info['lac']}, CID: {info['cid']} ({tech})")
                    break
        
        return info
    
    def get_serving_cell_info_quectel(self) -> Dict[str, Optional[str]]:
        """
        Obtém informações detalhadas da célula (específico para Quectel)
        
        Returns:
            Dict: Informações completas da célula
        """
        info = {}
        response = self._send_at_command('AT+QENG="servingcell"')
        
        if not response:
            return info
        
        # Processa resposta do Quectel
        lines = response.split('\n')
        for line in lines:
            if '+QENG:' in line:
                # Exemplo: +QENG: "servingcell","NOCONN","LTE","FDD",724,10,6400,466,100,3,5,5,-85,-11,-57,9
                parts = line.split(',')
                if len(parts) > 10:
                    try:
                        info['technology'] = parts[2].strip('"')
                        info['mcc'] = parts[4].strip()
                        info['mnc'] = parts[5].strip()
                        info['cid'] = parts[6].strip()
                        info['lac'] = parts[7].strip()
                        info['rsrp'] = parts[12].strip() if len(parts) > 12 else None
                        info['rsrq'] = parts[13].strip() if len(parts) > 13 else None
                        info['rssi'] = parts[14].strip() if len(parts) > 14 else None
                        
                        logger.info(f"Quectel - MCC: {info['mcc']}, MNC: {info['mnc']}")
                    except (IndexError, ValueError) as e:
                        logger.warning(f"Erro ao processar resposta Quectel: {e}")
        
        return info
    
    def get_serving_cell_info_simcom(self) -> Dict[str, Optional[str]]:
        """
        Obtém informações detalhadas da célula (específico para SIMCom)
        
        Returns:
            Dict: Informações completas da célula
        """
        info = {}
        response = self._send_at_command("AT+CPSI?")
        
        if not response:
            return info
        
        # Processa resposta do SIMCom
        if '+CPSI:' in response:
            # Exemplo: +CPSI: LTE,Online,724-10,0x1234,5678,100,FDD,1800
            match = re.search(r'\+CPSI:\s*([^,]+),([^,]+),(\d+)-(\d+),([^,]+),([^,]+)', response)
            if match:
                info['technology'] = match.group(1)
                info['mcc'] = match.group(3)
                info['mnc'] = match.group(4)
                info['lac'] = match.group(5)
                info['cid'] = match.group(6)
                
                logger.info(f"SIMCom - MCC: {info['mcc']}, MNC: {info['mnc']}")
        
        return info
    
    def get_complete_cell_info(self) -> CellTowerInfo:
        """
        Coleta todas as informações disponíveis da torre celular
        
        Returns:
            CellTowerInfo: Estrutura completa com dados da célula
        """
        logger.info("Coletando informações completas da torre celular...")
        
        cell_info = CellTowerInfo()
        
        # 1. Qualidade do sinal
        rssi, ber = self.get_signal_quality()
        cell_info.rssi = rssi
        
        # 2. Operadora
        cell_info.operator = self.get_operator_info()
        
        # 3. Registro na rede
        reg_info = self.get_network_registration()
        if not cell_info.lac:
            cell_info.lac = reg_info.get('lac')
        if not cell_info.cid:
            cell_info.cid = reg_info.get('cid')
        if not cell_info.technology:
            cell_info.technology = reg_info.get('technology')
        
        # 4. Informações específicas do modem
        if self.modem_model == "Quectel":
            detailed_info = self.get_serving_cell_info_quectel()
        elif self.modem_model == "SIMCom":
            detailed_info = self.get_serving_cell_info_simcom()
        else:
            detailed_info = {}
        
        # Atualiza com informações detalhadas
        for key, value in detailed_info.items():
            if value and not getattr(cell_info, key, None):
                setattr(cell_info, key, value)
        
        return cell_info

def format_for_google_geolocation(cell_info: CellTowerInfo) -> Dict:
    """
    Formata dados para Google Geolocation API
    
    Args:
        cell_info: Informações da torre celular
        
    Returns:
        Dict: Payload formatado para Google API
    """
    # Estrutura conforme Google Geolocation API
    payload = {
        "considerIp": False,
        "cellTowers": []
    }
    
    if all([cell_info.mcc, cell_info.mnc, cell_info.lac, cell_info.cid]):
        cell_tower = {
            "cellId": int(cell_info.cid, 16) if cell_info.cid.startswith('0x') else int(cell_info.cid),
            "locationAreaCode": int(cell_info.lac, 16) if cell_info.lac.startswith('0x') else int(cell_info.lac),
            "mobileCountryCode": int(cell_info.mcc),
            "mobileNetworkCode": int(cell_info.mnc)
        }
        
        # Adiciona sinal se disponível
        if cell_info.rssi:
            cell_tower["signalStrength"] = cell_info.rssi
        
        payload["cellTowers"].append(cell_tower)
    
    return payload

def scan_serial_ports() -> List[str]:
    """
    Escaneia portas seriais disponíveis
    
    Returns:
        List[str]: Lista de portas encontradas
    """
    import serial.tools.list_ports
    
    ports = []
    for port in serial.tools.list_ports.comports():
        ports.append(port.device)
        logger.info(f"Porta encontrada: {port.device} - {port.description}")
    
    return ports

def main():
    """Função principal - exemplo de uso"""
    print("🌐 AgroAlerta - Sistema de Leitura de Torres Celulares 4G/LTE")
    print("=" * 60)
    
    # Escaneia portas disponíveis
    print("\n📡 Escaneando portas seriais disponíveis...")
    ports = scan_serial_ports()
    
    if not ports:
        print("❌ Nenhuma porta serial encontrada")
        return
    
    # Usa primeira porta encontrada ou permite escolha
    selected_port = ports[0]
    if len(ports) > 1:
        print(f"\n📋 Portas disponíveis: {', '.join(ports)}")
        choice = input(f"Escolha uma porta (padrão: {selected_port}): ").strip()
        if choice:
            selected_port = choice
    
    print(f"\n🔌 Conectando na porta: {selected_port}")
    
    # Inicializa leitor do modem
    modem = ModemATReader(port=selected_port)
    
    try:
        # Conecta ao modem
        if not modem.connect():
            print("❌ Falha ao conectar com o modem")
            return
        
        print("✅ Conectado com sucesso!")
        
        # Coleta informações
        print("\n📊 Coletando informações da torre celular...")
        cell_info = modem.get_complete_cell_info()
        
        # Exibe resultados
        print("\n" + "=" * 60)
        print("📍 INFORMAÇÕES DA TORRE CELULAR")
        print("=" * 60)
        
        info_dict = asdict(cell_info)
        for key, value in info_dict.items():
            if value is not None:
                print(f"{key.upper():15}: {value}")
        
        # JSON formatado
        print("\n" + "=" * 60)
        print("📄 DADOS EM FORMATO JSON")
        print("=" * 60)
        json_data = json.dumps(asdict(cell_info), indent=2, ensure_ascii=False)
        print(json_data)
        
        # Formato Google Geolocation API
        print("\n" + "=" * 60)
        print("🌍 FORMATO GOOGLE GEOLOCATION API")
        print("=" * 60)
        google_format = format_for_google_geolocation(cell_info)
        google_json = json.dumps(google_format, indent=2)
        print(google_json)
        
        # Salva em arquivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"cell_tower_data_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'raw_data': asdict(cell_info),
                'google_format': google_format
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Dados salvos em: {filename}")
        
    except KeyboardInterrupt:
        print("\n\n⏹️ Operação cancelada pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
    finally:
        modem.disconnect()
        print("\n👋 Desconectado. Obrigado!")

if __name__ == "__main__":
    main()
