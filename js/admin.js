import { db } from "./firebase-config.js";
import { ADMIN_PASSWORD } from "./admin-config.js";
import {
  collection, query, orderBy, onSnapshot, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginOverlay = document.getElementById("loginOverlay");
const loginBtn = document.getElementById("loginBtn");
const adminPass = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");

loginBtn.onclick = function(){
  if(adminPass.value === ADMIN_PASSWORD){
    loginOverlay.classList.add("hidden");
  }else{
    loginError.textContent = "Wrong password.";
  }
};

const settingsRef = doc(db, "settings", "site");

const tbody = document.getElementById("leadRows");
const totalEl = document.getElementById("totalLeads");
const invEl = document.getElementById("investmentLeads");
const propEl = document.getElementById("propertyLeads");
const forexEl = document.getElementById("forexLeads");

onSnapshot(query(collection(db, "leads"), orderBy("createdAt", "desc")), (snap) => {
  let total=0, inv=0, prop=0, fx=0;
  tbody.innerHTML = "";
  snap.forEach((d) => {
    total++;
    const x = d.data();
    if(x.category === "investment") inv++;
    if(["property","wealth","tax"].includes(x.category)) prop++;
    if(x.category === "forex") fx++;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${x.name||""}</td>
      <td>${x.mobile||""}</td>
      <td><span class="badge">${x.category||"-"}</span></td>
      <td>${x.page||""}</td>
      <td>${x.source||"website"}</td>
      <td>${x.userAgent ? x.userAgent.slice(0,45) + "..." : "-"}</td>
    `;
    tbody.appendChild(tr);
  });
  totalEl.textContent = total;
  invEl.textContent = inv;
  propEl.textContent = prop;
  forexEl.textContent = fx;
}, (err)=>{
  console.error(err);
  tbody.innerHTML = '<tr><td colspan="6">Unable to load leads. Check Firestore read rules.</td></tr>';
});

onSnapshot(settingsRef, (snap) => {
  if(snap.exists()){
    const s = snap.data();
    document.getElementById("bannerText").value = s.bannerText || "";
    document.getElementById("defaultNumber").value = s.supportNumbers?.default || "";
    document.getElementById("forexNumber").value = s.supportNumbers?.forex || "";
    const m = s.forexMargins || {};
    ["USD","EUR","AED","GBP","CAD","AUD","SGD","JPY","THB","CHF"].forEach(code => {
      const el = document.getElementById("margin_"+code);
      if(el) el.value = m[code] ?? 2;
    });
  }
});

document.getElementById("saveSettingsBtn").onclick = async function(){
  const forexMargins = {};
  ["USD","EUR","AED","GBP","CAD","AUD","SGD","JPY","THB","CHF"].forEach(code => {
    forexMargins[code] = Number(document.getElementById("margin_"+code).value || 0);
  });

  const data = {
    bannerText: document.getElementById("bannerText").value.trim(),
    supportNumbers: {
      default: document.getElementById("defaultNumber").value.trim(),
      forex: document.getElementById("forexNumber").value.trim()
    },
    forexMargins
  };

  try{
    await setDoc(settingsRef, data, { merge:true });
    document.getElementById("saveMsg").textContent = "Settings saved.";
    setTimeout(()=>document.getElementById("saveMsg").textContent="", 2500);
  }catch(err){
    console.error(err);
    document.getElementById("saveMsg").textContent = "Could not save settings.";
  }
};
