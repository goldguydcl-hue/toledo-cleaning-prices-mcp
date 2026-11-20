import * as D from "./data.js";

const money = (n) => "$" + (n >= 100 ? Math.round(n / 5) * 5 : Math.round(n)).toLocaleString("en-US");
const rng = (a, b, plus) => (a === b ? money(a) : `${money(a)}–${money(b)}`) + (plus ? "+" : "");
const perft = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
const norm = (s) => String(s || "").toLowerCase().replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();

export const DISCLAIMER =
  "Ballpark market estimate only, built from published third-party price guides. These are NOT Simply Clean Toledo's prices and not a quote. Real prices depend on condition, scope, access and schedule.";
export const CTA =
  `For a free quote from ${D.BUSINESS.name}, use ${D.BUSINESS.quoteUrl} or call ${D.BUSINESS.phone}.`;

export function resolveService(input) {
  const s = norm(input).replace(/_/g, " ");
  if (!s) return null;
  for (const [id, svc] of Object.entries(D.SERVICES)) {
    if (s === id.replace(/_/g, " ") || svc.aliases.includes(s)) return id;
  }
  for (const [id, svc] of Object.entries(D.SERVICES)) {
    if (svc.aliases.some((a) => s.includes(a))) return id;
  }
  return null;
}

export function resolveArea(input) {
  let s = norm(input);
  if (!s) return { status: "missing" };
  s = s.replace(/\b(ohio|michigan)\b/g, (m) => (m === "ohio" ? "oh" : "mi")).replace(/\b\d{5}\b/g, "").trim();
  let state = null;
  const m = s.match(/\b(oh|mi)$/);
  if (m) { state = m[1].toUpperCase(); s = s.slice(0, m.index).trim(); }
  s = s.replace(/\b(city of|township|twp)\b/g, "").replace(/\s+/g, " ").trim();
  const bedford = norm(input).includes("bedford");
  for (const a of D.SERVICE_AREAS) {
    const c = norm(a.city).replace(/ township/, "");
    if ((s === c || (bedford && a.city === "Bedford Township")) && (!state || state === a.state)) {
      return { status: "in_area", ...a };
    }
  }
  for (const c of D.SERVICE_COUNTIES) {
    const [cn, st] = c.split(", ");
    const cs = norm(cn).replace(" county", "");
    if ((s === norm(cn) || s === cs) && (!state || state === st)) return { status: "in_area", city: null, county: cn, state: st };
  }
  // common Toledo neighborhoods
  if (/(point place|old west end|west toledo|south toledo|east toledo|north toledo|downtown toledo|uptown)/.test(s))
    return { status: "in_area", city: "Toledo", state: "OH", county: "Lucas County" };
  return { status: "out_of_area", input: String(input) };
}

function src(...ids) {
  return ids.map((id) => ({ id, ...D.SOURCES[id], retrieved: D.RETRIEVED }));
}

function nearestHouseRow(beds, baths) {
  let best = null, bestScore = Infinity;
  for (const r of D.HOMEGUIDE_HOUSE_TABLE) {
    const score = Math.abs(r.beds - beds) * 2 + Math.abs(r.baths - (baths ?? r.baths));
    if (score < bestScore) { best = r; bestScore = score; }
  }
  return { row: best, exact: bestScore === 0 };
}

const FREQS = ["one_time", "daily", "several_per_week", "weekly", "biweekly", "monthly"];
export function normFreq(f) {
  const s = norm(f).replace(/[- ]/g, "_");
  if (!s) return null;
  if (FREQS.includes(s)) return s;
  if (/once|one_?time|single|one_off/.test(s)) return "one_time";
  if (/daily|every_day|5x|nightly/.test(s)) return "daily";
  if (/(2|3|4)x|times_a_week|times_per_week|several/.test(s)) return "several_per_week";
  if (/bi_?weekly|every_(two|2)_weeks|fortnight/.test(s)) return "biweekly";
  if (/week/.test(s)) return "weekly";
  if (/month/.test(s)) return "monthly";
  return null;
}

