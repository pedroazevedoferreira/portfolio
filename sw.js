/*
  A primeira versão deste site registrava um service worker com cache offline.
  Este arquivo substitui aquele service worker para quem já visitou o site:
  apaga os caches antigos, remove o próprio registro e recarrega as abas abertas.
  A versão atual não registra nenhum service worker.
*/

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const chaves = await caches.keys();
      await Promise.all(chaves.map((chave) => caches.delete(chave)));
      await self.registration.unregister();
      const abas = await self.clients.matchAll({ type: "window" });
      abas.forEach((aba) => aba.navigate(aba.url));
    })()
  );
});
