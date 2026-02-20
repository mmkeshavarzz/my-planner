// ──────────────────────────────────────
// 🛡️ Service Worker - نگهبان آفلاین اپ
// نسخه کش رو هر بار که فایلت عوض شد، تغییر بده
// ──────────────────────────────────────

const CACHE_NAME = 'planner-cache-v1';

// لیست فایل‌هایی که میخوای آفلاین هم کار کنن
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ─── مرحله نصب: فایل‌ها رو کش کن ───
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 فایل‌ها کش شدن!');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // فوری فعال شو، منتظر نمون
  self.skipWaiting();
});

// ─── مرحله فعال‌سازی: کش‌های قدیمی رو پاک کن ───
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ کش قدیمی پاک شد:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ─── مرحله دریافت: اول کش، بعد اینترنت ───
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // اگه تو کش بود، از کش بده. نبود، از اینترنت بگیر
      return response || fetch(event.request);
    })
  );
});
