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

# Configurações de build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Garantir que node_modules nativo será construído com as ferramentas disponíveis
RUN npm run build

# Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid 1001 --create-home nextjs

COPY --from=builder /app/public ./public

# Copiando arquivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
