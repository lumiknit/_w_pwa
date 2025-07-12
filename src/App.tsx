import { Component, createSignal, onMount } from "solid-js";
import toast, { Toaster } from "solid-toast";

import { loadManifestsFromStorage } from "./store";

import Importer from "./components/Importer";
import SavedList from "./components/SavedList";
import ManifestEditor from "./components/ManifestEditor";
import Nav from "./components/Nav";
import { Dynamic } from "solid-js/web";
import SelfManifestView from "./components/SelfManifest";
import Help from "./components/Help";

const tabComponentMap: Map<string, Component> = new Map([
  ["List", SavedList],
  ["Editor", ManifestEditor],
  ["Import", Importer],
  ["Help", Help],
]);
const keys = Array.from(tabComponentMap.keys());

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal(keys[0]);

  onMount(() =>
    setTimeout(() => {
      toast.promise((async () => loadManifestsFromStorage())(), {
        loading: "Loading saved manifests...",
        success: "Loaded saved manifests",
        error: "Failed to load saved manifests",
      })
    }, 100)
  );

  return (
    <>
      <Toaster position="top-left" />
      <div class="container">
        <Nav tabs={keys} active={activeTab()} onTabChange={setActiveTab} />
        <SelfManifestView />
        <hr />
        <Dynamic component={tabComponentMap.get(activeTab())} />
      </div>
    </>
  );
};

export default App;
