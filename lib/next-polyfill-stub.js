// Intentionally empty — replaces Next's built-in client polyfills in
// production builds via `turbopack.resolveAlias` in next.config.ts.
//
// The original (next/dist/build/polyfills/polyfill-module.js, 1.4 KB raw /
// ~13.7 KB counted by Lighthouse's "Legacy JavaScript" audit) shims
// Array.prototype.at, Object.hasOwn, Object.fromEntries,
// String.trimStart/trimEnd, flat/flatMap, Promise.finally,
// Symbol.description and URL.canParse. Every browser in this project's
// browserslist (chrome/edge/firefox >= 93, safari >= 15.4) ships those
// natively, and URL.canParse is only referenced by Next's dev-only
// hot-reloader, so production code never depends on the shim.
module.exports = {};
