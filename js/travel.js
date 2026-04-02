const qs = (id) => document.getElementById(id);

let usdInr = 83;

// 🌍 Cost tiers (approx real-world buckets)
const COST_TIERS = {
  low: { budget: 30, mid: 70, luxury: 150 },
  medium: { budget: 60, mid: 120, luxury: 250 },
  high: { budget: 120, mid: 250, luxury: 500 }
};

// 🌎 Region-based airfare (India → region)
const FLIGHT_COST = {
  asia: { econLow: 15000, econHigh: 35000, bizLow: 70000, bizHigh: 150000 },
  europe: { econLow: 45000, econHigh: 90000, bizLow: 200000, bizHigh: 400000 },
  usa: { econLow: 70000, econHigh: 140000, bizLow: 300000, bizHigh: 600000 },
  middleeast: { econLow: 18000, econHigh: 45000, bizLow: 90000, bizHigh: 200000 }
};

// 🌍 Country classification (smart grouping)
const COUNTRY_MAP = {
  "Thailand": { tier: "low", region: "asia" },
  "Vietnam": { tier: "low", region: "asia" },
  "Indonesia": { tier: "low", region: "asia" },

  "UAE": { tier: "medium", region: "middleeast" },
  "Singapore": { tier: "medium", region: "asia" },

  "Japan": { tier: "high", region: "asia" },
  "France": { tier: "high", region: "europe" },
  "Germany": { tier: "high", region: "europe" },
  "Italy": { tier: "medium", region: "europe" },

  "United States": { tier: "high", region: "usa" },
  "United Kingdom": { tier: "high", region: "europe" },

  "Australia": { tier: "high", region: "asia" }
};

// 🌍 Load full country list dynamically
async function loadCountries() {
  const select = qs("travelCountry");

  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();

    const countries = data
      .map(c => c.name.common)
      .sort();

    countries.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    select.value = "Thailand";

  } catch (e) {
    console.error("Country load failed");
  }
}

// 💱 USD-INR
async function loadUsdInr(){
  try{
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    usdInr = data.rates.INR;
  }catch(e){}
}

// 🧠 Smart calculation
window.calculateTravel = function(){
  const country = qs("travelCountry").value;
  const days = Number(qs("travelDays").value);
  const type = qs("travelType").value;
  const ticket = qs("ticketClass").value;

  if(!country || days <= 0){
    alert("Enter valid details");
    return;
  }

  // fallback if country not mapped
  const meta = COUNTRY_MAP[country] || { tier: "medium", region: "asia" };

  const tier = COST_TIERS[meta.tier];
  const flight = FLIGHT_COST[meta.region];

  let perDayLow = tier.budget;
  let perDayHigh = tier.mid;

  if(type === "leisure"){
    perDayLow = tier.mid;
    perDayHigh = tier.luxury;
  }

  if(type === "business"){
    perDayLow = tier.mid * 1.2;
    perDayHigh = tier.luxury * 1.2;
  }

  const stayLow = perDayLow * days * usdInr;
  const stayHigh = perDayHigh * days * usdInr;

  const flightLow = ticket === "economy" ? flight.econLow : flight.bizLow;
  const flightHigh = ticket === "economy" ? flight.econHigh : flight.bizHigh;

  const totalLow = stayLow + flightLow;
  const totalHigh = stayHigh + flightHigh;

  qs("travelResultTitle").textContent = `${country} • ${days} days`;
  qs("travelTotalInr").textContent =
    `₹ ${Math.round(totalLow).toLocaleString("en-IN")} – ₹ ${Math.round(totalHigh).toLocaleString("en-IN")}`;

  qs("travelBreakdown").textContent =
    `Stay: ₹ ${Math.round(stayLow).toLocaleString("en-IN")} – ₹ ${Math.round(stayHigh).toLocaleString("en-IN")}
     | Flight: ₹ ${flightLow.toLocaleString("en-IN")} – ₹ ${flightHigh.toLocaleString("en-IN")}`;

  qs("travelResult").classList.remove("hidden");
};

loadCountries();
loadUsdInr();
