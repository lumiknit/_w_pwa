javascript: (async () => {
  try {
    let d = document;
    let s = d.createElement("script");
    s.src = "https://lumiknit.github.io/apps/pwa/patch.js";
    let r = await fetch("$url");
    let j = await r.text();
    let js = j.split('\n').filter(x => x.trim().startsWith('{')).map((l) => JSON.parse(l));
    s.onload = () => {console.log("A"); window.PWA(js);};
    d.body.append(s);
  } catch (e) {
    alert("Failed to load script: " + e);
  }
})();
