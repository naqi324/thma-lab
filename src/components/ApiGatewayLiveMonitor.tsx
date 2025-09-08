import { useEffect, useMemo, useRef, useState } from "react";
import outputs from "../../amplify_outputs.json";

type ApiEvent = {
  id: string;
  ts: number;
  request: { method: string; path: string };
  response?: { status: number; latencyMs: number };
  requestId?: string;
};

const endpoint =
  (outputs as any)?.custom?.API?.monitorApi?.endpoint?.replace(/\/$/, "") || "";

export default function ApiGatewayLiveMonitor() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [online, setOnline] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [demo, setDemo] = useState<boolean>(false);
  const sinceRef = useRef<number>(Date.now() - 15000);
  const timerRef = useRef<number | null>(null);

  const url = useMemo(() => (endpoint ? `${endpoint}/monitor/poll` : ""), []);

  useEffect(() => {
    let interval = 2000;
    async function tick() {
      if (!url || paused) return;
      try {
        const u = new URL(url);
        u.searchParams.set("since", String(sinceRef.current));
        u.searchParams.set("limit", "30");
        const r = await fetch(u.toString(), { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (Array.isArray(data.events) && data.events.length) {
          setEvents((prev) => {
            const merged = [...prev, ...data.events].slice(-100);
            return dedupe(merged);
          });
        }
        if (typeof data.nextSince === "number") {
          sinceRef.current = data.nextSince;
        } else {
          sinceRef.current = Date.now();
        }
        setOnline(true);
        interval = 2000;
      } catch {
        setOnline(false);
        interval = Math.min(interval * 1.5, 8000);
      } finally {
        timerRef.current = window.setTimeout(tick, interval);
      }
    }
    tick();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [url, paused]);

  // Demo generator for local dev when endpoint is missing
  useEffect(() => {
    if (!demo) return;
    const id = window.setInterval(() => {
      const now = Date.now();
      const isGet = Math.random() < 0.5;
      const path = isGet
        ? `/biomed/devices/${Math.random().toString(36).slice(2, 8)}`
        : "/helpdesk/tickets";
      const status = isGet ? 200 : [200, 201, 400, 500][Math.floor(Math.random() * 4)];
      const latencyMs = 50 + Math.floor(Math.random() * 400);
      const ev: ApiEvent = {
        id: `demo-${now}-${Math.random().toString(36).slice(2, 6)}`,
        ts: now,
        request: { method: isGet ? "GET" : "POST", path },
        response: { status, latencyMs },
      };
      setEvents((prev) => dedupe([...prev, ev]).slice(-100));
      sinceRef.current = now;
    }, 1200);
    return () => window.clearInterval(id);
  }, [demo]);

  const onPause = () => setPaused((p) => !p);
  const onDemo = () => setDemo((d) => !d);

  return (
    <section id="biomedit-device-monitor" className="thma-monitor" aria-live="polite">
      <style>{css}</style>
      <header className="thma-monitor__hdr">
        <div className="thma-monitor__title">
          <strong>BiomedIT Device Monitor</strong>
        </div>
        <div className="thma-monitor__status">
          <span className={online ? "dot on" : "dot off"} />
          {online ? "live" : "offline/retrying"}
          <button className="thma-monitor__btn" onClick={onPause}>
            {paused ? "Resume" : "Pause"}
          </button>
          {!endpoint && (
            <button className="thma-monitor__btn" onClick={onDemo}>
              {demo ? "Stop Demo" : "Demo"}
            </button>
          )}
        </div>
      </header>

      {!endpoint && (
        <div className="thma-monitor__warn">
          Not configured locally. Provide monitorApi endpoint in amplify_outputs.json, or use Demo.
        </div>
      )}

      <ol className="thma-monitor__list" reversed>
        {[...events].reverse().map((e) => (
          <li key={e.id} className="thma-monitor__row">
            <time className="ts">{fmtTime(e.ts)}</time>
            <span className={`method m-${(e.request.method || "GET").toLowerCase()}`}>
              {e.request.method || "—"}
            </span>
            <code className="path">{e.request.path || "—"}</code>
            <span
              className={`status s-${bucket(e.response?.status ?? 0)}`}
              title={`status ${e.response?.status ?? 0}`}
            >
              {e.response?.status ?? "—"}
            </span>
            <span className="latency">{e.response?.latencyMs ?? "—"} ms</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function bucket(status: number) {
  if (status >= 500) return "5";
  if (status >= 400) return "4";
  if (status >= 300) return "3";
  if (status >= 200) return "2";
  return "x";
}
function dedupe(arr: ApiEvent[]) {
  const seen = new Set<string>();
  const out: ApiEvent[] = [];
  for (const e of arr) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
  }
  return out;
}

const css = `
.thma-monitor{position:static;max-height:420px;border-top:1px solid var(--m-brd,#3332);background:var(--m-bg,#0b0b0b);color:var(--m-fg,#eaeaea);font-size:var(--fs-0);line-height:1.65;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;overflow:auto;margin-top:24px;border-radius:8px}
@media (prefers-color-scheme: light){.thma-monitor{--m-bg:#fff;--m-fg:#111;--m-brd:#0003}}
.thma-monitor__hdr{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:inherit}
.thma-monitor__title{display:flex;align-items:center;gap:8px}
.thma-monitor__status{display:flex;gap:8px;align-items:center}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 0 2px #0003 inset;margin-right:4px}
.dot.on{background:#16a34a}
.dot.off{background:#ef4444}
.thma-monitor__btn{margin-left:8px;padding:3px 8px;border:1px solid #8884;border-radius:8px;background:transparent;color:inherit;cursor:pointer}
.thma-monitor__btn:hover{background:#8881}
.thma-monitor__warn{padding:8px 12px;color:#b45309}
.thma-monitor__list{list-style:none;margin:0;padding:4px 0}
.thma-monitor__row{display:grid;grid-template-columns:100px 64px minmax(140px,1fr) 72px 80px;gap:10px;align-items:center;padding:8px 12px;border-top:1px dashed #8882}
.thma-monitor__row:nth-child(odd){background:#fff1;}
.ts{opacity:.8}
.method{font-weight:700}
.m-get{color:#60a5fa}.m-post{color:#34d399}.m-put{color:#f59e0b}.m-delete{color:#f87171}
.status{justify-self:end;padding:2px 6px;border-radius:999px;border:1px solid #8883}
.s-2{background:#16a34a22;color:#16a34a}.s-3{background:#06b6d422;color:#06b6d4}
.s-4{background:#f59e0b22;color:#f59e0b}.s-5{background:#ef444422;color:#ef4444}.s-x{background:#9ca3af22;color:#9ca3af}
.latency{justify-self:end;opacity:.85}
`;
