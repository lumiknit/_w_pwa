/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";

import "@picocss/pico/css/pico.min.css";

const root = document.getElementById("root");

render(() => <App />, root!);
