
const formatINR = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(isFinite(n)?n:0);
const formatNum = n => new Intl.NumberFormat('en-IN',{maximumFractionDigits:2}).format(isFinite(n)?n:0);
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];

function showToast(msg='Copied to clipboard'){
  const t=qs('#toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
}

function copyText(text){
  navigator.clipboard.writeText(text).then(()=>showToast('Summary copied'));
}

function setTheme(mode){
  document.documentElement.classList.toggle('light', mode==='light');
  localStorage.setItem('investpercent-theme', mode);
  const icon=qs('#themeIcon');
  if(icon) icon.className = mode==='light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}
function toggleTheme(){
  const mode = document.documentElement.classList.contains('light') ? 'dark':'light';
  setTheme(mode);
}
function initTheme(){
  setTheme(localStorage.getItem('investpercent-theme') || 'dark');
}
function toggleMenu(){ qs('.nav-links')?.classList.toggle('open'); }

function progressBar(){
  const total=document.documentElement.scrollHeight-window.innerHeight;
  const progress=Math.max(0, Math.min(1, window.scrollY/total));
  qs('.top-progress').style.transform=`scaleX(${progress})`;
}

function animateValue(el, to, prefix='', suffix=''){
  const from=0, dur=1200, start=performance.now();
  function step(ts){
    const p=Math.min(1,(ts-start)/dur);
    const eased=1-Math.pow(1-p,3);
    const val = from + (to-from)*eased;
    el.textContent = `${prefix}${formatNum(val)}${suffix}`;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function ensureChart(canvasId, config){
  const c=document.getElementById(canvasId);
  if(!c || typeof Chart==='undefined') return null;
  if(c._chart) c._chart.destroy();
  c._chart=new Chart(c,config); return c._chart;
}

function saveFavorite(id){
  const favs = JSON.parse(localStorage.getItem('investpercent-favs')||'[]');
  const idx = favs.indexOf(id);
  if(idx>=0) favs.splice(idx,1); else favs.push(id);
  localStorage.setItem('investpercent-favs', JSON.stringify(favs));
  renderFavorites();
  paintStars();
}
function paintStars(){
  const favs = JSON.parse(localStorage.getItem('investpercent-favs')||'[]');
  qsa('[data-fav]').forEach(btn=>{
    const active=favs.includes(btn.dataset.fav);
    btn.innerHTML = `<i class="fa-${active?'solid':'regular'} fa-star"></i>`;
    btn.setAttribute('aria-label', active?'Remove favorite':'Add favorite');
  });
}
function renderFavorites(){
  const wrap=qs('#favoriteTools'); if(!wrap) return;
  const favs = JSON.parse(localStorage.getItem('investpercent-favs')||'[]');
  const cards=qsa('[data-tool-card]').filter(el=>favs.includes(el.dataset.toolCard));
  wrap.innerHTML = cards.length ? cards.map(c=>`<a class="chip" href="#${c.id}">${c.dataset.title}</a>`).join('') : `<span class="helper">Star calculators to pin them here.</span>`;
}
function initSearch(){
  const input=qs('#siteSearch');
  const result=qs('#searchResults');
  if(!input||!result) return;
  const tools=qsa('[data-tool-card]').map(card=>({
    id:card.id,title:card.dataset.title,keywords:(card.dataset.keywords||'').toLowerCase()
  }));
  input.addEventListener('input', ()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){result.innerHTML=''; result.classList.add('hidden'); return;}
    const hits=tools.filter(t=>t.title.toLowerCase().includes(q)||t.keywords.includes(q)).slice(0,8);
    result.innerHTML = hits.length ? hits.map(t=>`<button class="search-hit" data-go="${t.id}">${t.title}</button>`).join('') : `<div class="helper">No calculator found</div>`;
    result.classList.remove('hidden');
    qsa('.search-hit').forEach(b=>b.onclick=()=>{document.getElementById(b.dataset.go)?.scrollIntoView({behavior:'smooth', block:'start'}); result.classList.add('hidden'); input.value='';});
  });
}
function bindQuickWidget(){
  qs('#quickToggle')?.addEventListener('click',()=>qs('#quickPanel').classList.toggle('open'));
}
function syncRange(inputId, rangeId){
  const i=qs('#'+inputId), r=qs('#'+rangeId); if(!i||!r) return;
  const sync=(from,to)=>()=>to.value=from.value;
  i.addEventListener('input', sync(i,r)); r.addEventListener('input', sync(r,i));
}
function setupSyncs(){
  [['sipAmount','sipAmountRange'],['sipReturn','sipReturnRange'],['sipYears','sipYearsRange'],
   ['lumpAmount','lumpAmountRange'],['lumpReturn','lumpReturnRange'],['lumpYears','lumpYearsRange'],
   ['emiAmount','emiAmountRange'],['emiRate','emiRateRange'],['emiYears','emiYearsRange'],
   ['fdAmount','fdAmountRange'],['fdRate','fdRateRange'],['fdYears','fdYearsRange']].forEach(([a,b])=>syncRange(a,b));
}

function calcSIP(){
  const P=+qs('#sipAmount').value||0, annual=+qs('#sipReturn').value||0, years=+qs('#sipYears').value||0, step=+qs('#sipStep').value||0;
  const r=annual/12/100; const n=years*12;
  let totalInv=0, corpus=0, yearly=[];
  for(let y=1;y<=years;y++){
    let monthly = P*Math.pow(1+step/100,y-1);
    for(let m=1;m<=12;m++){
      corpus = (corpus + monthly) * (1+r);
      totalInv += monthly;
    }
    yearly.push({year:y, invested:totalInv, value:corpus});
  }
  qs('#sipResult').classList.remove('hidden');
  animateValue(qs('#sipInvestedVal'), totalInv, '₹');
  animateValue(qs('#sipReturnsVal'), corpus-totalInv, '₹');
  animateValue(qs('#sipValueVal'), corpus, '₹');
  qs('#sipTable').innerHTML = yearly.map(y=>`<tr><td>Year ${y.year}</td><td>${formatINR(y.invested)}</td><td>${formatINR(y.value-y.invested)}</td><td>${formatINR(y.value)}</td></tr>`).join('');
  ensureChart('sipChart',{
    type:'bar',
    data:{labels:yearly.map(y=>'Y'+y.year),datasets:[
      {label:'Invested',data:yearly.map(y=>y.invested), backgroundColor:'rgba(0,212,255,.7)'},
      {label:'Value',data:yearly.map(y=>y.value), backgroundColor:'rgba(22,227,154,.7)'}
    ]},
    options:{responsive:true, plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}, scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}, y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}
  });
  qs('#sipShare').onclick=()=>copyText(`SIP summary: Monthly SIP ${formatINR(P)}, return ${annual}%, duration ${years} years, total invested ${formatINR(totalInv)}, estimated value ${formatINR(corpus)}.`);
  qs('#sipResult').scrollIntoView({behavior:'smooth', block:'nearest'});
}
function resetSIP(){ ['sipAmount','sipReturn','sipYears','sipStep'].forEach(id=>qs('#'+id).value=qs('#'+id).defaultValue||''); ['sipAmountRange','sipReturnRange','sipYearsRange'].forEach(id=>{if(qs('#'+id)&&qs('#'+id.replace('Range',''))) qs('#'+id).value=qs('#'+id.replace('Range','')).value}); qs('#sipResult').classList.add('hidden'); }

