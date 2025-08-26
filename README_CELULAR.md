# 📡 Sistema de Torres Celulares 4G/LTE - AgroAlerta

## 🌾 Visão Geral

Este sistema foi desenvolvido especificamente para o **AgroAlerta**, permitindo que agricultores em áreas rurais de Moçambique obtenham sua localização através de torres de celular quando o GPS não está disponível. O sistema utiliza comandos AT para comunicar-se com modems 4G/LTE e extrair informações de rede que podem ser convertidas em coordenadas geográficas.

## 🎯 Objetivos

- **🌍 Geolocalização Rural**: Alternativa ao GPS em áreas remotas
- **📶 Monitoramento de Sinal**: Qualidade de conexão em tempo real  
- **🚨 Alertas Contextuais**: Baseados na localização da torre
- **📊 Análise de Cobertura**: Mapeamento de áreas agrícolas
- **🔄 Integração Completa**: Com o ecossistema AgroAlerta

## 📁 Estrutura de Arquivos

```
AgroAlerta/
├── modem_4g_reader.py          # 🧠 Script principal
├── exemplo_uso_celular.py      # 📋 Exemplos práticos
├── CELL_TOWER_GUIDE.md         # 📖 Guia completo
├── requirements_celular.txt    # 📦 Dependências
└── README_CELULAR.md           # 📄 Esta documentação
```

## 🚀 Instalação Rápida

### 1. Instalar Dependências
```bash
pip install -r requirements_celular.txt
```

### 2. Verificar Modem
```bash
# Windows
Device Manager → Ports (COM & LPT)

# Linux
ls /dev/ttyUSB* /dev/ttyACM*

# Python (automático)
python modem_4g_reader.py
```

### 3. Executar Sistema
```python
python exemplo_uso_celular.py
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# .env
GOOGLE_GEOLOCATION_API_KEY=sua_chave_aqui
MODEM_PORT=COM3
MODEM_BAUDRATE=115200
DEFAULT_TIMEOUT=10
```

### Configuração Django (Backend)
```python
# settings.py
INSTALLED_APPS = [
    # ... outras apps
    'localizacao',
]

# APIs de Geolocalização
GOOGLE_GEOLOCATION_API_KEY = env('GOOGLE_GEOLOCATION_API_KEY')
MODEM_PORT = env('MODEM_PORT', 'COM3')
```

## 📊 Dados Coletados

### Informações da Torre Celular
```json
{
  "mcc": "643",              # Mobile Country Code (Moçambique)
  "mnc": "01",               # Mobile Network Code (mCel/Vodacom/Movitel)
  "lac": "1A2B",             # Location Area Code
  "cid": "3C4D",             # Cell ID (identificador único da torre)
  "tac": "5E6F",             # Tracking Area Code (LTE)
  "rssi": -75,               # Força do sinal (-50 a -110 dBm)
  "rsrp": -85,               # Reference Signal Received Power
  "rsrq": -12,               # Reference Signal Received Quality
  "operator": "mCel",        # Nome da operadora
  "technology": "LTE",       # Tecnologia (2G/3G/4G/5G)
  "timestamp": "2025-08-26T09:30:00"
}
```

### Mapeamento MCC/MNC Moçambique
```python
MOZAMBIQUE_NETWORKS = {
    "643": {  # Moçambique MCC
        "01": "mCel",
        "02": "Vodacom Moçambique", 
        "03": "Movitel",
        "04": "TMcel"
    }
}
```

## 🌍 Integração com Google Geolocation API

### Formato de Requisição
```json
{
  "considerIp": false,
  "cellTowers": [
    {
      "cellId": 12345,
      "locationAreaCode": 6789,
      "mobileCountryCode": 643,
      "mobileNetworkCode": 1,
      "signalStrength": -75
    }
  ]
}
```

### Resposta Esperada
```json
{
  "location": {
    "lat": -25.9692,
    "lng": 32.5732
  },
  "accuracy": 1000
}
```

## 🚜 Casos de Uso Agrícolas

### 1. **Fazendeiro em Campo Remoto**
```python
# Obter localização sem GPS
service = AgroAlertaCellService()
location = service.get_location_data()

# Buscar alertas climáticos para a região
alertas = get_climate_alerts_for_location(location)
```

### 2. **Monitoramento de Qualidade de Sinal**
```python
# Verificar cobertura durante o trabalho
for reading in service.monitor_field_location(60):  # 1 hora
    if reading['signal_quality']['rssi'] < -90:
        alert("Sinal fraco - considere mover para área com melhor cobertura")
```

### 3. **Alertas Baseados em Torre**
```python
# Sistema determina região pela torre mais próxima
region = determine_region_from_cell_tower(cell_info)
weather_alerts = get_regional_weather_alerts(region)
market_prices = get_regional_market_prices(region)
```

## 📈 Análise de Qualidade do Sinal

### Interpretação RSSI
| Valor RSSI | Qualidade | Emoji | Recomendação |
|------------|-----------|--------|--------------|
| -50 a -60 dBm | Excelente | 📶📶📶📶 | Ideal para todas as funções |
| -60 a -70 dBm | Bom | 📶📶📶 | Funcionalidade completa |
| -70 a -80 dBm | Regular | 📶📶 | Alertas podem ter delay |
| -80 a -90 dBm | Fraco | 📶 | Use SMS para alertas críticos |
| < -90 dBm | Muito Fraco | ❌ | Procure área com melhor sinal |

## 🛠️ Comandos AT Suportados

### Comandos Universais
```bash
AT                    # Teste básico
ATI                   # Informações do modem
AT+COPS?              # Operadora atual
AT+CSQ                # Qualidade do sinal
AT+CREG?              # Registro 2G/3G
AT+CGREG?             # Registro GPRS
AT+CEREG?             # Registro LTE
```

