import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
// API Monitor removed; keep core app minimal

import ApiGatewayLiveMonitor from "./components/ApiGatewayLiveMonitor";

const md = new MarkdownIt({
  html: true,
  linkify: true,
});

// Keep track of heading IDs to handle duplicates
const headingIds: { [key: string]: number } = {};

// Custom renderer for headings to add IDs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultHeadingRenderer = md.renderer.rules.heading_open || function(tokens: any[], idx: number, options: any, _env: any, self: any) {
  return self.renderToken(tokens, idx, options);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
md.renderer.rules.heading_open = function(tokens: any[], idx: number, options: any, _env: any, self: any) {
  const token = tokens[idx];
  const nextToken = tokens[idx + 1];
  
  if (nextToken && nextToken.type === 'inline' && nextToken.content) {
    // Generate ID from heading content
    const headingText = nextToken.content;
    const baseId = headingText.trim().toLowerCase()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Handle duplicates
    let id = baseId;
    if (headingIds[baseId]) {
      id = `${baseId}-${headingIds[baseId]}`;
      headingIds[baseId]++;
    } else {
      headingIds[baseId] = 1;
    }
    
    // Add id attribute
    token.attrSet('id', id);
  }
  
  return defaultHeadingRenderer(tokens, idx, options, _env, self);
};

// 2) Add highlight with explicit param/return types
md.set({
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {
        /* noop */
      }
    }
    // fallback: escape code safely using markdown-it's util
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export default function App() {
  const [html, setHtml] = useState<string>("Loading…");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  // API monitoring removed

  // Track scroll progress and show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      setShowScrollTop(winScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch("/index.md")
      .then((r) => r.text())
      .then((text) => {
        // Reset heading IDs counter for each render
        Object.keys(headingIds).forEach(key => delete headingIds[key]);
        
        const rendered = md.render(text);
        setHtml(rendered);
      })
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

// Enhance inline code elements with copy buttons
useEffect(() => {
  if (!html) return;

  const enhanceInlineCode = () => {
    // Find all inline <code> elements (not inside <pre>)
    document.querySelectorAll<HTMLElement>(".content code").forEach((code) => {
      // Skip if inside <pre> or already enhanced
      if (code.parentElement?.tagName === "PRE") return;
      if (code.parentElement?.classList.contains("inline-code-wrapper")) return;
      
      // Create wrapper
      const wrapper = document.createElement("span");
      wrapper.className = "inline-code-wrapper";
      
      // Clone the code element
      const codeClone = code.cloneNode(true) as HTMLElement;
      
      // Create copy button
      const btn = document.createElement("button");
      btn.className = "inline-copy-btn";
      btn.type = "button";
      btn.title = "Copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "📋";
      
      // Copy handler
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = code.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = "✓";
          setTimeout(() => (btn.textContent = original || "📋"), 1500);
        });
      };
      
      // Replace original code with wrapper
      code.replaceWith(wrapper);
      wrapper.appendChild(codeClone);
      wrapper.appendChild(btn);
    });
  };

  // Run after the DOM updates
  const timer = setTimeout(enhanceInlineCode, 50);
  return () => clearTimeout(timer);
}, [html]);

// API monitor UI removed

// Helper function to scroll to heading by ID
const scrollToHeading = (headingId: string) => {
  // Find the element by ID
  const element = document.getElementById(headingId);
  
  if (element) {
    // Get the element's position
    const rect = element.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    
    // Scroll to position with offset for fixed header
    window.scrollTo({
      top: absoluteTop - 80,
      behavior: 'smooth'
    });
    
    // Close the TOC
    setTocOpen(false);
  }
};

