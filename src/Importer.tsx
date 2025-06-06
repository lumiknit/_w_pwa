import { Component, onMount } from "solid-js";
import { Manifest, mansToStr, strToMans } from "./lib";
import { fetchTextFromURL, loadImportURL, saveImportURL } from "./import-url";
import toast from "solid-toast";
import { copyText } from "./clipboard";

type Props = {
  currentManifests: Manifest[];

  onImportData: (data: Manifest[]) => void;
};

const Importer: Component<Props> = (props) => {
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
    const manifests = strToMans(str);
    props.onImportData(manifests);

    toast.success("Imported!");
  };

  const handleExportClick = () => {
    const str = mansToStr(props.currentManifests);
    contentsRef.value = str;

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

  return (
    <>
      <h2> Import </h2>

      <label>
        Import JSON
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
        <button onClick={handleImportClick}> Import </button>
        <button class="contrast" onClick={handleExportClick}>
          Export All
        </button>
      </div>
    </>
  );
};

export default Importer;
