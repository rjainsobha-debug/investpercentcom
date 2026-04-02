function calculateSIP() {
  let amount = document.getElementById("sipAmount").value;
  let rate = document.getElementById("sipRate").value / 100 / 12;
  let years = document.getElementById("sipYears").value * 12;

  let future = amount * ((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate);

  animateValue("sipResult", 0, Math.round(future), 800);
}

function calculateEMI() {
  let P = document.getElementById("loanAmount").value;
  let r = document.getElementById("interestRate").value / 12 / 100;
  let n = document.getElementById("loanTenure").value * 12;

  let emi = (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);

  document.getElementById("emiResult").innerText = "₹ " + Math.round(emi);
}

function animateValue(id, start, end, duration) {
  let obj = document.getElementById(id);
  let current = start;
  let increment = end/50;

  let timer = setInterval(function(){
    current += increment;
    obj.innerHTML = "₹ " + Math.round(current);
    if(current >= end){
      obj.innerHTML = "₹ " + end;
      clearInterval(timer);
    }
  },20);
}

function showPopup(){
  document.getElementById("leadPopup").style.display="flex";
}

function submitLead(){
  window.open("https://wa.me/918882332050");
}
