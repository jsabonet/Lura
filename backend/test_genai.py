from decouple import config
import os


def main():
    api_key = config('GOOGLE_AI_API_KEY', default=None)
    print('GOOGLE_AI_API_KEY present:', bool(api_key))
    if not api_key:
        print('❌ GOOGLE_AI_API_KEY not set. Please set it in backend/.env or environment.')
        return

    try:
        import google.generativeai as genai
    except Exception as e:
        print('❌ Could not import google.generativeai:', e)
        return

    try:
        genai.configure(api_key=api_key)
        print('✅ genai configured')

        print('\nListing available models:')
        models = genai.list_models()
        # Try to print useful info for each model
        try:
            for m in models:
                # m may be an object or dict-like
                name = getattr(m, 'name', None) or (m.get('name') if isinstance(m, dict) else str(m))
                print('-', name)
        except Exception:
            print(models)

    except Exception as e:
        print('❌ Error while configuring/listing models:', e)


if __name__ == '__main__':
    main()

# --- Small test to generate a response and print model usage metrics ---
def small_test():
    from firebase.ai_service import FirebaseAIService, get_model_usage_metrics
    import asyncio
    service = FirebaseAIService()
    prompt = "Diga olá em português."
    print("\n[TESTE] Gerando resposta curta com modelo padrão/fallback...")
    result = asyncio.run(service.generate_text(prompt))
    print("Resultado:", result)
    print("\n[METRICS] Model usage:", get_model_usage_metrics())