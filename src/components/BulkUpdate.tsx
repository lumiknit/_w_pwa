import { Component, Show, createSignal } from "solid-js";
import { bulkUpdateManifests } from "../store";
import { displays, Display } from "../core/lib";
import toast from "solid-toast";

const BulkUpdate: Component = () => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [display, setDisplay] = createSignal<Display>("standalone");
  const [themeColor, setThemeColor] = createSignal("#000000");
  const [backgroundColor, setBackgroundColor] = createSignal("#000000");

  const handleUpdateAll = () => {
    const updates: {
      display?: Display;
      theme_color?: string;
      background_color?: string;
    } = {};

    // Only include non-empty values
    if (display()) updates.display = display();
    if (themeColor()) updates.theme_color = themeColor();
    if (backgroundColor()) updates.background_color = backgroundColor();

    bulkUpdateManifests(updates);
    toast.success("All manifests updated successfully!");
  };

  return (
    <div class="bulk-update">
      <h4
        onClick={() => setIsExpanded(!isExpanded())}
        style="cursor: pointer; user-select: none;"
      >
        Bulk Update All Manifests {isExpanded() ? "▼" : "▶"}
      </h4>

      <Show when={isExpanded()}>
        <div class="grid">
          <div>
            <label for="bulk-display">Display Mode:</label>
            <select
              id="bulk-display"
              value={display()}
              onInput={(e) => setDisplay(e.currentTarget.value as Display)}
            >
              {displays.map((d) => (
                <option value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label for="bulk-theme-color">Theme Color:</label>
            <input
              id="bulk-theme-color"
              type="color"
              value={themeColor()}
              onInput={(e) => setThemeColor(e.currentTarget.value)}
            />
          </div>

          <div>
            <label for="bulk-background-color">Background Color:</label>
            <input
              id="bulk-background-color"
              type="color"
              value={backgroundColor()}
              onInput={(e) => setBackgroundColor(e.currentTarget.value)}
            />
          </div>
        </div>

        <button type="button" onClick={handleUpdateAll}>
          Update All Manifests
        </button>
      </Show>
    </div>
  );
};

export default BulkUpdate;
