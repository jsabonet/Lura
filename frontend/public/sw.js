// Service Worker desabilitado para evitar problemas
// Este arquivo existe apenas para evitar erros 404

// Desregistra qualquer service worker existente
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

// Resposta padrão para evitar erros
self.addEventListener('fetch', function(event) {
  // Permitir que as requisições passem normalmente
  return;
});
