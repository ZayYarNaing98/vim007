// vim007 worker: JSON API, MCP server, api-catalog, and Markdown content
// negotiation in front of the static SPA assets. Only runs on the routes
// listed in wrangler.jsonc `run_worker_first` — plain asset requests never
// invoke it. All data is public and read-only; there is no auth.

const MCP_PROTOCOL = "2025-06-18";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

// With SPA not_found_handling, missing assets come back as the HTML shell
// with status 200 — so a fetch only counts if the content type matches.
async function fetchAsset(env, origin, path, expectType) {
  const res = await env.ASSETS.fetch(new URL(path, origin));
  if (!res.ok) return null;
  const type = res.headers.get("Content-Type") ?? "";
  return type.includes(expectType) ? res : null;
}

async function assetJson(env, origin, path) {
  const res = await fetchAsset(env, origin, path, "json");
  return res ? res.json() : null;
}

/* ---------- Markdown content negotiation ---------- */

function markdownPathFor(pathname) {
  if (pathname === "/") return "/md/index.md";
  if (pathname === "/progress") return "/md/progress.md";
  const m = pathname.match(/^\/lesson\/([\w-]+)\/?$/);
  return m ? `/md/lesson/${m[1]}.md` : null;
}

/* ---------- JSON API ---------- */

async function handleApi(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");
  let assetPath = null;
  if (path === "/api/lessons") assetPath = "/api/lessons.json";
  else {
    const m = path.match(/^\/api\/lessons\/([\w-]+)$/);
    if (m) assetPath = `/api/lessons/${m[1]}.json`;
  }
  if (!assetPath) {
    return json({ error: "Not found. See /openapi.json for available endpoints." }, 404);
  }
  const res = await fetchAsset(env, url.origin, assetPath, "json");
  if (!res) {
    return json({ error: "Unknown lesson slug. GET /api/lessons lists all slugs." }, 404);
  }
  return new Response(res.body, {
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

/* ---------- MCP server (streamable HTTP, stateless) ---------- */

const MCP_TOOLS = [
  {
    name: "list_lessons",
    description:
      "List all Vim TypeTutor lessons: slug, title, category, summary, taught keys, and exercise counts.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_lesson",
    description:
      "Get one lesson by slug, including its intro and every exercise (instruction, initial code, goal state, par keystrokes).",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: 'Lesson slug, e.g. "survival" or "matching-pairs".',
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
];

async function handleMcp(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "POST") {
    return json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32000, message: "POST JSON-RPC messages to this endpoint." },
      },
      405
    );
  }
  let msg;
  try {
    msg = await request.json();
  } catch {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
  }
  const { id, method, params } = msg ?? {};

  if (method === "initialize") {
    return json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: MCP_PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "vim007", title: "Vim TypeTutor", version: "1.0.0" },
        instructions:
          "Read-only access to the Vim TypeTutor curriculum (24 lessons, 157 exercises). No auth required.",
      },
    });
  }
  if (method === "tools/list") {
    return json({ jsonrpc: "2.0", id, result: { tools: MCP_TOOLS } });
  }
  if (method === "tools/call") {
    const origin = new URL(request.url).origin;
    const name = params?.name;
    const args = params?.arguments ?? {};
    let data = null;
    if (name === "list_lessons") {
      data = await assetJson(env, origin, "/api/lessons.json");
    } else if (name === "get_lesson") {
      if (typeof args.slug !== "string" || !/^[\w-]+$/.test(args.slug)) {
        return json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: "Invalid slug. Call list_lessons for valid slugs." }],
            isError: true,
          },
        });
      }
      data = await assetJson(env, origin, `/api/lessons/${args.slug}.json`);
    } else {
      return json({ jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown tool: ${name}` } });
    }
    if (data === null) {
      return json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: "Not found. Call list_lessons for valid slugs." }],
          isError: true,
        },
      });
    }
    return json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        isError: false,
      },
    });
  }
  // Notifications (initialized, cancelled, ...) get an empty 202.
  if (id === undefined || id === null) return new Response(null, { status: 202, headers: CORS });
  return json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
}

/* ---------- entry ---------- */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/mcp") return handleMcp(request, env);
    if (pathname.startsWith("/api/")) return handleApi(request, env);

    if (pathname === "/.well-known/api-catalog") {
      const res = await fetchAsset(env, url.origin, "/.well-known/api-catalog.json", "json");
      if (res) {
        return new Response(res.body, {
          headers: { "Content-Type": "application/linkset+json", ...CORS },
        });
      }
    }

    const accept = request.headers.get("Accept") ?? "";
    if (request.method === "GET" && accept.includes("text/markdown")) {
      const mdPath = markdownPathFor(pathname);
      if (mdPath) {
        const res = await fetchAsset(env, url.origin, mdPath, "markdown");
        if (res) {
          return new Response(res.body, {
            headers: {
              "Content-Type": "text/markdown; charset=utf-8",
              "Vary": "Accept",
              ...CORS,
            },
          });
        }
      }
    }
    return env.ASSETS.fetch(request);
  },
};
