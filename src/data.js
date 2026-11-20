// All price figures below are copied from the public pages listed in SOURCES.
// Retrieved 2026-11-20. Do not add a number here without a source id.

export const RETRIEVED = "2026-11-20";

export const BUSINESS = {
  name: "Simply Clean Toledo",
  site: "https://simplycleantoledo.com/",
  quoteUrl: "https://simplycleantoledo.com/quote-calculator/",
  phone: "(419) 314-4145",
  phoneNote: "calls only",
};

export const SOURCES = {
  angi_commercial: {
    publisher: "Angi", title: "How Much Does Commercial Cleaning Cost? [2026 Data]",
    url: "https://www.angi.com/articles/commercial-cleaning-cost.htm",
    geography: "United States (national averages)", page_date: "Updated Oct 12, 2026",
  },
  homeguide_commercial: {
    publisher: "HomeGuide", title: "How Much Does Commercial Cleaning Cost?",
    url: "https://homeguide.com/costs/commercial-cleaning-prices",
    geography: "United States (national averages)", page_date: "Dec 13, 2023 (page title says 2026 prices)",
  },
  thumbtack_toledo_commercial: {
    publisher: "Thumbtack", title: "Commercial cleaning services near Toledo, OH (cost FAQ)",
    url: "https://www.thumbtack.com/oh/toledo/commercial-cleaning/",
    geography: "Toledo, OH page", page_date: "not shown",
  },
  homeguide_house: {
    publisher: "HomeGuide", title: "House Cleaning Services Prices & Cost Calculator",
    url: "https://homeguide.com/costs/house-cleaning-prices",
    geography: "United States (national averages)", page_date: "not shown",
  },
  homeguide_toledo_house: {
    publisher: "HomeGuide", title: "The 10 Best House Cleaning Services in Toledo, OH (2026), cost FAQ",
    url: "https://homeguide.com/oh/toledo/house-cleaning/",
    geography: "Toledo, OH page", page_date: "2026",
  },
  homeadvisor_house: {
    publisher: "HomeAdvisor", title: "How Much Does Professional House Cleaning Cost in 2026?",
    url: "https://www.homeadvisor.com/cost/cleaning-services/hire-a-maid-service/",
    geography: "United States (national averages)", page_date: "Updated Jun 19, 2026",
  },
  thumbtack_house: {
    publisher: "Thumbtack", title: "How much does house cleaning cost?",
    url: "https://www.thumbtack.com/p/house-cleaning-prices",
    geography: "United States (national averages)", page_date: "not shown",
  },
  care_toledo_house: {
    publisher: "Care.com", title: "House Cleaning Services in Toledo, OH",
    url: "https://www.care.com/house-cleaning/toledo-oh",
    geography: "Toledo, OH (posted rates of independent cleaners)", page_date: "November 2026",
  },
  homeguide_postconstruction: {
    publisher: "HomeGuide", title: "How Much Does Post-Construction Cleaning Cost? (2026)",
    url: "https://homeguide.com/costs/post-construction-cleaning-rates",
    geography: "United States (national averages)", page_date: "2026",
  },
  rvdetailing_index: {
    publisher: "RVDetailing.org", title: "RV Detailing Price Index: Posted Per-Foot Prices (2026)",
    url: "https://rvdetailing.org/rv-detailer-price-index/",
    geography: "United States (78 detailer websites, October 2026)", page_date: "October 2026",
  },
  deckhand_boat: {
    publisher: "Deckhand", title: "Boat detailing prices (2026): what detailers charge per foot",
    url: "https://www.deckhand-llc.com/guides/boat-detailing-prices",
    geography: "United States (135 businesses that publish per-foot prices)", page_date: "Updated Nov 16, 2026",
  },
  boatwork_boat: {
    publisher: "Boatwork", title: "Boat Detailing & Cleaning: pros and published prices",
    url: "https://boatwork.co/specialities/boat-detailing-cleaning/",
    geography: "United States (published prices, researched Oct 2026)", page_date: "Updated November 2026",
  },
  cleanjets_aircraft: {
    publisher: "CleanJets", title: "Aircraft Interior Detailing: What's Included (Time & Cost)",
    url: "https://cleanjets.net/articles/owner-guides/interior-detailing-guide",
    geography: "United States (single publisher's guide; low confidence)", page_date: "not shown",
  },
  bls_oews_toledo: {
    publisher: "U.S. Bureau of Labor Statistics", title: "OEWS May 2025, Toledo, OH MSA (45780): janitors (37-2011) and maids/housekeeping cleaners (37-2012)",
    url: "https://www.bls.gov/oes/current/oes_45780.htm",
    geography: "Toledo, OH metropolitan area", page_date: "May 2025 estimates (BLS API series OEUM004578000000037201103/08, OEUM004578000000037201203/08)",
  },
};

