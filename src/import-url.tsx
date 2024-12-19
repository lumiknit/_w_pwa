const importURLStorageKey = "loadURL";

/** Save url to local storage */
export const saveImportURL = (url: string) => {
  localStorage.setItem(importURLStorageKey, url);
};

/** Load url from local storage */
export const loadImportURL = (): string => {
  return localStorage.getItem(importURLStorageKey) || "";
};

/** Fetch text from the url */
export const fetchTextFromURL = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  return await res.text();
};
