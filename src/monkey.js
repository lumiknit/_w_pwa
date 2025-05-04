// ==UserScript==
// @name         PWA for monkey
// @description  Override site's manifest.json
// @author       You
// @version      0.0.1
// @grant        none
// @namespace    PWA
// @include      http://*/*
// @include      https://*/*
// ==/UserScript==

(() => {
  "use strict";
  const manifests = $manifests;

  const host = window.location.host;

  // Find manifest
  const m = manifests.find((m) => {
    return m.start_url.includes(host);
  });

  if (!m) return;

  document
    .querySelectorAll('link[rel="manifest"]')
    .forEach((el) => el.remove());
  var manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = URL.createObjectURL(
    new Blob([JSON.stringify(m)], { type: "application/json" }),
  );
  document.head.appendChild(manifest);

  alert("Overrided");
})();
