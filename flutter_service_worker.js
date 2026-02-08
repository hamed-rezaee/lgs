'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "98b5a2b30834a12b2622246f6c83acb9",
"assets/AssetManifest.bin.json": "eba94e7fed7b98247028242e8879bb5b",
"assets/assets/buy_me_a_coffee_qr_code.png": "028f43121f750f0ca7e5892c9efcc584",
"assets/assets/documents/script_syntax_guide.md": "970fb64865f2d27f861f5c3d369deaf8",
"assets/assets/documents/user_guide.md": "53203a2304a8804ff33b655da8023ea5",
"assets/assets/fonts/share_tech_mono.ttf": "a1cea4ee23cd0a3e68cd6dcc1155613c",
"assets/assets/icons/bmc_logo.png": "2bb0d80ba5f3b8b559c0128b57baf294",
"assets/assets/icons/ic_google_logo.png": "2892cd76d5e83ef784811ce868b3fddd",
"assets/assets/icons/ic_logo.png": "40c51eb17b920077bcc9df5b3667bb14",
"assets/assets/samples/4_bit_alu.lgs": "8163cccf435914513a33edc46a8b1333",
"assets/assets/samples/7_segment.lgs": "4e6fe2063689dffedb60698fb687b0a9",
"assets/assets/samples/8_bit_counter.lgs": "a15098e20112a772c5dd9f4fc0684886",
"assets/assets/samples/custom_4x4_ram.lgs": "07a9b8a1685d4a2f7acd38c08aa3d907",
"assets/assets/samples/invader_matrix_display.lgs": "5ce27162c27aee6e443c198397e449bd",
"assets/assets/samples/keyboard_driver.lgs": "a2a51eb100593a29319d139c14a54971",
"assets/assets/samples/keypad_4x4_driver.lgs": "7f3943ab1dda1dccc281cfb5a4877a65",
"assets/assets/samples/lcd_hello_world.lgs": "a22ad712a1060d3b4389dc70f771ba3d",
"assets/FontManifest.json": "4b20ea24f99f750d1fe65ad139098e0e",
"assets/fonts/MaterialIcons-Regular.otf": "d6fbd81b7730f5e3b1484eb2a7aa0f20",
"assets/NOTICES": "69b9e5743d331446cb6e8f9105db34a6",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"favicon.png": "efb059ac863d3f2acef4dc781ec5c045",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"flutter_bootstrap.js": "e9f421e4f16e9d68a18cc69230d52dc9",
"icons/Icon-192.png": "6a5eecea9ed8735affae886164c03f57",
"icons/Icon-512.png": "d47d6e4c70b22f291a12ba8743c99ac4",
"icons/Icon-maskable-192.png": "6a5eecea9ed8735affae886164c03f57",
"icons/Icon-maskable-512.png": "d47d6e4c70b22f291a12ba8743c99ac4",
"index.html": "15e078cf97949a1a4458d9811f297945",
"/": "15e078cf97949a1a4458d9811f297945",
"main.dart.js": "b7b512cb4c0a0780469960d97c3dfe1e",
"main.dart.mjs": "55b627092ab8abe74915435eac7104b1",
"main.dart.wasm": "e2affd8ea6c21990156ce0c0036c8fb9",
"manifest.json": "271be5815d76798611c7c6f06ce5d606",
"robots.txt": "6340fbe30fd917581bdc1795d2dca6d6",
"share_tech_mono.ttf": "a1cea4ee23cd0a3e68cd6dcc1155613c",
"sitemap.xml": "8d8488a107741913ad9517c790655e2a",
"version.json": "7b6403defeebe6fbbfd45ab9bb6d39e2"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"main.dart.wasm",
"main.dart.mjs",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
