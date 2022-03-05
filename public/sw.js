importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js");

const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { pageCache, offlineFallback } = workbox.recipes;
const { registerRoute, setDefaultHandler } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;

const CACHE_NAME_FONTS_STYLESHEETS = "google-fonts-stylesheets";
const CACHE_NAME_FONTS = "google-fonts";
const CACHE_NAME_IMAGES = "images";
const CACHE_NAME_STATIC = "static";
const CACHE_NAME_LOCALES = "locales";

self.addEventListener("fetch", _ => {
	// Set common caching patterns
	pageCache();
	offlineFallback({ pageFallback: "offline" });

	// Cache Google Fonts stylesheets
	registerRoute(
		({ url }) => url.origin === "https://fonts.googleapis.com",
		new StaleWhileRevalidate({
			cacheName: CACHE_NAME_FONTS_STYLESHEETS,
		})
	);

	// Cache Google Fonts files
	registerRoute(
		({ url }) => url.origin === "https://fonts.gstatic.com",
		new CacheFirst({
			cacheName: CACHE_NAME_FONTS,
			plugins: [
				new CacheableResponsePlugin({
					statuses: [0, 200],
				}),
				new ExpirationPlugin({
					maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
					maxEntries: 30,
					purgeOnQuotaError: true,
				}),
			],
		})
	);

	// Cache images
	registerRoute(
		({ request }) => request.destination === "image",
		new CacheFirst({
			cacheName: CACHE_NAME_IMAGES,
			plugins: [
				new ExpirationPlugin({
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
					maxEntries: 60,
					purgeOnQuotaError: true,
				}),
			],
		})
	);

	// Cache styles and scripts
	registerRoute(
		({ request }) => request.destination === "script" || request.destination === "style",
		new StaleWhileRevalidate({
			cacheName: CACHE_NAME_STATIC,
		})
	);

	// Cache locales files
	registerRoute(
		({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/locales/"),
		new StaleWhileRevalidate({
			cacheName: CACHE_NAME_LOCALES,
		})
	);
});
