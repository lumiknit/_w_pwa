import { TbTrash } from "solid-icons/tb";
import { Component, For, Show } from "solid-js";
import { Manifest } from "./lib";

type Props = {
  manifests: Manifest[];

  onClear: () => void;
  onSelect: (i: number) => void;
  onDelete: (i: number) => void;

  onCopyForMonkey: () => void;

  onCopyToClipboardChange: (value: boolean) => void;
};

const SavedList: Component<Props> = (props) => {
  return (
    <>
      <h2> Saved </h2>
      <button type="reset" onClick={props.onClear}>
        Clear all saved
      </button>

      <button type="button" onClick={props.onCopyForMonkey}>
        Copy for xxxMonkey
      </button>

      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            props.onCopyToClipboardChange(e.currentTarget.checked)
          }
        />
        Copy and Open when Load
      </label>

      <For each={props.manifests}>
        {(m, i) => (
          <fieldset role="group">
            <button
              class="outline break-all px-1"
              onClick={() => props.onSelect(i())}
            >
              <div class="hstack">
                <span>
                  <Show when={m.icons.length > 0}>
                    <img src={m.icons[0].src} alt={m.name} width={36} />
                  </Show>
                </span>
                <span>
                  <b>{m.name}</b> <br />{" "}
                  {m.start_url.replace(/https?:\/\//, "")}
                </span>
              </div>
            </button>
            <button class="flex-0 px-1" onClick={() => props.onDelete(i())}>
              <TbTrash />
            </button>
          </fieldset>
        )}
      </For>
    </>
  );
};

export default SavedList;
