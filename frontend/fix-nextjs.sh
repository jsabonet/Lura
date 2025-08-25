#!/bin/bash

echo "🔧 Resolvendo problemas do Next.js..."

# Limpar cache completamente
echo "🗑️ Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf out

# Verificar se existem problemas com arquivos de lock
echo "🔍 Verificando package-lock..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi

# Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install

# Criar arquivos necessários se não existirem
echo "📁 Criando arquivos necessários..."

# Criar .gitignore se não existir
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOF
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# turbo
.turbo
EOF
fi

echo "✅ Configuração concluída!"
echo "🚀 Para iniciar o servidor, use: npm run dev"
