import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp,
  doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const qs = (id) => document.getElementById(id);
let siteSettings = {
  bannerText: "Trusted by investors, property buyers and forex seekers across India.",
  forexMargins: { USD:2, EUR:2, AED:2, GBP:2, CAD:2, AUD:2, SGD:2, JPY:2, THB:2, CHF:2 },
  supportNumbers: { default: "918882332050", forex: "919311354795" }
};

function readSettings(){
  const ref = doc(db, "settings", "site");
  onSnapshot(ref, (snap) => {
    if(snap.exists()){
      siteSettings = { ...siteSettings, ...snap.data() };
      const banner = qs("dynamicBanner");
      if(banner) banner.textContent = siteSettings.bannerText || banner.textContent;
      const defaultMargin = qs("marginPercent");
      if(defaultMargin && !defaultMargin.dataset.touched){
        defaultMargin.value = (siteSettings.forexMargins?.USD ?? 2);
      }
    }
  }, (err) => console.error("settings read error", err));
}
readSettings();

window.openPopup = function(category="investment"){
  const popup = qs("leadPopup");
  const cat = qs("leadCategory");
  if(cat) cat.value = category;
  if(popup) popup.classList.remove("hidden");
};
window.closePopup = function(){
  const popup = qs("leadPopup");
  if(popup) popup.classList.add("hidden");
};

window.submitLead = async function(){
  const name = (qs("leadName")?.value || "").trim();
  const mobile = (qs("leadMobile")?.value || "").trim();
  const category = (qs("leadCategory")?.value || "investment").trim();

  if(!name || mobile.length < 10){
    alert("Please enter valid name and mobile number.");
    return;
  }

  let number = siteSettings.supportNumbers?.default || "918882332050";
  if(category === "forex") number = siteSettings.supportNumbers?.forex || "919311354795";

  try{
    await addDoc(collection(db, "leads"), {
      name,
      mobile,
      category,
      source: "website",
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      createdAt: serverTimestamp()
    });

    const msg = encodeURIComponent(`Hi, my name is ${name}. My mobile is ${mobile}. I need help with ${category}.`);
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
    closePopup();
  }catch(err){
    console.error(err);
    alert("Lead could not be saved. Please check Firestore rules or try again.");
  }
};

window.calculateSIP = function(){
  const m = Number(qs("sipMonthly").value || 0);
  const r = Number(qs("sipRate").value || 0) / 12 / 100;
  const y = Number(qs("sipYears").value || 0) * 12;
  if(m<=0 || r<=0 || y<=0){ alert("Enter valid SIP values."); return; }
  const fv = m * (((Math.pow(1+r,y)-1)/r) * (1+r));
  qs("sipOut").textContent = "₹ " + Math.round(fv).toLocaleString("en-IN");
  qs("sipOutWrap").classList.remove("hidden");
};

window.calculateLumpsum = function(){
  const p = Number(qs("lumpAmount").value || 0);
  const r = Number(qs("lumpRate").value || 0) / 100;
  const y = Number(qs("lumpYears").value || 0);
  if(p<=0 || r<=0 || y<=0){ alert("Enter valid lumpsum values."); return; }
  const fv = p * Math.pow(1+r, y);
  qs("lumpOut").textContent = "₹ " + Math.round(fv).toLocaleString("en-IN");
  qs("lumpOutWrap").classList.remove("hidden");
};

window.calculateCAGR = function(){
  const start = Number(qs("cagrStart").value || 0);
  const end = Number(qs("cagrEnd").value || 0);
  const years = Number(qs("cagrYears").value || 0);
  if(start<=0 || end<=0 || years<=0){ alert("Enter valid CAGR values."); return; }
  const cagr = (Math.pow(end/start, 1/years)-1) * 100;
  qs("cagrOut").textContent = cagr.toFixed(2) + "%";
  qs("cagrOutWrap").classList.remove("hidden");
};

window.calculateEMI = function(){
  const P = Number(qs("loanAmount").value || 0);
  const annual = Number(qs("loanRate").value || 0)/12/100;
  const n = Number(qs("loanYears").value || 0) * 12;
  if(P<=0 || annual<=0 || n<=0){ alert("Enter valid EMI values."); return; }
  const emi = (P*annual*Math.pow(1+annual,n))/(Math.pow(1+annual,n)-1);
  qs("emiOut").textContent = "₹ " + Math.round(emi).toLocaleString("en-IN");
  qs("emiOutWrap").classList.remove("hidden");
};

