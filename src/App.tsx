import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {
        /* ignore */
      }
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export default function App() {
  const [html, setHtml] = useState<string>("Loading…");

  useEffect(() => {
    fetch("/index.md")
      .then((r) => r.text())
      .then((text) => setHtml(md.render(text)))
      .catch(() => setHtml("Failed to load markdown."));
  }, []);

  return (
    <main style={{ maxWidth: 860, margin: "2rem auto", padding: "0 1rem", lineHeight: 1.6 }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