### Comandos Específicos por Fabricante

#### Quectel Modems
```bash
AT+QENG="servingcell" # Informações detalhadas da célula
AT+QCSQ               # Qualidade estendida do sinal
AT+QNWINFO            # Informações de rede
```

#### SIMCom Modems  
```bash
AT+CPSI?              # Informações do sistema
AT+CNETSCAN           # Escaneamento de redes
AT+CCLK?              # Data/hora da rede
```

#### Huawei Modems
```bash
AT^SYSCFGEX?          # Configuração do sistema
AT^HFREQINFO          # Informações de frequência
AT^SYSINFOEX          # Informações detalhadas do sistema
```

## 🧪 Teste e Validação

### Teste Básico de Comunicação
```python
python -c "
from modem_4g_reader import ModemATReader
modem = ModemATReader('COM3')
print('✅ Sucesso' if modem.connect() else '❌ Falha')
modem.disconnect()
"
```

### Teste de Coleta de Dados
```python
python exemplo_uso_celular.py
# Escolha opção 1: Testar comunicação com modem
```

### Validação de Precisão
```python
# Compare coordenadas GPS vs Torre Celular
gps_coords = get_gps_location()
cell_coords = get_cell_tower_location()
distance = calculate_distance(gps_coords, cell_coords)
print(f"Diferença: {distance:.2f} metros")
```

## 🚨 Troubleshooting

### Problema: Modem não detectado
**Solução:**
```python
import serial.tools.list_ports
for port in serial.tools.list_ports.comports():
    print(f"Porta: {port.device} - {port.description}")
```

### Problema: Permissão negada (Linux)
**Solução:**
```bash
sudo usermod -a -G dialout $USER
sudo chmod 666 /dev/ttyUSB0  # ou porta específica
```

### Problema: Timeout nos comandos AT
**Solução:**
```python
# Teste diferentes baudrates
for baud in [9600, 19200, 38400, 57600, 115200]:
    modem = ModemATReader(port='COM3', baudrate=baud, timeout=10)
    if modem.connect():
        print(f"Funcionou com {baud} bps")
        break
```

### Problema: Comandos específicos não funcionam
**Solução:**
```python
# Teste modelo do modem
response = modem._send_at_command("ATI")
print(f"Modelo: {response}")

# Use comandos genéricos como fallback
if "Quectel" not in response:
    use_generic_commands = True
```

## 📊 Monitoramento e Logging

### Sistema de Log Estruturado
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agroalerta_cell.log'),
        logging.StreamHandler()
    ]
)
```

### Métricas de Performance
```python
metrics = {
    'tempo_resposta_at': [],
    'qualidade_sinal_historico': [],
    'torres_detectadas': set(),
    'coordenadas_obtidas': [],
    'erros_comunicacao': 0
}
```

## 🔄 Integração com AgroAlerta

### Backend Django
```python
# views.py
from .services.cell_location import CellLocationService

@api_view(['GET'])
def get_farmer_location(request):
    service = CellLocationService()
    location = service.get_location()
    
    if location:
        # Busca alertas para a região
        alerts = get_regional_alerts(location)
        
        return Response({
            'location': location,
            'alerts': alerts,
            'method': 'cell_towers'
        })
```

### Frontend React/Next.js
```typescript
// Hook para localização celular
const useCellLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const getCellLocation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/location/cell/');
      const data = await response.json();
      setLocation(data.location);
    } catch (error) {
      console.error('Erro ao obter localização celular:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return { location, loading, getCellLocation };
};
```

## 📱 Aplicação Mobile (Futuro)

### React Native
```typescript
// Serviço nativo para comunicação serial
import { NativeModules } from 'react-native';
const { CellTowerModule } = NativeModules;

const getCellTowerInfo = async () => {
  try {
    const info = await CellTowerModule.getCellInfo();
    return info;
  } catch (error) {
    console.error('Erro ao obter info da torre:', error);
  }
};
```

## 🎯 Roadmap de Desenvolvimento

### Fase 1: ✅ Implementado
- [x] Comunicação básica com modem via AT commands
- [x] Coleta de MCC, MNC, LAC, CID
- [x] Integração com Google Geolocation API
- [x] Sistema de logging e monitoramento

### Fase 2: 🚧 Em Desenvolvimento
- [ ] Interface web para configuração
- [ ] API REST completa para integração
- [ ] Sistema de cache de coordenadas
- [ ] Detecção automática de modelo de modem

### Fase 3: 📋 Planejado
- [ ] Aplicação mobile nativa
- [ ] Sistema de triangulação próprio
- [ ] Base de dados de torres locais
- [ ] Alertas proativos baseados em movimento

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** suas modificações
4. **Teste** em diferentes modems/operadoras
5. **Submeta** um Pull Request

### Testes Necessários
- ✅ Teste com modem Quectel
- ✅ Teste com modem SIMCom  
- ⏳ Teste com modem Huawei
- ⏳ Teste em redes mCel/Vodacom/Movitel
- ⏳ Teste de precisão vs GPS

## 📄 Licença

Este sistema é parte do **AgroAlerta** - Sistema Inteligente de Alertas Agrícolas para Moçambique.

Licenciado sob MIT License. Veja `LICENSE` para mais detalhes.

## 🆘 Suporte

- **📧 Email**: support@agroalerta.mz
- **💬 Issues**: GitHub Issues
- **📖 Docs**: [Documentação Completa](CELL_TOWER_GUIDE.md)
- **🎥 Tutoriais**: Em desenvolvimento

---

**Desenvolvido com ❤️ para a agricultura moçambicana** 🌾🇲🇿
