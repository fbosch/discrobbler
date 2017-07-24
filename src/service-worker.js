const CACHE_NAME = 'discrobbler-cache-v0.3'
const urlsToCache = [
    'index.html',
    './dist/build.js',
    './dist/record.svg',
    './dist/vinyls.svg'
]

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache)
        })
    )
})