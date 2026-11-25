/* Ihaw Nights offline cache. The version below changes automatically whenever the game changes.
   The game page itself is fetched fresh when online (saved copy is used offline), so phones get updates right away. */
const VERSION='ihaw-41d637a234';
const FILES=["./", "index.html", "manifest.webmanifest", "fonts.css", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "fonts/Baloo2.woff2", "fonts/Nunito.woff2"];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
function isPage(req){ const u=new URL(req.url); return req.mode==='navigate' || (u.origin===location.origin && /\/(index\.html)?$/.test(u.pathname)); }
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  if(isPage(req)){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(VERSION).then(c=>c.put('index.html',cp)); } return r; }).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).catch(()=>Response.error())));
});
