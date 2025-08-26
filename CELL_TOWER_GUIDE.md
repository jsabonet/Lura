# 📡 Guia de Uso - Sistema de Torres Celulares 4G/LTE

## 🚀 Instalação e Configuração

### 1. Instalação de Dependências
```bash
pip install pyserial
```

### 2. Verificação de Portas Seriais

#### Windows:
- Gerenciador de Dispositivos → Portas (COM & LPT)
- Geralmente: COM3, COM4, COM5, etc.

#### Linux:
```bash
ls /dev/ttyUSB* /dev/ttyACM*
# Comum: /dev/ttyUSB0, /dev/ttyACM0
```

#### macOS:
```bash
ls /dev/cu.* /dev/tty.*
# Exemplo: /dev/cu.usbmodem1234
```

## 🔧 Exemplos de Uso

### Uso Básico
```python
from modem_4g_reader import ModemATReader, CellTowerInfo

# Conecta ao modem
modem = ModemATReader(port='COM3')
if modem.connect():
    # Coleta dados
    cell_info = modem.get_complete_cell_info()
    print(f"MCC: {cell_info.mcc}, MNC: {cell_info.mnc}")
    print(f"LAC: {cell_info.lac}, CID: {cell_info.cid}")
    print(f"RSSI: {cell_info.rssi} dBm")
    
    modem.disconnect()
```

### Integração com Google Geolocation API
```python
import requests
from modem_4g_reader import ModemATReader, format_for_google_geolocation

def get_location_from_cell_towers(api_key: str):
    modem = ModemATReader(port='COM3')
    
    if modem.connect():
        cell_info = modem.get_complete_cell_info()
        modem.disconnect()
        
        # Formata para Google API
        payload = format_for_google_geolocation(cell_info)
        
        # Chama Google Geolocation API
        url = f"https://www.googleapis.com/geolocation/v1/geolocate?key={api_key}"
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            location = response.json()
            return location['location']  # {'lat': -25.7479, 'lng': 32.6376}
    
    return None

# Uso
api_key = "sua_chave_google_api"
location = get_location_from_cell_towers(api_key)
if location:
    print(f"Localização: {location['lat']}, {location['lng']}")
```

## 📊 Interpretação dos Dados

### Códigos de Identificação
```python
# Exemplo de dados coletados
{
    "mcc": "643",           # Mobile Country Code (Rússia)
    "mnc": "02",            # Mobile Network Code (MegaFon)
    "lac": "1234",          # Location Area Code
    "cid": "56789",         # Cell ID
    "tac": "ABCD",          # Tracking Area Code (LTE)
    "rssi": -75,            # Signal Strength (-50 a -110 dBm)
    "rsrp": -85,            # Reference Signal Received Power
    "rsrq": -10,            # Reference Signal Received Quality
    "operator": "Vodacom",   # Nome da operadora
    "technology": "LTE"      # Tecnologia de rede
}
```

### Qualidade do Sinal (RSSI)
- **-50 a -60 dBm**: 📶 Excelente
- **-60 a -70 dBm**: 📶 Bom  
- **-70 a -80 dBm**: 📶 Regular
- **-80 a -90 dBm**: 📶 Fraco
- **-90 a -110 dBm**: 📶 Muito fraco

### MCC/MNC por País (Moçambique)
```python
MOZAMBIQUE_NETWORKS = {
    "643": {  # MCC Moçambique
        "01": "mCel",
        "02": "Vodacom", 
        "03": "Movitel"
    }
}
```

## 🌍 Integração com AgroAlerta

### 1. Serviço de Localização Celular
```python
# backend/localizacao/services/cell_location.py
from modem_4g_reader import ModemATReader, format_for_google_geolocation
import requests

class CellLocationService:
    def __init__(self, google_api_key: str):
        self.api_key = google_api_key
        self.modem_port = self._detect_modem_port()
    
    def get_location(self) -> dict:
        """Obtém localização via torres celulares"""
        modem = ModemATReader(port=self.modem_port)
        
        try:
            if modem.connect():
                cell_info = modem.get_complete_cell_info()
                
                # Usa Google Geolocation API
                payload = format_for_google_geolocation(cell_info)
                url = f"https://www.googleapis.com/geolocation/v1/geolocate?key={self.api_key}"
                
                response = requests.post(url, json=payload)
                
                if response.status_code == 200:
                    location_data = response.json()
                    
                    return {
                        'latitude': location_data['location']['lat'],
                        'longitude': location_data['location']['lng'],
                        'accuracy': location_data.get('accuracy', 1000),
                        'method': 'cell_towers',
                        'cell_info': asdict(cell_info)
                    }
                    
        except Exception as e:
            logger.error(f"Erro ao obter localização celular: {e}")
        
        finally:
            modem.disconnect()
        
        return None
```

