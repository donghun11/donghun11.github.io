// ========================================
// ========================================
// 날짜 파싱 헬퍼 (안드로이드 WebView 호환)
// ========================================
function parseDate(val){
  if(!val) return new Date();
  const p=val.split('-');
  if(p.length===3){
    return new Date(parseInt(p[0]), parseInt(p[1])-1, parseInt(p[2]), 12, 0, 0);
  }
  return new Date();
}

// ========================================
// 오늘 날짜 전역 관리
// ========================================
let userToday = new Date();

function updateSchedTodayBar(){
  const el=document.getElementById('schedTodayVal');
  if(el) el.textContent=userToday.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});
}

function applyUserToday(){
  const val=document.getElementById('userTodayInput').value;
  if(!val)return;
  userToday=parseDate(val);
  if(isNaN(userToday.getTime())) userToday=new Date();
  const label=userToday.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});
  document.getElementById('userTodayLabel').textContent='기준일: '+label;
  // 각 함수가 정의된 후에만 호출 (순서 안전)
  if(typeof updateSchedTodayBar==='function') updateSchedTodayBar();
  if(typeof initHome==='function') initHome();
  if(typeof simReset==='function') simReset();
  if(typeof updateAR==='function') updateAR();
  if(typeof buildSched==='function') buildSched();
  if(typeof initFormula==='function') initFormula();
}

// 핵심 계산 (논문 수식)
// ========================================
const SYN=29.53058867, ANO=27.55454989, NOD=27.21222082; // 교점월
const T_SM=(SYN*ANO)/(SYN-ANO);   // ≈411.78일 슈퍼문 주기
const T_CSM=413.5;                 // ≈413.5일 연속 슈퍼문 주기 (실측 413~414일)
const T_QSM=SYN/0.14;             // ≈210.9일 준슈퍼문 주기
// 사로스 주기: 223삭망월 ≈ 6585.32일 ≈ 18년11일8시간
const SAROS=6585.3213;
// 슈퍼 블러드문: 슈퍼문+개기월식 → LCM(T_SM, SAROS) ≈ 54년
// 근사: 슈퍼문이면서 교점월이 0.5±0.03 (개기월식 조건)
const PER=362600, APO=405500; // 달 궤도 평균 근지점/원지점(km)
const J2000=new Date(2000,0,6,18,14,0);
const daysSince=dt=>(dt-J2000)/86400000;
function moonPhase(dt){let p=(daysSince(dt)%SYN)/SYN;return p<0?p+1:p}
function moonDist(dt){let ap=(daysSince(dt)%ANO)/ANO;if(ap<0)ap+=1;return((APO+PER)/2)-((APO-PER)/2)*Math.cos(2*Math.PI*ap)}
function prox(d){return(APO-d)/(APO-PER)}
// 교점 위상 (0=상승교점, 0.5=하강교점 → 월식 가능)
function nodePhase(dt){let n=(daysSince(dt)%NOD)/NOD;return n<0?n+1:n}
// 개기월식 조건: 교점 위상이 0 또는 0.5 근처 (±0.05)
function isLunarEclipse(dt){const n=nodePhase(dt);return n<0.05||n>0.95||(n>0.45&&n<0.55)}
// 반영월식: 교점 위상 ±0.12 범위
function isPenumbralEclipse(dt){const n=nodePhase(dt);return n<0.12||n>0.88||(n>0.38&&n<0.62)}
function classify(ph,d){const pr=prox(d),full=ph>=0.49&&ph<=0.51;if(full&&pr>=0.90)return'super';if(full&&pr>=0.86)return'quasi';if(full)return'normal';return'other'}
function phaseIcon(p){
  if(p<=0.01||p>=0.99) return '🌑';
  if(p<0.125) return '🌒';  // 초승달
  if(p<0.25)  return '🌒';  // 상현 전
  if(p<0.375) return '🌓';  // 상현달
  if(p<0.49)  return '🌔';  // 상현망간
  if(p<=0.51) return '🌕';  // 보름달
  if(p<0.625) return '🌖';  // 하현망간
  if(p<0.75)  return '🌖';  // 하현 전
  if(p<0.875) return '🌗';  // 하현달
  return '🌘';              // 그믐달
}
function phaseName(p){
  const icon = phaseIcon(p);
  if(p<=0.01||p>=0.99) return icon+' 신월';
  if(p<0.125)  return icon+' 초승달';
  if(p<0.25)   return icon+' 상현 전';
  if(p<0.375)  return icon+' 상현달';
  if(p<0.49)   return icon+' 상현망간';
  if(p<=0.51)  return icon+' 보름달';
  if(p<0.625)  return icon+' 하현망간';
  if(p<0.75)   return icon+' 하현 전';
  if(p<0.875)  return icon+' 하현달';
  return icon+' 그믐달';
}
function typeLabel(t){return{super:'슈퍼문 🌕',quasi:'준 슈퍼문 🌔',blood:'슈퍼 블러드문 🩸',penumbral:'슈퍼 반영월식 🌕🌑',normal:'보름달 🌕',other:'—'}[t]}
// 어떤 type/phase든 항상 올바른 이름 반환
function moonLabel(type,ph){
  return (type==='super'||type==='quasi'||type==='blood'||type==='normal') ? typeLabel(type) : phaseName(ph);
}
// 정밀 보름달: 이진탐색으로 보름달 정확한 순간(ms) 반환
function _findFullMoon(from, maxDays){
  let dt=new Date(from.getTime()+3600000);
  let prevPh=moonPhase(dt);
  for(let i=0;i<maxDays*24;i++){
    dt=new Date(dt.getTime()+3600000);
    const ph=moonPhase(dt);
    if(prevPh<0.5&&ph>=0.5){
      // 이진탐색으로 1분 이하 정밀도
      let lo=new Date(dt.getTime()-3600000), hi=new Date(dt);
      for(let j=0;j<12;j++){
        const mid=new Date((lo.getTime()+hi.getTime())/2);
        if(moonPhase(mid)<0.5) lo=mid; else hi=mid;
      }
      const exact=new Date((lo.getTime()+hi.getTime())/2);
      // 정확한 보름달 순간의 로컬 날짜를 정오로 반환
      return new Date(exact.getFullYear(),exact.getMonth(),exact.getDate(),12,0,0);
    }
    prevPh=ph;
  }
  return new Date(from.getTime()+T_SM*86400000);
}

