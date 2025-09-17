import os
import google.generativeai as genai

try:
    api_key = os.getenv('GOOGLE_AI_API_KEY')
    if not api_key:
        print("❌ GOOGLE_AI_API_KEY não encontrada nas variáveis de ambiente")
        exit(1)

    # Configure the client
    genai.configure(api_key=api_key)
    
    # Try to load a model
    model = genai.GenerativeModel('gemini-pro')
    
    # Try a simple generation
    response = model.generate_content("Say hello!")
    
    print("✅ Test successful!")
    print(f"Model response: {response.text}")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")