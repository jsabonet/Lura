# Firebase AI Service - Backend
# Serviço para integração com Vertex AI usando Firebase Admin SDK

import os
import json
from typing import Dict, List, Optional, Any
from google.cloud import aiplatform
from google.oauth2 import service_account
from decouple import config
from .config import get_firebase_app, is_firebase_configured


import threading

# Simple in-memory metrics for model usage
_model_usage_counter = {}
_model_usage_lock = threading.Lock()

def _log_model_usage(model_name):
    with _model_usage_lock:
        _model_usage_counter[model_name] = _model_usage_counter.get(model_name, 0) + 1
    print(f"[AI MODEL USAGE] {model_name} used { _model_usage_counter[model_name] } times")

def get_model_usage_metrics():
    with _model_usage_lock:
        return dict(_model_usage_counter)


_SHORT_TO_CANONICAL = {
    'gemini-pro': 'models/gemini-pro-latest',
    'gemini-2.5-pro': 'models/gemini-2.5-pro',
    'gemini-flash': 'models/gemini-flash-latest',
    'gemini-2.5-flash': 'models/gemini-2.5-flash',
    'gemini-flash-lite': 'models/gemini-flash-lite-latest',
    'gemini-2.5-flash-lite': 'models/gemini-2.5-flash-lite',
}

def canonicalize_model_name(name):
    if not name:
        return name
    name = name.strip()
    return _SHORT_TO_CANONICAL.get(name, name)


def _format_inline(text: str) -> str:
    """Formata elementos inline: negrito, itálico, código, links"""
    import re
    
    # Escapar HTML especial primeiro (antes de processar markdown)
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    
    # Código inline `código`
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    
    # Links [texto](url)
    text = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', text)
    
    # Negrito **texto** ou __texto__ (não capturar espaços nas pontas)
    text = re.sub(r'\*\*([^\*\n]+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__([^_\n]+?)__', r'<strong>\1</strong>', text)
    
    # Itálico *texto* ou _texto_ (mas não dentro de palavras ou números)
    text = re.sub(r'(?<!\w)\*([^\*\n]+?)\*(?!\w)', r'<em>\1</em>', text)
    text = re.sub(r'(?<!\w)_([^_\n]+?)_(?!\w)', r'<em>\1</em>', text)
    
    # Tachado ~~texto~~
    text = re.sub(r'~~([^~\n]+?)~~', r'<del>\1</del>', text)
    
    return text


def _process_table_cell(cell_text: str) -> str:
    """
    Processa conteúdo de célula de tabela, incluindo <br>, <ul>, <li>
    Não escapa HTML dentro de células para permitir formatação rica
    """
    import re
    
    # Se contém tags HTML como <br>, <ul>, <li>, não escapar
    if re.search(r'<(br|ul|li|ol|strong|em)', cell_text, re.IGNORECASE):
        # Processar apenas markdown inline (negrito, itálico) sem escapar HTML existente
        # Negrito **texto**
        cell_text = re.sub(r'\*\*([^\*\n]+?)\*\*', r'<strong>\1</strong>', cell_text)
        # Itálico *texto*
        cell_text = re.sub(r'(?<!\w)\*([^\*\n]+?)\*(?!\w)', r'<em>\1</em>', cell_text)
        return cell_text
    else:
        # Processar normalmente com escape
        return _format_inline(cell_text)


