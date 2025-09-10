# Dockerfile para Backend (Django)
FROM python:3.11-alpine

# Configurações
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Dependências do sistema (incluindo compiladores para NumPy)
RUN apk update && apk add --no-cache \
        postgresql-dev \
        gcc \
        g++ \
        musl-dev \
        libffi-dev \
        linux-headers \
        python3-dev \
        build-base \
        openblas-dev \
        lapack-dev \
        gfortran \
    && rm -rf /var/cache/apk/*

# Diretório de trabalho
WORKDIR /app

# Instalar dependências Python (apenas básicas)
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Criar usuário não-root
RUN addgroup -g 1001 -S app \
    && adduser -S -D -h /app -s /bin/sh -G app -u 1001 app \
    && chown -R app:app /app
USER app

# Expor porta
EXPOSE 8000

# Comando padrão
CMD ["gunicorn", "agroalerta.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
