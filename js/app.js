// popup
function showPopup(){
  document.getElementById("leadPopup").style.display="flex";
}
function submitLead(){
  window.open("https://wa.me/918882332050");
}

// market simulation
setInterval(()=>{
  document.querySelector(".ticker").innerHTML = `
    NIFTY: ${22000+Math.floor(Math.random()*200)} |
    SENSEX: ${73000+Math.floor(Math.random()*300)} |
    GOLD: ${72000+Math.floor(Math.random()*200)} |
    SILVER: ${85000+Math.floor(Math.random()*300)}
  `;
},2000);
