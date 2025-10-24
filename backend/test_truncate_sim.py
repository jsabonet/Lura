import os, asyncio, sys, pathlib
# Ensure repository root is on sys.path so 'backend' package can be imported
repo_root = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(repo_root))
from backend.firebase.ai_service import FirebaseAIService

# We'll monkeypatch _get_generative_model to return a fake model that returns a fake response
class FakeCandidate:
    def __init__(self, text, finish_reason='MAX_TOKENS', token_count=10):
        self.parts = None
        self.text = text
        self.finish_reason = finish_reason
        self.token_count = token_count

class FakeResponse:
    def __init__(self, text, prompt_token_count=5, token_count=10, finish_reason='MAX_TOKENS'):
        self.text = text
        self.candidates = [FakeCandidate(text, finish_reason, token_count)]
        self.prompt_token_count = prompt_token_count

class FakeModel:
    def __init__(self, name):
        self.name = name
    def generate_content(self, prompt, generation_config=None):
        # First call returns truncated short text, second call returns continuation
        if not hasattr(self, 'calls'):
            self.calls = 0
        self.calls += 1
        if self.calls == 1:
            return FakeResponse('Parte 1 incompleta', prompt_token_count=5, token_count=64, finish_reason='MAX_TOKENS')
        else:
            return FakeResponse('Continuação da resposta completa', prompt_token_count=2, token_count=120, finish_reason='SUCCESS')

async def run_test():
    svc = FirebaseAIService()
    # monkeypatch
    svc._get_generative_model = lambda candidate: (FakeModel(candidate), candidate)
    res = await svc.generate_text('Teste de truncamento', model_name='models/gemini-pro-latest', max_output_tokens=32)
    print('RESULT:', res)

if __name__ == '__main__':
    asyncio.run(run_test())
