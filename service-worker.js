self.addEventListener("install", (e) => {
    e.waitUntil(
      caches.open("rutina-cache").then((cache) => {
        return cache.addAll([
          "./",
          "./index.html",
          "./app.js",
          "./manifest.json",
          "./img/icon-192.png",
          "./img/icon-512.png",
          "./img/Logo - Innova Schools.png",
          "./img/logotipo2.png"
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (e) => {
    e.respondWith(
      caches.match(e.request).then((response) => {
        return response || fetch(e.request);
      })
    );
  });
  