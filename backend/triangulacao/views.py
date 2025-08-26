import json
import time
import subprocess
import sys
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.conf import settings
from .models import TriangulationSession, CellTowerReading

# Adicionar o diretório raiz do projeto ao Python path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.append(project_root)

try:
    # Importar o sistema de triangulação
    from sistema_triangulacao import CellTowerTriangulation
except ImportError as e:
    # Fallback se não conseguir importar
    print(f"Erro ao importar sistema de triangulação: {e}")
    CellTowerTriangulation = None


@require_http_methods(["GET"])
def triangulation_status(request):
    """Verificar status do sistema de triangulação"""
    
    status = {
        'available': False,
        'method': 'none',
        'error': None,
        'hardware': {
            'modem_detected': False,
            'triangulation_system': CellTowerTriangulation is not None
        }
    }
    
    try:
        if CellTowerTriangulation is None:
            status['error'] = 'Sistema de triangulação não encontrado'
            return JsonResponse(status)
        
        # Verificar se há modem disponível
        triangulator = CellTowerTriangulation()
        
        # Tentar detectar modem (modo teste)
        modem_available = triangulator.check_modem_availability()
        
        status['hardware']['modem_detected'] = modem_available
        
        if modem_available:
            status['available'] = True
            status['method'] = 'hardware'
        else:
            # Verificar se modo simulação está disponível
            status['available'] = True
            status['method'] = 'simulation'
            status['error'] = 'Usando modo simulação (sem hardware real)'
            
    except Exception as e:
        status['error'] = f'Erro ao verificar sistema: {str(e)}'
    
    return JsonResponse(status)


@csrf_exempt
@require_http_methods(["POST"])
def triangulation_locate(request):
    """Executar triangulação e retornar localização"""
    
    start_time = time.time()
    
    try:
        # Parse dos parâmetros
        data = json.loads(request.body) if request.body else {}
        method = data.get('method', 'hybrid_triangulation')
        timeout = data.get('timeout', 30000)
        
        if CellTowerTriangulation is None:
            return JsonResponse({
                'success': False,
                'error': 'Sistema de triangulação não disponível'
            })
        
        # Executar triangulação
        triangulator = CellTowerTriangulation()
        result = triangulator.get_location_by_triangulation(
            use_simulation=True  # Por enquanto usar simulação
        )
        
        if result is None:
            return JsonResponse({
                'success': False,
                'error': 'Falha na triangulação - nenhuma torre detectada'
            })
        
        processing_time = int((time.time() - start_time) * 1000)
        
        # Salvar no banco de dados
        session = TriangulationSession.objects.create(
            user=request.user if request.user.is_authenticated else None,
            latitude=result.latitude,
            longitude=result.longitude,
            accuracy_meters=result.accuracy_meters,
            method='cell_triangulation',
            towers_used=len(result.towers) if result.towers else 0,
            confidence=result.confidence,
            processing_time_ms=processing_time
        )
        
        # Salvar torres detectadas
        if result.towers:
            for tower in result.towers:
                CellTowerReading.objects.create(
                    session=session,
                    operator=tower.get('operator', 'Unknown'),
                    cell_id=tower.get('cell_id', ''),
                    lac=tower.get('lac', ''),
                    rssi=tower.get('rssi', -999),
                    distance_meters=tower.get('distance', 0)
                )
        
        response_data = {
            'success': True,
            'latitude': result.latitude,
            'longitude': result.longitude,
            'accuracy_meters': result.accuracy_meters,
            'towers_used': len(result.towers) if result.towers else 0,
            'confidence': result.confidence,
            'processing_time_ms': processing_time,
            'method': result.method,
            'timestamp': result.timestamp,
            'towers': result.towers or []
        }
        
        return JsonResponse(response_data)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Dados JSON inválidos'
        }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Erro na triangulação: {str(e)}'
        }, status=500)


@require_http_methods(["GET"])
def triangulation_test(request):
    """Endpoint de teste para verificar funcionamento"""
    
    try:
        # Executar teste básico
        test_result = {
            'system_available': CellTowerTriangulation is not None,
            'timestamp': time.time(),
            'test_status': 'ok'
        }
        
        if CellTowerTriangulation:
            triangulator = CellTowerTriangulation()
            
            # Teste de simulação
            result = triangulator.simulate_triangulation()
            if result:
                test_result['simulation'] = {
                    'latitude': result.latitude,
                    'longitude': result.longitude,
                    'accuracy': result.accuracy_meters,
                    'towers': len(result.towers) if result.towers else 0
                }
            
        return JsonResponse(test_result)
        
    except Exception as e:
        return JsonResponse({
            'system_available': False,
            'error': str(e),
            'timestamp': time.time(),
            'test_status': 'error'
        }, status=500)
