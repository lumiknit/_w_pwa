import {
  TbScript,
  TbTrash,
  TbTrashFilled,
  TbExternalLink,
  TbWorldWww,
} from "solid-icons/tb";
import { Component, For } from "solid-js";
import { Manifest, cleanManifestForExport, getOpenUrl } from "../core/index";
import {
  clearAllManifests,
  copyOnSelect,
  delManifestFromList,
  manifest,
  manifestList,
  monkeyCode,
  openManifestFromList,
  setCopyOnSelect,
} from "../store";
import toast from "solid-toast";
import { copyText } from "../core/clipboard";
import BulkUpdate from "./BulkUpdate";

type ItemProps = {
  index: number;
  manifest: Manifest;
};

const Item: Component<ItemProps> = (props) => {
  const handleSelect = () => {
    openManifestFromList(props.index);
    if (copyOnSelect()) {
      copyText(JSON.stringify(cleanManifestForExport(props.manifest), null, 2));
      toast.success("Manifest copied to clipboard.");
    }
    toast.success(`Using ${props.manifest.name}`);
  };

  const handleDelete = () => {
    const m = delManifestFromList(props.index);
    toast.success(`Deleted ${m.name}`);
  };

  const handleOpen = () => {
    window.open(getOpenUrl(props.manifest), "_blank");
  };

  return (
    <fieldset role="group">
      <button
        class={
          "break-all px-1" +
          (manifest().start_url === props.manifest.start_url ? "" : " outline")
        }
        onClick={handleSelect}
      >
        <div class="hstack">
          <span>
            <img src={props.manifest.icons[0]?.src} alt="(icon)" width={36} />
          </span>
          <span>
            <b>{props.manifest.name}</b> <br />
            {props.manifest.start_url}
          </span>
        </div>
      </button>
      <button class="flex-0 px-1 outline" onClick={handleOpen}>
        <TbExternalLink />
      </button>
      <button class="flex-0 px-1 outline" onClick={handleDelete}>
        <TbTrash />
      </button>
    </fieldset>
  );
};

const SavedList: Component = () => {
  const handleClear = () => {
    clearAllManifests();
    toast.success("All saved manifests cleared.");
  };

  const handleCopyForMonkey = async () => {
    copyText(await monkeyCode());
    toast.success("Using Monkey");
  };

  const handleOpenAllLinks = () => {
    manifestList().forEach((manifest) => {
      window.open(getOpenUrl(manifest), "_blank");
    });
    toast.success(`Opened ${manifestList().length} links`);
  };

  return (
    <>
      <h2> Manifest List </h2>

      <div>
        <button type="reset" onClick={handleClear}>
          <TbTrashFilled />
          Clear All
        </button>
        <button type="button" class="ml-1" onClick={handleCopyForMonkey}>
          <TbScript />
          Copy Userscript
        </button>
        <button type="button" class="ml-1" onClick={handleOpenAllLinks}>
          <TbWorldWww />
          Open All Links
        </button>
      </div>

      <label>
        <input
          type="checkbox"
          checked={copyOnSelect()}
          onChange={(e) => setCopyOnSelect(e.currentTarget.checked)}
        />
        Copy and Open when Load
      </label>

      <BulkUpdate />

      <For each={manifestList()}>
        {(m, i) => <Item index={i()} manifest={m} />}
      </For>
    </>
  );
};

export default SavedList;
