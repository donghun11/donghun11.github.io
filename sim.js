// SIMULATION
// ========================================
let simDt=new Date(),simPlaying=true,simSpd=1,simRaf=null,simLast=null;
const DOW=['일','월','화','수','목','금','토'];
function initSim(){
  simDt=new Date(userToday);
  simPlaying=false; // 기본 일시정지 — 탭 진입 시 자동재생 안 함
  simLast=null;
  if(simRaf){cancelAnimationFrame(simRaf);simRaf=null;}
  drawSim();updateSimUI();
  document.getElementById('btnPP').textContent='▶ 재생';
}
function simLoop(ts){
  if(simPlaying&&simLast!==null)simDt=new Date(simDt.getTime()+(ts-simLast)/1000*simSpd*86400000);
  simLast=ts;drawSim();updateSimUI();simRaf=requestAnimationFrame(simLoop);
}
function simPP(){
  simPlaying=!simPlaying;simLast=null;
  document.getElementById('btnPP').textContent=simPlaying?'⏸ 일시정지':'▶ 재생';
}
function setSpd(btn, v){
  simSpd=v;
  document.querySelectorAll('.spd-chip').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
}
function simReset(){simDt=new Date(userToday);simLast=null;}
function simJump(){simDt=nextSM(simDt);simLast=null;}
function simAddDays(n){
  // 일시정지 후 날짜 이동
  simPlaying=false;simLast=null;
  document.getElementById('btnPP').textContent='▶ 재생';
  simDt=new Date(simDt.getTime()+n*86400000);
  drawSim();updateSimUI();
}

