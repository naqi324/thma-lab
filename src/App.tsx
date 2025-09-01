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


// Enhance ALL fenced code blocks with a copy button (incl. inside <details>)
useEffect(() => {
  if (!html) return;

  const enhance = () => {
    // Find all <pre><code> blocks rendered by markdown-it/highlight.js
    document.querySelectorAll<HTMLPreElement>(".content pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;

      // If already enhanced, skip
      if (pre.parentElement && pre.parentElement.classList.contains("codeblock")) {
        return;
      }

      // Wrap in a positioned container for the button
      const wrapper = document.createElement("div");
      wrapper.className = "codeblock";

      // Insert wrapper and move <pre> inside it
      pre.replaceWith(wrapper);
      wrapper.appendChild(pre);

      // Create the button
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.title = "Copy code";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "Copy";

      // Copy handler
      btn.onclick = () => {
        const text = code.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = original || "Copy"), 1500);
        });
      };

      // If this code block sits inside <details>, keep your existing visual treatment
      const details = wrapper.closest("details");
      if (details) {
        details.classList.add("details-code"); // optional: reuse your earlier class
      }

      wrapper.appendChild(btn);
    });
  };

  // Run after the DOM updates
  const timer = setTimeout(enhance, 0);
  return () => clearTimeout(timer);
}, [html]);

return (
  <main>
    <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
  </main>
);
}
