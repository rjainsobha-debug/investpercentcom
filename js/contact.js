const CONTACT = {
  whatsapp: "919999999999",
  telegram: "investpercent"
};

function openWhatsApp(msg) {
  const message = encodeURIComponent(msg || "Hi, I want financial advice");
  window.open("https://wa.me/" + CONTACT.whatsapp + "?text=" + message, "_blank");
}

function openTelegram() {
  window.open("https://t.me/" + CONTACT.telegram, "_blank");
}

function waLead(msg) {
  openWhatsApp(msg || "Hi, I need help with insurance planning");
}