function drawSim(){
  const cv=document.getElementById('simCanvas');if(!cv)return;
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);

  // bg
  ctx.fillStyle='#030508';ctx.fillRect(0,0,W,H);

  // stars (stable positions using sin/cos seeds)
  for(let i=0;i<140;i++){
    const sx=((Math.sin(i*137.508)*0.5+0.5)*W);
    const sy=((Math.cos(i*97.31)*0.5+0.5)*H);
    const tw=Date.now()/1000;
    ctx.fillStyle=`rgba(240,236,224,${0.12+Math.sin(tw+i)*0.07})`;
    ctx.beginPath();ctx.arc(sx,sy,i%9===0?1.3:0.65,0,Math.PI*2);ctx.fill();
  }

  const ph=moonPhase(simDt),dist=moonDist(simDt),pr2=prox(dist),type=classify(ph,dist);

  // Layout: Sun (left area), Earth orbits Sun, Moon orbits Earth
  const sunX=W*0.5, sunY=H*0.5;

  // 지구의 태양 공전 (1년 = 365일, simDt 기준)
  const dayOfYear=(simDt-new Date(simDt.getFullYear(),0,1))/86400000;
  const earthOrbitA=W*0.34, earthOrbitB=H*0.32; // 태양 공전 타원
  const earthAngle=(dayOfYear/365.25)*Math.PI*2 - Math.PI/2;
  const earX=sunX+Math.cos(earthAngle)*earthOrbitA;
  const earY=sunY+Math.sin(earthAngle)*earthOrbitB;

  // Sun corona rays
  for(let i=0;i<14;i++){
    const ra=(i/14)*Math.PI*2+Date.now()/2200;
    const r1=32,r2=48+Math.sin(Date.now()/700+i*0.9)*7;
    ctx.strokeStyle=`rgba(255,240,70,${0.06+Math.sin(Date.now()/500+i)*0.04})`;
    ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(sunX+Math.cos(ra)*r1,sunY+Math.sin(ra)*r1);
    ctx.lineTo(sunX+Math.cos(ra)*r2,sunY+Math.sin(ra)*r2);ctx.stroke();
  }
  // Sun glow
  const sg=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,62);
  sg.addColorStop(0,'rgba(255,255,100,.32)');sg.addColorStop(.45,'rgba(255,220,40,.1)');sg.addColorStop(1,'transparent');
  ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sunX,sunY,62,0,Math.PI*2);ctx.fill();
  // Sun body
  const sunG=ctx.createRadialGradient(sunX-7,sunY-7,0,sunX,sunY,27);
  sunG.addColorStop(0,'#ffffff');sunG.addColorStop(.25,'#fff88a');sunG.addColorStop(.65,'#f0c030');sunG.addColorStop(1,'#e08010');
  ctx.beginPath();ctx.arc(sunX,sunY,27,0,Math.PI*2);ctx.fillStyle=sunG;ctx.fill();
  ctx.textAlign='center';ctx.font='16px JetBrains Mono,monospace';
  ctx.fillStyle='rgba(255,240,80,.55)';ctx.fillText('☀ 태양',sunX,sunY+46);

  // 지구 공전 궤도 표시
  ctx.strokeStyle='rgba(100,160,255,.08)';ctx.lineWidth=1;ctx.setLineDash([3,8]);
  ctx.beginPath();ctx.ellipse(sunX,sunY,earthOrbitA,earthOrbitB,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);

  // Sunlight beam to Earth (동적 위치)
  const lg=ctx.createLinearGradient(sunX+27,sunY,earX,earY);
  lg.addColorStop(0,'rgba(255,240,70,.14)');lg.addColorStop(1,'rgba(255,240,70,.02)');
  ctx.strokeStyle=lg;ctx.lineWidth=1.5;ctx.setLineDash([4,9]);
  ctx.beginPath();ctx.moveTo(sunX+27,sunY);ctx.lineTo(earX,earY);ctx.stroke();ctx.setLineDash([]);

  // 달 궤도 (지구 중심, 작게)
  const oa=68, ob=54;
  ctx.strokeStyle='rgba(242,192,64,.18)';ctx.lineWidth=1;ctx.setLineDash([3,6]);
  ctx.beginPath();ctx.ellipse(earX,earY,oa,ob,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);

  // 근지점/원지점 라벨
  ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
  ctx.fillStyle='rgba(242,192,64,.4)';ctx.fillText('근지점',earX+oa,earY-ob*.15-10);
  ctx.fillStyle='rgba(240,236,224,.22)';ctx.fillText('원지점',earX-oa,earY-ob*.15-10);

  // 90% 임계선
  const r90a=oa*0.78, r90b=ob*0.78;
  ctx.strokeStyle='rgba(242,192,64,.32)';ctx.lineWidth=1;ctx.setLineDash([2,4]);
  ctx.beginPath();ctx.ellipse(earX,earY,r90a,r90b,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
  ctx.fillStyle='rgba(242,192,64,.5)';ctx.fillText('90%',earX+r90a+2,earY-2);

  // 86% 임계선
  const r86a=oa*0.86, r86b=ob*0.86;
  ctx.strokeStyle='rgba(224,120,48,.28)';ctx.lineWidth=1;ctx.setLineDash([2,4]);
  ctx.beginPath();ctx.ellipse(earX,earY,r86a,r86b,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(224,120,48,.48)';ctx.fillText('86%',earX+r86a+2,earY+11);

  // Earth
  const earR = 28;
  ctx.save();
  ctx.beginPath();ctx.arc(earX,earY,earR,0,Math.PI*2);ctx.clip();

  // 바다
  const eg=ctx.createRadialGradient(earX-earR*.3,earY-earR*.3,earR*.05,earX,earY,earR);
  eg.addColorStop(0,'#6ac8ff');eg.addColorStop(.35,'#1a78e8');eg.addColorStop(1,'#082860');
  ctx.fillStyle=eg;ctx.fillRect(earX-earR,earY-earR,earR*2,earR*2);

  // 대륙
  // 유라시아 (오른쪽 위)
  ctx.fillStyle='rgba(55,140,55,.9)';
  ctx.beginPath();ctx.ellipse(earX+earR*.2,earY-earR*.2,earR*.36,earR*.26,0.3,0,Math.PI*2);ctx.fill();
  // 아메리카 (왼쪽)
  ctx.fillStyle='rgba(60,148,60,.85)';
  ctx.beginPath();ctx.ellipse(earX-earR*.38,earY-earR*.08,earR*.16,earR*.32,-0.2,0,Math.PI*2);ctx.fill();
  // 아프리카 (중앙 아래)
  ctx.fillStyle='rgba(65,150,55,.85)';
  ctx.beginPath();ctx.ellipse(earX+earR*.08,earY+earR*.22,earR*.16,earR*.22,0.05,0,Math.PI*2);ctx.fill();
  // 오세아니아 (오른쪽 아래)
  ctx.fillStyle='rgba(60,140,50,.75)';
  ctx.beginPath();ctx.ellipse(earX+earR*.42,earY+earR*.32,earR*.11,earR*.09,0.2,0,Math.PI*2);ctx.fill();
  // 남극 (흰색)
  ctx.fillStyle='rgba(240,248,255,.7)';
  ctx.beginPath();ctx.ellipse(earX,earY+earR*.72,earR*.38,earR*.18,0,0,Math.PI*2);ctx.fill();

  // 구름
  ctx.fillStyle='rgba(255,255,255,.22)';
  ctx.beginPath();ctx.ellipse(earX-earR*.05,earY-earR*.5,earR*.38,earR*.1,0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(earX+earR*.28,earY+earR*.08,earR*.25,earR*.08,-.3,0,Math.PI*2);ctx.fill();

  ctx.restore();

  // 대기권 글로우
  const atmG=ctx.createRadialGradient(earX,earY,earR-1,earX,earY,earR+7);
  atmG.addColorStop(0,'rgba(100,200,255,.4)');atmG.addColorStop(1,'transparent');
  ctx.beginPath();ctx.arc(earX,earY,earR+7,0,Math.PI*2);ctx.fillStyle=atmG;ctx.fill();
  // 테두리
  ctx.beginPath();ctx.arc(earX,earY,earR,0,Math.PI*2);
  ctx.strokeStyle='rgba(140,210,255,.55)';ctx.lineWidth=1.5;ctx.stroke();

// Moon position (지구 주위 공전)
  // ★ 핵심: 달의 위치각을 태양-지구 방향 기준으로 계산
  // 태양(sunX,sunY) → 지구(earX,earY) 방향 벡터를 기준으로,
  // phase=0(신월)이면 태양 방향(지구-태양 반대), phase=0.5(보름)면 반대편
  // phase=0.25(상현)이면 90° 시계방향 (오른쪽 밝음)
  const sunToEarthAngle = Math.atan2(earY - sunY, earX - sunX);
  // phase=0 신월: 달이 태양과 같은 방향 (태양 쪽) → angle = sunToEarth + π
  // phase=0.5 보름: 달이 태양 반대편 → angle = sunToEarth
  // phase=0.25 상현: 달이 지구 기준 오른쪽
  const moonAngle = sunToEarthAngle + Math.PI + ph * Math.PI * 2;
  const normD=(moonDist(simDt)-PER)/(APO-PER);
  const moonRA=oa*(0.80+0.20*normD);
  const moonRB=ob*(0.80+0.20*normD);
  const mx=earX+Math.cos(moonAngle)*moonRA;
  const my=earY+Math.sin(moonAngle)*moonRB;

  // Earth→Moon line
  ctx.strokeStyle='rgba(242,192,64,.06)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(earX,earY);ctx.lineTo(mx,my);ctx.stroke();

  // Moon glow (슈퍼/준슈퍼)
  const ms=type==='super'?11:type==='quasi'?9:7;
  if(type==='super'||type==='quasi'){
    const glowC=type==='super'?'rgba(242,192,64,0.30)':'rgba(224,120,48,0.25)';
    const gr=type==='super'?ms*1.8:ms*1.6;
    const mg2=ctx.createRadialGradient(mx,my,0,mx,my,gr);
    mg2.addColorStop(0,glowC);mg2.addColorStop(1,'transparent');
    ctx.beginPath();ctx.arc(mx,my,gr,0,Math.PI*2);ctx.fillStyle=mg2;ctx.fill();
  }

  // Moon body — 통합 drawPhase 사용
  drawPhase(ctx, mx, my, ms, ph, type);

  // type label
  if(type==='super'||type==='quasi'){
    ctx.font='bold 22px Noto Serif KR,serif';
    ctx.fillStyle=type==='super'?'rgba(242,192,64,.95)':'rgba(224,120,48,.9)';
    ctx.textAlign='center';ctx.fillText(type==='super'?'🌕 슈퍼문!':'🌔 준 슈퍼문',W/2,32);
  }

  // prox readout
  ctx.textAlign='right';ctx.font='12px JetBrains Mono,monospace';
  ctx.fillStyle='rgba(240,236,224,.35)';ctx.fillText('근접도 '+(pr2*100).toFixed(1)+'%',W-8,H-8);
}

function updateSimUI(){
  const ph=moonPhase(simDt),dist=moonDist(simDt),pr2=prox(dist),type=classify(ph,dist);
  // 날짜 크게
  const y=simDt.getFullYear(),m=simDt.getMonth()+1,d=simDt.getDate();
  document.getElementById('simDateMain').textContent=`${y}년 ${m}월 ${d}일`;
  document.getElementById('simDateDow').textContent=`${DOW[simDt.getDay()]}요일`;
  // 다음 슈퍼문 D-day
  const ns=nextSM(simDt);
  const dd=Math.ceil((ns-simDt)/86400000);
  document.getElementById('simDday').textContent=dd<=0?'오늘!':'D-'+dd;
  // chips
  document.getElementById('scDist').textContent=(dist/1000).toFixed(0)+'천km';
  document.getElementById('scProx').textContent=(pr2*100).toFixed(1)+'%';
  document.getElementById('scPhase').textContent=(ph*100).toFixed(0)+'%';
  const sc=document.getElementById('scType');
  sc.textContent=type==='super'?'🌕슈퍼':type==='quasi'?'🌔준슈퍼':phaseName(ph);
  sc.style.color=type==='super'?'var(--gold)':type==='quasi'?'var(--orange)':'inherit';
}

// ========================================
