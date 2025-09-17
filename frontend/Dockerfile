# Dockerfile para Frontend (Next.js)
FROM node:18-bullseye-slim AS base

# Dependências para build (instaladas no estágio deps)
FROM base AS deps
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential \
	   python3 \
	   python3-pip \
	   ca-certificates \
	   git \
	&& rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci --unsafe-perm

# Build da aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If a prebuilt .next exists in the build context, copy it in so we can skip the build
# Configurações de build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Aumentar memória disponível para Node durante o build para evitar OOM/Bus errors
ENV NODE_OPTIONS=--max_old_space_size=2048
# Em ambientes com memória limitada, criamos temporariamente um swapfile para a etapa de build
RUN if [ -d ".next/standalone" ]; then echo "Found prebuilt .next/standalone — skipping build"; else \
			fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048; \
			chmod 600 /swapfile; mkswap /swapfile; swapon /swapfile; \
			npm run build || (echo "Primary build failed, retrying with reduced memory usage..." && NODE_OPTIONS=--max_old_space_size=1024 npm run build); \
			swapoff /swapfile; rm -f /swapfile; \
		fi

# Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid 1001 --create-home nextjs

COPY --from=builder /app/public ./public

# Copiando arquivos de build
## Copy the contents of the Next.js standalone into the workdir so server.js is at /app/server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy a small entrypoint to validate server file before starting
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chown nextjs:nodejs /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
