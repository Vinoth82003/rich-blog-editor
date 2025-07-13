// extensions/PrismCodeBlock.js
import { Node, mergeAttributes } from "@tiptap/core";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";

export const PrismCodeBlock = Node.create({
  name: "prismCodeBlock",
  content: "text*",
  group: "block",
  code: true,
  defining: true,

  addAttributes() {
    return {
      language: {
        default: "javascript",
      },
    };
  },

  parseHTML() {
    return [{ tag: "pre" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(HTMLAttributes),
      ["code", { class: `language-${node.attrs.language}` }, 0],
    ];
  },

  addCommands() {
    return {
      toggleCodeBlock:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
    };
  },
});