function commercial(p, notes) {
  const lines = [], used = new Set(["angi_commercial"]);
  const type = ["office", "medical", "industrial", "retail", "educational"].includes(p.facility_type) ? p.facility_type : "office";
  if (p.facility_type && p.facility_type !== type) notes.push(`Unknown facility_type "${p.facility_type}"; used office rates.`);
  const [lo, hi] = D.ANGI_COMM_PER_SQFT[type];
  let headline = null;
  if (p.square_feet) {
    const a = p.square_feet * lo, b = p.square_feet * hi;
    const sz = D.ANGI_COMM_BY_SIZE.find((r) => p.square_feet <= r.max);
    headline = { low: sz.range[0], high: sz.range[1], unit: "per visit", plus: !!sz.plus };
    lines.push(`Angi per-visit range for ${sz.label}: **${rng(sz.range[0], sz.range[1], sz.plus)} per visit** (national).`);
    lines.push(`Angi's ${type} rate of $${lo.toFixed(2)}–$${hi.toFixed(2)}/sq ft × ${p.square_feet.toLocaleString()} sq ft works out to ${rng(a, b)} per visit. Angi publishes both figures and they differ; the size range above is the main guide.`);
    const hg = D.HOMEGUIDE_COMM_MONTHLY.find((r) => p.square_feet <= r.max);
    if (hg) { used.add("homeguide_commercial"); lines.push(`HomeGuide monthly contract figure for ${hg.label} (based on 3 visits a week): ${rng(hg.range[0], hg.range[1], hg.plus)} per month. Sources differ a lot here; recurring contracts are usually priced lower per visit than one-time cleans.`); }
  } else {
    notes.push("Add square_feet for a size-based estimate.");
    lines.push(`Angi per-visit ranges by size: up to 1,000 sq ft $70–$250; 1,000–5,000 sq ft $150–$600; 5,000–20,000 sq ft $400–$2,000; 20,000+ sq ft $1,000–$2,500+.`);
  }
  const f = normFreq(p.frequency);
  if (f && D.ANGI_COMM_BY_FREQ[f]) {
    const r = D.ANGI_COMM_BY_FREQ[f];
    lines.push(`Angi per-visit range for ${f.replace("_", "-")} service: ${rng(r[0], r[1], f === "one_time")}.`);
    if (!headline) headline = { low: r[0], high: r[1], unit: "per visit" };
  } else if (f === "several_per_week") {
    lines.push("Several visits a week: Angi publishes daily ($100–$500 per visit) and weekly ($150–$600 per visit) ranges; HomeGuide's monthly figures above assume 3 visits a week.");
  }
  const h = D.ANGI_COMM_HOURLY[type];
  lines.push(`Hourly (Angi, ${type}): $${h[0]}–$${h[1]} per cleaner-hour.`);
  used.add("thumbtack_toledo_commercial");
  const t = D.THUMBTACK_TOLEDO_COMM;
  lines.push(`Toledo-area reference (Thumbtack's Toledo page): office cleaning averages about $${t.avg_clean} per clean; about $${t.upto_1000_sqft} for 1,000 sq ft or less; about $${t.sqft_9000_10000} for 9,000–10,000 sq ft; commercial cleaners charge about $${t.hourly[0]}–$${t.hourly[1]} an hour.`);
  used.add("bls_oews_toledo");
  lines.push(`Local labor context (BLS, Toledo metro, May 2025): janitors earn a mean $${D.BLS_TOLEDO.janitors_mean_hourly}/hr (median $${D.BLS_TOLEDO.janitors_median_hourly}). That is worker pay, not the price a company bills.`);
  return { headline, lines, sources: src(...used), time_estimate: null };
}

