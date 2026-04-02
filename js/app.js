function qs(id){ return document.getElementById(id); }

window.openPopup = function(category='investment'){
  const popup = qs('popup');
  const cat = qs('leadCategory');
  if(cat) cat.value = category;
  if(popup) popup.classList.add('show');
}

window.closePopup = function(){
  const popup = qs('popup');
  if(popup) popup.classList.remove('show');
}

window.goToWhatsApp = function(){
  const name = (qs('leadName')?.value || '').trim();
  const mobile = (qs('leadMobile')?.value || '').trim();
  const category = (qs('leadCategory')?.value || 'investment').trim();

  if(!name || mobile.length < 10){
    alert('Please enter valid name and mobile number.');
    return;
  }

  let number = '918882332050';
  if(category === 'forex') number = '919311354795';

  const msg = encodeURIComponent(`Hi, my name is ${name}. My mobile is ${mobile}. I need help with ${category}.`);
  window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  closePopup();
};

window.calculateSIP = function(){
  const amount = Number(qs('sipAmount').value || 0);
  const annualRate = Number(qs('sipRate').value || 0);
  const years = Number(qs('sipYears').value || 0);

  if(amount <= 0 || annualRate <= 0 || years <= 0){
    alert('Please enter valid SIP details.');
    return;
  }

  const r = annualRate / 12 / 100;
  const n = years * 12;
  const futureValue = amount * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  qs('sipValue').textContent = '₹ ' + Math.round(futureValue).toLocaleString('en-IN');
  qs('sipInvested').textContent = '₹ ' + (amount * n).toLocaleString('en-IN');
  qs('sipResult').style.display = 'block';
};

window.calculateEMI = function(){
  const P = Number(qs('loanAmount').value || 0);
  const annualRate = Number(qs('interestRate').value || 0);
  const years = Number(qs('loanTenure').value || 0);

  if(P <= 0 || annualRate <= 0 || years <= 0){
    alert('Please enter valid loan details.');
    return;
  }

  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  qs('emiValue').textContent = '₹ ' + Math.round(emi).toLocaleString('en-IN');
  qs('emiResult').style.display = 'block';
};

window.calculateTax = function(){
  const income = Number(qs('income').value || 0);
  if(income <= 0){
    alert('Please enter annual income.');
    return;
  }

  let tax = 0;
  if(income <= 300000) tax = 0;
  else if(income <= 700000) tax = (income - 300000) * 0.05;
  else if(income <= 1000000) tax = 20000 + (income - 700000) * 0.10;
  else if(income <= 1200000) tax = 50000 + (income - 1000000) * 0.15;
  else if(income <= 1500000) tax = 80000 + (income - 1200000) * 0.20;
  else tax = 140000 + (income - 1500000) * 0.30;

  qs('taxValue').textContent = '₹ ' + Math.round(tax).toLocaleString('en-IN');
  qs('taxResult').style.display = 'block';
};

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closePopup();
});
