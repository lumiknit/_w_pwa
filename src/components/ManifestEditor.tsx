import { Component, For } from "solid-js";
import {
  displays,
  getImageSizeAndMime,
  iconMimes,
  iconPurposeOptions,
  trimLink,
} from "../core";
import toast from "solid-toast";
import { TbPencilPlus, TbPlus, TbTrash } from "solid-icons/tb";
import {
  addCurrentManifestToList,
  fixDisplayAndColor,
  manifest,
  setFixDisplayAndColor,
  setManifest,
  updateCurrentManifestToList,
} from "../store";

const ManifestEditor: Component = () => {
  const getIconSizeN = () => {
    const s = manifest().icons[0]?.sizes.split("x")[0];
    return isNaN(parseInt(s)) ? "" : parseInt(s);
  };

  const addShortcut = () => {
    setManifest((m) => ({
      ...m,
      shortcuts: [...m.shortcuts, { name: "", url: "" }],
    }));
  };

  const deleteShortcut = (i: number) => {
    setManifest((m) => ({
      ...m,
      shortcuts: m.shortcuts.filter((_, j) => j !== i),
    }));
  };

  const updateShortcutsName = (i: number, name: string) => {
    setManifest((m) => ({
      ...m,
      shortcuts: m.shortcuts.map((s, j) => (j === i ? { ...s, name } : s)),
    }));
  };

  const updateShortcutsURL = (i: number, url: string) => {
    setManifest((m) => ({
      ...m,
      shortcuts: m.shortcuts.map((s, j) => (j === i ? { ...s, url } : s)),
    }));
  };

  const handleAdd = () => {
    addCurrentManifestToList();
    toast.success("Manifest added to the list.");
  };

  const handleUpdate = () => {
    updateCurrentManifestToList();
    toast.success("Manifest updated in the list.");
  };

  return (
    <>
      <h2> Fields </h2>

      <button onClick={handleAdd}>
        <TbPlus />
        Add
      </button>

      <button onClick={handleUpdate} class="ml-1">
        <TbPencilPlus />
        Update
      </button>

      <label>
        App Name
        <input
          type="text"
          value={manifest().name}
          onChange={(e) =>
            setManifest((m) => ({
              ...m,
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
            setManifest((m) => ({
              ...m,
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
            setManifest((m) => ({
              ...m,
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
            setManifest((m) => ({
              ...m,
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
          onChange={(e) => {
            setManifest((m) => ({
              ...m,
              icons: [{ ...manifest().icons[0], src: e.target.value }],
            }));
            getImageSizeAndMime(e.target.value)
              .then((res) => {
                toast.success(`Image Info: ${res[0]}x${res[1]} ${res[2]}`);
                setManifest((m) => ({
                  ...m,
                  icons: [
                    {
                      ...m.icons[0],
                      sizes: `${res[0]}x${res[1]}`,
                      type: res[2],
                    },
                  ],
                }));
              })
              .catch((e) => {
                console.error(e);
              });
          }}
        />
        <img src={manifest().icons[0]?.src} alt="icon" width="36" />
      </label>

      <label>
        Icon Size (width & height) / Type
        <fieldset role="group">
          <input
            type="number"
            placeholder="any"
            value={getIconSizeN()}
            onChange={(e) =>
              setManifest({
                ...manifest(),
                icons: [
                  {
                    ...manifest().icons[0],
                    sizes: isNaN(parseInt(e.target.value))
                      ? "any"
                      : `${e.target.value}x${e.target.value}`,
                  },
                ],
              })
            }
          />
          <select
            onChange={(e) =>
              setManifest((m) => ({
                ...m,
                icons: [{ ...m.icons[0], type: e.target.value }],
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

      <label>
        Icon Purpose
        <select
          onChange={(e) =>
            setManifest((m) => ({
              ...m,
              icons: [
                {
                  ...m.icons[0],
                  purpose: iconPurposeOptions.find(
                    (v) => v.label === e.target.value,
                  )?.value,
                },
              ],
            }))
          }
        >
          <For each={iconPurposeOptions}>
            {(option) => (
              <option
                selected={
                  iconPurposeOptions.find(
                    (v) => v.value === manifest().icons[0].purpose,
                  )?.label === option.label
                }
                value={option.label}
              >
                {option.label}
              </option>
            )}
          </For>
        </select>
      </label>

      <label>Shortcuts</label>
      <For each={manifest().shortcuts}>
        {(s, i) => (
          <fieldset role="group">
            <input
              type="text"
              placeholder="Name"
              value={s.name}
              onChange={(e) => updateShortcutsName(i(), e.currentTarget.value)}
            />
            <input
              type="text"
              placeholder="URL (e.g. /abc)"
              value={s.url}
              onChange={(e) => updateShortcutsURL(i(), e.currentTarget.value)}
            />
            <button onClick={() => deleteShortcut(i())} class="flex-0 px-1">
              <TbTrash />
            </button>
          </fieldset>
        )}
      </For>
      <button onClick={addShortcut}>Add Shortcut</button>
    </>
  );
};

export default ManifestEditor;
