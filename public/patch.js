window.PWA = (manifests) => {
  // Find manifest
  const host = window.location.host;
  const m = manifests.find((m) => {
    return m.start_url.includes(host);
  });
  if (!m) {
    console.error("No manifest found for this host:", host);
    return;
  }
  const json = JSON.stringify(m, null, 2);
  document
    .querySelectorAll('link[rel="manifest"]')
    .forEach((el) => el.remove());
  var manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = URL.createObjectURL(
    new Blob([json], { type: "application/json" }),
  );
  document.head.appendChild(manifest);
  alert(`Applied: ${m.name} (${m.start_url})`);
};
