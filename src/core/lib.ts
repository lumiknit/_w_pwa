import toast from "solid-toast";
import { z } from "zod";

export const displays = [
  "standalone",
  "browser",
  "minimal-ui",
  "fullscreen",
] as const;
export const displaySchema = z.enum(displays);
export type Display = z.infer<typeof displaySchema>;

export const iconMimes = ["image/png", "image/jpeg"] as const;
export const iconMimeSchema = z.enum(iconMimes);
export type IconMime = z.infer<typeof iconMimeSchema>;

export const iconPurposes = [
  "any",
  "monochrome",
  "maskable",
  "maskable any",
] as const;
export const iconPurposeSchema = z.enum(iconPurposes);
export type IconPurpose = z.infer<typeof iconPurposeSchema>;

export const iconPurposeOptions: {
  label: string;
  value: IconPurpose | undefined;
}[] = [
  { label: "None", value: undefined },
  { label: "Maskable", value: "maskable" },
];

export const iconSchema = z.object({
  src: z.string(),
  sizes: z.string(),
  type: iconMimeSchema,
  purpose: iconPurposeSchema.optional(),
});
export type Icon = z.infer<typeof iconSchema>;

export const shortcutSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type Shortcut = z.infer<typeof shortcutSchema>;

export const manifestSchema = z.object({
  name: z.string(),
  short_name: z.string(),
  start_url: z.string(),
  display: displaySchema,
  background_color: z.string(),
  theme_color: z.string(),
  icons: z.array(iconSchema),
  shortcuts: z.array(shortcutSchema),

  // Non-manifest fields.
  // This fields are used only for the Web UI.
  _appliable_url: z.string().optional(),
});
export type Manifest = z.infer<typeof manifestSchema>;

export const defaultIcon = (): Icon => ({
  src: "",
  sizes: "128x128",
  type: iconMimes[0],
  purpose: undefined,
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

export const sanitizeManifest = (m: unknown): Manifest => {
  try {
    const parsed = manifestSchema.parse(m);
    if (parsed.icons.length === 0) {
      parsed.icons = [defaultIcon()];
    }
    parsed.start_url = normalizeStartURL(parsed.start_url);
    console.log(m, parsed);
    return parsed;
  } catch (error) {
    console.warn(
      "Failed to validate manifest, using defaults with merged data:",
      error,
    );
    const d = defaultManifest();
    const res = {
      ...d,
      ...(typeof m === "object" && m !== null ? m : {}),
    };

    const safeParsed = manifestSchema.safeParse(res);
    if (safeParsed.success) {
      if (safeParsed.data.icons.length === 0) {
        safeParsed.data.icons = [defaultIcon()];
      }
      safeParsed.data.start_url = normalizeStartURL(safeParsed.data.start_url);
      return safeParsed.data;
    }

    const fallback = defaultManifest();
    fallback.start_url = normalizeStartURL(fallback.start_url);
    return fallback;
  }
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

/**
 * Modify current page manifest to the given manifest.
 */
export const setCurrentPageManifest = async (manifest: Manifest) => {
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

export const cleanManifestForExport = (manifest: Manifest) => {
  const { _appliable_url, ...clean } = manifest;
  return clean;
};

export const manifestListToString = (manifests: Manifest[]) => {
  return manifests
    .map((m) => JSON.stringify(cleanManifestForExport(m)))
    .join("\n");
};

export const stringToManifestList = (str: string): Manifest[] => {
  const spl = str.split("\n");
  const res: Manifest[] = [];
  for (let s of spl) {
    s = s.trim();
    if (s === "") {
      continue;
    }
    try {
      const j = JSON.parse(s);
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
  localStorage.setItem("manifests", manifestListToString(manifests));
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
    .map((m) => {
      try {
        const parsed = JSON.parse(m);
        return sanitizeManifest(parsed);
      } catch (e) {
        console.warn("Failed to parse stored manifest:", m, e);
        return null;
      }
    })
    .filter((m): m is Manifest => m !== null);
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

export const getOpenUrl = (manifest: Manifest): string => {
  if (manifest._appliable_url) {
    if (manifest._appliable_url.startsWith("http")) {
      return manifest._appliable_url;
    }
    try {
      const baseUrl = new URL(manifest.start_url);
      return new URL(manifest._appliable_url, baseUrl).toString();
    } catch (e) {
      console.warn("Failed to compose URL:", e);
      return manifest.start_url;
    }
  }
  return manifest.start_url;
};