// Worker wages (what cleaners are paid, NOT what customers are billed).
export const BLS_TOLEDO = {
  janitors_mean_hourly: 17.64, janitors_median_hourly: 16.94,
  maids_mean_hourly: 15.51, maids_median_hourly: 14.86,
};

export const SERVICE_AREAS = [
  { city: "Toledo", state: "OH", county: "Lucas County" },
  { city: "Perrysburg", state: "OH", county: "Wood County" },
  { city: "Sylvania", state: "OH", county: "Lucas County" },
  { city: "Maumee", state: "OH", county: "Lucas County" },
  { city: "Bowling Green", state: "OH", county: "Wood County" },
  { city: "Oregon", state: "OH", county: "Lucas County" },
  { city: "Holland", state: "OH", county: "Lucas County" },
  { city: "Rossford", state: "OH", county: "Wood County" },
  { city: "Waterville", state: "OH", county: "Lucas County" },
  { city: "Whitehouse", state: "OH", county: "Lucas County" },
  { city: "Northwood", state: "OH", county: "Wood County" },
  { city: "Ottawa Hills", state: "OH", county: "Lucas County" },
  { city: "Monclova", state: "OH", county: "Lucas County" },
  { city: "Swanton", state: "OH", county: "Fulton County" },
  { city: "Temperance", state: "MI", county: "Monroe County" },
  { city: "Lambertville", state: "MI", county: "Monroe County" },
  { city: "Monroe", state: "MI", county: "Monroe County" },
  { city: "Bedford Township", state: "MI", county: "Monroe County" },
];
export const SERVICE_COUNTIES = ["Lucas County, OH", "Wood County, OH", "Fulton County, OH", "Monroe County, MI"];

export const SERVICES = {
  commercial: {
    label: "Commercial & office cleaning (janitorial)",
    aliases: ["commercial", "office", "office cleaning", "janitorial", "commercial cleaning", "business", "medical office", "retail", "school", "warehouse", "industrial"],
    inputs: "square_feet (recommended), frequency, facility_type (office | medical | industrial | retail | educational)",
  },
  residential: {
    label: "Residential / house cleaning",
    aliases: ["residential", "house", "house cleaning", "home", "home cleaning", "apartment", "maid", "deep clean", "move out", "move-out", "move in", "move-in"],
    inputs: "bedrooms + bathrooms and/or square_feet, cleaning_type (standard | deep | move_in_out), frequency",
  },
  new_construction: {
    label: "New construction cleaning (move-in ready)",
    aliases: ["new construction", "new_construction", "post construction", "post-construction", "construction", "builder clean", "final clean"],
    inputs: "square_feet (recommended), phase (rough | final | touch_up)",
  },
  post_remodel: {
    label: "Post-remodel / renovation cleaning",
    aliases: ["post remodel", "post_remodel", "remodel", "remodeling", "renovation", "post-remodel", "post renovation"],
    inputs: "square_feet (recommended)",
  },
  rv: {
    label: "RV / camper cleaning",
    aliases: ["rv", "camper", "motorhome", "travel trailer", "fifth wheel", "rv cleaning", "camper cleaning"],
    inputs: "length_feet (recommended), service_level (interior | full_detail | exterior_wash)",
  },
  boat: {
    label: "Boat cleaning",
    aliases: ["boat", "boat cleaning", "boat detailing", "yacht", "pontoon"],
    inputs: "length_feet (recommended), service_level (interior | full_detail | exterior_wash)",
  },
  aircraft_interior: {
    label: "Aircraft interior cleaning (interior only)",
    aliases: ["aircraft", "aircraft interior", "aircraft_interior", "airplane", "plane", "jet", "private jet", "cabin"],
    inputs: "aircraft_class (piston | turboprop | jet), seats (optional, informational)",
  },
};

