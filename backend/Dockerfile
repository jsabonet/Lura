# Dockerfile para Backend (Django)
FROM python:3.11-alpine

# Configurações
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND noninteractive

# Dependências do sistema
RUN apk update && apk add --no-cache \
        postgresql-dev \
        gcc \
        musl-dev \
        libffi-dev \
    && rm -rf /var/cache/apk/*

# Diretório de trabalho
WORKDIR /app

# Instalar dependências Python
COPY requirements.txt .
COPY requirements_prod.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements_prod.txt

# Copiar código
COPY . .

# Criar usuário não-root
RUN addgroup -g 1001 -S app \
    && adduser -S -D -h /app -s /bin/sh -G app -u 1001 app \
    && chown -R app:app /app
USER app

# Coletar arquivos estáticos
RUN python manage.py collectstatic --noinput

# Expor porta
EXPOSE 8000

# Comando padrão
CMD ["gunicorn", "agroalerta.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