function residential(p, notes) {
  const lines = [], used = new Set();
  const ct = ({ deep: "deep", move_in_out: "move_in_out", move_out: "move_in_out", move_in: "move_in_out", standard: "standard" })[norm(p.cleaning_type).replace(/[- ]/g, "_")] || "standard";
  if (p.cleaning_type && !["deep", "move_in_out", "move_out", "move_in", "standard"].includes(norm(p.cleaning_type).replace(/[- ]/g, "_"))) notes.push(`Unknown cleaning_type "${p.cleaning_type}"; used standard.`);
  const key = ct === "move_in_out" ? "move" : ct;
  let headline = null;
  if (p.bedrooms != null) {
    used.add("homeguide_house");
    const { row, exact } = nearestHouseRow(p.bedrooms, p.bathrooms);
    const r = row[key];
    headline = { low: r[0], high: r[1], unit: "per visit" };
    lines.push(`HomeGuide ${ct.replace(/_/g, "-")} clean, ${row.label}${exact ? "" : " (closest row in their table)"}: **${rng(r[0], r[1])} per visit** (national).`);
  }
  if (p.square_feet) {
    used.add("homeadvisor_house");
    const H = D.HOMEADVISOR_HOUSE;
    if (ct === "standard") {
      const a = p.square_feet * H.per_sqft_standard[0], b = p.square_feet * H.per_sqft_standard[1];
      lines.push(`HomeAdvisor standard rate $0.10–$0.20/sq ft × ${p.square_feet.toLocaleString()} sq ft: ${rng(a, b)} per visit.`);
      if (!headline) headline = { low: Math.round(a), high: Math.round(b), unit: "per visit" };
    } else {
      const max = ct === "deep" ? H.per_sqft_deep_max : H.per_sqft_move_max;
      lines.push(`HomeAdvisor says ${ct === "deep" ? "deep cleaning" : "move-in/move-out cleaning"} can cost up to $${max.toFixed(2)}/sq ft, or up to about ${money(p.square_feet * max)} for ${p.square_feet.toLocaleString()} sq ft.`);
    }
  }
  used.add("homeguide_toledo_house");
  const T = D.HOMEGUIDE_TOLEDO_HOUSE;
  lines.push(`HomeGuide's Toledo page: a standard house cleaning costs $${T.standard[0]}–$${T.standard[1]} on average and a deep cleaning $${T.deep[0]}–$${T.deep[1]}.`);
  if (!headline) {
    if (ct === "move_in_out") { used.add("homeadvisor_house"); lines.push("HomeAdvisor: move-in/move-out cleaning costs up to $500 depending on home size."); }
    else headline = { low: T[ct][0], high: T[ct][1], unit: "per visit" };
    notes.push("Add bedrooms/bathrooms or square_feet for a size-based estimate.");
  }
  const f = normFreq(p.frequency);
  if (f === "weekly" || f === "biweekly") { used.add("homeadvisor_house"); const r = D.HOMEADVISOR_HOUSE[f]; lines.push(`HomeAdvisor ${f} cleaning: about $${r[0]}–$${r[1]} per visit.`); }
  if (f === "monthly" || f === "one_time") { used.add("thumbtack_house"); const r = D.THUMBTACK_HOUSE[f]; lines.push(`Thumbtack national ${f === "monthly" ? "once-a-month" : "one-time"} visit: $${r[0]}–$${r[1]}.`); }
  used.add("care_toledo_house"); used.add("homeadvisor_house");
  lines.push(`Hourly: cleaning companies $25–$80/hr and independent cleaners $12–$25/hr (HomeAdvisor, national). Care.com lists an average posted rate around $${D.CARE_TOLEDO_HOURLY}/hr for Toledo house cleaners.`);
  const time = D.HOMEADVISOR_HOUSE.hours[ct];
  lines.push(`Typical time (HomeAdvisor): ${time} for a ${ct.replace(/_/g, "-")} clean of an average home; crew size changes the clock time.`);
  return { headline, lines, sources: src(...used), time_estimate: time };
}

function construction(p, notes, remodel) {
  const lines = [], used = new Set(["homeguide_postconstruction", "angi_commercial"]);
  const P = D.HOMEGUIDE_POSTCON;
  const phase = remodel ? "final" : (["rough", "final", "touch_up"].includes(p.phase) ? p.phase : "final");
  const r = P[phase];
  let headline = null;
  if (p.square_feet) {
    const a = p.square_feet * r[0], b = p.square_feet * r[1];
    headline = { low: Math.round(a), high: Math.round(b), unit: "per job" };
    lines.push(`HomeGuide ${phase === "final" ? (remodel ? "standard interior" : "standard interior (detailed, move-in ready)") : phase.replace("_", "-")} cleaning at $${r[0].toFixed(2)}–$${r[1].toFixed(2)}/sq ft × ${p.square_feet.toLocaleString()} sq ft: **${rng(a, b)} per job** (national).`);
    if (!remodel && phase === "final") lines.push(`If a separate rough clean is also needed: HomeGuide $0.15–$0.40/sq ft, about ${rng(p.square_feet * 0.15, p.square_feet * 0.40)}.`);
  } else {
    notes.push("Add square_feet for a size-based estimate.");
    lines.push("HomeGuide interior totals by project size: 500 sq ft $100–$300; 1,000 sq ft $200–$600; 1,500 sq ft $300–$900; 2,000 sq ft $400–$1,200; 2,500 sq ft $500–$1,500; 3,500 sq ft $700–$2,100.");
  }
  lines.push(`Angi lists post-construction cleaning at $0.15–$0.60/sq ft and $30–$50 per hour.`);
  if (remodel) lines.push("Remodel note: HomeGuide's range covers both new construction and renovations, and it says new construction typically generates more debris than a renovation. No separate published per-square-foot rate for post-remodel cleaning was found.");
  return { headline, lines, sources: src(...used), time_estimate: null };
}

