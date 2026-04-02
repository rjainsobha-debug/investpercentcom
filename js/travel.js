
const qs = (id) => document.getElementById(id);

const COUNTRY_DATA = {
  Thailand: { currency: "USD", budget: 38, mid: 104, luxury: 313, econLow: 18000, econHigh: 32000, bizLow: 75000, bizHigh: 140000 },
  Japan: { currency: "USD", budget: 54, mid: 138, luxury: 349, econLow: 35000, econHigh: 65000, bizLow: 140000, bizHigh: 280000 },
  "United Arab Emirates": { currency: "USD", budget: 113, mid: 284, luxury: 748, econLow: 18000, econHigh: 40000, bizLow: 85000, bizHigh: 180000 },
  Singapore: { currency: "USD", budget: 70, mid: 183, luxury: 497, econLow: 22000, econHigh: 42000, bizLow: 95000, bizHigh: 190000 },
  "United States": { currency: "USD", budget: 121, mid: 325, luxury: 926, econLow: 65000, econHigh: 120000, bizLow: 250000, bizHigh: 500000 },
  "United Kingdom": { currency: "USD", budget: 95, mid: 243, luxury: 627, econLow: 55000, econHigh: 110000, bizLow: 230000, bizHigh: 450000 },
  France: { currency: "USD", budget: 109, mid: 309, luxury: 976, econLow: 55000, econHigh: 115000, bizLow: 240000, bizHigh: 480000 },
  Australia: { currency: "USD", budget: 72, mid: 186, luxury: 492, econLow: 60000, econHigh: 115000, bizLow: 240000, bizHigh: 460000 }
};

let usdInr = 83;

async function loadUsdInr(){
  try{
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if(data && data.rates && data.rates.INR){
      usdInr = data.rates.INR;
    }
  }catch(e){
    console.error(e);
  }
}

function populateCountries(){
  const select = qs("travelCountry");
  Object.keys(COUNTRY_DATA).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
  select.value = "Singapore";
}

window.calculateTravel = function(){
  const country = qs("travelCountry").value;
  const days = Number(qs("travelDays").value || 0);
  const travelType = qs("travelType").value;
  const ticketClass = qs("ticketClass").value;
  if(!country || days <= 0){
    alert("Please select country and duration.");
    return;
  }

  const d = COUNTRY_DATA[country];
  let perDayLow = d.budget;
  let perDayHigh = d.mid;
  if(travelType === "leisure"){
    perDayLow = d.mid;
    perDayHigh = d.luxury;
  }
  if(travelType === "business"){
    perDayLow = d.mid * 1.15;
    perDayHigh = d.luxury * 1.10;
  }

  const stayLowInr = perDayLow * days * usdInr;
  const stayHighInr = perDayHigh * days * usdInr;

  const ticketLow = ticketClass === "economy" ? d.econLow : d.bizLow;
  const ticketHigh = ticketClass === "economy" ? d.econHigh : d.bizHigh;

  const totalLow = stayLowInr + ticketLow;
  const totalHigh = stayHighInr + ticketHigh;

  qs("travelResultTitle").textContent = `${country} • ${days} days • ${travelType} • ${ticketClass}`;
  qs("travelTotalInr").textContent = `₹ ${Math.round(totalLow).toLocaleString("en-IN")} – ₹ ${Math.round(totalHigh).toLocaleString("en-IN")}`;
  qs("travelBreakdown").textContent = `Stay + local spend: ₹ ${Math.round(stayLowInr).toLocaleString("en-IN")} – ₹ ${Math.round(stayHighInr).toLocaleString("en-IN")} • Air ticket: ₹ ${ticketLow.toLocaleString("en-IN")} – ₹ ${ticketHigh.toLocaleString("en-IN")}`;
  qs("travelResult").classList.remove("hidden");
};

populateCountries();
loadUsdInr();