window.calculateAffordability = function(){
  const income = Number(qs("affordIncome").value || 0);
  const obligations = Number(qs("affordDebt").value || 0);
  if(income<=0){ alert("Enter monthly income."); return; }
  const safeEmi = Math.max((income*0.4)-obligations,0);
  const approxLoan = safeEmi * 200;
  qs("affordOut").textContent = "₹ " + Math.round(approxLoan).toLocaleString("en-IN");
  qs("affordOutWrap").classList.remove("hidden");
};

window.calculateAppreciation = function(){
  const price = Number(qs("propPrice").value || 0);
  const rate = Number(qs("propGrowth").value || 0)/100;
  const years = Number(qs("propYears").value || 0);
  if(price<=0 || years<=0){ alert("Enter valid property values."); return; }
  const future = price * Math.pow(1+rate, years);
  qs("propOut").textContent = "₹ " + Math.round(future).toLocaleString("en-IN");
  qs("propOutWrap").classList.remove("hidden");
};

window.calculateTax = function(){
  const income = Number(qs("taxIncome").value || 0);
  if(income<=0){ alert("Enter annual income."); return; }
  let tax = 0;
  if(income <= 300000) tax = 0;
  else if(income <= 700000) tax = (income - 300000) * 0.05;
  else if(income <= 1000000) tax = 20000 + (income - 700000) * 0.10;
  else if(income <= 1200000) tax = 50000 + (income - 1000000) * 0.15;
  else if(income <= 1500000) tax = 80000 + (income - 1200000) * 0.20;
  else tax = 140000 + (income - 1500000) * 0.30;
  qs("taxOut").textContent = "₹ " + Math.round(tax).toLocaleString("en-IN");
  qs("taxOutWrap").classList.remove("hidden");
};

window.calculateHRA = function(){
  const basic = Number(qs("hraBasic").value || 0);
  const hra = Number(qs("hraReceived").value || 0);
  const rent = Number(qs("hraRent").value || 0);
  const metro = qs("hraMetro").value === "yes";
  if(basic<=0 || hra<=0 || rent<=0){ alert("Enter valid HRA values."); return; }
  const exempt = Math.min(hra, rent - 0.1*basic, (metro ? 0.5 : 0.4) * basic);
  qs("hraOut").textContent = "₹ " + Math.max(Math.round(exempt),0).toLocaleString("en-IN");
  qs("hraOutWrap").classList.remove("hidden");
};

window.calculate80C = function(){
  const invested = Number(qs("c80Invested").value || 0);
  const deduction = Math.min(invested, 150000);
  qs("c80Out").textContent = "₹ " + deduction.toLocaleString("en-IN");
  qs("c80OutWrap").classList.remove("hidden");
};

window.calculateRetirement = function(){
  const expense = Number(qs("retExpense").value || 0);
  const years = Number(qs("retYears").value || 0);
  const inflation = Number(qs("retInflation").value || 0)/100;
  if(expense<=0 || years<=0){ alert("Enter valid retirement values."); return; }
  const futureAnnual = expense * 12 * Math.pow(1+inflation, years);
  const corpus = futureAnnual * 25;
  qs("retOut").textContent = "₹ " + Math.round(corpus).toLocaleString("en-IN");
  qs("retOutWrap").classList.remove("hidden");
};

window.calculateEducation = function(){
  const currentCost = Number(qs("eduCurrent").value || 0);
  const years = Number(qs("eduYears").value || 0);
  const infl = Number(qs("eduInflation").value || 0)/100;
  if(currentCost<=0 || years<=0){ alert("Enter valid education values."); return; }
  const future = currentCost * Math.pow(1+infl, years);
  qs("eduOut").textContent = "₹ " + Math.round(future).toLocaleString("en-IN");
  qs("eduOutWrap").classList.remove("hidden");
};

window.calculateInsurance = function(){
  const income = Number(qs("insIncome").value || 0);
  const liabilities = Number(qs("insLiab").value || 0);
  if(income<=0){ alert("Enter valid income."); return; }
  const cover = (income * 15) + liabilities;
  qs("insOut").textContent = "₹ " + Math.round(cover).toLocaleString("en-IN");
  qs("insOutWrap").classList.remove("hidden");
};

document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closePopup(); });
