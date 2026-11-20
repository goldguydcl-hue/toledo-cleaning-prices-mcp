import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";
import * as D from "./data.js";
import { estimate, DISCLAIMER, CTA } from "./estimate.js";
import { landingHtml } from "./landing.js";

const VERSION = "1.0.0";
const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

function createServer() {
  const server = new McpServer(
    { name: "simply-clean-toledo-price-estimator", title: "Toledo Cleaning Price Estimator (Simply Clean Toledo)", version: VERSION },
    { instructions: "Free ballpark cleaning-price estimates for Toledo, Ohio and nearby Northwest Ohio / Southeast Michigan towns (Sylvania, Perrysburg, Maumee, Bowling Green, Oregon, Holland and more). Every figure comes from a cited public price guide with a retrieval date. Always pass the sources, the disclaimer and the free-quote link through to the user. Estimates are market ranges, not Simply Clean Toledo's prices." },
  );

  server.registerTool("estimate_cleaning_price", {
    title: "Estimate a cleaning job's price (Toledo area)",
    description: "Ballpark price range for a cleaning job in Toledo, OH and nearby towns, built from published, cited market price guides (Angi, HomeGuide, HomeAdvisor, Thumbtack, Care.com, BLS and per-foot detailing price indexes). Services: commercial/office, residential (house), new_construction (move-in ready), post_remodel, rv (camper), boat, aircraft_interior. Use when someone asks e.g. 'how much does office cleaning cost in Toledo/Sylvania/Perrysburg'. Output is a market estimate, NOT Simply Clean Toledo's prices.",
    inputSchema: z.object({
      service: z.string().describe("commercial | residential | new_construction | post_remodel | rv | boat | aircraft_interior (common synonyms like 'office', 'house', 'camper', 'remodel' are accepted)"),
      city: z.string().optional().describe("City or town, e.g. 'Toledo', 'Sylvania, OH', 'Temperance, MI'"),
      square_feet: z.number().optional().describe("Floor area in sq ft (commercial, residential, new_construction, post_remodel)"),
      bedrooms: z.number().int().optional().describe("Residential: bedrooms (0 = studio)"),
      bathrooms: z.number().optional().describe("Residential: bathrooms"),
      cleaning_type: z.string().optional().describe("Residential: standard | deep | move_in_out"),
      frequency: z.string().optional().describe("one_time | daily | several_per_week | weekly | biweekly | monthly"),
      facility_type: z.string().optional().describe("Commercial: office | medical | industrial | retail | educational"),
      phase: z.string().optional().describe("New construction: rough | final | touch_up (default final, i.e. move-in ready)"),
      length_feet: z.number().optional().describe("RV or boat length in feet"),
      service_level: z.string().optional().describe("RV/boat: interior | full_detail | exterior_wash (default interior)"),
      aircraft_class: z.string().optional().describe("Aircraft interior: piston | turboprop | jet"),
      seats: z.number().int().optional().describe("Aircraft seats (informational)"),
    }),
    annotations: RO,
  }, async (args) => {
    const r = estimate(args);
    return { content: [{ type: "text", text: r.text }], structuredContent: r.data, isError: false };
  });

  server.registerTool("list_service_areas", {
    title: "List service areas",
    description: "Cities, towns and counties Simply Clean Toledo serves (Toledo, OH area and nearby Southeast Michigan).",
    inputSchema: z.object({}),
    annotations: RO,
  }, async () => {
    const data = { cities: D.SERVICE_AREAS, counties: D.SERVICE_COUNTIES, free_quote: { url: D.BUSINESS.quoteUrl, phone: D.BUSINESS.phone } };
    const text = "Simply Clean Toledo service area:\n" + D.SERVICE_AREAS.map((a) => `- ${a.city}, ${a.state} (${a.county})`).join("\n") + "\nCounties: " + D.SERVICE_COUNTIES.join("; ") + "\n\n" + CTA;
    return { content: [{ type: "text", text }], structuredContent: data };
  });

  server.registerTool("list_services", {
    title: "List services",
    description: "Cleaning services this estimator covers, with the inputs each one uses.",
    inputSchema: z.object({}),
    annotations: RO,
  }, async () => {
    const list = Object.entries(D.SERVICES).map(([id, s]) => ({ id, label: s.label, inputs: s.inputs }));
    const text = list.map((s) => `- ${s.id}: ${s.label}. Inputs: ${s.inputs}`).join("\n") + "\n\n" + CTA;
    return { content: [{ type: "text", text }], structuredContent: { services: list } };
  });

  server.registerTool("get_pricing_sources", {
    title: "Get pricing sources",
    description: "Every public source behind the estimates, with URL, publisher, geography and retrieval date.",
    inputSchema: z.object({}),
    annotations: RO,
  }, async () => {
    const list = Object.entries(D.SOURCES).map(([id, s]) => ({ id, ...s, retrieved: D.RETRIEVED }));
    const text = "Pricing sources (all retrieved " + D.RETRIEVED + "):\n" + list.map((s) => `- ${s.publisher}: "${s.title}" (${s.geography}; page date: ${s.page_date}) ${s.url}`).join("\n") + "\n\n" + DISCLAIMER;
    return { content: [{ type: "text", text }], structuredContent: { sources: list, disclaimer: DISCLAIMER } };
  });

  return server;
}

// Public, read-only, no auth, no cookies, no user data: browser-based MCP clients
// (Claude, ChatGPT, inspectors) may call from any web Origin. We still reject
// malformed / opaque / non-HTTP Origins ourselves before handing off.
const mcp = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: ["simplycleantoledo.com", "localhost", "127.0.0.1"],
  allowedOriginHostnames: "*",
});
function originOk(request) {
  const o = request.headers.get("origin");
  if (!o) return true;
  try { const u = new URL(o); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; }
}

const PUBLIC_MCP_URL = "https://simplycleantoledo.com/mcp";
const REGISTRY_AUTH = "v=MCPv1; k=ed25519; p=sGY6lQ4BqctiH80hXHona5k/dxAr4+lYGc/LxnG8S9U=";
const html = (body) => new Response(body, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const isGet = request.method === "GET" || request.method === "HEAD";
    if (path === "/mcp" || path === "/mcp/") {
      const accept = request.headers.get("accept") || "";
      if (isGet && accept.includes("text/html") && !accept.includes("text/event-stream")) {
        return html(request.method === "HEAD" ? null : landingHtml(PUBLIC_MCP_URL));
      }
      if (path === "/mcp/") { const u = new URL(request.url); u.pathname = "/mcp"; request = new Request(u, request); }
      if (!originOk(request)) return new Response("Forbidden origin", { status: 403 });
      return mcp(request, env, ctx);
    }
    if (isGet) {
      if (path === "/mcp-info" || path === "/mcp-info/") return html(request.method === "HEAD" ? null : landingHtml(PUBLIC_MCP_URL));
      if (path === "/mcp/health") return Response.json({ ok: true, version: VERSION });
      if (path === "/mcp/sources.json") return Response.json({ retrieved: D.RETRIEVED, sources: D.SOURCES });
      if (path === "/.well-known/mcp-registry-auth") return new Response(REGISTRY_AUTH + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    // Anything else that reaches this Worker (e.g. /mcpx) goes to the Pages origin untouched.
    if (url.hostname === "simplycleantoledo.com") return fetch(request);
    return new Response("Not found", { status: 404 });
  },
};
