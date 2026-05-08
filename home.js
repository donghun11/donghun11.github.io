function drawMoonPhase(phase, type){
  const cv=document.getElementById('moonCanvas');
  if(!cv||!cv.getContext)return;
  const ctx=cv.getContext('2d');
  if(!ctx)return;
  const W=cv.width,H=cv.height,R=W/2-8;
  const cx=W/2,cy=H/2;
  ctx.clearRect(0,0,W,H);

  // 1. 달 표면 (밝은 면)
  const g=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.03,cx,cy,R);
  if(type==='super'){
    g.addColorStop(0,'#fffce0');g.addColorStop(.3,'#f2c040');
    g.addColorStop(.72,'#c07818');g.addColorStop(1,'#6a3808');
  } else if(type==='quasi'){
    g.addColorStop(0,'#ffe8c0');g.addColorStop(.3,'#e07830');
    g.addColorStop(.72,'#804020');g.addColorStop(1,'#3a1808');
  } else if(type==='blood'){
    g.addColorStop(0,'#ffa080');g.addColorStop(.3,'#cc2200');
    g.addColorStop(.72,'#7a0800');g.addColorStop(1,'#3a0000');
  } else {
    g.addColorStop(0,'#ffffff');g.addColorStop(.38,'#e0e0e0');
    g.addColorStop(.78,'#aaaaaa');g.addColorStop(1,'#666');
  }
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.fillStyle=g;ctx.fill();

  // 2. 크레이터
  [[cx-R*.14,cy-R*.22,R*.10],[cx+R*.22,cy-R*.08,R*.07],
   [cx-R*.30,cy+R*.17,R*.06],[cx+R*.07,cy+R*.30,R*.05],
   [cx+R*.32,cy+R*.25,R*.08]].forEach(([x,y,r])=>{
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,.10)';ctx.fill();
  });

  // 3. 어두운 면 (위상 마스크)
  // 달 위상 렌더링 원리 (북반구 기준):
  // p=0/1: 신월(완전 어둠)  p=0.25: 상현달(오른쪽 밝음)
  // p=0.5: 보름달(완전 밝음) p=0.75: 하현달(왼쪽 밝음)
  // p<0.5: 신월→보름 (오른쪽부터 밝아짐)
  //   초승달: 오른쪽 얇은 초승  상현달: 오른쪽 반달  보름전: 오른쪽 불룩
  // p>0.5: 보름→신월 (왼쪽부터 어두워짐)
  //   하현달: 왼쪽 반달  그믐달: 왼쪽 얇은 초승
  //
  // 렌더링: 밝은 원 전체를 먼저 그린 뒤, 어두운 영역을 덮어씌우는 방식
  // 어두운 영역 = [어두운 반원] + [경계 타원]으로 구성
  const p=phase;

  ctx.save();
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
  ctx.fillStyle='rgba(3,5,11,0.92)';
  drawPhase(ctx, cx, cy, R, phase, type);
}
function initHome(){
  const now=userToday;
  const ph=moonPhase(now),dist=moonDist(now),pr2=prox(dist),type=classify(ph,dist);

  // 달 위상 캔버스
  drawMoonPhase(ph, type);

  // 홈 탭 아이콘을 실제 위상에 맞춰 표시
  const homeIcon=document.querySelector('.tb[data-t="home"] .tb-icon');
  if(homeIcon) homeIcon.textContent=phaseIcon(ph);

  // 링 색상
  document.querySelectorAll('.ring').forEach(r=>{
    r.style.borderColor=type==='super'?'rgba(242,192,64,.18)':type==='quasi'?'rgba(224,120,48,.18)':type==='blood'?'rgba(200,34,0,.18)':'rgba(255,255,255,.08)';
  });

  const badge=document.getElementById('typeBadge');
  // super/quasi/blood/normal은 typeLabel, 나머지는 phaseName(ph)
  badge.textContent=moonLabel(type,ph);
  badge.className='type-badge '+(type==='quasi'?'quasi':type==='blood'?'blood':type==='super'?'':'dim');
  document.getElementById('dateSub').textContent=now.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});
  document.getElementById('distVal').textContent=Math.round(dist).toLocaleString()+' km';
  const pp=(pr2*100).toFixed(1);
  document.getElementById('proxVal').textContent=pp+'%';
  const fill=document.getElementById('proxFill');fill.style.width=pp+'%';
  fill.className='prox-fill'+(type==='quasi'?' quasi':'');
  document.getElementById('phaseVal').textContent=phaseName(ph)+` (${(ph*100).toFixed(1)}%)`;
  document.getElementById('periodVal').textContent=`≈ ${T_SM.toFixed(0)}일`;
  const ns=nextSM(now);
  document.getElementById('nextDate').textContent=ns.toLocaleDateString('ko-KR',{month:'long',day:'numeric'});
  document.getElementById('nextDday').textContent='D-'+Math.ceil((ns-now)/86400000);
  const nq=nextQSM(now);
  document.getElementById('nextQDate').textContent=nq?nq.toLocaleDateString('ko-KR',{month:'long',day:'numeric'}):'—';
  document.getElementById('nextQDday').textContent=nq?'D-'+Math.ceil((nq-now)/86400000):'—';
}

// ========================================
