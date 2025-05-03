import { Component, For, Setter } from "solid-js";
import {
  displays,
  getImageSizeAndMime,
  iconMimes,
  Manifest,
  trimLink,
} from "./lib";
import toast from "solid-toast";
import { TbTrash } from "solid-icons/tb";

type Props = {
  manifest: Manifest;
  setManifest: Setter<Manifest>;

  setFixDisplayAndColor: (b: boolean) => void;
};

const ManifestEditor: Component<Props> = (props) => {
  const getIconSizeN = () => {
    const s = props.manifest.icons[0]?.sizes.split("x")[0];
    return isNaN(parseInt(s)) ? "" : parseInt(s);
  };

  const addShortcut = () => {
    props.setManifest((m) => ({
      ...m,
      shortcuts: [...m.shortcuts, { name: "", url: "" }],
    }));
  };

  const deleteShortcut = (i: number) => {
    props.setManifest((m) => ({
      ...m,
      shortcuts: m.shortcuts.filter((_, j) => j !== i),
    }));
  };

  const updateShortcutsName = (i: number, name: string) => {
    props.setManifest((m) => ({
      ...m,
      shortcuts: m.shortcuts.map((s, j) => (j === i ? { ...s, name } : s)),
    }));
  };

  const updateShortcutsURL = (i: number, url: string) => {
    props.setManifest((m) => ({
      ...m,
      shortcuts: m.shortcuts.map((s, j) => (j === i ? { ...s, url } : s)),
    }));
  };

  return (
    <>
      <h2> Fields </h2>

      <label>
        App Name
        <input
          type="text"
          value={props.manifest.name}
          onChange={(e) =>
            props.setManifest((m) => ({
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
          value={trimLink(props.manifest.start_url)}
          onChange={(e) =>
            props.setManifest((m) => ({
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
            onChange={(e) =>
              props.setFixDisplayAndColor(e.currentTarget.checked)
            }
          />
          Fix
        </label>
      </div>
      <fieldset role="group">
        <select
          onChange={(e) =>
            props.setManifest((m) => ({
              ...m,
              display: e.target.value,
            }))
          }
        >
          <For each={displays}>
            {(d) => (
              <option selected={d === props.manifest.display} value={d}>
                {d}
              </option>
            )}
          </For>
        </select>
        <input
          type="color"
          value={props.manifest.background_color}
          onChange={(e) =>
            props.setManifest((m) => ({
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
          value={props.manifest.icons[0]?.src}
          onChange={(e) => {
            props.setManifest((m) => ({
              ...m,
              icons: [{ ...props.manifest.icons[0], src: e.target.value }],
            }));
            getImageSizeAndMime(e.target.value)
              .then((res) => {
                toast.success(`Image Info: ${res[0]}x${res[1]} ${res[2]}`);
                props.setManifest((m) => ({
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
        <img src={props.manifest.icons[0]?.src} alt="icon" width="36" />
      </label>

      <label>
        Icon Size (width & height) / Type
        <fieldset role="group">
          <input
            type="number"
            placeholder="any"
            value={getIconSizeN()}
            onChange={(e) =>
              props.setManifest({
                ...props.manifest,
                icons: [
                  {
                    ...props.manifest.icons[0],
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
              props.setManifest((m) => ({
                ...m,
                icons: [{ ...m.icons[0], type: e.target.value }],
              }))
            }
          >
            <For each={iconMimes}>
              {(m) => (
                <option selected={m === props.manifest.icons[0].type} value={m}>
                  {m}
                </option>
              )}
            </For>
          </select>
        </fieldset>
      </label>

      <label>Shortcuts</label>
      <For each={props.manifest.shortcuts}>
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
