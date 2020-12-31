const CACHE_NAME = "jajankuy-v18";
const urlsToCache = [
    "/",
    "/index.html",
    "/index.php",
    "/products.json",
    "/styles/materialize.min.css",
    "/styles/style.css",
    "/scripts/materialize.min.js",
    "/scripts/storage.js",
    "/scripts/sw-config.js",
    "/scripts/app.js",
    "/scripts/liff-starter.js",
    "/images/assets/JK-icon.png",
    "/images/assets/JajanKuy.png",
    "/images/assets/profile.jpg",
    "/images/assets/undraw_Login_re_4vu2.svg",
    "/images/assets/undraw_add_to_cart_vkjp.svg",
    "/images/assets/undraw_order_confirmed_aaw7.svg",
    "/images/assets/undraw_happy_announcement_ac67.svg",
    "/images/photos/product-1.jpg",
    "/images/photos/product-2.jpg",
    "/images/photos/product-3.jpg",
    "/images/photos/product-4.jpg",
    "/images/photos/product-5.jpg",
    "/images/photos/product-6.jpg",
    "/images/photos/product-7.jpg",
    "/images/photos/product-8.jpg",
    "/images/photos/product-9.jpg",
    "/images/photos/product-10.jpg",
    "/images/photos/product-11.jpg",
    "/images/photos/product-12.jpg",
    "/images/photos/product-13.jpg",
    "/images/photos/product-14.jpg",
    "/images/photos/product-15.jpg",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://static.line-scdn.net/liff/edge/2/sdk.js"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
        .match(event.request, {
            cacheName: CACHE_NAME
        })
        .then(function (response) {
            if (response) {
                console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                return response;
            }

            console.log(
                "ServiceWorker: Memuat aset dari server: ",
                event.request.url
            );
            return fetch(event.request);
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});