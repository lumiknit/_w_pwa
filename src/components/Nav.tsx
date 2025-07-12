import { Component, For } from "solid-js";

type Props = {
  tabs: string[];
  active: string;
  onTabChange: (tab: string) => void;
};

const Nav: Component<Props> = (props) => {
  return (
    <nav class="top-fixed">
      <ul>
        <li>
          <strong>Any PWA</strong>
        </li>
      </ul>
      <ul>
        <For each={props.tabs}>
          {(tab) => (
            <li>
              <a
                href="#"
                class={props.active === tab ? "nav-active" : ""}
                onClick={() => props.onTabChange(tab)}
              >
                {tab}
              </a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
};

export default Nav;