// 다음 슈퍼문: 보름달 정확한 날 기준으로 prox >= thr
function nextSM(from, thr=0.90){
  let dt=new Date(from);
  for(let i=0;i<25;i++){
    const fm=_findFullMoon(dt, 35);
    if(!fm) break;
    if(prox(moonDist(fm))>=thr) return fm;
    dt=new Date(fm.getTime()+3600000);
  }
  return new Date(from.getTime()+T_SM*86400000);
}

// 다음 준슈퍼문: 슈퍼문 직전/직후 보름달 중 prox 최고값
// 우리 단순모델은 정확히 86~90% 구간 보름달이 없어서, 슈퍼문 전후 가장 높은 비슈퍼 보름달 사용
function nextQSM(from){
  let dt=new Date(from);
  let candidate=null, candProx=0;
  let superSeen=false;
  for(let i=0;i<35;i++){
    const fm=_findFullMoon(dt, 35);
    if(!fm) break;
    const pr=prox(moonDist(fm));
    if(pr>=0.86&&pr<0.90) return fm; // 정확히 구간 안이면 즉시 반환
    if(pr<0.90){
      if(pr>candProx){ candProx=pr; candidate=fm; }
      // 슈퍼문 구간이 끝난 후 prox가 다시 감소하기 시작하면 후보 확정
      if(superSeen && pr<candProx*0.90) return candidate;
    } else {
      superSeen=true;
      candidate=null; candProx=0; // 슈퍼문 이후 새로 카운트
    }
    dt=new Date(fm.getTime()+3600000);
  }
  return candidate;
}
function nextBloodMoon(from){
  let dt=new Date(from);dt.setDate(dt.getDate()+1);
  for(let i=0;i<20000;i++){
    const p=moonPhase(dt),d=moonDist(dt);
    if(p>=0.49&&p<=0.51&&prox(d)>=0.90&&isLunarEclipse(dt))return dt;
    dt=new Date(dt.getTime()+86400000);
  }
  return null;
}
// 다음 슈퍼 반영월식
function nextPenumbral(from){
  let dt=new Date(from);dt.setDate(dt.getDate()+1);
  for(let i=0;i<5000;i++){
    const p=moonPhase(dt),d=moonDist(dt);
    if(p>=0.49&&p<=0.51&&prox(d)>=0.86&&isPenumbralEclipse(dt))return dt;
    dt=new Date(dt.getTime()+86400000);
  }
  return null;
}

// ========================================
// 통합 달 위상 렌더링 (홈·시뮬·AR 공용)
// ctx: CanvasRenderingContext2D
// cx,cy: 중심, R: 반지름
// phase: 0=신월, 0.25=상현, 0.5=보름, 0.75=하현
// type: 'super'|'quasi'|'blood'|'normal'|'other'
// ========================================
