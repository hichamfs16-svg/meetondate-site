// Date web app: offline shell. Hashed build files are cached for good; pages
// try the network first and fall back to the last copy. Anything that is not
// this site (the database, sign-in, photos) is never touched.
var V = 'date-20261107164805';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.add('/app/welcome/'); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.indexOf('/app') !== 0) return;
  if (u.pathname.indexOf('/app/_expo/static/') === 0) {
    e.respondWith(caches.match(r).then(function (hit) {
      return hit || fetch(r).then(function (res) {
        if (res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); }
        return res;
      });
    }));
    return;
  }
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).catch(function () { return caches.match('/app/welcome/'); }));
  }
});