### 2. API Django para Localização
```python
# backend/localizacao/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.cell_location import CellLocationService

@api_view(['GET'])
def get_cell_location(request):
    """Endpoint para obter localização via torres celulares"""
    
    service = CellLocationService(
        google_api_key=settings.GOOGLE_GEOLOCATION_API_KEY
    )
    
    location = service.get_location()
    
    if location:
        return Response({
            'success': True,
            'location': location
        })
    else:
        return Response({
            'success': False,
            'error': 'Não foi possível obter localização'
        }, status=400)
```

### 3. Frontend - Fallback para GPS
```typescript
// frontend/src/services/location.ts
interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  method: 'gps' | 'cell_towers' | 'ip';
}

class LocationService {
  async getLocation(): Promise<LocationResult | null> {
    // 1. Tenta GPS primeiro
    try {
      const gpsLocation = await this.getGPSLocation();
      if (gpsLocation) {
        return { ...gpsLocation, method: 'gps' };
      }
    } catch (error) {
      console.log('GPS não disponível, tentando torres celulares...');
    }
    
    // 2. Fallback para torres celulares
    try {
      const cellLocation = await this.getCellLocation();
      if (cellLocation) {
        return { ...cellLocation, method: 'cell_towers' };
      }
    } catch (error) {
      console.log('Torres celulares não disponíveis...');
    }
    
    // 3. Fallback final por IP
    return this.getIPLocation();
  }
  
  private async getCellLocation(): Promise<LocationResult | null> {
    const response = await fetch('/api/localizacao/cell/');
    if (response.ok) {
      const data = await response.json();
      return data.location;
    }
    return null;
  }
}
```

## 🛠️ Comandos AT Suportados

### Comandos Básicos
```
AT              # Teste de comunicação
ATI             # Informações do modem
AT+COPS?        # Operadora atual
AT+CSQ          # Qualidade do sinal
AT+CREG?        # Registro 2G/3G
AT+CGREG?       # Registro GPRS
AT+CEREG?       # Registro LTE/4G
```

### Comandos Específicos por Fabricante

#### Quectel
```
AT+QENG="servingcell"    # Informações detalhadas da célula
AT+QCSQ                  # Qualidade do sinal estendida
```

#### SIMCom
```
AT+CPSI?                 # Informações do sistema
AT+CNETSCAN              # Scan de redes
```

#### Huawei
```
AT^SYSCFGEX?             # Configuração do sistema
AT^HFREQINFO             # Informações de frequência
```

## 🚨 Troubleshooting

### Erro: "Porta não encontrada"
```python
# Verificar portas disponíveis
import serial.tools.list_ports
for port in serial.tools.list_ports.comports():
    print(f"{port.device}: {port.description}")
```

### Erro: "Permission denied" (Linux)
```bash
# Adicionar usuário ao grupo dialout
sudo usermod -a -G dialout $USER
# Reiniciar sessão
```

### Modem não responde
```python
# Teste diferentes baudrates
for baud in [9600, 19200, 38400, 57600, 115200]:
    try:
        modem = ModemATReader(port='COM3', baudrate=baud)
        if modem.connect():
            print(f"Conectado com {baud} bps")
            break
    except:
        continue
```

## 📈 Monitoramento Contínuo

### Script de Monitoramento
```python
import time
from modem_4g_reader import ModemATReader

def monitor_cell_towers(interval=60):
    """Monitora torres celulares continuamente"""
    modem = ModemATReader(port='COM3')
    
    if modem.connect():
        while True:
            try:
                cell_info = modem.get_complete_cell_info()
                
                print(f"[{cell_info.timestamp}] "
                      f"MCC:{cell_info.mcc} MNC:{cell_info.mnc} "
                      f"LAC:{cell_info.lac} CID:{cell_info.cid} "
                      f"RSSI:{cell_info.rssi}dBm")
                
                time.sleep(interval)
                
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"Erro: {e}")
                time.sleep(5)
    
    modem.disconnect()

# Executa monitoramento a cada 60 segundos
monitor_cell_towers(60)
```

Este sistema fornece uma base sólida para geolocalização baseada em torres celulares, essencial para áreas rurais onde GPS pode ser limitado! 🌐📡
