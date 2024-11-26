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

const App: Component = () => {
  const [exp, setExp] = createSignal("");
  const [manifest, setManifest] = createSignal(defaultManifest());
  const [mans, setMans] = createSignal<Manifest[]>([]);
  const [code, setCode] = createSignal("alert('42')");

  const getIconSizeN = () => {
    const s = manifest().icons[0]?.sizes.split("x")[0];
    return isNaN(parseInt(s)) ? "" : parseInt(s);
  };

  const handleImport = () => {
    const e = strToMans(exp());
    setMans((s) => [...e, ...s]);
    saveManifests(mans());
    toast.success("Imported " + e.length);
  };
  const handleExport = () => {
    setExp(mansToStr(mans()));
    toast.success("Exported");
  };
  const handleSave = () => {
    setMans((s) => [manifest(), ...s]);
    saveManifests(mans());
    toast.success("Inserted");
  };

  const handleClearSaved = () => {
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
    const name = mans()[i].name;
    setManifest(mans()[i]);
    updateSelfManifest(mans()[i]);
    toast.success("Using " + name);
  };

  onMount(() => {
    setMans(loadManifests());
  });

  createEffect(() => {
    const m = { ...manifest()};
    // Replace start_url to original one
    m.start_url = 'https://' + trimLink(m.start_url);
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
              if (navigator.clipboard) {
                navigator.clipboard.writeText(code());
              } else {
                const el = document.createElement("textarea");
                el.value = code();
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
              }
              toast.success("Copied!");
            }}
          >
            Copy Code
          </button>

          <a href={"https://" + trimLink(manifest().start_url)} target="_blank">
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
                start_url: untrimLink(e.target.value),
              }))
            }
          />
        </label>

        <label>
          Display
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
        </label>

        <label>
          Color
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
        </label>

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
          Icon Size (w/h, single int)
          <input
            type="number"
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
        </label>

        <label>
          Icon Type
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
        </label>

        <hr />

        <h2> Import </h2>

        <label>
          Import JSON
          <textarea value={exp()} onChange={(e) => setExp(e.target.value)} />
        </label>

        <button onClick={handleImport}> Import </button>
        <button onClick={handleExport}> Export All </button>

        <hr />

        <h2> Saved </h2>
        <button type="reset" onClick={handleClearSaved}>
          Clear all saved
        </button>

        <For each={mans()}>
          {(m, i) => (
            <fieldset role="group">
              <button class="outline" onClick={() => useMan(i())}>
                {m.name} / {trimLink(m.start_url)}
              </button>
              <button onClick={() => handleDel(i())}> Del </button>
            </fieldset>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
