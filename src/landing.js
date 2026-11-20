import * as D from "./data.js";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function landingHtml(mcpUrl) {
  const areas = D.SERVICE_AREAS.map((a) => `${a.city}, ${a.state}`).join(" · ");
  const services = Object.values(D.SERVICES).map((s) => `<li>${esc(s.label)}</li>`).join("");
  const sources = Object.values(D.SOURCES).map((s) => `<li><a href="${esc(s.url)}" rel="nofollow noopener">${esc(s.publisher)}: ${esc(s.title)}</a> <span class="m">(${esc(s.geography)}; retrieved ${D.RETRIEVED})</span></li>`).join("");
  const cursorJson = JSON.stringify({ mcpServers: { "toledo-cleaning-prices": { url: mcpUrl } } }, null, 2);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Free Toledo Cleaning Price Estimator MCP Server | Simply Clean Toledo</title>
<link rel="canonical" href="https://simplycleantoledo.com/mcp-info"><meta name="description" content="Free, public MCP server that gives ballpark cleaning prices for Toledo, Ohio and nearby towns, with cited sources. Connect it to Claude, ChatGPT, Cursor and other AI assistants.">
<style>body{font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1d2b36;max-width:820px;margin:0 auto;padding:24px}h1{color:#0b3954;line-height:1.25}h2{color:#0b3954;margin-top:32px}code,pre{background:#f1f5f8;border-radius:6px}code{padding:2px 6px}pre{padding:12px;overflow:auto}.url{font-size:1.1rem;padding:12px;background:#e8f4fb;border:1px solid #b9dcef;border-radius:8px;word-break:break-all}.note{background:#fff8e6;border:1px solid #f0dca0;border-radius:8px;padding:12px}.m{color:#5b6b78;font-size:.9rem}a{color:#0b6aa2}footer{margin-top:40px;font-size:.9rem;color:#5b6b78}</style></head><body>
<h1>Free Toledo Cleaning Price Estimator (MCP server)</h1>
<p>A free, public <a href="https://modelcontextprotocol.io/">Model Context Protocol</a> server from <a href="${D.BUSINESS.site}">Simply Clean Toledo</a>. Connect it to Claude, ChatGPT, Cursor or any MCP-capable assistant, then ask things like <em>"How much does office cleaning cost in Toledo?"</em> or <em>"What does a deep clean cost for a 3-bedroom house in Sylvania?"</em> You get a ballpark range with every source linked and dated.</p>
<p class="note"><strong>Ballpark market estimates only.</strong> Figures come from published third-party price guides (Angi, HomeGuide, HomeAdvisor, Thumbtack, Care.com, BLS and per-foot detailing price indexes). They are not Simply Clean Toledo's prices and not a quote. For a free quote, use <a href="${D.BUSINESS.quoteUrl}">simplycleantoledo.com/quote-calculator</a> or call <a href="tel:+14193144145">${D.BUSINESS.phone}</a>.</p>
<h2>Connect URL</h2>
<p class="url"><code>${esc(mcpUrl)}</code></p>
<p>Streamable HTTP transport. No sign-in, no API key, free to use.</p>
<h2>Add it to Claude</h2>
<ol><li>Open Claude (web or desktop) and go to <strong>Settings → Connectors</strong>.</li><li>Click <strong>Add custom connector</strong>.</li><li>Name it "Toledo Cleaning Prices" and paste the connect URL above. Leave authentication empty, then click <strong>Add</strong>.</li><li>In a chat, enable the connector from the tools menu and ask your question.</li></ol>
<p>Claude Code: <code>claude mcp add --transport http toledo-cleaning-prices ${esc(mcpUrl)}</code></p>
<h2>Add it to ChatGPT</h2>
<ol><li>Go to <strong>Settings → Apps &amp; Connectors → Advanced settings</strong> and turn on <strong>Developer mode</strong> (available on plans that support custom connectors).</li><li>Back in <strong>Apps &amp; Connectors</strong>, click <strong>Create</strong>.</li><li>Name it "Toledo Cleaning Prices", paste the connect URL as the MCP server URL, choose <strong>No authentication</strong>, and save.</li><li>In a new chat, pick it from the tools / developer-mode menu and ask your question.</li></ol>
<h2>Cursor and other clients</h2>
<pre>${esc(cursorJson)}</pre>
<h2>Tools</h2>
<ul><li><code>estimate_cleaning_price</code>: service, city, size (sq ft, bedrooms/bathrooms, RV or boat length, aircraft class) and frequency.</li><li><code>list_service_areas</code></li><li><code>list_services</code></li><li><code>get_pricing_sources</code></li></ul>
<h2>Services covered</h2><ul>${services}</ul>
<h2>Service area</h2><p>${esc(areas)}. Counties: ${esc(D.SERVICE_COUNTIES.join(", "))}. Requests for other places still get the general published ranges.</p>
<h2>Sources</h2><ul>${sources}</ul>
<p class="m">Machine-readable list: <a href="/mcp/sources.json">/mcp/sources.json</a></p>
<footer>Simply Clean Toledo · 3601 W Alexis Rd, Suite 206, Toledo, OH 43623 · <a href="tel:+14193144145">${D.BUSINESS.phone}</a> (calls only) · <a href="${D.BUSINESS.site}">simplycleantoledo.com</a></footer>
</body></html>`;
}
