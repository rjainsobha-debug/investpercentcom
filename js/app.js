import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// OPEN POPUP
window.openPopup = function () {
  document.getElementById("popup").style.display = "flex";
};

// CLOSE POPUP
window.closePopup = function () {
  document.getElementById("popup").style.display = "none";
};

// SAVE LEAD + ROUTE
window.goToWhatsApp = async function () {

  let name = document.getElementById("leadName").value.trim();
  let mobile = document.getElementById("leadMobile").value.trim();

  // VALIDATION
  if (!name || mobile.length < 10) {
    alert("Enter valid details");
    return;
  }

  // DETECT CATEGORY
  let category = "investment";
  if (window.location.pathname.includes("property")) category = "property";
  if (window.location.pathname.includes("tax")) category = "tax";
  if (window.location.pathname.includes("wealth")) category = "wealth";
  if (window.location.pathname.includes("forex")) category = "forex";

  try {
    await addDoc(collection(db, "leads"), {
      name: name,
      mobile: mobile,
      category: category,
      source: "website",
      page: window.location.pathname,
      createdAt: serverTimestamp()
    });

    // ROUTING NUMBERS
    let number = "918882332050"; // default wealth/property

    if (category === "forex") {
      number = "919311354795";
    }

    window.open(`https://wa.me/${number}?text=Hi%2C%20I%20need%20help%20with%20${category}`, "_blank");

    window.closePopup();

  } catch (error) {
    console.error(error);
    alert("Error saving lead");
  }
};
