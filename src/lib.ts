export const displays = ["standalone", "browser", "minimal-ui", "fullscreen"];
export const iconMimes = [
  "image/png",
  "image/jpeg",
  "image/svg",
  "image/x-icon",
];

export type Icon = {
  src: string;
  sizes: string;
  type: string;
};

export type Manifest = {
  name: string;
  short_name: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: Icon[];
};

export const defaultIcon = (): Icon => ({
  src: "",
  sizes: "128x128",
  type: iconMimes[0],
});

export const defaultManifest = (): Manifest => ({
  name: "App",
  short_name: "App",
  start_url: "www",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#000000",
  icons: [defaultIcon()],
});

export const linkPrefix = "https://lumiknit.github.io/apps/pwa/j.html?j=";
export const trimLink = (link: string) =>
  decodeURI(link.replace(linkPrefix, ""));
export const untrimLink = (link: string) =>
  linkPrefix + encodeURI(link.replace(/https?:\/\//, ""));

const el = (id: string) => document.getElementById(id) as HTMLElement;

export const updateSelfManifest = async (manifest: Manifest) => {
  const src = JSON.stringify(manifest);
  const blob = new Blob([src], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  el("man-ph").setAttribute("href", url);

  const link = document.createElement("link");
  link.rel = "manifest";
  link.setAttribute("href", "data:application/json;charset=8" + src);
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
      const m = {
        ...j,
        ...defaultManifest(),
      };
      if (m.icons.length === 0) {
        m.icons = [defaultIcon()];
      }
      res.push(m);
    } catch (e) {
      console.warn("Failed to parse manifest", s);
      continue;
    }
  }
  return res;
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
