// TAB
// ========================================
const PM={home:'p-home',ar:'p-ar',sim:'p-sim',formula:'p-formula',sched:'p-sched'};
function switchTab(tab){
  Object.entries(PM).forEach(([k,id])=>document.getElementById(id).classList.toggle('active',k===tab));
  document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('active',b.dataset.t===tab));
  if(tab==='ar'&&!camStream) startAR();
  else if(tab==='ar') updateAR();
  if(tab==='sim'){if(!simRaf){simRaf=requestAnimationFrame(simLoop);}}
  else{if(simRaf){cancelAnimationFrame(simRaf);simRaf=null;simLast=null;}}
  if(tab==='formula')initFormula();
  if(tab==='sched')buildSched();
}

// ========================================
// INIT
// ========================================
function _pad(n){ return n < 10 ? '0'+n : ''+n; }

// initApp: index.html의 비동기 HTML 로드 후 호출
function initApp(){
  var t=new Date();
  var todayISO=t.getFullYear()+'-'+_pad(t.getMonth()+1)+'-'+_pad(t.getDate());
  var inp=document.getElementById('userTodayInput');
  if(inp){
    inp.value=todayISO;
    inp.addEventListener('change', applyUserToday);
    inp.addEventListener('input', applyUserToday);
  }
  if(typeof updateSchedTodayBar==='function') updateSchedTodayBar();
  if(typeof initHome==='function') initHome();
  if(typeof initSim==='function') initSim();
  if(typeof initFormula==='function') initFormula();
  if(typeof buildSched==='function') buildSched();
}
