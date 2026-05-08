function drawPhase(ctx, cx, cy, R, phase, type){
  const p=phase;

  // 오프스크린 캔버스로 위상 렌더링 (destination-out 격리)
  const oc=document.createElement('canvas');
  const d=Math.ceil(R*2+4);
  oc.width=d; oc.height=d;
  const oc2=oc.getContext('2d');
  const ocx=d/2, ocy=d/2;

  // 1. 달 표면 (밝은 면 전체)
  const g=oc2.createRadialGradient(ocx-R*.3,ocy-R*.3,R*.03,ocx,ocy,R);
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
  oc2.beginPath();oc2.arc(ocx,ocy,R,0,Math.PI*2);
  oc2.fillStyle=g;oc2.fill();

  // 2. 크레이터
  oc2.fillStyle='rgba(0,0,0,.10)';
  [[ocx-R*.14,ocy-R*.22,R*.10],[ocx+R*.22,ocy-R*.08,R*.07],
   [ocx-R*.30,ocy+R*.17,R*.06],[ocx+R*.07,ocy+R*.30,R*.05],
   [ocx+R*.32,ocy+R*.25,R*.08]].forEach(([x,y,r])=>{
    oc2.beginPath();oc2.arc(x,y,r,0,Math.PI*2);oc2.fill();
  });

  // 3. 어두운 면: 달 원 안에 어두운 오버레이 후, 밝은 영역 destination-out으로 복원
  if(p<=0.01||p>=0.99){
    // 신월: 전체 어둠
    oc2.beginPath();oc2.arc(ocx,ocy,R,0,Math.PI*2);
    oc2.fillStyle='rgba(3,5,11,0.95)';oc2.fill();
  } else if(!(p>0.49&&p<0.51)){
    // 달 전체에 어두운 오버레이
    oc2.beginPath();oc2.arc(ocx,ocy,R,0,Math.PI*2);
    oc2.fillStyle='rgba(3,5,11,0.95)';oc2.fill();

    // 밝은 영역을 destination-out으로 지움
    oc2.globalCompositeOperation='destination-out';
    oc2.beginPath();
    oc2.moveTo(ocx,ocy-R);

    if(p<0.5){
      // 신월→보름: 오른쪽이 밝음
      // 경계 타원 ex: p=0→R, p=0.25→0, p→0.5→-R
      const ex=R*(1-2*(p/0.5));
      // 오른쪽 반원 (시계방향: 위→오른쪽→아래)
      oc2.arc(ocx,ocy,R,-Math.PI/2,Math.PI/2,false);
      if(Math.abs(ex)<1){
        oc2.lineTo(ocx,ocy-R);
      } else if(ex>0){
        // 초승달: 타원이 오른쪽으로 볼록 → 반시계(위→오른쪽→아래 반대)로 닫아 좁힘
        oc2.ellipse(ocx,ocy,ex,R,0,Math.PI/2,-Math.PI/2,true);
      } else {
        // 보름 근처: 타원이 왼쪽으로 볼록 → 시계방향으로 왼쪽까지 확장
        oc2.ellipse(ocx,ocy,-ex,R,0,Math.PI/2,-Math.PI/2,false);
      }
    } else {
      // 보름→신월: 왼쪽이 밝음
      const ex=R*(1-2*((p-0.5)/0.5));
      // 왼쪽 반원 (반시계: 위→왼쪽→아래)
      oc2.arc(ocx,ocy,R,-Math.PI/2,Math.PI/2,true);
      if(Math.abs(ex)<1){
        oc2.lineTo(ocx,ocy-R);
      } else if(ex>0){
        // 하현망간: 타원 왼쪽에 볼록 → 시계방향
        oc2.ellipse(ocx,ocy,ex,R,0,Math.PI/2,-Math.PI/2,false);
      } else {
        // 그믐 근처: 타원 오른쪽으로 볼록 → 반시계
        oc2.ellipse(ocx,ocy,-ex,R,0,Math.PI/2,-Math.PI/2,true);
      }
    }
    oc2.fillStyle='rgba(0,0,0,1)';oc2.fill();
    oc2.globalCompositeOperation='source-over';
  }

  // 4. 오프스크린을 메인 캔버스에 복사
  ctx.save();
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
  ctx.drawImage(oc, cx-d/2, cy-d/2);
  ctx.restore();

  // 5. 테두리 + 글로우
  if(type==='super'||type==='quasi'||type==='blood'){
    const gc=type==='blood'?'rgba(200,34,0,.5)':type==='super'?'rgba(242,192,64,.55)':'rgba(224,120,48,.45)';
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle=gc;ctx.lineWidth=Math.max(1,R*.03);ctx.stroke();
  }
}
