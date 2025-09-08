// Minimal CloudWatch Logs poller for API Gateway access logs.
// Returns normalized events for the two target endpoints.
// No bodies/headers/credentials are forwarded to the client.

import { CloudWatchLogsClient, FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const REGION = process.env.AWS_REGION || "us-west-2";
const LOG_GROUP_NAME = process.env.LOG_GROUP_NAME || ""; // <- set in Amplify env

type ApiEvent = {
  id: string;
  ts: number;
  request: { method: string; path: string };
  response?: { status: number; latencyMs: number };
  requestId?: string;
  // additional metadata for details view
  meta?: {
    ip?: string;
    resourcePath?: string;
    path?: string;
    responseLength?: number;
    integrationStatus?: string | number;
    integrationLatency?: number;
  };
};

export const handler = async (event: any) => {
  try {
    if (!LOG_GROUP_NAME) {
      return json(500, { error: "LOG_GROUP_NAME not configured" });
    }

    const qs = event?.queryStringParameters ?? {};
    const since = clampInt(qs.since ? parseInt(qs.since, 10) : Date.now() - 15000, 0, Date.now());
    const limit = clampInt(qs.limit ? parseInt(qs.limit, 10) : 30, 1, 100);
    const debug = String(qs.debug || "").toLowerCase() === "1";

    const cw = new CloudWatchLogsClient({ region: REGION });
    const resp = await cw.send(new FilterLogEventsCommand({
      logGroupName: LOG_GROUP_NAME,
      startTime: since + 1,
      interleaved: true,
      // Deliberately no filterPattern; we filter precisely after safe JSON parse.
    }));

    const out: ApiEvent[] = [];
    let scanned = 0, parsed = 0, included = 0;
    let maxTs = since;

    for (const e of resp.events ?? []) {
      scanned++;
      maxTs = Math.max(maxTs, e.timestamp ?? since);
      const msg = e.message ?? "";
      let o: any;
      try {
        o = JSON.parse(msg);
      } catch {
        continue;
      }
      parsed++;

      // Common API Gateway access log fields (JSON format configured on the Stage)
      const method = o.httpMethod ?? o.requestMethod ?? "";
      const resourcePath = o.resourcePath ?? "";
      const path = o.path ?? resourcePath ?? "";
      const status = toInt(o.status, 0);
      const latencyMs = toInt(o.responseLatency ?? o.integrationLatency, 0);
      const requestId = o.requestId ?? "";
      const when = typeof o.requestTimeEpoch === "number" ? o.requestTimeEpoch : (e.timestamp ?? Date.now());

      // Only include our two endpoints
      const include =
        resourcePath.startsWith("/biomed/devices") ||
        resourcePath === "/helpdesk/tickets" ||
        path.startsWith("/biomed/devices") ||
        path.endsWith("/helpdesk/tickets") ||
        path.includes("/biomed/devices/");
      if (!include) continue;
      included++;

      out.push({
        id: `${e.eventId ?? requestId ?? when}-${Math.random().toString(36).slice(2, 7)}`,
        ts: when,
        request: { method, path },
        response: { status, latencyMs },
        requestId,
        meta: {
          ip: typeof o.ip === "string" ? o.ip : undefined,
          resourcePath,
          path,
          responseLength: toInt(o.responseLength, 0),
          integrationStatus: o.integrationStatus,
          integrationLatency: toInt(o.integrationLatency, 0),
        },
      });
    }

    out.sort((a, b) => a.ts - b.ts);
    const trimmed = out.slice(-limit);
    for (const ev of trimmed) redact(ev);

    const body: any = { events: trimmed, nextSince: Math.max(maxTs, since) };
    if (debug) {
      body.meta = { scanned, parsed, included, logGroup: LOG_GROUP_NAME, region: REGION, requestSince: since };
    }
    return json(200, body);
  } catch (err: any) {
    console.error("monitor error", err?.message || err);
    return json(200, { events: [], nextSince: Date.now(), warning: String(err?.message || err) });
  }
};

function json(code: number, body: unknown) {
  return {
    statusCode: code,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      // CORS kept permissive for dev; tighten if desired.
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
    },
    body: JSON.stringify(body),
  };
}

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}
function toInt(v: any, dflt: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : dflt;
}
function redact(ev: any) {
  const mask = (s: string) => (s.length > 8 ? s.slice(0, 4) + "…" + s.slice(-2) : "•••");
  const tokenish = /(?<![A-Za-z0-9])[A-Za-z0-9_\-]{24,64}(?![A-Za-z0-9])/g;
  const email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const scrub = (s?: string) => (typeof s === "string" ? s.replace(tokenish, mask).replace(email, "user@…") : s);
  ev.request && (ev.request.path = scrub(ev.request.path));
}
