# Toledo Cleaning Price Estimator (MCP server)

[![goldguydcl-hue/toledo-cleaning-prices-mcp MCP server](https://glama.ai/mcp/servers/goldguydcl-hue/toledo-cleaning-prices-mcp/badges/score.svg)](https://glama.ai/mcp/servers/g

A free, public [Model Context Protocol](https://modelcontextprotocol.io/) server from [Simply Clean Toledo](https://simplycleantoledo.com/).
Ask your AI assistant things like "How much does office cleaning cost in Toledo?" or "What does a deep clean cost for a
3-bedroom house in Sylvania?" and get a ballpark range with every source linked and dated.

**Connect URL:** `https://simplycleantoledo.com/mcp` (Streamable HTTP, no sign-in, no API key)
Info page: https://simplycleantoledo.com/mcp-info

> Ballpark market estimates only, built from published third-party price guides (Angi, HomeGuide, HomeAdvisor,
> Thumbtack, Care.com, BLS and per-foot detailing price indexes). They are not Simply Clean Toledo's prices and not a quote.
> For a free quote: https://simplycleantoledo.com/quote-calculator/ or call (419) 314-4145.

## Tools
| Tool | What it does |
| --- | --- |
| `estimate_cleaning_price` | Range for a job: `service`, `city`, plus size (`square_feet`, `bedrooms`/`bathrooms`, `length_feet`, `aircraft_class`) and `frequency` |
| `list_service_areas` | Towns and counties served (Toledo, Sylvania, Perrysburg, Maumee, Bowling Green, Oregon, Holland and more; Monroe County, MI) |
| `list_services` | Commercial/office, residential, new construction (move-in ready), post-remodel, RV/camper, boat, aircraft interior |
| `get_pricing_sources` | Every source URL with publisher, geography and retrieval date |

All tools are read-only.

## Add it to your assistant
- **Claude** (web/desktop): Settings → Connectors → Add custom connector → paste `https://simplycleantoledo.com/mcp`, no auth.
- **Claude Code:** `claude mcp add --transport http toledo-cleaning-prices https://simplycleantoledo.com/mcp`
- **ChatGPT:** Settings → Apps & Connectors → Advanced → turn on Developer mode → Create → paste the URL, No authentication.
- **Cursor / other clients:**
```json
{ "mcpServers": { "toledo-cleaning-prices": { "url": "https://simplycleantoledo.com/mcp" } } }
```

## Run it yourself
Cloudflare Worker built with the Agents SDK (`createMcpHandler`) and `@modelcontextprotocol/server`.
```bash
npm install
npx wrangler dev        # http://localhost:8787/mcp
node test/local.mjs     # offline sample estimates
```
Every number lives in `src/data.js` next to its source id; `RETRIEVED` holds the date the sources were checked.

## License
MIT
