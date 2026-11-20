import { estimate, resolveArea } from "../src/estimate.js";
const cases = [
  { service: "office cleaning", city: "Toledo, OH", square_feet: 3000, frequency: "weekly" },
  { service: "house", city: "Sylvania", bedrooms: 3, bathrooms: 2, cleaning_type: "deep" },
  { service: "new construction", city: "Perrysburg Township", square_feet: 2400 },
  { service: "remodel", city: "Maumee" , square_feet: 1200},
  { service: "rv", city: "Temperance, MI", length_feet: 32 },
  { service: "boat", city: "Oregon", length_feet: 24, service_level: "full" },
  { service: "aircraft interior", city: "Swanton", aircraft_class: "turboprop" },
  { service: "commercial", city: "Columbus, OH", square_feet: 10000, facility_type: "medical" },
  { service: "pool", city: "Toledo" },
  { service: "residential", city: "", square_feet: -5, cleaning_type: "move out" },
];
for (const c of cases) { const r = estimate(c); console.log("\n=== " + JSON.stringify(c) + "\n" + r.text); }
for (const a of ["bedford twp, mi", "Monroe", "monroe oh", "Lucas County", "Point Place", "Ottawa Hills, Ohio 43606"]) console.log(a, JSON.stringify(resolveArea(a)));