function calcLump(){
  const P=+qs('#lumpAmount').value||0, annual=+qs('#lumpReturn').value||0, years=+qs('#lumpYears').value||0, comp=+qs('#lumpComp').value||1;
  const amount = P*Math.pow(1+annual/100/comp, comp*years);
  const gain=amount-P;
  qs('#lumpResult').classList.remove('hidden');
  animateValue(qs('#lumpMaturityVal'), amount, '₹');
  animateValue(qs('#lumpGainVal'), gain, '₹');
  animateValue(qs('#lumpPctVal'), P?gain/P*100:0, '', '%');
  let pts=[]; for(let y=0;y<=years;y++){pts.push({year:y, value:P*Math.pow(1+annual/100/comp, comp*y)});}
  qs('#lumpTable').innerHTML = pts.map(p=>`<tr><td>${p.year}</td><td>${formatINR(p.value)}</td></tr>`).join('');
  ensureChart('lumpChart',{type:'line',data:{labels:pts.map(p=>'Y'+p.year), datasets:[{label:'Growth', data:pts.map(p=>p.value), borderColor:'#00d4ff', backgroundColor:'rgba(0,212,255,.1)', fill:true, tension:.3}]}, options:{responsive:true, plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}, scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}, y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#lumpShare').onclick=()=>copyText(`Lump sum summary: Invested ${formatINR(P)} at ${annual}% for ${years} years. Maturity ${formatINR(amount)}.`);
}
function calcCAGR(){
  const start=+qs('#cagrStart').value||0, end=+qs('#cagrEnd').value||0, years=+qs('#cagrYears').value||0;
  const cagr = start>0 && end>0 && years>0 ? (Math.pow(end/start,1/years)-1)*100 : 0;
  const abs = start>0 ? ((end-start)/start)*100 : 0;
  qs('#cagrResult').classList.remove('hidden');
  animateValue(qs('#cagrVal'), cagr, '', '%');
  animateValue(qs('#cagrAbsVal'), abs, '', '%');
  animateValue(qs('#cagrGainVal'), end-start, '₹');
  let pts=[]; for(let y=0;y<=years;y++){pts.push(start*Math.pow(1+cagr/100,y));}
  ensureChart('cagrChart',{type:'line',data:{labels:[...Array(years+1)].map((_,i)=>'Y'+i),datasets:[{label:'Projected path',data:pts,borderColor:'#7b61ff',backgroundColor:'rgba(123,97,255,.08)',fill:true,tension:.3}]}, options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#cagrShare').onclick=()=>copyText(`CAGR summary: ${formatINR(start)} grew to ${formatINR(end)} in ${years} years. CAGR ${formatNum(cagr)}%.`);
}

function calcFD(){
  const P=+qs('#fdAmount').value||0, annual=+qs('#fdRate').value||0, years=+qs('#fdYears').value||0, n=+qs('#fdComp').value||4;
  const compound = P*Math.pow(1+annual/100/n, n*years);
  const simple = P*(1+annual/100*years);
  qs('#fdResult').classList.remove('hidden');
  animateValue(qs('#fdCompoundVal'), compound, '₹');
  animateValue(qs('#fdSimpleVal'), simple, '₹');
  animateValue(qs('#fdInterestVal'), compound-P, '₹');
  let rows=[]; for(let y=1;y<=years;y++){rows.push({y, value:P*Math.pow(1+annual/100/n, n*y)});}
  qs('#fdTable').innerHTML = rows.map(r=>`<tr><td>${r.y}</td><td>${formatINR(r.value)}</td></tr>`).join('');
  ensureChart('fdChart',{type:'bar',data:{labels:rows.map(r=>'Y'+r.y),datasets:[{label:'FD Value',data:rows.map(r=>r.value),backgroundColor:'rgba(255,209,102,.75)'}]},options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#fdShare').onclick=()=>copyText(`FD summary: Principal ${formatINR(P)}, rate ${annual}%, tenure ${years} years, maturity ${formatINR(compound)}.`);
}

function emiFormula(P, annual, years){
  const r=annual/12/100, n=years*12;
  const emi = P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  return {emi, r, n};
}
function calcEMI(){
  const P=+qs('#emiAmount').value||0, rate=+qs('#emiRate').value||0, years=+qs('#emiYears').value||0, fee=+qs('#emiFee').value||0;
  const {emi,n,r}=emiFormula(P,rate,years);
  const total=emi*n, interest=total-P, effective=total+fee;
  qs('#emiResult').classList.remove('hidden');
  animateValue(qs('#emiVal'), emi, '₹');
  animateValue(qs('#emiInterestVal'), interest, '₹');
  animateValue(qs('#emiTotalVal'), effective, '₹');
  let bal=P, rows=[];
  for(let i=1;i<=Math.min(n,60);i++){
    const int=bal*r, princ=emi-int; bal=Math.max(0, bal-princ);
    rows.push({month:i, emi, princ, int, bal});
  }
  qs('#emiTable').innerHTML = rows.map(r=>`<tr><td>${r.month}</td><td>${formatINR(r.emi)}</td><td>${formatINR(r.princ)}</td><td>${formatINR(r.int)}</td><td>${formatINR(r.bal)}</td></tr>`).join('');
  ensureChart('emiChart',{type:'doughnut',data:{labels:['Principal','Interest'],datasets:[{data:[P,interest],backgroundColor:['rgba(0,212,255,.8)','rgba(123,97,255,.8)']} ]}, options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#emiShare').onclick=()=>copyText(`EMI summary: Loan ${formatINR(P)} at ${rate}% for ${years} years. EMI ${formatINR(emi)}. Total interest ${formatINR(interest)}.`);
}

function calcTax(){
  const gross=+qs('#taxGross').value||0, basic=+qs('#taxBasic').value||0, hra=+qs('#taxHra').value||0, rent=+qs('#taxRent').value||0, city=qs('#taxCity').value, c80=+qs('#tax80c').value||0, d80=+qs('#tax80d').value||0, nps=+qs('#taxNps').value||0, home=+qs('#taxHome').value||0;
  const oldStd=50000, newStd=75000;
  const hraEx = Math.max(0, Math.min(hra, (city==='metro'?0.5:0.4)*basic, Math.max(0,rent - 0.1*basic)));
  const oldTaxable = Math.max(0, gross - oldStd - hraEx - Math.min(c80,150000)-Math.min(d80,75000)-Math.min(nps,50000)-Math.min(home,200000));
  const newTaxable = Math.max(0, gross - newStd);
  function slabTaxOld(income){
    let tax=0;
    if(income>1000000){ tax += (income-1000000)*0.3; income=1000000; }
    if(income>500000){ tax += (income-500000)*0.2; income=500000; }
    if(income>250000){ tax += (income-250000)*0.05; }
    if(income<=500000) tax=Math.max(0,tax-12500);
    return tax*1.04;
  }
  function slabTaxNew(income){
    const slabs=[[1500000,0.3],[1200000,0.2],[1000000,0.15],[700000,0.10],[300000,0.05]];
    let tax=0;
    for(const [min,rate] of slabs){ if(income>min){ tax+=(income-min)*rate; income=min; } }
    if(income<=700000) tax=0;
    return tax*1.04;
  }
  const oldTax=slabTaxOld(oldTaxable), newTax=slabTaxNew(newTaxable);
  qs('#taxResult').classList.remove('hidden');
  animateValue(qs('#taxOldVal'), oldTax, '₹');
  animateValue(qs('#taxNewVal'), newTax, '₹');
  animateValue(qs('#taxSaveVal'), Math.abs(oldTax-newTax), '₹');
  qs('#taxWinner').innerHTML = `${oldTax<newTax?'🏆 Old Regime':'🏆 New Regime'} saves more`;
  qs('#taxBreak').innerHTML = `
    <tr><td>Gross Salary</td><td>${formatINR(gross)}</td><td>${formatINR(gross)}</td></tr>
    <tr><td>Standard Deduction</td><td>${formatINR(oldStd)}</td><td>${formatINR(newStd)}</td></tr>
    <tr><td>HRA Exemption</td><td>${formatINR(hraEx)}</td><td>${formatINR(0)}</td></tr>
    <tr><td>Other Deductions</td><td>${formatINR(Math.min(c80,150000)+Math.min(d80,75000)+Math.min(nps,50000)+Math.min(home,200000))}</td><td>${formatINR(0)}</td></tr>
    <tr><td>Taxable Income</td><td>${formatINR(oldTaxable)}</td><td>${formatINR(newTaxable)}</td></tr>
    <tr><td>Total Tax incl. cess</td><td>${formatINR(oldTax)}</td><td>${formatINR(newTax)}</td></tr>
  `;
  ensureChart('taxChart',{type:'bar',data:{labels:['Old Regime','New Regime'],datasets:[{label:'Tax',data:[oldTax,newTax],backgroundColor:['rgba(0,212,255,.8)','rgba(123,97,255,.8)']}]},options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#taxShare').onclick=()=>copyText(`Tax comparison summary: Old regime tax ${formatINR(oldTax)} vs new regime tax ${formatINR(newTax)} on gross salary ${formatINR(gross)}.`);
}

function calcRetirement(){
  const age=+qs('#retAge').value||30, retire=+qs('#retRetire').value||60, exp=+qs('#retExpense').value||50000, infl=+qs('#retInfl').value||6, pre=+qs('#retPre').value||12, post=+qs('#retPost').value||7, life=+qs('#retLife').value||85;
  const years=retire-age, retiredYears=life-retire;
  const firstMonthAtRet = exp*Math.pow(1+infl/100, years);
  const annualNeed = firstMonthAtRet*12;
  const real = ((1+post/100)/(1+infl/100))-1;
  const corpus = real!==0 ? annualNeed * (1 - Math.pow(1+real, -retiredYears)) / real : annualNeed*retiredYears;
  const monthlyNeeded = years>0 ? corpus * (pre/12/100) / (Math.pow(1+pre/12/100, years*12)-1) : corpus;
  qs('#retResult').classList.remove('hidden');
  animateValue(qs('#retCorpusVal'), corpus, '₹');
  animateValue(qs('#retSaveVal'), monthlyNeeded, '₹');
  animateValue(qs('#retExpVal'), firstMonthAtRet, '₹');
  let pts=[]; let corpusGrow=0;
  for(let y=1;y<=years;y++){ corpusGrow = (corpusGrow + monthlyNeeded*12)*(1+pre/100); pts.push(corpusGrow); }
  ensureChart('retChart',{type:'line',data:{labels:pts.map((_,i)=>'Y'+(i+1)),datasets:[{label:'Corpus trajectory',data:pts,borderColor:'#16e39a',backgroundColor:'rgba(22,227,154,.08)',fill:true,tension:.35}]},options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#retShare').onclick=()=>copyText(`Retirement summary: Required corpus ${formatINR(corpus)}. To reach it by age ${retire}, save about ${formatINR(monthlyNeeded)} per month.`);
}

function calcNetWorth(){
  const assetIds=['nwCash','nwFd','nwMf','nwStocks','nwGold','nwRealEstate','nwEpf','nwNps','nwCrypto'];
  const debtIds=['nwHomeLoan','nwCarLoan','nwPersonalLoan','nwCard'];
  const assets=assetIds.map(id=>+qs('#'+id).value||0);
  const debts=debtIds.map(id=>+qs('#'+id).value||0);
  const totalAssets=assets.reduce((a,b)=>a+b,0), totalDebts=debts.reduce((a,b)=>a+b,0), net=totalAssets-totalDebts;
  qs('#nwResult').classList.remove('hidden');
  animateValue(qs('#nwAssetsVal'), totalAssets, '₹');
  animateValue(qs('#nwDebtVal'), totalDebts, '₹');
  animateValue(qs('#nwNetVal'), net, '₹');
  const ratio = totalAssets? totalDebts/totalAssets*100:0;
  qs('#nwGrade').textContent = net>50000000?'Wealthy':net>10000000?'Stable':'Building';
  ensureChart('nwChart',{type:'doughnut',data:{labels:['Cash','FD','MF','Stocks','Gold','Real Estate','EPF','NPS','Crypto'],datasets:[{data:assets,backgroundColor:['#00d4ff','#16e39a','#7b61ff','#ffd166','#ff8c42','#57cc99','#5e60ce','#48bfe3','#ff6577']} ]},options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#nwShare').onclick=()=>copyText(`Net worth summary: Assets ${formatINR(totalAssets)}, liabilities ${formatINR(totalDebts)}, net worth ${formatINR(net)}.`);
}

function calcStock(){
  const buy=+qs('#stockBuy').value||0, sell=+qs('#stockSell').value||0, qty=+qs('#stockQty').value||0, br=+qs('#stockBrokerage').value||0;
  const gross=(sell-buy)*qty;
  const brokerage=((buy*qty)+(sell*qty))*br/100;
  const charges=(buy*qty+sell*qty)*0.0015;
  const net=gross-brokerage-charges;
  const ret=buy?((sell-buy)/buy*100):0;
  qs('#stockResult').classList.remove('hidden');
  animateValue(qs('#stockGrossVal'), gross, '₹');
  animateValue(qs('#stockNetVal'), net, '₹');
  animateValue(qs('#stockReturnVal'), ret, '', '%');
  ensureChart('stockChart',{type:'bar',data:{labels:['Gross P/L','Charges','Net P/L'],datasets:[{data:[gross,brokerage+charges,net],backgroundColor:['rgba(22,227,154,.8)','rgba(255,101,119,.8)','rgba(0,212,255,.8)']}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#stockShare').onclick=()=>copyText(`Stock return summary: Bought at ₹${buy}, sold at ₹${sell}, quantity ${qty}. Net profit ${formatINR(net)}.`);
}

function calcTerm(){
  const age=+qs('#termAge').value||30, income=+qs('#termIncome').value||0, expenses=+qs('#termExpenses').value||0, liabilities=+qs('#termLiab').value||0, dependents=+qs('#termDep').value||0;
  const years=Math.max(1,60-age);
  const cover = income*years + liabilities + Math.max(0,(expenses*12*10));
  let premiumRate = age<30?0.45:age<40?0.72:age<50?1.35:2.4;
  const annualPremium = cover/1000*premiumRate*(1+dependents*0.05);
  qs('#termResult').classList.remove('hidden');
  animateValue(qs('#termCoverVal'), cover, '₹');
  animateValue(qs('#termPremiumVal'), annualPremium, '₹');
  animateValue(qs('#termYearsVal'), years);
  ensureChart('termChart',{type:'bar',data:{labels:['Income replacement','Liabilities','Family cushion'],datasets:[{data:[income*years, liabilities, expenses*12*10],backgroundColor:['rgba(0,212,255,.8)','rgba(255,140,66,.8)','rgba(123,97,255,.8)']}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#termShare').onclick=()=>copyText(`Term insurance summary: Recommended cover ${formatINR(cover)} and estimated annual premium ${formatINR(annualPremium)}.`);
}

function calcCurrency(){
  const rates={INR:1,USD:83.4,EUR:90.2,GBP:105.7,AED:22.7,SGD:61.6,AUD:54.2,CAD:58.4,JPY:0.56,CHF:94.7,CNY:11.5};
  const amt=+qs('#fxAmount').value||0, from=qs('#fxFrom').value, to=qs('#fxTo').value;
  const inInr=amt*rates[from], out=inInr/rates[to];
  qs('#fxResult').classList.remove('hidden');
  animateValue(qs('#fxConvVal'), out);
  animateValue(qs('#fxRateVal'), rates[from]/rates[to]);
  animateValue(qs('#fxInvVal'), rates[to]/rates[from]);
  ensureChart('fxChart',{type:'line',data:{labels:['W1','W2','W3','W4'],datasets:[{label:`${from}/${to} illustrative trend`,data:[0.97,1.01,0.99,1.03].map(v=>out?v*(rates[from]/rates[to]):0),borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,.08)',fill:true,tension:.35}]},options:{plugins:{legend:{labels:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}},scales:{x:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}},y:{ticks:{color:getComputedStyle(document.body).getPropertyValue('--muted')}}}}});
  qs('#fxShare').onclick=()=>copyText(`Currency summary: ${amt} ${from} ≈ ${formatNum(out)} ${to}. Static indicative rates only.`);
}

function financialDashboard(){
  const emergency = (+qs('#dashEmergency').value||0) / Math.max(1,+qs('#dashExpense').value||1);
  const dti = ((+qs('#dashDebt').value||0) / Math.max(1,+qs('#dashIncome').value||1))*100;
  const save = ((+qs('#dashSave').value||0) / Math.max(1,+qs('#dashIncome').value||1))*100;
  const diversify = +qs('#dashDiversify').value||0;
  let score = Math.min(25, emergency*4) + Math.max(0,25 - dti/2) + Math.min(25, save) + Math.min(25, diversify/4);
  score=Math.max(0,Math.min(100,score));
  qs('#dashResult').classList.remove('hidden');
  animateValue(qs('#dashScoreVal'), score);
  animateValue(qs('#dashEmergencyVal'), emergency, '', ' months');
  animateValue(qs('#dashDtiVal'), dti, '', '%');
  ensureChart('dashChart',{type:'doughnut',data:{labels:['Score','Gap'],datasets:[{data:[score,100-score],backgroundColor:['rgba(22,227,154,.9)','rgba(255,255,255,.08)'],borderWidth:0}]},options:{cutout:'72%',plugins:{legend:{display:false}}}});
}

document.addEventListener('click',e=>{
  if(e.target.closest('[data-fav]')) saveFavorite(e.target.closest('[data-fav]').dataset.fav);
});

document.addEventListener('DOMContentLoaded',()=>{
  initTheme(); paintStars(); renderFavorites(); initSearch(); bindQuickWidget(); setupSyncs(); progressBar();
  window.addEventListener('scroll', progressBar);
});
