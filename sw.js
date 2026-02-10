const CACHE="freeze-tray-utility-v1";
const ASSETS=[
  "./",
  "./index.html",
  "./label.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/qrcode.js"
];

self.addEventListener("install",(e)=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate",(e)=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("fetch",(e)=>{
  e.respondWith((async()=>{
    const cached=await caches.match(e.request);
    if(cached) return cached;
    try { return await fetch(e.request); }
    catch(err){ return caches.match("./index.html"); }
  })());
});