return (
  <>

    {/* Table of Contents Toggle Button */}
    <button
      onClick={() => setTocOpen(!tocOpen)}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1001,
        transition: 'all var(--transition-base)',
        color: 'var(--primary)'
      }}
      aria-label="Toggle table of contents"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    {/* Table of Contents Sidebar */}
    <aside className="toc" style={{
      position: 'fixed',
      top: 0,
      left: tocOpen ? 0 : '-320px',
      bottom: 0,
      width: '320px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      boxShadow: tocOpen ? 'var(--shadow-lg)' : 'none',
      zIndex: 1000,
      transition: 'left var(--transition-base)',
      overflowY: 'auto',
      padding: '80px 20px 20px'
    }}>
      <style>{`
        /* Scoped Table of Contents styles */
        .toc .toc-link {
          background: none;
          border: none;
          color: var(--text);
          text-decoration: none;
          font-size: 1rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          padding: 0.25rem 0;
          transition: color var(--transition-fast);
        }
        .toc .toc-link:hover { color: var(--link-hover); text-decoration: underline; }
        .toc .toc-sub { color: var(--muted); font-size: 0.95rem; }
        .toc .toc-sublist { list-style: none; padding-left: 1rem; margin-top: 0.5rem; border-left: 2px solid var(--border); }
        .toc .toc-subitem { position: relative; padding-left: 0.75rem; margin-bottom: 0.5rem; }
        .toc .toc-subitem::before { content: ''; position: absolute; left: 0; top: 0.95em; width: 6px; height: 6px; border-radius: 50%; background: var(--border); }
        .toc .toc-subitem:hover::before { background: var(--link-hover); }
      `}</style>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Table of Contents</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.75rem' }}>
            <button className="toc-link" onClick={() => scrollToHeading('chat-bots-we-will-build')}>Chat Bots We Will Build</button>
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <button className="toc-link" onClick={() => scrollToHeading('app-1-formulary-patient-education')} style={{ fontWeight: 600 }}>App 1: Formulary & Patient Education</button>
            <ul className="toc-sublist">
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('configurations')}>Configurations</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('model')}>Model</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('system-prompt')}>System prompt</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('add-examples')}>Add examples</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('inference-parameters')}>Inference parameters</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('data')}>Data</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('guardrails')}>Guardrails</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('ui')}>UI</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('review-sharing-export-options')}>Review Sharing & Export Options</button></li>
            </ul>
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <button className="toc-link" onClick={() => scrollToHeading('app-2-biomedicalit-troubleshooting-agentic-bot')} style={{ fontWeight: 600 }}>App 2: Biomedical/IT Troubleshooting</button>
            <ul className="toc-sublist">
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('configurations-1')}>Configurations</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('model-1')}>Model</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('system-prompt-1')}>System prompt</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('add-examples-1')}>Add examples</button></li>
              
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('inference-parameters-1')}>Inference parameters</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('data-1')}>Data</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('guardrails-1')}>Guardrails</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('functions')}>Functions</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('ui-1')}>UI</button></li>
              <li className="toc-subitem"><button className="toc-link toc-sub" onClick={() => scrollToHeading('review-sharing-export-options-1')}>Review Sharing & Export Options</button></li>
            </ul>
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <button className="toc-link" onClick={() => scrollToHeading('biomedit-device-monitor')}>BiomedIT Device Monitor</button>
          </li>
        </ul>
      </nav>
    </aside>

    {/* Progress Bar at top */}
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'var(--border)',
      zIndex: 999
    }}>
      <div style={{
        height: '100%',
        width: `${scrollProgress}%`,
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        transition: 'width 100ms ease'
      }} />
    </div>

    {/* Scroll to Top Button */}
    {showScrollTop && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'all var(--transition-base)',
          color: 'white'
        }}
        aria-label="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    )}

    <main style={{ paddingTop: '20px', position: 'relative' }}>
      {/* Minimal AWS logo, non-intrusive */}
      <div className="aws-logo" aria-label="AWS logo" title="AWS" style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--text)', opacity: 0.9 }}>
        <svg width="64" height="24" viewBox="0 0 90 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
          <text x="0" y="18" fill="currentColor" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" fontWeight="700" fontSize="18">AWS</text>
          <path d="M35 24c8 3.2 18 2.8 26-1.6" stroke="var(--aws-gold)" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      {html === "Loading…" ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Loading content...</p>
        </div>
      ) : (
        <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
      )}
      <ApiGatewayLiveMonitor />
    </main>

    {/* Add spinning animation */}
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>

  </>
);
}
