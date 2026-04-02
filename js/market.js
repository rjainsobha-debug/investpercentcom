import { METALS_API_KEY } from "./apis-config.js";

let forexRates = null;
let inrPerUsd = null;

const currencyNames = {
  USD: "US Dollar",
  EUR: "Euro",
  AED: "UAE Dirham",
  GBP: "British Pound",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  SGD: "Singapore Dollar",
  JPY: "Japanese Yen",
  THB: "Thai Baht",
  CHF: "Swiss Franc",
  INR: "Indian Rupee"
};

function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}

async function loadForex() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (data && data.rates) {
      forexRates = data.rates;
      inrPerUsd = data.rates.INR;
      setText("usdInr", data.rates.INR ? data.rates.INR.toFixed(2) : "-");
      setText("usdEur", data.rates.EUR ? data.rates.EUR.toFixed(4) : "-");
      setText("usdAed", data.rates.AED ? data.rates.AED.toFixed(4) : "-");
    }
  } catch (e) {
    console.error(e);
  }
}

function toIndianNumber(num, decimals=2){
  return Number(num).toLocaleString("en-IN", {maximumFractionDigits: decimals, minimumFractionDigits: decimals});
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
      const goldOz = Number(data.metals.gold || 0);
      const silverOz = Number(data.metals.silver || 0);

      setText("goldOz", "₹ " + toIndianNumber(goldOz));
      setText("silverOz", "₹ " + toIndianNumber(silverOz));

      const goldPerGram = goldOz / 31.1035;
      const goldPer10g = goldPerGram * 10;
      const silverPerGram = silverOz / 31.1035;
      const silverPerKg = silverPerGram * 1000;

      setText("goldGram", "₹ " + toIndianNumber(goldPerGram));
      setText("gold10g", "₹ " + toIndianNumber(goldPer10g));
      setText("silverGram", "₹ " + toIndianNumber(silverPerGram));
      setText("silverKg", "₹ " + toIndianNumber(silverPerKg));
      setText("gold10gSide", "₹ " + toIndianNumber(goldPer10g));
      setText("silverKgSide", "₹ " + toIndianNumber(silverPerKg));

      warn.textContent = "";
    } else {
      warn.textContent = "Metals API returned no data.";
    }
  } catch (e) {
    console.error(e);
    warn.textContent = "Unable to fetch gold/silver. Check metals.dev key.";
  }
}

function populateCurrencies(){
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");
  const currencies = ["USD","EUR","AED","GBP","CAD","AUD","SGD","JPY","THB","CHF","INR"];
  currencies.forEach(code => {
    const opt1 = document.createElement("option");
    opt1.value = code;
    opt1.textContent = `${code} - ${currencyNames[code] || code}`;
    const opt2 = opt1.cloneNode(true);
    from.appendChild(opt1);
    to.appendChild(opt2);
  });
  from.value = "USD";
  to.value = "INR";
}

window.calculateForex = function(){
  if(!forexRates){
    alert("Forex rates are still loading. Please try again.");
    return;
  }

  const amount = Number(document.getElementById("forexAmount").value || 0);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const margin = Number(document.getElementById("marginPercent").value || 0);

  if(amount <= 0){
    alert("Please enter amount.");
    return;
  }

  // API base is USD. Convert from source currency to USD, then to target.
  const fromRate = forexRates[from];
  const toRate = forexRates[to];

  if(!fromRate || !toRate){
    alert("Currency pair unavailable.");
    return;
  }

  const usdAmount = amount / fromRate;
  const liveConverted = usdAmount * toRate;
  const ourRate = (toRate / fromRate) * (1 + margin / 100);
  const ourConverted = amount * ourRate;

  document.getElementById("liveRateValue").textContent = liveConverted.toLocaleString("en-IN", {maximumFractionDigits: 2});
  document.getElementById("ourRateValue").textContent = ourConverted.toLocaleString("en-IN", {maximumFractionDigits: 2});
  document.getElementById("pairText").textContent = `${from} → ${to}`;
  document.getElementById("fxResult").style.display = "block";
}

populateCurrencies();
loadForex();
loadMetals();
