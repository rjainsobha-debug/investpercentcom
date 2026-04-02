import { METALS_API_KEY } from "./apis-config.js";

async function loadForex() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (data && data.rates) {
      const inr = data.rates.INR;
      const eur = data.rates.EUR;
      const aed = data.rates.AED;
      document.getElementById("usdInr").textContent = inr ? inr.toFixed(2) : "-";
      document.getElementById("usdEur").textContent = eur ? eur.toFixed(4) : "-";
      document.getElementById("usdAed").textContent = aed ? aed.toFixed(4) : "-";
    }
  } catch (e) {
    console.error(e);
  }
}

async function loadMetals() {
  const warn = document.getElementById("metalWarn");
  if (!METALS_API_KEY) {
    warn.textContent = "Add your metals.dev API key in js/apis-config.js to enable live gold and silver.";
    return;
  }

  try {
    const res = await fetch(`https://api.metals.dev/v1/latest?api_key=${METALS_API_KEY}&currency=INR&unit=toz`);
    const data = await res.json();
    if (data && data.metals) {
      const gold = data.metals.gold;
      const silver = data.metals.silver;
      document.getElementById("goldInr").textContent = gold ? Number(gold).toLocaleString("en-IN", {maximumFractionDigits: 2}) : "-";
      document.getElementById("silverInr").textContent = silver ? Number(silver).toLocaleString("en-IN", {maximumFractionDigits: 2}) : "-";
      warn.textContent = "";
    } else {
      warn.textContent = "Metals API returned no data.";
    }
  } catch (e) {
    console.error(e);
    warn.textContent = "Unable to fetch gold/silver. Check metals.dev key.";
  }
}

loadForex();
loadMetals();
