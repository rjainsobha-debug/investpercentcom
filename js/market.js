import { db } from "./firebase-config.js";
import { METALS_API_KEY } from "./apis-config.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const qs = (id)=>document.getElementById(id);

let forexRates = null;
let siteSettings = {
  forexMargins: { USD:2, EUR:2, AED:2, GBP:2, CAD:2, AUD:2, SGD:2, JPY:2, THB:2, CHF:2 }
};

const currencyNames = {
  USD:"US Dollar", EUR:"Euro", AED:"UAE Dirham", GBP:"British Pound", CAD:"Canadian Dollar",
  AUD:"Australian Dollar", SGD:"Singapore Dollar", JPY:"Japanese Yen", THB:"Thai Baht", CHF:"Swiss Franc", INR:"Indian Rupee"
};

function setText(id, value){ const el = qs(id); if(el) el.textContent = value; }
function inr(num, digits=2){ return Number(num).toLocaleString("en-IN", {maximumFractionDigits: digits, minimumFractionDigits: digits}); }

onSnapshot(doc(db, "settings", "site"), (snap) => {
  if(snap.exists()){
    siteSettings = { ...siteSettings, ...snap.data() };
    const banner = qs("dynamicBanner");
    if(banner) banner.textContent = siteSettings.bannerText || banner.textContent;
  }
});

async function loadForex(){
  try{
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if(data && data.rates){
      forexRates = data.rates;
      setText("usdInr", data.rates.INR?.toFixed(2) || "-");
      setText("usdEur", data.rates.EUR?.toFixed(4) || "-");
      setText("usdAed", data.rates.AED?.toFixed(4) || "-");
      populateCurrencies();
    }
  }catch(err){ console.error(err); }
}

async function loadMetals(){
  if(!METALS_API_KEY){
    setText("metalWarn", "Add your metals.dev key in js/apis-config.js to enable gold and silver.");
    return;
  }
  try{
    const res = await fetch(`https://api.metals.dev/v1/latest?api_key=${METALS_API_KEY}&currency=INR&unit=toz`);
    const data = await res.json();
    if(data && data.metals){
      const goldOz = Number(data.metals.gold || 0);
      const silverOz = Number(data.metals.silver || 0);
      const goldGram = goldOz / 31.1035;
      const gold10g = goldGram * 10;
      const silverGram = silverOz / 31.1035;
      const silverKg = silverGram * 1000;

      setText("goldGram", "₹ " + inr(goldGram));
      setText("gold10g", "₹ " + inr(gold10g));
      setText("silverGram", "₹ " + inr(silverGram));
      setText("silverKg", "₹ " + inr(silverKg));
      setText("goldOz", "₹ " + inr(goldOz));
      setText("silverOz", "₹ " + inr(silverOz));
      setText("gold10gSide", "₹ " + inr(gold10g));
      setText("silverKgSide", "₹ " + inr(silverKg));
    }
  }catch(err){
    console.error(err);
    setText("metalWarn", "Unable to fetch gold/silver. Check your metals.dev API key.");
  }
}

function populateCurrencies(){
  const from = qs("fromCurrency");
  const to = qs("toCurrency");
  if(!from || !to || !forexRates) return;
  from.innerHTML = "";
  to.innerHTML = "";
  const list = ["USD","EUR","AED","GBP","CAD","AUD","SGD","JPY","THB","CHF","INR"];
  list.forEach(code => {
    const a = document.createElement("option");
    a.value = code;
    a.textContent = `${code} - ${currencyNames[code]}`;
    const b = a.cloneNode(true);
    from.appendChild(a);
    to.appendChild(b);
  });
  from.value = "USD";
  to.value = "INR";

  const defaultMargin = qs("marginPercent");
  if(defaultMargin){
    defaultMargin.value = siteSettings.forexMargins?.USD ?? 2;
  }
  from.onchange = function(){
    if(defaultMargin){
      defaultMargin.dataset.touched = "1";
      defaultMargin.value = siteSettings.forexMargins?.[from.value] ?? 2;
    }
  }
}

window.calculateForex = function(){
  if(!forexRates){ alert("Rates are loading. Try again."); return; }

  const amount = Number(qs("forexAmount").value || 0);
  const from = qs("fromCurrency").value;
  const to = qs("toCurrency").value;
  const margin = Number(qs("marginPercent").value || 0);

  if(amount <= 0){ alert("Enter amount."); return; }
  const fromRate = forexRates[from];
  const toRate = forexRates[to];
  if(!fromRate || !toRate){ alert("Currency unavailable."); return; }

  const usdAmount = amount / fromRate;
  const live = usdAmount * toRate;
  const pairRate = toRate / fromRate;
  const adjustedRate = pairRate * (1 + margin/100);
  const adjusted = amount * adjustedRate;

  qs("pairText").textContent = `${from} → ${to}`;
  qs("liveRateValue").textContent = live.toLocaleString("en-IN", {maximumFractionDigits:2});
  qs("ourRateValue").textContent = adjusted.toLocaleString("en-IN", {maximumFractionDigits:2});
  qs("appliedMargin").textContent = margin.toFixed(2) + "%";
  qs("fxResult").classList.remove("hidden");
};

loadForex();
loadMetals();
