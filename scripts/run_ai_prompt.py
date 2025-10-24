import os
import sys
import json
import asyncio

# Ensure backend code is importable
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKEND_DIR = os.path.join(REPO_ROOT, 'backend')
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from firebase.ai_service import FirebaseAIService

TEST_PROMPT = os.environ.get('AI_TEST_PROMPT', 'Dê três técnicas práticas para proteger a produção de milho na época seca em Moçambique. Fale curto e direto.')

async def main():
    svc = FirebaseAIService()
    print(f"[INFO] Firebase configured: {svc.is_configured}")
    # Echo whether API key is set (masked)
    has_key = bool(os.environ.get('GOOGLE_AI_API_KEY'))
    print(f"[INFO] GOOGLE_AI_API_KEY set: {has_key}")

    result = await svc.generate_text(TEST_PROMPT)
    print("[RAW]", json.dumps({k: (v if k not in ('content_html','text','content') else ('<html>' if k=='content_html' and v else (v[:120]+'...' if v and len(v)>120 else v))) for k,v in result.items()}, ensure_ascii=False, indent=2))

    if result.get('success'):
        text = result.get('text') or result.get('content') or ''
        print("\n=== RESULT SUMMARY ===")
        print("Model:", result.get('model'))
        print("Truncated:", result.get('truncated'))
        print("Finish reason:", result.get('finish_reason'))
        print("Text length:", len(text))
        if text:
            preview = text[:600] + ('...' if len(text) > 600 else '')
            print("\nPreview:\n", preview)
    else:
        print("\n[ERROR]", result.get('error'))

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Interrupted")
