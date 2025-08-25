@echo off
echo Resolvendo problemas do Next.js...

echo Limpando cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .turbo rmdir /s /q .turbo

echo Iniciando servidor...
npm run dev
