import { Component, createEffect, createSignal } from "solid-js";
import CodeAccordion from "./CodeAccordion";
import { manifest } from "../store";
import toast from "solid-toast";
import { makeChromeManifest, updateSelfManifest } from "../core";

import { default as overrideCode } from "../core/raw/override-manifest.js?raw";
import { copyText } from "../core/clipboard";
import { TbBrowser } from "solid-icons/tb";

const SelfManifestView: Component = () => {
  const [code, setCode] = createSignal("alert('42')");

  createEffect(() => {
    // Replace start_url to original one
    const m = makeChromeManifest(manifest());
    const c = overrideCode
      .replace('"$json"', "`" + JSON.stringify(m) + "`")
      .replace(/\n\s*/g, " ");
    setCode(c);
  });

  const handleCopyCode = () => {
    const c = "javascript:" + code();
    copyText(c);
    toast.success("Copied!");
  };

  return (
    <>
      <h1>Self manifest</h1>

      <CodeAccordion
        items={[
          {
            title: "manifest.json",
            content: JSON.stringify(manifest(), null, 2),
          },
          { title: "override.js", content: code() },
        ]}
      />

      <div>
        <button onClick={handleCopyCode}>Copy code</button>

        <a
          role="button"
          class="ml-1"
          href={manifest().start_url}
          target="_blank"
        >
          <TbBrowser />
          Open
        </a>

        <button
          class="ml-1"
          onClick={() => {
            updateSelfManifest(makeChromeManifest(manifest()));
          }}
        >
          Update manifest
        </button>
      </div>
    </>
  );
};

export default SelfManifestView;