function perFoot(p, notes, kind) {
  const lines = [], used = new Set();
  const lvl = ["interior", "full_detail", "exterior_wash"].includes(p.service_level) ? p.service_level : "interior";
  const L = p.length_feet;
  let headline = null;
  if (!L) notes.push("Add length_feet for a total; prices below are per foot.");
  if (kind === "rv") {
    used.add("rvdetailing_index");
    const r = D.RV_INDEX[lvl];
    lines.push(`RV ${r.label.toLowerCase()} (RVDetailing.org index of posted prices): median ${perft(r.median)}/ft, middle half ${perft(r.p25)}–${perft(r.p75)}/ft${r.n < 20 ? ` (only ${r.n} posted prices; treat as rough)` : ""}.`);
    if (L) { headline = { low: Math.round(L * r.p25), high: Math.round(L * r.p75), unit: "per job" }; lines.push(`For ${L} ft: **${rng(L * r.p25, L * r.p75)}**, around ${money(L * r.median)} at the median.`); }
  } else {
    used.add("deckhand_boat");
    const r = D.DECKHAND_BOAT[lvl];
    lines.push(`Boat ${r.label.toLowerCase()} (Deckhand, ${r.n} US businesses): ${perft(r.range[0])}–${perft(r.range[1])}/ft, typical ${perft(r.typical)}/ft.`);
    if (L) { headline = { low: Math.round(L * r.range[0]), high: Math.round(L * r.range[1]), unit: "per job" }; lines.push(`For ${L} ft: **${rng(L * r.range[0], L * r.range[1])}**, around ${money(L * r.typical)} at the typical rate.`); }
    if (lvl === "full_detail") { used.add("boatwork_boat"); const b = D.BOATWORK_FULL; lines.push(`Cross-check (Boatwork): full detail median $${b.median}/ft, middle half $${b.mid[0]}–$${b.mid[1]}/ft${L ? `, about ${rng(L * b.mid[0], L * b.mid[1])} for ${L} ft` : ""}.`); }
  }
  lines.push("These are US-wide published price lists. No Toledo-specific published per-foot prices were found. Condition, mildew, pet hair and access (driveway, storage lot, marina) change the price.");
  return { headline, lines, sources: src(...used), time_estimate: null };
}

function aircraft(p, notes) {
  const used = new Set(["cleanjets_aircraft"]);
  const cls = ["piston", "turboprop", "jet"].includes(p.aircraft_class) ? p.aircraft_class : null;
  const lines = [];
  let headline = null, time = null;
  const rows = cls ? [cls] : ["piston", "turboprop", "jet"];
  if (!cls) notes.push("Add aircraft_class (piston, turboprop or jet) to narrow this down.");
  for (const k of rows) {
    const r = D.CLEANJETS_AIRCRAFT[k];
    lines.push(`${r.label} interior detail: ${rng(r.range[0], r.range[1], r.plus)}, typically ${r.hours} (CleanJets guide).`);
  }
  if (cls) { const r = D.CLEANJETS_AIRCRAFT[cls]; headline = { low: r.range[0], high: r.range[1], unit: "per job", plus: !!r.plus }; time = r.hours; }
  if (p.seats) lines.push(`Seats given: ${p.seats}. Published guides price by aircraft class and cabin size, not per seat.`);
  lines.push("Only one published source with aircraft-interior price ranges was found, so treat these as low confidence. Interior cleaning only; deep carpet extraction or leather reconditioning is priced extra.");
  return { headline, lines, sources: src(...used), time_estimate: time };
}

