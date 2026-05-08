// FORMULA
// ========================================
let curStep=0;const STEPS=6;
function initFormula(){
  const dots=document.getElementById('stepDots');dots.innerHTML='';
  for(let i=0;i<STEPS;i++){const d=document.createElement('div');d.className='sdot'+(i===0?' on':'');dots.appendChild(d);}
  showStep(0);
  // userToday 기준으로 날짜 설정
  const _y=userToday.getFullYear(),_m=_pad(userToday.getMonth()+1),_d=_pad(userToday.getDate());
  document.getElementById('cToday').value=_y+'-'+_m+'-'+_d;
  setCalcType(document.getElementById('ct-super'),'super');
}
function showStep(n){
  curStep=Math.max(0,Math.min(STEPS-1,n));
  document.querySelectorAll('.step-card').forEach((c,i)=>c.classList.toggle('show',i===curStep));
  document.querySelectorAll('.sdot').forEach((d,i)=>d.classList.toggle('on',i===curStep));
  document.getElementById('sPrev').disabled=curStep===0;
  const nxt=document.getElementById('sNext');
  nxt.disabled=false;
  if(curStep===STEPS-1){
    nxt.textContent='계산하기 ↓';
    nxt.onclick=function(){
      const calc=document.getElementById('calcSec');
      if(calc) calc.scrollIntoView({behavior:'smooth',block:'start'});
    };
  } else {
    nxt.textContent='다음 →';
    nxt.onclick=function(){goStep(1);};
  }
}
function goStep(d){showStep(curStep+d);}

// 가장 최근 이벤트 찾기 (userToday 이전)
function findLastSM(type='super'){
  // 역방향으로 보름달 순간을 1개씩 찾아서 조건 체크
  let dt=new Date(userToday);
  for(let i=0;i<30;i++){
    dt=new Date(dt.getTime()-SYN*86400000); // 삭망월씩 뒤로
    // dt 근처 보름달 정밀 탐색 (앞으로 2일 탐색)
    const fm=_findFullMoon(new Date(dt.getTime()-2*86400000), 6);
    if(fm>=userToday) continue;
    const pr2=prox(moonDist(fm));
    if(type==='super'&&pr2>=0.90) return fm;
    if(type==='quasi'&&pr2>=0.86&&pr2<0.90) return fm;
    if(type==='blood'&&pr2>=0.90&&isLunarEclipse(fm)) return fm;
    if(type==='penumbral'&&pr2>=0.86&&isPenumbralEclipse(fm)) return fm;
  }
  return parseDate('2015-09-28');
}

let calcType='super';
function setCalcType(btn,t){
  calcType=t;
  document.querySelectorAll('.calc-sec .fc').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  // 자동 기입 갱신
  const last=findLastSM(t);
  document.getElementById('cLastSM').value=last.toISOString().slice(0,10);
  const notes={super:'마지막 슈퍼문 자동 기입',quasi:'마지막 준슈퍼문 자동 기입',
    blood:'마지막 슈퍼 블러드문 자동 기입',penumbral:'마지막 슈퍼 반영월식 자동 기입'};
  
  const btnLabels={super:'📐 다음 슈퍼문 계산',quasi:'📐 다음 준슈퍼문 계산',
    blood:'🩸 다음 블러드문 계산',penumbral:'🌕🌑 다음 반영월식 계산'};
  document.getElementById('cCalcBtn').textContent=btnLabels[t];
  document.getElementById('cRes').textContent='← 계산 버튼을 눌러주세요!';
}

function doCalc(){
  const lastVal=document.getElementById('cLastSM').value;
  const todayVal=document.getElementById('cToday').value;
  if(!lastVal||!todayVal){document.getElementById('cRes').textContent='⚠️ 날짜를 확인해주세요.';return;}
  const lastDt=parseDate(lastVal),todayDt=parseDate(todayVal);
  const elapsed=Math.round((todayDt-lastDt)/86400000);
  if(elapsed<0){document.getElementById('cRes').textContent='⚠️ 기준일보다 이전 날짜입니다.';return;}

  let T,periodName,nextDt,formula;
  if(calcType==='super'){
    T=T_SM;periodName='슈퍼문 주기';
    nextDt=nextSM(todayDt,0.90);
    formula=`1/T = 1/${SYN.toFixed(2)} − 1/${ANO.toFixed(2)}\nT = ${T.toFixed(1)}일 ≈ 13.7개월`;
  } else if(calcType==='quasi'){
    T=T_QSM;periodName='준슈퍼문 주기';
    nextDt=nextQSM(todayDt);   // 슈퍼문 제외한 준슈퍼문만
    formula=`T = T(삭망월) ÷ 0.14\n= ${SYN.toFixed(2)} ÷ 0.14 = ${T.toFixed(1)}일 ≈ 7개월`;
  } else if(calcType==='blood'){
    T=SAROS;periodName='사로스(블러드문) 주기';
    nextDt=nextBloodMoon(todayDt);
    formula=`사로스 주기: 223삭망월 ≈ ${SAROS.toFixed(0)}일 ≈ 18년 11일\n슈퍼문+개기월식 LCM ≈ 54년`;
  } else {
    T=SYN*NOD/(SYN-NOD)*2;periodName='반영월식+슈퍼문 주기';
    nextDt=nextPenumbral(todayDt);
    formula=`교점월(${NOD.toFixed(2)}일)과 삭망월의 결합 주기\n≈ 5~6년 주기`;
  }

  const remainder=elapsed%T;
  const daysLeft=Math.round(T-remainder);
  const predDate=new Date(todayDt.getTime()+daysLeft*86400000);
  const actualDays=nextDt?Math.ceil((nextDt-todayDt)/86400000):null;
  const actualStr=nextDt
    ?`${nextDt.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})} (D-${actualDays})`
    :'계산 중 (매우 희귀한 이벤트)';

  document.getElementById('cRes').textContent=
    `기준일: ${lastDt.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})}\n`+
    `오늘:   ${todayDt.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})}\n`+
    `경과:   ${elapsed}일\n\n`+
    `━━ ${periodName} ━━━━━━━━━━\n`+
    formula+'\n\n'+
    `${elapsed}일 ÷ ${T.toFixed(1)}일 → 나머지 ${remainder.toFixed(1)}일\n`+
    `다음까지 = ${T.toFixed(1)} − ${remainder.toFixed(1)} ≈ ${daysLeft}일\n\n`+
    `📅 수식 예측: ${predDate.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})}\n`+
    `🛰 NASA 예측: ${actualStr}`;
}

// ========================================
