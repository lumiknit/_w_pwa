import { Component, createSignal, onMount } from "solid-js";
import { manifestListToString, stringToManifestList } from "../core";
import {
  fetchTextFromURL,
  loadImportURL,
  saveImportURL,
} from "../core/import-url";
import toast from "solid-toast";
import { copyText } from "../core/clipboard";
import { manifestList, setManifestList } from "../store";
import { TbCopy, TbFileExport, TbFileImport } from "solid-icons/tb";

const Importer: Component = () => {
  const [title, setTitle] = createSignal("Imported / Exported JSON");

  let contentsRef: HTMLTextAreaElement = null!;
  let urlRef: HTMLInputElement = null!;

  onMount(() => {
    urlRef.value = loadImportURL();
  });

  const handleImportChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    saveImportURL(value);
  };

  const handleImportClick = () => {
    const str = contentsRef.value;
    const manifests = stringToManifestList(str);
    setManifestList(manifests);
    setTitle("Imported JSON");
    toast.success("Imported!");
  };

  const handleExportClick = () => {
    const str = manifestListToString(manifestList());
    contentsRef.value = str;
    setTitle("Exported JSON");

    // Copy to clipboard
    copyText(str);

    toast.success("Exported! See textarea and clipboard");
  };

  const handleLoadImportFromURLClick = async () => {
    const url = urlRef.value;
    if (!url) {
      toast.error("No URL found");
      return;
    }
    const task = (async () => {
      const text = await fetchTextFromURL(url);
      contentsRef.value = text;
    })();

    await toast.promise(task, {
      loading: `Loading from ${url}`,
      success: "Loaded",
      error: (e) => `Failed to load: ${e}`,
    });
  };

  const handleAllSiteScript = async () => {
    const code = (await import("../core/raw/patch-script.js?raw")).default
    .replace(/\n\s*/g, "")
    .replace("\"$url\"", JSON.stringify(urlRef.value));
    copyText(code);
    toast.success("Copied script to clipboard");
  };

  return (
    <>
      <h2> Import </h2>

      <label>
        {title()}
        <textarea ref={contentsRef!} />
      </label>

      <fieldset role="group">
        <button class="outline secondary" disabled>
          URL
        </button>
        <input
          ref={urlRef!}
          type="url"
          aria-label="url"
          onChange={handleImportChange}
        />
        <button onClick={handleLoadImportFromURLClick}>Load</button>
      </fieldset>

      <div role="group">
        <button onClick={handleImportClick}> <TbFileImport /> Import </button>
        <button class="contrast" onClick={handleExportClick}>
          <TbFileExport />
          Export All
        </button>
      </div>

      <div>
        <button onClick={handleAllSiteScript}>
          <TbCopy />
          Copy All Sites Script
        </button>
        <p>
          This copies a script which can be used all sites in the list of the URL.
        </p>
      </div>
    </>
  );
};

export default Importer;