function numOrNull(v, name, notes, max) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n > max) { notes.push(`Ignored ${name}=${v} (must be a positive number up to ${max.toLocaleString()}).`); return null; }
  return n;
}

export function estimate(args = {}) {
  const notes = [];
  const service = resolveService(args.service);
  if (!service) {
    return { ok: false, text: `I don't have "${args.service ?? ""}" as a service. Services: ${Object.values(D.SERVICES).map((s) => s.label).join("; ")}.\n\n${CTA}`, data: { ok: false, error: "unknown_service", services: Object.keys(D.SERVICES) } };
  }
  const area = resolveArea(args.city);
  const p = {
    square_feet: numOrNull(args.square_feet, "square_feet", notes, 2000000),
    bedrooms: args.bedrooms === 0 ? 0 : numOrNull(args.bedrooms, "bedrooms", notes, 20),
    bathrooms: numOrNull(args.bathrooms, "bathrooms", notes, 20),
    length_feet: numOrNull(args.length_feet, "length_feet", notes, 200),
    seats: numOrNull(args.seats, "seats", notes, 500),
    frequency: args.frequency, facility_type: norm(args.facility_type) || undefined,
    cleaning_type: args.cleaning_type, phase: norm(args.phase).replace(/[- ]/g, "_") || undefined,
    service_level: norm(args.service_level).replace(/[- ]/g, "_") || undefined,
    aircraft_class: norm(args.aircraft_class) || undefined,
  };
  if (args.frequency && !normFreq(args.frequency)) notes.push(`Unrecognized frequency "${args.frequency}". Use one_time, daily, several_per_week, weekly, biweekly or monthly.`);
  if (service === "rv" || service === "boat") {
    const l = p.service_level;
    if (l === "wash" || l === "exterior") p.service_level = "exterior_wash";
    if (l === "full" || l === "detail") p.service_level = "full_detail";
  }
  let r;
  if (service === "commercial") r = commercial(p, notes);
  else if (service === "residential") r = residential(p, notes);
  else if (service === "new_construction") r = construction(p, notes, false);
  else if (service === "post_remodel") r = construction(p, notes, true);
  else if (service === "rv") r = perFoot(p, notes, "rv");
  else if (service === "boat") r = perFoot(p, notes, "boat");
  else r = aircraft(p, notes);

  let areaLine;
  if (area.status === "in_area") areaLine = `${area.city ? area.city + ", " + area.state : area.county + ", " + area.state} is in ${D.BUSINESS.name}'s service area (${area.county}).`;
  else if (area.status === "missing") areaLine = `No city given. ${D.BUSINESS.name} serves Toledo, OH and nearby Lucas, Wood and Fulton County (OH) and Monroe County (MI) communities.`;
  else areaLine = `"${area.input}" is outside ${D.BUSINESS.name}'s listed service area (Toledo, OH and nearby Lucas, Wood and Fulton County, OH and Monroe County, MI communities). The general published ranges below still apply as a rough guide.`;

  const label = D.SERVICES[service].label;
  const head = r.headline ? `Ballpark: ${rng(r.headline.low, r.headline.high, r.headline.plus)} ${r.headline.unit}` : "No single headline figure; see the published ranges below.";
  const text = [
    `## ${label}: ballpark market estimate`,
    areaLine,
    `**${head}**`,
    "",
    ...r.lines.map((l) => "- " + l),
    ...(notes.length ? ["", "Notes: " + notes.join(" ")] : []),
    "",
    "Sources (retrieved " + D.RETRIEVED + "):",
    ...r.sources.map((s) => `- ${s.publisher}, "${s.title}" (${s.geography}): ${s.url}`),
    "",
    `_${DISCLAIMER}_`,
    "",
    area.status === "out_of_area" ? "If the job is in the Toledo area after all: " + CTA : CTA,
  ].join("\n");
  return {
    ok: true, text,
    data: {
      ok: true, service, service_label: label, area, headline: r.headline, details: r.lines.map((l) => l.replace(/\*\*/g, "")),
      typical_time: r.time_estimate, notes, sources: r.sources, disclaimer: DISCLAIMER,
      free_quote: { url: D.BUSINESS.quoteUrl, phone: D.BUSINESS.phone, phone_note: D.BUSINESS.phoneNote },
    },
  };
}
