import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import {
  defaultManifest,
  displays,
  iconMimes,
  loadManifests,
  Manifest,
  mansToStr,
  saveManifests,
  strToMans,
  trimLink,
  untrimLink,
  updateSelfManifest,
} from "./lib";
import toast, { Toaster } from "solid-toast";
import { overrideCode } from "./code";
import { fetchTextFromURL, loadImportURL, saveImportURL } from "./import-url";

import { TbTrash } from "solid-icons/tb";

const App: Component = () => {
  const [exp, setExp] = createSignal("");
  const [manifest, setManifest] = createSignal(defaultManifest());
  const [mans, setMans] = createSignal<Manifest[]>([]);
  const [code, setCode] = createSignal("alert('42')");
  const [copyToClipboard, setCopyToClipboard] = createSignal(false);
  const [importURL, setImportURL] = createSignal("");

  const [fixDisplayAndColor, setFixDisplayAndColor] = createSignal(false);

  const getIconSizeN = () => {
    const s = manifest().icons[0]?.sizes.split("x")[0];
    return isNaN(parseInt(s)) ? "" : parseInt(s);
  };

  const copyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  const handleImport = () => {
    const e = strToMans(exp());
    setMans((s) => [...e, ...s]);
    saveManifests(mans());
    toast.success("Imported " + e.length);
  };

  const handleExportAll = () => {
    const str = mansToStr(mans());
    setExp(str);

    // Copy to clipboard
    copyText(str);

    toast.success("Exported! See textarea and clipboard");
  };

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

    setManifest(newM);
    updateSelfManifest(newM);
    toast.success("Using " + name);

    if (copyToClipboard()) {
      copyText("javascript:" + code());
      window.open(untrimLink(mans()[i].start_url));
    }
  };

  const handleImportFromURL = async () => {
    const url = importURL();
    if (!url) {
      toast.error("No URL found");
      return;
    }
    const task = (async () => {
      const text = await fetchTextFromURL(url);
      setExp(text);
    })();

    await toast.promise(task, {
      loading: `Loading from ${url}`,
      success: "Loaded",
      error: (e) => `Failed to load: ${e}`,
    });
  };

  onMount(() => {
    setMans(loadManifests());
    setImportURL(loadImportURL());
  });

  createEffect(() => {
    // Replace start_url to original one
    const c = overrideCode.replace("$json", JSON.stringify(manifest()));
    setCode(c);
  });

  createEffect(() => {
    console.log("saveImportURL", importURL());
    saveImportURL(importURL());
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
              updateSelfManifest(manifest());
            }}
          >
            Update manifest
          </button>

          <button onClick={handleSave} class="outline contrast">
            Save
          </button>
        </div>

        <hr />

        <h2> Fields </h2>

        <label>
          App Name
          <input
            type="text"
            value={manifest().name}
            onChange={(e) =>
              setManifest((s) => ({
                ...s,
                name: e.target.value,
                short_name: e.target.value,
              }))
            }
          />
        </label>

        <label>
          Link
          <input
            type="text"
            value={trimLink(manifest().start_url)}
            onChange={(e) =>
              setManifest((s) => ({
                ...s,
                start_url: e.target.value,
              }))
            }
          />
        </label>

        <div>
          Display / Color &nbsp;
          <label class="inline-block">
            <input
              type="checkbox"
              checked={fixDisplayAndColor()}
              onChange={(e) => setFixDisplayAndColor(e.currentTarget.checked)}
            />
            Fix
          </label>
        </div>
        <fieldset role="group">
          <select
            onChange={(e) =>
              setManifest((s) => ({
                ...s,
                display: e.target.value,
              }))
            }
          >
            <For each={displays}>
              {(d) => (
                <option selected={d === manifest().display} value={d}>
                  {d}
                </option>
              )}
            </For>
          </select>
          <input
            type="color"
            value={manifest().background_color}
            onChange={(e) =>
              setManifest((s) => ({
                ...s,
                background_color: e.target.value,
                theme_color: e.target.value,
              }))
            }
          />
        </fieldset>

        <label>
          Icon Src
          <input
            type="text"
            value={manifest().icons[0]?.src}
            onChange={(e) =>
              setManifest((s) => ({
                ...s,
                icons: [{ ...s.icons[0], src: e.target.value }],
              }))
            }
          />
        </label>

        <label>
          Icon Size (width & height) / Type
          <fieldset role="group">
            <input
              type="number"
              placeholder="any"
              value={getIconSizeN()}
              onChange={(e) =>
                setManifest((s) => ({
                  ...s,
                  icons: [
                    {
                      ...s.icons[0],
                      sizes: isNaN(parseInt(e.target.value))
                        ? "any"
                        : `${e.target.value}x${e.target.value}`,
                    },
                  ],
                }))
              }
            />
            <select
              onChange={(e) =>
                setManifest((s) => ({
                  ...s,
                  icons: [{ ...s.icons[0], type: e.target.value }],
                }))
              }
            >
              <For each={iconMimes}>
                {(m) => (
                  <option selected={m === manifest().icons[0].type} value={m}>
                    {m}
                  </option>
                )}
              </For>
            </select>
          </fieldset>
        </label>

        <hr />

        <h2> Import </h2>

        <label>
          Import JSON
          <textarea value={exp()} onChange={(e) => setExp(e.target.value)} />
        </label>

        <fieldset role="group">
          <button class="outline secondary" disabled>
            URL
          </button>
          <input
            type="url"
            aria-label="url"
            value={importURL()}
            onChange={(e) => setImportURL(e.currentTarget.value)}
          />
          <button
            onClick={() => {
              handleImportFromURL();
            }}
          >
            Load
          </button>
        </fieldset>

        <div role="group">
          <button onClick={handleImport}> Import </button>
          <button class="contrast" onClick={handleExportAll}>
            Export All
          </button>
        </div>

        <hr />

        <h2> Saved </h2>
        <button type="reset" onClick={handleClearSaved}>
          Clear all saved
        </button>
        <label>
          <input
            type="checkbox"
            checked={copyToClipboard()}
            onChange={(e) => setCopyToClipboard(e.currentTarget.checked)}
          />
          Copy and Open when Load
        </label>

        <For each={mans()}>
          {(m, i) => (
            <fieldset role="group">
              <button class="outline break-all" onClick={() => useMan(i())}>
                <b>{m.name}</b> <br /> {m.start_url.replace(/https?:\/\//, "")}
              </button>
              <button class="flex-0 px-1" onClick={() => handleDel(i())}>
                <TbTrash />
              </button>
            </fieldset>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
