// SIP Calculator
function calculateSIP() {
  let amount = parseInt(document.getElementById("sipAmount").value);
  let rate = parseFloat(document.getElementById("sipRate").value) / 100 / 12;
  let years = parseInt(document.getElementById("sipYears").value) * 12;

  let futureValue = amount * ((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate);

  document.getElementById("sipResult").innerText =
    "₹ " + Math.round(futureValue).toLocaleString();
}

// EMI Calculator
function calculateEMI() {
  let P = parseInt(document.getElementById("loanAmount").value);
  let r = parseFloat(document.getElementById("interestRate").value) / 12 / 100;
  let n = parseInt(document.getElementById("loanTenure").value) * 12;

  let emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  document.getElementById("emiResult").innerText =
    "₹ " + Math.round(emi).toLocaleString();
}

// WhatsApp Redirect
function sendToWhatsApp(number) {
  let url = "https://wa.me/91" + number + "?text=I want consultation from InvestPercent";
  window.open(url, "_blank");
}
