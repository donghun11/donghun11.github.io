// AR — Star Walk 스타일 (GPS + 방위/기울기 기반 달 위치)
// ========================================
let camStream=null;
let arGpsLat=null, arGpsLon=null;
let arDeviceAz=0;   // 기기 방위각 (북=0, 동=90)
let arDevicePitch=0; // 기기 기울기 (수평=0, 수직=90)
let arAnimId=null;

// ── 달 천구 좌표 계산 (적경/적위 → 방위각/고도) ──
function moonRaDec(dt){
  // 단순화된 달 적경/적위 계산 (±1도 정밀도)
  const T=(dt-new Date(2000,0,1,12,0,0))/86400000/36525; // 율리우스 세기
  const L0=218.316+13.176396*T*36525; // 평균 경도
  const M=134.963+13.064993*T*36525;  // 평균 근점각
  const F=93.272+13.229350*T*36525;   // 교점 위도
  const r2d=180/Math.PI, d2r=Math.PI/180;
  const Lrad=L0*d2r, Mrad=M*d2r, Frad=F*d2r;
  // 황경 보정
  const lon=L0+6.289*Math.sin(Mrad)-1.274*Math.sin(2*Lrad-Mrad)
    +0.658*Math.sin(2*Lrad)-0.214*Math.sin(2*Mrad)-0.186*Math.sin(Mrad);
  const lat=5.128*Math.sin(Frad)+0.280*Math.sin(Mrad+Frad)
    -0.277*Math.sin(Mrad-Frad);
  // 황도 → 적도 변환
  const eps=(23.439-0.000036*T*36525)*d2r;
  const lonRad=lon*d2r, latRad=lat*d2r;
  const x=Math.cos(latRad)*Math.cos(lonRad);
  const y=Math.cos(eps)*Math.cos(latRad)*Math.sin(lonRad)-Math.sin(eps)*Math.sin(latRad);
  const z=Math.sin(eps)*Math.cos(latRad)*Math.sin(lonRad)+Math.cos(eps)*Math.sin(latRad);
  const ra=Math.atan2(y,x)*r2d;
  const dec=Math.asin(z)*r2d;
  return {ra:(ra+360)%360, dec};
}

function moonAltAz(dt, lat, lon){
  const {ra, dec}=moonRaDec(dt);
  const r2d=180/Math.PI, d2r=Math.PI/180;
  // 항성시 계산
  const J=(dt-new Date(2000,0,1,12,0,0))/86400000;
  const GMST=(280.46061837+360.98564736629*J)%360;
  const LST=(GMST+lon+360)%360;
  const H=((LST-ra)+360)%360; // 시각
  const Hrad=H*d2r, decRad=dec*d2r, latRad=lat*d2r;
  const sinAlt=Math.sin(decRad)*Math.sin(latRad)+Math.cos(decRad)*Math.cos(latRad)*Math.cos(Hrad);
  const alt=Math.asin(Math.max(-1,Math.min(1,sinAlt)))*r2d;
  const cosA=(Math.sin(decRad)-Math.sin(alt*d2r)*Math.sin(latRad))/(Math.cos(alt*d2r)*Math.cos(latRad));
  let az=Math.acos(Math.max(-1,Math.min(1,cosA)))*r2d;
  if(Math.sin(Hrad)>0) az=360-az;
  return {alt:Math.round(alt*10)/10, az:Math.round(az*10)/10};
}

// ── GPS 획득 ──
function startAR(){
  const noCam=document.getElementById('noCam');
  // 카메라 시작
  if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false})
      .then(stream=>{
        camStream=stream;
        const v=document.getElementById('camVid');
        v.srcObject=stream; v.play();
        if(noCam) noCam.style.display='none';
      })
      .catch(()=>{ if(noCam) noCam.style.display='none'; }); // 카메라 없어도 계속
  } else {
    if(noCam) noCam.style.display='none';
  }

  // GPS
  if(navigator.geolocation){
    navigator.geolocation.watchPosition(pos=>{
      arGpsLat=pos.coords.latitude;
      arGpsLon=pos.coords.longitude;
      const el=document.getElementById('arGpsStatus');
      if(el) el.textContent='📍 '+arGpsLat.toFixed(4)+'°, '+arGpsLon.toFixed(4)+'°';
    }, ()=>{
      const el=document.getElementById('arGpsStatus');
      if(el) el.textContent='⚠️ 위치 사용 불가';
    }, {enableHighAccuracy:true,maximumAge:10000});
  }

  // 기기 방위/기울기
  if(window.DeviceOrientationEvent){
    // iOS 13+ 권한 요청
    if(typeof DeviceOrientationEvent.requestPermission==='function'){
      DeviceOrientationEvent.requestPermission().then(s=>{
        if(s==='granted') window.addEventListener('deviceorientation',_onOrient,true);
      });
    } else {
      window.addEventListener('deviceorientation',_onOrient,true);
    }
  }

  // 렌더 루프
  if(arAnimId) cancelAnimationFrame(arAnimId);
  arAnimId=requestAnimationFrame(_arLoop);
}

