import toast from "solid-toast";

export const displays = ["standalone", "browser", "minimal-ui", "fullscreen"];

export const iconMimes = ["image/png", "image/jpeg"];

export const iconPurposes = ["any", "monochrome", "maskable", "maskable any"];

export type Icon = {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
};

export type Shortcut = {
  name: string;
  url: string;
};

export type Manifest = {
  name: string;
  short_name: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: Icon[];
  shortcuts: Shortcut[];
};

export const defaultIcon = (): Icon => ({
  src: "",
  sizes: "128x128",
  type: iconMimes[0],
  purpose: "maskable",
});

export const defaultManifest = (): Manifest => ({
  name: "App",
  short_name: "App",
  start_url: "www",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#000000",
  icons: [defaultIcon()],
  shortcuts: [],
});

export const sanitizeManifest = (m: Object) => {
  const d = defaultManifest();
  const res: any = {
    ...d,
    ...m,
  };
  Object.entries(d).forEach(([k, v]) => {
    if (typeof res[k] !== typeof v) {
      res[k] = v;
    }
  });
  if (res.icons.length === 0) {
    res.icons = [defaultIcon()];
  }
  res.start_url = normalizeStartURL(res.start_url);
  console.log(m, res);
  return res as Manifest;
};

export const linkPrefix = "https://lumiknit.github.io/apps/pwa/j.html?j=";
export const trimLink = (link: string) =>
  decodeURI(link.replace(linkPrefix, ""));
export const untrimLink = (link: string) =>
  linkPrefix + encodeURI(link.replace(/https?:\/\//, ""));

export const normalizeStartURL = (url: string) => {
  url = trimLink(url.trim());
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }
  return url;
};

const el = (id: string) => document.getElementById(id) as HTMLElement;

export const updateSelfManifest = async (manifest: Manifest) => {
  // Convert start_url to self url
  const m = { ...manifest, start_url: untrimLink(manifest.start_url) };

  const src = JSON.stringify(m);
  const blob = new Blob([src], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  el("man-ph").setAttribute("href", url);

  const link = document.createElement("link");
  link.rel = "manifest";
  link.setAttribute("href", "data:application/json;charset=8" + src);

  console.log("Updating manifest", m);

  toast.success("Manifest updated");
};

export const mansToStr = (manifests: Manifest[]) => {
  return manifests.map((m) => JSON.stringify(m)).join("\n");
};

export const strToMans = (str: string) => {
  const spl = str.split("\n");
  const res: Manifest[] = [];
  for (let s of spl) {
    s = s.trim();
    if (s === "") {
      continue;
    }
    try {
      const j = JSON.parse(s);
      if (typeof j !== "object") {
        throw new Error("Not an object");
      }
      const m = sanitizeManifest(j);
      res.push(m);
    } catch (e) {
      console.warn("Failed to parse manifest", s);
      continue;
    }
  }
  return res;
};

/** Add some more fields for chrome */
export const makeChromeManifest = (manifest: Manifest) => {
  try {
    const startURL = manifest.start_url;
    // Remove all paths
    const url = new URL(startURL);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    const newStartURL = url.toString();

    const m = {
      ...manifest,
      scope: newStartURL,
      shortcuts: manifest.shortcuts.map((s) => ({
        ...s,
        url: new URL(s.url, newStartURL).toString(),
      })),
    };
    return m;
  } catch (e) {
    console.error("Failed to make chrome manifest", e);
    return manifest;
  }
};

export const saveManifests = (manifests: Manifest[]) => {
  localStorage.setItem("manifests", mansToStr(manifests));
};

export const loadManifests = (): Manifest[] => {
  const v = localStorage.getItem("manifests");
  if (v === null) {
    return [];
  }
  return v
    .split("\n")
    .map((v) => v.trim())
    .filter((v) => v)
    .map((m) => JSON.parse(m));
};

export const getImageSizeAndMime = (url: string) =>
  new Promise<[number, number, string]>((resolve, reject) => {
    const img = new Image();
    console.log("Start");
    img.onload = () => {
      resolve([img.width, img.height, "image/png"]);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
