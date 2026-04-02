import { db } from "./firebase-config.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const totalEl = document.getElementById('totalLeads');
const investEl = document.getElementById('investmentLeads');
const propertyEl = document.getElementById('propertyLeads');
const forexEl = document.getElementById('forexLeads');
const tbody = document.getElementById('leadRows');

const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  let total = 0, inv = 0, prop = 0, fx = 0;
  tbody.innerHTML = "";

  snapshot.forEach((doc) => {
    total += 1;
    const data = doc.data();
    const cat = data.category || "";
    if (cat === "investment") inv += 1;
    if (cat === "property" || cat === "wealth" || cat === "tax") prop += 1;
    if (cat === "forex") fx += 1;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.name || ""}</td>
      <td>${data.mobile || ""}</td>
      <td><span class="badge">${cat || "-"}</span></td>
      <td>${data.page || ""}</td>
      <td>${data.source || "website"}</td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = total;
  investEl.textContent = inv;
  propertyEl.textContent = prop;
  forexEl.textContent = fx;
}, (error) => {
  console.error(error);
  tbody.innerHTML = '<tr><td colspan="5">Unable to load CRM data. Check Firestore read rules.</td></tr>';
});
