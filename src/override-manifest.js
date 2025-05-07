(() => {
  document
    .querySelectorAll('link[rel="manifest"]')
    .forEach((el) => el.remove());
  var manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = URL.createObjectURL(
    new Blob(["$json"], { type: "application/json" }),
  );
  document.head.appendChild(manifest);
  alert("Applied");
})();
