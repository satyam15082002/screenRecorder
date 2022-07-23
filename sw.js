self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('assets').then((cache) => cache.addAll([
      './index.html',
      './js/script.js',
      './css/style.css',
      './icon/recorder.svg',
      './manifest.json',
      './css/font-awesome-4.7.0/css/font-awesome.css',
      './css/font-awesome-4.7.0/css/font-awesome.min.css',
      './css/font-awesome-4.7.0/fonts/fontawesome-webfont.svg'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
