const V='gallop-roll-v33';const FILES=['./','./index.html','./game.js','./game.js?v=33','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// network first so updates show up straight away; cached copy when offline
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))))});
