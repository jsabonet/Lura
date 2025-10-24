import json
import urllib.request

url = 'http://localhost:8000/api/ai/proxy/generate/'
req = urllib.request.Request(url, data=json.dumps({'prompt': 'Teste rápido via script'}).encode('utf-8'))
req.add_header('Content-Type', 'application/json')
# If you need to add an Authorization header for local testing, uncomment and set your token:
# req.add_header('Authorization', 'Bearer YOUR_TOKEN_HERE')

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode('utf-8')
        print('STATUS', resp.status)
        print('BODY', body)
except Exception as e:
    # If it's an HTTPError, it may have a .code and a .read() to get the body
    if hasattr(e, 'code'):
        print('HTTP ERROR', e.code)
        try:
            body = e.read().decode('utf-8')
            print('BODY', body)
        except Exception:
            pass
    else:
        print('ERROR', str(e))