function _onOrient(e){
  // alpha=방위각(북=0), beta=앞뒤 기울기, gamma=좌우
  if(e.webkitCompassHeading!=null){
    arDeviceAz=e.webkitCompassHeading; // iOS
  } else if(e.alpha!=null){
    arDeviceAz=(360-e.alpha)%360; // Android
  }
  if(e.beta!=null) arDevicePitch=e.beta; // 앞뒤 기울기 (수직=90)
}

function _arLoop(){
  _arDraw();
  arAnimId=requestAnimationFrame(_arLoop);
}

function _arDraw(){
  const cv=document.getElementById('arCanvas');
  if(!cv) return;
  const W=cv.offsetWidth, H=cv.offsetHeight;
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const ctx=cv.getContext('2d');
  if(!ctx) return;
  ctx.clearRect(0,0,W,H);

  const now=new Date(); // AR은 항상 실제 현재 시각 사용
  const ph=moonPhase(now), dist=moonDist(now), pr2=prox(dist), type=classify(ph,dist);

  // 나침반 바늘 업데이트
  const needle=document.getElementById('arNeedle');
  if(needle) needle.style.transform=`translate(-50%,-100%) rotate(${arDeviceAz}deg)`;

  // 달 방위각/고도 계산 (GPS 있을 때)
  let moonAz=null, moonAlt=null;
  if(arGpsLat!==null){
    const pos=moonAltAz(now, arGpsLat, arGpsLon);
    moonAz=pos.az; moonAlt=pos.alt;
    document.getElementById('arAzimuth').textContent=moonAz.toFixed(1)+'°';
    document.getElementById('arAltitude').textContent=moonAlt.toFixed(1)+'°';
  }

  // 거리/근접도 업데이트
  document.getElementById('arDist').textContent=Math.round(dist).toLocaleString()+' km';
  const pp=(pr2*100).toFixed(1);
  document.getElementById('arProxVal').textContent=pp+'%';
  document.getElementById('arProxBar').style.width=pp+'%';
  document.getElementById('arType').textContent=moonLabel(type,ph);
  document.getElementById('arBadge').textContent=moonLabel(type,ph);

  // ── 방위각 눈금 그리기 ──
  const FOV_H=60; // 가로 시야각 (도)
  const FOV_V=FOV_H*H/W;
  const centerAz=arDeviceAz;
  const centerAlt=Math.max(0,Math.min(90, arDevicePitch>85?90:arDevicePitch));

  // 방위각 라벨들
  ctx.textAlign='center'; ctx.textBaseline='top';
  const dirs=[{az:0,lbl:'N'},{az:45,lbl:'NE'},{az:90,lbl:'E'},{az:135,lbl:'SE'},
              {az:180,lbl:'S'},{az:225,lbl:'SW'},{az:270,lbl:'W'},{az:315,lbl:'NW'}];
  dirs.forEach(({az,lbl})=>{
    let dAz=az-centerAz;
    if(dAz>180) dAz-=360; if(dAz<-180) dAz+=360;
    if(Math.abs(dAz)>FOV_H/2+10) return;
    const sx=W/2+dAz/FOV_H*W;
    const isMain=['N','E','S','W'].includes(lbl);
    // 지평선 y위치 계산
    const horizY=H/2+centerAlt/FOV_V*H;
    ctx.fillStyle=isMain?'rgba(255,255,255,.8)':'rgba(255,255,255,.45)';
    ctx.font=(isMain?'bold ':'')+'12px JetBrains Mono,monospace';
    ctx.fillText(lbl,sx,horizY+8);
    // 눈금선
    ctx.strokeStyle=isMain?'rgba(255,255,255,.35)':'rgba(255,255,255,.18)';
    ctx.lineWidth=isMain?1.5:1;
    ctx.beginPath();ctx.moveTo(sx,horizY);ctx.lineTo(sx,horizY+6);ctx.stroke();
  });

  // 지평선 선
  const horizY=H/2+centerAlt/FOV_V*H;
  if(horizY>0&&horizY<H){
    const grad=ctx.createLinearGradient(0,0,W,0);
    grad.addColorStop(0,'transparent');
    grad.addColorStop(.3,'rgba(255,255,255,.25)');
    grad.addColorStop(.7,'rgba(255,255,255,.25)');
    grad.addColorStop(1,'transparent');
    ctx.strokeStyle=grad; ctx.lineWidth=1.5;
    ctx.setLineDash([6,10]);
    ctx.beginPath();ctx.moveTo(0,horizY);ctx.lineTo(W,horizY);ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── 달 마커 그리기 ──
  if(moonAz===null||moonAlt===null){
    // GPS 없음: 중앙에 달 표시 + 안내
    const sx=W/2, sy=H*0.42;
    const ms=type==='super'?44:type==='quasi'?36:28;
    // 글로우
    if(type==='super'||type==='quasi'){
      const gc=type==='super'?'rgba(242,192,64,':'rgba(224,120,48,';
      const grd=ctx.createRadialGradient(sx,sy,0,sx,sy,ms*2.5);
      grd.addColorStop(0,gc+'0.35)');grd.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(sx,sy,ms*2.5,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
    }
    // 달 본체 — 통합 drawPhase 사용
    drawPhase(ctx, sx, sy, ms, ph, type);
    ctx.beginPath();ctx.arc(sx,sy,ms,0,Math.PI*2);
    ctx.strokeStyle=type==='super'?'rgba(242,192,64,.6)':'rgba(200,200,200,.3)';
    ctx.lineWidth=1.5;ctx.stroke();
    // 안내 텍스트
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.font='bold 14px JetBrains Mono,monospace';
    ctx.fillStyle='rgba(255,255,255,.9)';
    ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=3;
    const lbl=moonLabel(type,ph);
    ctx.strokeText(lbl,sx,sy+ms+10);ctx.fillText(lbl,sx,sy+ms+10);
    ctx.font='11px JetBrains Mono,monospace';
    ctx.fillStyle='rgba(255,255,255,.5)';
    ctx.fillText('📍 위치 권한을 허용하면 하늘에서 달을 찾아드립니다',sx,sy+ms+32);
  } else if(moonAz!==null&&moonAlt!==null){
    let dAz=moonAz-centerAz;
    if(dAz>180) dAz-=360; if(dAz<-180) dAz+=360;
    const dAlt=moonAlt-centerAlt;
    const sx=W/2+dAz/FOV_H*W;
    const sy=H/2-dAlt/FOV_V*H;
    const onScreen=Math.abs(dAz)<FOV_H/2+20&&Math.abs(dAlt)<FOV_V/2+20;
    const belowEl=document.getElementById('arBelowHorizon');
    const subEl=document.getElementById('arBelowSub');
    if(moonAlt<-3){
      // 지평선 아래
      if(belowEl) belowEl.style.display='block';
      if(subEl) subEl.textContent='방위각 '+moonAz.toFixed(1)+'° · 고도 '+moonAlt.toFixed(1)+'°';
    } else {
      if(belowEl) belowEl.style.display='none';
      if(onScreen){
        const ms=type==='super'?38:type==='quasi'?30:22;
        // 글로우
        if(type==='super'||type==='quasi'){
          const gc=type==='super'?'rgba(242,192,64,':'rgba(224,120,48,';
          const grd=ctx.createRadialGradient(sx,sy,0,sx,sy,ms*2.5);
          grd.addColorStop(0,gc+'0.35)');grd.addColorStop(1,'transparent');
          ctx.beginPath();ctx.arc(sx,sy,ms*2.5,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
        }
        // 달 본체 — 통합 drawPhase 사용
        drawPhase(ctx, sx, sy, ms, ph, type);
        // 테두리
        ctx.beginPath();ctx.arc(sx,sy,ms,0,Math.PI*2);
        ctx.strokeStyle=type==='super'?'rgba(242,192,64,.6)':'rgba(200,200,200,.4)';
        ctx.lineWidth=1.5;ctx.stroke();
        // 라벨
        ctx.textAlign='center';ctx.textBaseline='top';
        ctx.font='bold 11px JetBrains Mono,monospace';
        ctx.fillStyle='rgba(255,255,255,.9)';
        ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=3;
        const lbl=(type==='super'?'🌕 슈퍼문':type==='quasi'?'🌔 준슈퍼문':'🌕 달')+' '+moonAlt.toFixed(0)+'°';
        ctx.strokeText(lbl,sx,sy+ms+6);ctx.fillText(lbl,sx,sy+ms+6);
        // 화면 밖이면 화살표 안내
      } else {
        // 화면 밖: 방향 화살표
        const arrowAngle=Math.atan2(-(sy-H/2),sx-W/2);
        const ax=W/2+Math.cos(arrowAngle)*(Math.min(W,H)/2-40);
        const ay=H/2+Math.sin(arrowAngle)*(Math.min(W,H)/2-40);
        ctx.save();ctx.translate(ax,ay);ctx.rotate(arrowAngle);
        ctx.fillStyle='rgba(242,192,64,.8)';
        ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-8);ctx.lineTo(-10,8);ctx.closePath();ctx.fill();
        ctx.restore();
        ctx.textAlign='center';ctx.font='10px JetBrains Mono,monospace';
        ctx.fillStyle='rgba(255,255,255,.7)';
        ctx.fillText(Math.abs(dAz).toFixed(0)+'°',ax,ay+20);
      }
    }
  }
}

function updateAR(){
  if(arAnimId) return; // 루프 중이면 스킵
  const now=userToday;
  const ph=moonPhase(now),dist=moonDist(now),pr2=prox(dist),type=classify(ph,dist);
  const pp=(pr2*100).toFixed(1);
  document.getElementById('arDist').textContent=Math.round(dist).toLocaleString()+' km';
  document.getElementById('arProxVal').textContent=pp+'%';
  document.getElementById('arProxBar').style.width=pp+'%';
  const _arLabel=moonLabel(type,ph);
  document.getElementById('arType').textContent=_arLabel;
  document.getElementById('arBadge').textContent=_arLabel;
}

// ========================================
