import { Component, createEffect, createSignal, onMount } from "solid-js";
import {
  defaultManifest,
  loadManifests,
  makeChromeManifest,
  Manifest,
  sanitizeManifest,
  saveManifests,
  untrimLink,
  updateSelfManifest,
} from "./lib";
import toast, { Toaster } from "solid-toast";
import { overrideCode } from "./code";

import { copyText } from "./clipboard";
import Importer from "./Importer";
import SavedList from "./SavedList";
import ManifestEditor from "./ManifestEditor";

const App: Component = () => {
  const [manifest, setManifest] = createSignal(defaultManifest());
  const [mans, setMans] = createSignal<Manifest[]>([]);
  const [code, setCode] = createSignal("alert('42')");
  const [copyToClipboard, setCopyToClipboard] = createSignal(false);

  const [fixDisplayAndColor, setFixDisplayAndColor] = createSignal(false);

  const handleSave = () => {
    setMans((s) => [manifest(), ...s]);
    saveManifests(mans());
    toast.success("Inserted");
  };

  const handleClearSaved = () => {
    if (!confirm("Clear all saved links?")) {
      return;
    }
    setMans(() => []);
    saveManifests(mans());
    toast.success("Cleared");
  };

  const handleDel = (i: number) => {
    const name = mans()[i].name;
    setMans((s) => s.filter((_, j) => i !== j));
    saveManifests(mans());
    toast.success("Deleted " + name);
  };

  const useMan = (i: number) => {
    const old = manifest();
    const name = mans()[i].name;
    const newM = mans()[i];

    if (fixDisplayAndColor()) {
      newM.display = old.display;
      newM.background_color = old.background_color;
      newM.theme_color = old.theme_color;
    }

    const m = sanitizeManifest(newM);

    setManifest(m);
    updateSelfManifest(m);
    toast.success("Using " + name);

    if (copyToClipboard()) {
      copyText("javascript:" + code());
      window.open(untrimLink(mans()[i].start_url));
    }
  };

  onMount(() => {
    setMans(loadManifests());
  });

  createEffect(() => {
    // Replace start_url to original one
    const m = makeChromeManifest(manifest());
    const c = overrideCode.replace("$json", JSON.stringify(m));
    setCode(c);
  });

  return (
    <>
      <Toaster />
      <div class="container">
        <h1>Self manifest</h1>

        <hr />

        <h2> Raw Manifest</h2>

        <label>
          Raw JSON
          <pre>{JSON.stringify(manifest(), null, 2)}</pre>
        </label>

        <label>
          Apply script (copy and paste in console!)
          <pre>{code()}</pre>
        </label>

        <div>
          <button
            onClick={() => {
              console.log("javascript:" + code());
              copyText("javascript:" + code());
              toast.success("Copied!");
            }}
          >
            Copy code
          </button>

          <a href={manifest().start_url} target="_blank">
            Open
          </a>
        </div>

        <div>
          <button
            onClick={() => {
              updateSelfManifest(makeChromeManifest(manifest()));
            }}
          >
            Update manifest
          </button>

          <button onClick={handleSave} class="outline contrast">
            Save
          </button>
        </div>

        <hr />

        <ManifestEditor
          manifest={manifest()}
          setManifest={setManifest}
          setFixDisplayAndColor={setFixDisplayAndColor}
        />

        <hr />

        <Importer
          currentManifests={mans()}
          onImportData={(m) => {
            setMans(m);
            saveManifests(m);
          }}
        />

        <hr />

        <SavedList
          manifests={mans()}
          onClear={handleClearSaved}
          onSelect={useMan}
          onDelete={handleDel}
          onCopyToClipboardChange={setCopyToClipboard}
        />
      </div>
    </>
  );
};

export default App;