def _markdown_to_html(text: str) -> str:
    """
    Converte markdown para HTML formatado com suporte completo a:
    - Cabeçalhos (# ## ###)
    - Negrito (**texto** ou __texto__)
    - Itálico (*texto* ou _texto_)
    - Listas numeradas (1. 2. 3.)
    - Listas não-numeradas (- * +)
    - Blocos de código (```codigo```)
    - Código inline (`codigo`)
    - Links [texto](url)
    - Aspas/Citações (> texto)
    - Linhas horizontais (---, ***, ___)
    - Tabelas
    """
    if not text:
        return ''
    
    import re
    
    lines = text.split('\n')
    html_lines = []
    in_code_block = False
    in_list = False
    in_quote = False
    code_language = ''
    list_type = None  # 'ul' or 'ol'
    last_was_block = False  # Track if last element was a block element
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Blocos de código com ```
        if stripped.startswith('```'):
            if not in_code_block:
                # Iniciar bloco de código
                code_language = stripped[3:].strip() or 'plaintext'
                html_lines.append(f'<pre class="code-block"><code class="language-{code_language}">')
                in_code_block = True
                last_was_block = True
            else:
                # Fechar bloco de código
                html_lines.append('</code></pre>')
                in_code_block = False
                code_language = ''
                last_was_block = True
            i += 1
            continue
        
        # Dentro de bloco de código - não processar markdown
        if in_code_block:
            # Escapar HTML
            escaped = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            html_lines.append(escaped)
            i += 1
            continue
        
        # Linha vazia - fechar listas/quotes
        if not stripped:
            if in_list:
                html_lines.append(f'</{list_type}>')
                in_list = False
                list_type = None
            if in_quote:
                html_lines.append('</blockquote>')
                in_quote = False
            # Não adicionar <br> após fechamento de blocos estruturais
            # apenas entre parágrafos normais
            i += 1
            continue
        
        # Linhas horizontais (---, ***, ___)
        if re.match(r'^(\-{3,}|\*{3,}|_{3,})$', stripped):
            if in_list:
                html_lines.append(f'</{list_type}>')
                in_list = False
            html_lines.append('<hr>')
            last_was_block = True
            i += 1
            continue
        
        # Cabeçalhos
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', stripped)
        if heading_match:
            if in_list:
                html_lines.append(f'</{list_type}>')
                in_list = False
            level = len(heading_match.group(1))
            heading_text = _format_inline(heading_match.group(2))
            html_lines.append(f'<h{level}>{heading_text}</h{level}>')
            last_was_block = True
            i += 1
            continue
        
        # Citações/Blockquotes
        if stripped.startswith('>'):
            quote_text = _format_inline(stripped[1:].strip())
            if not in_quote:
                html_lines.append('<blockquote>')
                in_quote = True
            html_lines.append(f'<p>{quote_text}</p>')
            last_was_block = False  # Dentro de quote
            i += 1
            continue
        elif in_quote:
            html_lines.append('</blockquote>')
            in_quote = False
            last_was_block = True
        
        # Listas numeradas
        numbered_match = re.match(r'^(\d+)\.\s+(.+)$', stripped)
        if numbered_match:
            list_text = _format_inline(numbered_match.group(2))
            if not in_list or list_type != 'ol':
                if in_list:
                    html_lines.append(f'</{list_type}>')
                html_lines.append('<ol>')
                in_list = True
                list_type = 'ol'
            html_lines.append(f'<li>{list_text}</li>')
            last_was_block = False  # Dentro de lista
            i += 1
            continue
        
        # Listas não-numeradas (-, *, +)
        bullet_match = re.match(r'^[\-\*\+]\s+(.+)$', stripped)
        if bullet_match:
            list_text = _format_inline(bullet_match.group(1))
            if not in_list or list_type != 'ul':
                if in_list:
                    html_lines.append(f'</{list_type}>')
                html_lines.append('<ul>')
                in_list = True
                list_type = 'ul'
            html_lines.append(f'<li>{list_text}</li>')
            last_was_block = False  # Dentro de lista
            i += 1
            continue
        
        # Se estava em lista mas linha não é item, fechar lista
        if in_list:
            html_lines.append(f'</{list_type}>')
            in_list = False
            list_type = None
            last_was_block = True
        
        # Tabelas markdown (detectar linha com | ... | ... |)
        if '|' in stripped and stripped.count('|') >= 2:
            # Coletar todas as linhas da tabela
            table_lines = []
            table_start = i
            
            # Primeira linha (cabeçalhos)
            if '|' in stripped:
                table_lines.append(stripped)
                i += 1
                
                # Verificar linha de separação (| :--- | :--- |)
                if i < len(lines):
                    sep_line = lines[i].strip()
                    if '|' in sep_line and ('-' in sep_line or ':' in sep_line):
                        table_lines.append(sep_line)
                        i += 1
                        
                        # Coletar linhas de dados
                        while i < len(lines):
                            data_line = lines[i].strip()
                            if data_line and '|' in data_line:
                                table_lines.append(data_line)
                                i += 1
                            else:
                                break
                        
                        # Converter para HTML
                        if len(table_lines) >= 2:
                            html_lines.append('<div class="table-wrapper"><table>')
                            
                            # Processar cabeçalhos
                            headers = [cell.strip() for cell in table_lines[0].split('|') if cell.strip()]
                            html_lines.append('<thead><tr>')
                            for header in headers:
                                html_lines.append(f'<th>{_process_table_cell(header)}</th>')
                            html_lines.append('</tr></thead>')
                            
                            # Processar linhas de dados (pular linha de separação)
                            if len(table_lines) > 2:
                                html_lines.append('<tbody>')
                                for row_line in table_lines[2:]:
                                    cells = [cell.strip() for cell in row_line.split('|') if cell.strip()]
                                    html_lines.append('<tr>')
                                    for cell in cells:
                                        html_lines.append(f'<td>{_process_table_cell(cell)}</td>')
                                    html_lines.append('</tr>')
                                html_lines.append('</tbody>')
                            
                            html_lines.append('</table></div>')
                            last_was_block = True
                            continue
            
            # Se não for tabela válida, voltar ao índice original
            i = table_start
        
        # Parágrafos normais com formatação inline
        formatted_line = _format_inline(stripped)
        html_lines.append(f'<p>{formatted_line}</p>')
        last_was_block = False
        i += 1
    
    # Fechar tags abertas no final
    if in_code_block:
        html_lines.append('</code></pre>')
    if in_list:
        html_lines.append(f'</{list_type}>')
    if in_quote:
        html_lines.append('</blockquote>')
    
    return '\n'.join(html_lines)


