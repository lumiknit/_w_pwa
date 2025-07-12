import { Component, For, Show } from "solid-js";

export type CodeItem = {
  title: string;
  content: string;
};

type Props = {
  items: CodeItem[];
};

const CodeAccordion: Component<Props> = (props) => {
  const name = Math.random().toString(36);
  return (
    <article>
      <For each={props.items}>
        {(item, idx) => (
          <>
            <Show when={idx() > 0}>
              <hr />
            </Show>
            <details name={name}>
              <summary>{item.title}</summary>
              <pre>{item.content}</pre>
            </details>
          </>
        )}
      </For>
    </article>
  );
};

export default CodeAccordion;
