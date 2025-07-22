// Current opened manifest

import { createSignal, Setter } from "solid-js";
import {
  defaultManifest,
  Display,
  loadManifests,
  Manifest,
  sanitizeManifest,
  saveManifests,
} from "./core";

export const [manifest, setManifest] =
  createSignal<Manifest>(defaultManifest());
const [manifestList, setManifestList_] = createSignal<Manifest[]>([]);
export { manifestList };

export const setManifestList: Setter<Manifest[]> = (v) => {
  const u = setManifestList_(v as Manifest[]);
  saveManifests(u);
};

// Options
export const [fixDisplayAndColor, setFixDisplayAndColor] = createSignal(false);
export const [copyOnSelect, setCopyOnSelect] = createSignal(false);

// Methods

export const loadManifestsFromStorage = () => {
  const manifests = loadManifests();
  setManifestList(manifests);
};

export const addCurrentManifestToList = () => {
  setManifestList((s) => [manifest(), ...s]);
};

export const updateCurrentManifestToList = () => {
  setManifestList((s) => [
    manifest(),
    ...s.filter((m) => m.start_url !== manifest().start_url),
  ]);
};

export const clearAllManifests = () => {
  setManifestList([]);
};

export const delManifestFromList = (i: number): Manifest => {
  const m = manifestList()[i];
  setManifestList((s) => s.filter((_, idx) => idx !== i));
  return m;
};

export const openManifestFromList = (i: number) => {
  const old = manifest();
  const picked = manifestList()[i];

  if (fixDisplayAndColor()) {
    picked.display = old.display;
    picked.background_color = old.background_color;
    picked.theme_color = old.theme_color;
  }

  const m = sanitizeManifest(picked);

  setManifest(m);

  return m;
};

/**
 * Return the user script for all manifest lists.
 */
export const monkeyCode = async () => {
  let code = (await import("./core/raw/monkey.js?raw")).default;
  code = code.replace("$manifests", JSON.stringify(manifestList()));
  return code;
};

/**
 * Update all manifests in the list with new display mode and/or theme colors.
 */
export const bulkUpdateManifests = (options: {
  display?: Display;
  theme_color?: string;
  background_color?: string;
}) => {
  setManifestList((manifests) =>
    manifests.map((manifest) => ({
      ...manifest,
      ...(options.display && { display: options.display }),
      ...(options.theme_color && { theme_color: options.theme_color }),
      ...(options.background_color && {
        background_color: options.background_color,
      }),
    })),
  );
};