class FirebaseAIService:
    """
    Serviço para interação com Vertex AI através do Firebase
    """
    
    def __init__(self):
        self.project_id = config('FIREBASE_PROJECT_ID', default='lura-ai')
        self.location = config('VERTEX_AI_LOCATION', default='us-central1')
        self.firebase_app = get_firebase_app()
        self.is_configured = is_firebase_configured()
        # Modo de desenvolvimento mock: quando true, respostas serão simuladas
        self.dev_mock = config('FIREBASE_AI_DEV_MOCK', default='false').lower() in ('1', 'true', 'yes')
        if self.dev_mock:
            print("⚠️ FIREBASE_AI_DEV_MOCK habilitado: usando respostas simuladas para AI")
        
        # Se estamos no modo mock, não inicializamos Vertex AI
        if not self.dev_mock and self.is_configured:
            self._initialize_vertex_ai()
    
    def _initialize_vertex_ai(self):
        """Inicializa o cliente Google AI"""
        try:
            import google.generativeai as genai
            
            # Configura o cliente com a API key do .env
            # Use decouple.config so local .env files are read when running Django locally
            api_key = config('GOOGLE_AI_API_KEY', default=None)
            if not api_key:
                raise ValueError("GOOGLE_AI_API_KEY não encontrada nas variáveis de ambiente")
                
            genai.configure(api_key=api_key)
            print("✅ Google AI inicializado com sucesso")
            
        except ImportError as e:
            print(f"❌ Erro ao importar Google Generative AI: {e}")
            self.is_configured = False
        except Exception as e:
            print(f"❌ Erro ao inicializar Google AI: {e}")
            self.is_configured = False

    def _get_generative_model(self, model_name: str = "gemini-pro"):
        """
        Instancia um modelo generativo usando Google's Generative AI.
        Retorna o modelo ou None em caso de erro.
        """
        try:
            import google.generativeai as genai
            canon_name = canonicalize_model_name(model_name)
            model = genai.GenerativeModel(canon_name)
            print(f"✅ Modelo {canon_name} carregado via Google Generative AI")
            return model, canon_name
        except Exception as e:
            print(f"❌ Erro ao carregar modelo {model_name}: {str(e)}")
            return None, None
    
    async def generate_text(
        self, 
        prompt: str, 
        model_name: str = None,
        max_output_tokens: int = 1024,
        temperature: float = 0.7,
        top_p: float = 0.8,
        top_k: int = 40
    ) -> Dict[str, Any]:
        """
        Gera texto usando Google's Generative AI
        """
        if self.dev_mock:
            # Retornar resposta simulada para desenvolvimento
            return {
                'success': True,
                'text': f"[DEV MOCK] Resposta simulada para: {prompt[:50]}...",
                'model': 'dev-mock',
                'usage': {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}
            }
            
        # Load default/fallback models from env
        default_model = config('GOOGLE_AI_DEFAULT_MODEL', default='models/gemini-pro-latest')
        fallback_models = config('GOOGLE_AI_FALLBACK_MODELS', default='models/gemini-2.5-pro,models/gemini-flash-latest,models/gemini-2.5-flash,models/gemini-flash-lite-latest')
        fallback_list = [m.strip() for m in fallback_models.split(',') if m.strip()]
        # Use provided model_name or default
        requested_model = model_name or default_model
        all_candidates = [requested_model] + [m for m in fallback_list if m != requested_model]

        last_err = None
        def _extract_text_from_response(response) -> str:
            # Try multiple strategies to obtain a textual result from the response
            try:
                # quick accessor if available
                text = getattr(response, 'text', None)
                if text:
                    return text
            except Exception:
                pass

            # Check for candidates with parts
            try:
                candidates = getattr(response, 'candidates', None)
                if candidates:
                    pieces = []
                    for c in candidates:
                        # candidate may have parts (list with .text) or text-like properties
                        parts = getattr(c, 'parts', None)
                        if parts:
                            for p in parts:
                                t = getattr(p, 'text', None) or (p.get('text') if isinstance(p, dict) else None)
                                if t:
                                    pieces.append(t)
                        else:
                            # try common props
                            t = getattr(c, 'text', None) or getattr(c, 'content', None) or (c.get('text') if isinstance(c, dict) else None)
                            if t:
                                pieces.append(t)
                    if pieces:
                        return "\n".join(pieces)
            except Exception:
                pass

            # Fallback: check response as mapping/dict-like
            try:
                if isinstance(response, dict):
                    for k in ('text', 'content', 'message'):
                        if k in response and response[k]:
                            return response[k]
            except Exception:
                pass

            # Last resort: string representation
            try:
                # Don't return the raw string representation of the proto/response object
                # as that makes its way to the frontend (looks like GenerateContentResponse(...)).
                # Instead, log the raw response for debugging and return empty string so
                # caller can trigger retry/fallback behavior.
                try:
                    print(f"[AI DEBUG] Raw response object (no text extracted): {type(response)}")
                    # attempt a compact repr but do not use it as returned content
                    raw_preview = repr(response)
                    # avoid logging excessively large blobs
                    if len(raw_preview) > 1000:
                        raw_preview = raw_preview[:1000] + '...'
                    print(f"[AI DEBUG] Raw response preview: {raw_preview}")
                except Exception:
                    pass
                return ''
            except Exception:
                return ''

        # Configure how many automatic continuation attempts we'll perform
        max_retries = int(config('GOOGLE_AI_MAX_RETRIES', default='3'))

        for candidate in all_candidates:
            model, resolved_name = self._get_generative_model(candidate)
            if not model:
                continue
            try:
                # initial request
                response = model.generate_content(
                    prompt,
                    generation_config={
                        'max_output_tokens': max_output_tokens,
                        'temperature': temperature,
                        'top_p': top_p,
                        'top_k': top_k
                    }
                )

                text_out = _extract_text_from_response(response)
                finish_reason = None
                try:
                    if getattr(response, 'candidates', None):
                        cand0 = response.candidates[0]
                        finish_reason = getattr(cand0, 'finish_reason', None) or getattr(response, 'finish_reason', None)
                    else:
                        finish_reason = getattr(response, 'finish_reason', None)
                except Exception:
                    finish_reason = None

                retried = False
                combined_text = text_out or ''
                combined_usage = {
                    'prompt_tokens': getattr(response, 'prompt_token_count', 0),
                    'completion_tokens': (response.candidates[0].token_count if getattr(response, 'candidates', None) else getattr(response, 'token_count', 0)),
                    'total_tokens': (getattr(response, 'prompt_token_count', 0) + (response.candidates[0].token_count if getattr(response, 'candidates', None) else getattr(response, 'token_count', 0)))
                }

                # if truncated (no text or finished by max tokens), attempt controlled retries to assemble full response
                need_retry = (not combined_text) or (isinstance(finish_reason, str) and 'MAX' in finish_reason.upper())
                retries = 0
                while need_retry and retries < max_retries:
                    retries += 1
                    retried = True
                    # progressively increase allowed tokens but respect env cap
                    try:
                        env_cap = int(config('GOOGLE_AI_MAX_OUTPUT_TOKENS', default='4096'))
                    except Exception:
                        env_cap = 4096
                    retry_tokens = min(max_output_tokens * (2 ** retries), env_cap)
                    print(f"🔁 Generation retry {retries}/{max_retries} with max_output_tokens={retry_tokens} due to finish_reason={finish_reason} or empty output")
                    try:
                        response2 = model.generate_content(
                            prompt,
                            generation_config={
                                'max_output_tokens': retry_tokens,
                                'temperature': temperature,
                                'top_p': top_p,
                                'top_k': top_k
                            }
                        )
                    except Exception as e:
                        print(f"⚠️ Retry attempt failed: {e}")
                        break

                    text2 = _extract_text_from_response(response2)
                    # merge outputs conservatively
                    if text2:
                        if combined_text:
                            combined_text = combined_text.rstrip() + "\n\n" + text2.lstrip()
                        else:
                            combined_text = text2

                    # merge usage if available
                    try:
                        p1 = combined_usage.get('prompt_tokens', 0)
                        c1 = combined_usage.get('completion_tokens', 0)
                        t1 = combined_usage.get('total_tokens', 0)
                        p2 = getattr(response2, 'prompt_token_count', 0)
                        c2 = (response2.candidates[0].token_count if getattr(response2, 'candidates', None) else getattr(response2, 'token_count', 0))
                        t2 = p2 + c2
                        combined_usage = {'prompt_tokens': p1 + p2, 'completion_tokens': c1 + c2, 'total_tokens': t1 + t2}
                    except Exception:
                        pass

                    # update finish reason
                    try:
                        if getattr(response2, 'candidates', None):
                            finish_reason = getattr(response2.candidates[0], 'finish_reason', finish_reason)
                        else:
                            finish_reason = getattr(response2, 'finish_reason', finish_reason)
                    except Exception:
                        pass

                    need_retry = (not combined_text) or (isinstance(finish_reason, str) and 'MAX' in finish_reason.upper())

                # If still truncated due to MAX_TOKENS after token-increase retries, try explicit continuation prompts
                if (not combined_text) or (isinstance(finish_reason, str) and 'MAX' in str(finish_reason).upper()):
                    cont_attempts = 0
                    while cont_attempts < max_retries:
                        cont_attempts += 1
                        try:
                            # Ask the model to continue the previous answer explicitly
                            cont_prompt = f"Por favor, continue a resposta anterior.\n\nResposta anterior:\n{combined_text}\n\nContinue a partir daqui:" if combined_text else f"Por favor, continue a resposta para: {prompt}"
                            retry_tokens = min(int(config('GOOGLE_AI_MAX_OUTPUT_TOKENS', default='4096')), max_output_tokens * (2 ** (retries + cont_attempts)))
                            print(f"🔁 Continuation attempt {cont_attempts}/{max_retries} with max_output_tokens={retry_tokens}")
                            response_cont = model.generate_content(
                                cont_prompt,
                                generation_config={
                                    'max_output_tokens': retry_tokens,
                                    'temperature': temperature,
                                    'top_p': top_p,
                                    'top_k': top_k
                                }
                            )
                            text_cont = _extract_text_from_response(response_cont)
                            if text_cont:
                                if combined_text:
                                    combined_text = combined_text.rstrip() + "\n\n" + text_cont.lstrip()
                                else:
                                    combined_text = text_cont
                                # merge usage conservatively
                                try:
                                    p_old = combined_usage.get('prompt_tokens', 0)
                                    c_old = combined_usage.get('completion_tokens', 0)
                                    p_new = getattr(response_cont, 'prompt_token_count', 0)
                                    c_new = (response_cont.candidates[0].token_count if getattr(response_cont, 'candidates', None) else getattr(response_cont, 'token_count', 0))
                                    combined_usage = {'prompt_tokens': p_old + p_new, 'completion_tokens': c_old + c_new, 'total_tokens': p_old + c_old + p_new + c_new}
                                except Exception:
                                    pass
                                # check finish reason
                                try:
                                    if getattr(response_cont, 'candidates', None):
                                        finish_reason = getattr(response_cont.candidates[0], 'finish_reason', finish_reason)
                                    else:
                                        finish_reason = getattr(response_cont, 'finish_reason', finish_reason)
                                except Exception:
                                    pass
                            # stop if not truncated anymore
                            if not (isinstance(finish_reason, str) and 'MAX' in str(finish_reason).upper()):
                                break
                        except Exception as e:
                            print(f"⚠️ Continuation attempt failed: {e}")
                            break

                _log_model_usage(resolved_name)

                # Prepare final return values (use combined_text/usage if retried)
                final_text = combined_text
                final_usage = combined_usage

                return {
                    'success': True,
                    'text': final_text,
                    'content': final_text,  # legacy key for compatibility
                    'content_html': _markdown_to_html(final_text),
                    'model': resolved_name,
                    'usage': final_usage,
                    'truncated': bool(retried) and (isinstance(finish_reason, str) and 'MAX' in finish_reason.upper()),
                    'finish_reason': finish_reason
                }
            except Exception as e:
                print(f"⚠️ Falha ao usar modelo {resolved_name}: {e}")
                last_err = e
                continue
        # If all candidates fail
        print(f"❌ Todos os modelos falharam: {[c for c in all_candidates]}")
        return {
            'success': False,
            'error': f'Nenhum modelo disponível. Último erro: {last_err}'
        }
            
        try:
            # Generate content using the model
            try:
                response = model.generate_content(
                    prompt,
                    generation_config={
                        'max_output_tokens': max_output_tokens,
                        'temperature': temperature,
                        'top_p': top_p,
                        'top_k': top_k
                    }
                )
            except Exception as e:
                # If the model is not found or not supported for generate_content,
                # attempt to list available models and try them as fallbacks.
                print(f"⚠️ Falha ao usar modelo {model_name}: {e}. Tentando fallbacks...")
                try:
                    import google.generativeai as genai
                    available = []
                    try:
                        # list_models may return an iterable of model objects or dicts
                        available = genai.list_models()
                    except Exception:
                        # If listing fails, fall back to a conservative candidate list
                        available = []

                    tried = []
                    success = False
                    last_err = None
                    # normalize available into names if possible
                    candidate_names = []
                    for m in available:
                        if isinstance(m, str):
                            candidate_names.append(m)
                        else:
                            # try common attributes
                            name = getattr(m, 'name', None) or m.get('name') if isinstance(m, dict) else None
                            if name:
                                candidate_names.append(name)

                    # append some common candidates as last resort
                    candidate_names.extend(['text-bison@001', 'text-bison', 'gemini-pro', 'gemini-1'])

                    for cand in candidate_names:
                        if not cand or cand in tried:
                            continue
                        tried.append(cand)
                        try:
                            cand_model = genai.GenerativeModel(cand)
                            response = cand_model.generate_content(
                                prompt,
                                generation_config={
                                    'max_output_tokens': max_output_tokens,
                                    'temperature': temperature,
                                    'top_p': top_p,
                                    'top_k': top_k
                                }
                            )
                            model_name = cand
                            model = cand_model
                            success = True
                            break
                        except Exception as e2:
                            last_err = e2
                            continue

                    if not success:
                        # re-raise the original exception if no fallback worked
                        raise e
                except Exception:
                    # If fallback attempts fail, raise the original exception
                    raise
            
            return {
                'success': True,
                'text': getattr(response, 'text', getattr(response, 'content', '')),
                'model': model_name,
                'usage': {
                    'prompt_tokens': getattr(response, 'prompt_token_count', 0),
                    'completion_tokens': (response.candidates[0].token_count if getattr(response, 'candidates', None) else getattr(response, 'token_count', 0)),
                    'total_tokens': (getattr(response, 'prompt_token_count', 0) + (response.candidates[0].token_count if getattr(response, 'candidates', None) else getattr(response, 'token_count', 0)))
                }
            }
            
        except Exception as e:
            print(f"❌ Erro ao gerar texto: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
        """
        Gera texto usando um modelo generativo
        
        Args:
            prompt: Texto de entrada para o modelo
            model_name: Nome do modelo (ex: 'gemini-pro')
            max_output_tokens: Número máximo de tokens na resposta
            temperature: Controla aleatoriedade (0.0-2.0)
            top_p: Controla diversidade (0.0-1.0)
            top_k: Limita o vocabulário considerado
            
        Returns:
            Dicionário com resposta do modelo
        """
        # Modo de desenvolvimento: retornar resposta simulada rápida
        if self.dev_mock:
            sample = f"[MOCK] Resposta simulada para prompt: {prompt[:200]}"
            return {
                'success': True,
                'content': sample,
                'model': 'mock',
                'usage': {
                    'prompt_tokens': len(prompt.split()),
                    'completion_tokens': len(sample.split()),
                },
                'metadata': {
                    'temperature': temperature,
                    'max_tokens': max_output_tokens
                }
            }

        if not self.is_configured:
            return {
                'success': False,
                'error': 'Firebase AI não está configurado'
            }
        
        # (Firebase AI Logic legacy block omitted)
    
    async def generate_text_stream(
        self,
        prompt: str,
        model_name: str = None,
        max_output_tokens: int = 1024,
        temperature: float = 0.7,
        top_p: float = 0.8,
        top_k: int = 40
    ):
        """
        Gera texto com streaming em tempo real (word-by-word)
        Yields chunks de texto conforme são gerados pela IA
        """
        if self.dev_mock:
            # Mock streaming para desenvolvimento
            mock_text = f"Resposta simulada em streaming para: {prompt[:50]}..."
            for word in mock_text.split():
                yield {
                    'type': 'content',
                    'text': word + ' ',
                    'done': False
                }
                import asyncio
                await asyncio.sleep(0.05)
            yield {'type': 'done', 'done': True}
            return
        
        # Load default/fallback models
        default_model = config('GOOGLE_AI_DEFAULT_MODEL', default='models/gemini-pro-latest')
        fallback_models = config('GOOGLE_AI_FALLBACK_MODELS', default='models/gemini-2.5-pro,models/gemini-flash-latest,models/gemini-2.5-flash,models/gemini-flash-lite-latest')
        fallback_list = [m.strip() for m in fallback_models.split(',') if m.strip()]
        requested_model = model_name or default_model
        all_candidates = [requested_model] + [m for m in fallback_list if m != requested_model]
        
        last_err = None
        for candidate in all_candidates:
            model, resolved_name = self._get_generative_model(candidate)
            if not model:
                continue
            
            try:
                print(f"🔄 Iniciando streaming com modelo {resolved_name}")
                
                # Generate content com streaming habilitado
                response = model.generate_content(
                    prompt,
                    generation_config={
                        'max_output_tokens': max_output_tokens,
                        'temperature': temperature,
                        'top_p': top_p,
                        'top_k': top_k
                    },
                    stream=True  # ATIVA O STREAMING!
                )
                
                accumulated_text = ""
                chunk_count = 0
                
                # Itera sobre os chunks conforme chegam
                for chunk in response:
                    try:
                        # Extrai texto do chunk
                        chunk_text = ""
                        if hasattr(chunk, 'text'):
                            chunk_text = chunk.text
                        elif hasattr(chunk, 'candidates') and chunk.candidates:
                            if hasattr(chunk.candidates[0], 'content'):
                                if hasattr(chunk.candidates[0].content, 'parts'):
                                    for part in chunk.candidates[0].content.parts:
                                        if hasattr(part, 'text'):
                                            chunk_text += part.text
                        
                        if chunk_text:
                            accumulated_text += chunk_text
                            chunk_count += 1
                            
                            # Envia o chunk para o cliente
                            yield {
                                'type': 'content',
                                'text': chunk_text,
                                'accumulated': accumulated_text,
                                'done': False
                            }
                    
                    except Exception as e:
                        print(f"⚠️ Erro ao processar chunk: {e}")
                        continue
                
                # Finaliza o streaming
                _log_model_usage(resolved_name)
                
                yield {
                    'type': 'done',
                    'done': True,
                    'total_text': accumulated_text,
                    'content_html': _markdown_to_html(accumulated_text),
                    'model': resolved_name,
                    'chunks': chunk_count
                }
                
                print(f"✅ Streaming completado: {chunk_count} chunks, {len(accumulated_text)} caracteres")
                return
                
            except Exception as e:
                print(f"⚠️ Falha no streaming com modelo {resolved_name}: {e}")
                last_err = e
                continue
        
        # Se todos os modelos falharem
        yield {
            'type': 'error',
            'error': f'Nenhum modelo disponível para streaming. Último erro: {last_err}',
            'done': True
        }
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model_name: str = "gemini-pro",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Chat com contexto de múltiplas mensagens
        
        Args:
            messages: Lista de mensagens [{"role": "user|assistant", "content": "..."}]
            model_name: Nome do modelo
            **kwargs: Parâmetros adicionais para geração
            
        Returns:
            Dicionário com resposta do chat
        """
        # Modo de desenvolvimento: resposta de chat mock
        if self.dev_mock:
            last = messages[-1]['content'] if messages else ''
            sample = f"[MOCK_CHAT] Echo: {last[:300]}"
            return {
                'success': True,
                'content': sample,
                'model': 'mock',
                'conversation_id': 'mock-conv-1',
                'usage': {
                    'prompt_tokens': sum(len(m.get('content','').split()) for m in messages),
                    'completion_tokens': len(sample.split())
                }
            }

        if not self.is_configured:
            return {
                'success': False,
                'error': 'Firebase AI não está configurado'
            }
        
        try:
            # Tentar instanciar modelo com fallback
            model, resolved_name = self._get_generative_model(model_name)
            if model is None:
                raise RuntimeError(f"Modelo de chat não disponível: tried candidates for '{model_name}'")
            
            # Converter mensagens para formato do Vertex AI
            history = []
            for msg in messages[:-1]:  # Todas exceto a última
                role = "user" if msg["role"] == "user" else "model"
                history.append({
                    "role": role,
                    "parts": [{"text": msg["content"]}]
                })
            
            # Iniciar chat com histórico e tentar envio
            try:
                chat = model.start_chat(history=history)
                last_message = messages[-1]["content"]
                response = chat.send_message(last_message)
            except Exception as e:
                # tentar fallbacks de chat
                last_exc = e
                for fb in ["chat-bison@001", "text-bison@001"]:
                    try:
                        from vertexai.generative_models import GenerativeModel
                        fb_model = GenerativeModel(fb)
                        chat = fb_model.start_chat(history=history)
                        last_message = messages[-1]["content"]
                        response = chat.send_message(last_message)
                        model_name = fb
                        model = fb_model
                        break
                    except Exception as e2:
                        last_exc = e2
                        continue

                else:
                    raise last_exc
            
            # extract text robustly from chat response
            try:
                chat_text = getattr(response, 'text', None)
            except Exception:
                chat_text = None

            if not chat_text:
                # try candidates/parts
                try:
                    candidates = getattr(response, 'candidates', None)
                    if candidates:
                        parts = []
                        for c in candidates:
                            p = getattr(c, 'parts', None)
                            if p:
                                for part in p:
                                    parts.append(getattr(part, 'text', '') or (part.get('text') if isinstance(part, dict) else ''))
                            else:
                                parts.append(getattr(c, 'text', '') or (c.get('text') if isinstance(c, dict) else ''))
                        chat_text = '\n'.join([p for p in parts if p])
                except Exception:
                    chat_text = None

            chat_text = chat_text or ''
            
            # Usar a mesma função de formatação markdown robusta
            content_html = _markdown_to_html(chat_text)

            # detect finish reason if available
            finish_reason = None
            try:
                if getattr(response, 'candidates', None):
                    finish_reason = getattr(response.candidates[0], 'finish_reason', None) or getattr(response, 'finish_reason', None)
                else:
                    finish_reason = getattr(response, 'finish_reason', None)
            except Exception:
                finish_reason = None

            # multi-retry continuation logic
            max_retries = int(config('GOOGLE_AI_MAX_RETRIES', default='3'))
            retried = False
            combined_text = chat_text or ''
            combined_usage = {
                'prompt_tokens': sum(len(msg["content"].split()) for msg in messages),
                'completion_tokens': len(chat_text.split()) if chat_text else 0,
            }

            need_retry = (not combined_text) or (isinstance(finish_reason, str) and 'MAX' in finish_reason.upper())
            retries = 0
            while need_retry and retries < max_retries:
                retries += 1
                retried = True
                try:
                    env_cap = int(config('GOOGLE_AI_MAX_OUTPUT_TOKENS', default='4096'))
                except Exception:
                    env_cap = 4096
                retry_tokens = min(2048 * (2 ** (retries-1)), env_cap)
                print(f"🔁 Chat retry {retries}/{max_retries} with max_output_tokens={retry_tokens} due to finish_reason={finish_reason} or empty output")
                try:
                    response2 = chat.send_message(last_message)
                except Exception as e:
                    print(f"⚠️ Chat retry attempt failed: {e}")
                    break

                text2 = None
                try:
                    text2 = getattr(response2, 'text', None)
                except Exception:
                    text2 = None
                if not text2:
                    try:
                        candidates2 = getattr(response2, 'candidates', None)
                        if candidates2:
                            parts = []
                            for c in candidates2:
                                p = getattr(c, 'parts', None)
                                if p:
                                    for part in p:
                                        parts.append(getattr(part, 'text', '') or (part.get('text') if isinstance(part, dict) else ''))
                                else:
                                    parts.append(getattr(c, 'text', '') or (c.get('text') if isinstance(c, dict) else ''))
                            text2 = '\n'.join([p for p in parts if p])
                    except Exception:
                        text2 = None

                if text2:
                    if combined_text:
                        combined_text = combined_text.rstrip() + "\n\n" + text2.lstrip()
                    else:
                        combined_text = text2
                    combined_usage['completion_tokens'] = combined_usage.get('completion_tokens', 0) + (len(text2.split()) if text2 else 0)

                try:
                    if getattr(response2, 'candidates', None):
                        finish_reason = getattr(response2.candidates[0], 'finish_reason', finish_reason)
                    else:
                        finish_reason = getattr(response2, 'finish_reason', finish_reason)
                except Exception:
                    pass

                need_retry = (not combined_text) or (isinstance(finish_reason, str) and 'MAX' in finish_reason.upper())

            return {
                'success': True,
                'content': combined_text,
                'text': combined_text,
                'content_html': _markdown_to_html(combined_text),
                'model': model_name,
                'conversation_id': id(chat),  # ID único da conversa
                'usage': combined_usage,
                'truncated': bool(retried) and (isinstance(finish_reason, str) and 'MAX' in finish_reason.upper()),
                'finish_reason': finish_reason
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'model': model_name
            }
    
    async def agriculture_assistant(
        self,
        query: str,
        context: Optional[Dict[str, str]] = None,
        language: str = "pt"
    ) -> Dict[str, Any]:
        """
        Assistente especializado em agricultura
        
        Args:
            query: Pergunta do usuário
            context: Contexto adicional (localização, cultura, etc.)
            language: Idioma da resposta
            
        Returns:
            Resposta especializada em agricultura
        """
        system_prompt = {
            "pt": """Você é um assistente especializado em agricultura e agronegócio, 
            focado em ajudar agricultores em Moçambique. Forneça conselhos práticos, 
            relevantes e baseados em evidências científicas. Considere o clima tropical, 
            as culturas locais e os desafios específicos da região.""",
            
            "en": """You are an agricultural and agribusiness specialist assistant, 
            focused on helping farmers in Mozambique. Provide practical, relevant advice 
            based on scientific evidence. Consider the tropical climate, local crops, 
            and specific challenges of the region."""
        }
        
        prompt = system_prompt.get(language, system_prompt["pt"])
        
        if context:
            prompt += "\n\nContexto:\n"
            for key, value in context.items():
                prompt += f"- {key}: {value}\n"
        
        prompt += f"\n\nPergunta: {query}"
        
        return await self.generate_text(
            prompt,
            temperature=0.7,
            max_output_tokens=1024
        )
    
    async def pest_disease_analysis(
        self,
        description: str,
        crop_type: Optional[str] = None,
        symptoms: Optional[List[str]] = None,
        language: str = "pt"
    ) -> Dict[str, Any]:
        """
        Análise de pragas e doenças
        """
        base_prompts = {
            "pt": "Como especialista em fitopatologia e entomologia, analise:",
            "en": "As a plant pathology and entomology expert, analyze:"
        }
        
        prompt = base_prompts.get(language, base_prompts["pt"])
        prompt += f"\n\nDescrição: {description}"
        
        if crop_type:
            prompt += f"\nCultura: {crop_type}"
        
        if symptoms:
            prompt += f"\nSintomas: {', '.join(symptoms)}"
        
        questions = {
            "pt": [
                "1. Possíveis pragas ou doenças",
                "2. Métodos de diagnóstico",
                "3. Tratamentos recomendados",
                "4. Medidas preventivas",
                "5. Quando buscar ajuda profissional"
            ],
            "en": [
                "1. Possible pests or diseases", 
                "2. Diagnostic methods",
                "3. Recommended treatments",
                "4. Prevention measures",
                "5. When to seek professional help"
            ]
        }
        
        prompt += "\n\nForneça:\n" + "\n".join(questions.get(language, questions["pt"]))
        
        return await self.generate_text(
            prompt,
            temperature=0.5,  # Menos aleatoriedade para análises técnicas
            max_output_tokens=1536
        )
    
    def get_service_status(self) -> Dict[str, Any]:
        """
        Retorna status do serviço Firebase AI
        """
        return {
            'firebase_configured': self.is_configured,
            'project_id': self.project_id,
            'location': self.location,
            'available_models': [
                'gemini-pro',
                'gemini-pro-vision'
            ] if self.is_configured else []
        }