// ---------- price tables (each row cites its source) ----------
export const ANGI_COMM_PER_SQFT = { // per square foot, Angi facility-type table
  office: [0.10, 0.20], medical: [0.20, 0.50], industrial: [0.15, 0.35], retail: [0.05, 0.10], educational: [0.10, 0.30],
};
export const ANGI_COMM_HOURLY = {
  office: [20, 80], medical: [35, 80], industrial: [50, 90], retail: [20, 50], educational: [30, 80],
};
export const ANGI_COMM_BY_SIZE = [ // per visit
  { max: 1000, label: "up to 1,000 sq ft", range: [70, 250] },
  { max: 5000, label: "1,000–5,000 sq ft", range: [150, 600] },
  { max: 20000, label: "5,000–20,000 sq ft", range: [400, 2000] },
  { max: Infinity, label: "20,000+ sq ft", range: [1000, 2500], plus: true },
];
export const ANGI_COMM_BY_FREQ = { // per visit
  daily: [100, 500], weekly: [150, 600], biweekly: [200, 700], monthly: [200, 800], one_time: [300, 1500],
};
export const HOMEGUIDE_COMM_MONTHLY = [ // per month, based on 3 visits per week
  { max: 1000, label: "under 1,000 sq ft", range: [100, 250] },
  { max: 2000, label: "1,000–2,000 sq ft", range: [200, 400] },
  { max: 4000, label: "2,000–4,000 sq ft", range: [250, 800] },
  { max: 6000, label: "4,000–6,000 sq ft", range: [350, 1200] },
  { max: 8000, label: "6,000–8,000 sq ft", range: [500, 1600] },
  { max: 10000, label: "8,000–10,000 sq ft", range: [650, 2000], plus: true },
];
export const THUMBTACK_TOLEDO_COMM = { avg_clean: 200, upto_1000_sqft: 120, sqft_9000_10000: 880, hourly: [25, 90] };

// HomeGuide house cleaning calculator table: [standard, deep, move_out]
export const HOMEGUIDE_HOUSE_TABLE = [
  { beds: 0, baths: 1, label: "Studio", standard: [60, 60], deep: [90, 90], move: [100, 100] },
  { beds: 1, baths: 1, label: "1 bed / 1 bath", standard: [60, 90], deep: [90, 110], move: [100, 120] },
  { beds: 2, baths: 1, label: "2 bed / 1 bath", standard: [90, 120], deep: [120, 175], move: [120, 180] },
  { beds: 2, baths: 2, label: "2 bed / 2 bath", standard: [95, 130], deep: [135, 195], move: [135, 210] },
  { beds: 3, baths: 1, label: "3 bed / 1 bath", standard: [110, 165], deep: [150, 250], move: [175, 260] },
  { beds: 3, baths: 2, label: "3 bed / 2 bath", standard: [135, 180], deep: [180, 280], move: [180, 300] },
  { beds: 4, baths: 3, label: "4 bed / 3 bath", standard: [140, 200], deep: [200, 400], move: [200, 390] },
];
export const HOMEGUIDE_TOLEDO_HOUSE = { standard: [90, 180], deep: [230, 600] };
export const HOMEADVISOR_HOUSE = {
  per_visit: [118, 239], avg: 176,
  per_sqft_standard: [0.10, 0.20], per_sqft_deep_max: 0.25, per_sqft_move_max: 0.35,
  deep_visit: [200, 400], move_max: 500,
  weekly: [75, 200], biweekly: [100, 250], hourly_company: [25, 80], hourly_independent: [12, 25],
  hours: { standard: "1–3 hours", deep: "3–6 hours", move_in_out: "4–8 hours" },
};
export const THUMBTACK_HOUSE = { one_time: [186, 332], biweekly: [165, 284], monthly: [170, 293] };
export const CARE_TOLEDO_HOURLY = 19.45;

export const HOMEGUIDE_POSTCON = { rough: [0.15, 0.40], final: [0.20, 0.60], touch_up: [0.20, 0.60], overall: [0.15, 0.60] };
export const HOMEGUIDE_POSTCON_TABLE = [
  [500, 100, 300], [1000, 200, 600], [1500, 300, 900], [2000, 400, 1200], [2500, 500, 1500], [3500, 700, 2100],
];
export const ANGI_POSTCON = { per_sqft: [0.15, 0.60], hourly: [30, 50] };

export const RV_INDEX = { // $/ft: median, 25th pct, 75th pct, n
  interior: { median: 12.5, p25: 9.5, p75: 27.5, n: 13, label: "Interior" },
  full_detail: { median: 25, p25: 15, p75: 40, n: 51, label: "Full detail" },
  exterior_wash: { median: 10, p25: 7, p75: 15, n: 67, label: "Exterior wash" },
};
export const DECKHAND_BOAT = { // $/ft US: typical range, typical value, n businesses
  interior: { range: [11, 17.5], typical: 15, n: 15, label: "Interior detail (cabin and cockpit)" },
  full_detail: { range: [18, 30], typical: 22.5, n: 65, label: "Full detail" },
  exterior_wash: { range: [6, 12], typical: 8, n: 46, label: "One-off wash" },
};
export const BOATWORK_FULL = { median: 21, mid: [18.13, 24.38], n: 14 };

export const CLEANJETS_AIRCRAFT = {
  piston: { range: [300, 600], hours: "2–4 hours", label: "Piston aircraft" },
  turboprop: { range: [500, 1200], hours: "3–6 hours", label: "Turboprop" },
  jet: { range: [1000, 4000], plus: true, hours: "4–12+ hours", label: "Jet" },
};
