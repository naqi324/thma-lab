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


 useEffect(() => {
  if (!html) return;

  // Delay to ensure DOM is updated
  const timer = setTimeout(() => {
    document.querySelectorAll("details").forEach((details) => {
      const pre = details.querySelector("pre code");
      if (pre && !details.querySelector(".copy-btn")) {
        // Wrap details in a container for positioning
        details.classList.add("details-code");

        const btn = document.createElement("button");
        btn.textContent = "Copy";
        btn.className = "copy-btn";
        btn.onclick = () => {
          navigator.clipboard.writeText(pre.textContent || "");
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = "Copy"), 1500);
        };
        details.appendChild(btn);
      }
    });
  }, 0);

  return () => clearTimeout(timer);
}, [html]);

return (
  <main>
    <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
  </main>
);
}
