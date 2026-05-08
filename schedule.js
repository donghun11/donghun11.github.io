// SCHEDULE
// ========================================
// Fred Espenak (NASA) 공식 데이터
// https://astropixels.com/ephemeris/moon/fullperigee2001.html
// type 기준: Relative Distance ≥0.90 = super, 0.86~0.90 = quasi
// 월식: t=개기, p=부분, n=반영
const NASA_DATA=[
  // ================================================
  // Fred Espenak (NASA/Astropixels) 공식 데이터
  // src:'NASA' = 실측, src:'NASA예측' = Espenak 예측
  // eclipse: t=개기, p=부분, n=반영
  // ================================================

  // ── 2001 ──
  {date:'2001-01-09',dist:357406,rdist:0.994,type:'super',src:'NASA',eclipse:'t'},
  {date:'2001-02-08',dist:356994,rdist:0.997,type:'super',src:'NASA'},
  {date:'2001-03-09',dist:361389,rdist:0.965,type:'quasi',src:'NASA'},
  // ── 2002 ──
  {date:'2002-01-28',dist:361766,rdist:0.961,type:'quasi',src:'NASA'},
  {date:'2002-02-27',dist:357091,rdist:0.996,type:'super',src:'NASA'},
  {date:'2002-03-28',dist:357212,rdist:0.996,type:'super',src:'NASA'},
  {date:'2002-04-27',dist:361870,rdist:0.961,type:'quasi',src:'NASA'},
  // ── 2003 ──
  {date:'2003-03-18',dist:361416,rdist:0.965,type:'quasi',src:'NASA'},
  {date:'2003-04-16',dist:357306,rdist:0.997,type:'super',src:'NASA'},
  {date:'2003-05-16',dist:357693,rdist:0.995,type:'super',src:'NASA',eclipse:'t'},
  {date:'2003-06-14',dist:362315,rdist:0.958,type:'quasi',src:'NASA'},
  // ── 2004 ──
  {date:'2004-05-04',dist:361359,rdist:0.966,type:'quasi',src:'NASA',eclipse:'t'},
  {date:'2004-06-03',dist:357384,rdist:0.997,type:'super',src:'NASA'},
  {date:'2004-07-02',dist:357699,rdist:0.995,type:'super',src:'NASA'},
  {date:'2004-07-31',dist:362193,rdist:0.958,type:'quasi',src:'NASA'},
  // ── 2005 ──
  {date:'2005-06-22',dist:361179,rdist:0.967,type:'quasi',src:'NASA'},
  {date:'2005-07-21',dist:357291,rdist:0.997,type:'super',src:'NASA'},
  {date:'2005-08-19',dist:357652,rdist:0.995,type:'super',src:'NASA'},
  {date:'2005-09-18',dist:362325,rdist:0.957,type:'quasi',src:'NASA'},
  // ── 2006 ──
  {date:'2006-08-09',dist:361257,rdist:0.967,type:'quasi',src:'NASA'},
  {date:'2006-09-07',dist:357298,rdist:0.997,type:'super',src:'NASA',eclipse:'p'},
  {date:'2006-10-07',dist:357695,rdist:0.994,type:'super',src:'NASA'},
  {date:'2006-11-05',dist:362616,rdist:0.955,type:'quasi',src:'NASA'},
  // ── 2007 ──
  {date:'2007-09-26',dist:360827,rdist:0.970,type:'quasi',src:'NASA'},
  {date:'2007-10-26',dist:356841,rdist:0.998,type:'super',src:'NASA'},
  {date:'2007-11-24',dist:357548,rdist:0.993,type:'super',src:'NASA'},
  {date:'2007-12-24',dist:363032,rdist:0.950,type:'quasi',src:'NASA'},
  // ── 2008 ──
  {date:'2008-10-14',dist:367908,rdist:0.900,type:'super',src:'NASA'},
  {date:'2008-11-13',dist:360196,rdist:0.974,type:'quasi',src:'NASA'},
  {date:'2008-12-12',dist:356615,rdist:0.999,type:'super',src:'NASA'},
  // ── 2009 ──
  {date:'2009-01-11',dist:357969,rdist:0.990,type:'super',src:'NASA'},
  {date:'2009-02-09',dist:364050,rdist:0.941,type:'quasi',src:'NASA',eclipse:'n'},
  {date:'2009-12-02',dist:367240,rdist:0.909,type:'super',src:'NASA'},
  {date:'2009-12-31',dist:359721,rdist:0.978,type:'quasi',src:'NASA',eclipse:'p'},
  // ── 2010 ──
  {date:'2010-01-30',dist:356607,rdist:1.000,type:'super',src:'NASA',note:'연간 최근접'},
  {date:'2010-02-28',dist:358436,rdist:0.987,type:'super',src:'NASA'},
  {date:'2010-03-30',dist:364689,rdist:0.935,type:'quasi',src:'NASA'},
  // ── 2011 ──
  {date:'2011-01-19',dist:366158,rdist:0.920,type:'super',src:'NASA'},
  {date:'2011-02-18',dist:359103,rdist:0.982,type:'super',src:'NASA'},
  {date:'2011-03-19',dist:356580,rdist:1.000,type:'super',src:'NASA',note:'역대 최근접'},
  {date:'2011-04-18',dist:358798,rdist:0.985,type:'super',src:'NASA'},
  {date:'2011-05-17',dist:365164,rdist:0.929,type:'quasi',src:'NASA'},
  // ── 2012 ──
  {date:'2012-03-08',dist:365497,rdist:0.927,type:'quasi',src:'NASA'},
  {date:'2012-04-06',dist:359076,rdist:0.984,type:'super',src:'NASA'},
  {date:'2012-05-06',dist:356954,rdist:1.000,type:'super',src:'NASA'},
  {date:'2012-06-04',dist:359257,rdist:0.984,type:'super',src:'NASA',eclipse:'p'},
  {date:'2012-07-03',dist:365483,rdist:0.926,type:'quasi',src:'NASA'},
  // ── 2013 ──
  {date:'2013-04-25',dist:365312,rdist:0.929,type:'quasi',src:'NASA',eclipse:'p'},
  {date:'2013-05-25',dist:359110,rdist:0.985,type:'super',src:'NASA',eclipse:'n'},
  {date:'2013-06-23',dist:356991,rdist:1.000,type:'super',src:'NASA'},
  {date:'2013-07-22',dist:359170,rdist:0.984,type:'super',src:'NASA'},
  {date:'2013-08-21',dist:365340,rdist:0.928,type:'quasi',src:'NASA'},
  // ── 2014 ──
  {date:'2014-06-13',dist:365038,rdist:0.931,type:'quasi',src:'NASA'},
  {date:'2014-07-12',dist:358975,rdist:0.985,type:'super',src:'NASA'},
  {date:'2014-08-10',dist:356898,rdist:1.000,type:'super',src:'NASA'},
  {date:'2014-09-09',dist:359182,rdist:0.983,type:'super',src:'NASA'},
  {date:'2014-10-08',dist:365659,rdist:0.925,type:'quasi',src:'NASA',eclipse:'t'},
  // ── 2015 ──
  {date:'2015-07-31',dist:365112,rdist:0.930,type:'quasi',src:'NASA'},
  {date:'2015-08-29',dist:358993,rdist:0.985,type:'super',src:'NASA'},
  {date:'2015-09-28',dist:356878,rdist:1.000,type:'blood',src:'NASA',eclipse:'t',note:'슈퍼 블러드문'},
  {date:'2015-10-27',dist:359324,rdist:0.982,type:'super',src:'NASA'},
  {date:'2015-11-25',dist:366149,rdist:0.921,type:'super',src:'NASA'},
  // ── 2016 ──
  {date:'2016-09-16',dist:364754,rdist:0.934,type:'penumbral',src:'NASA',eclipse:'n',note:'슈퍼 반영월식'},
  {date:'2016-10-16',dist:358475,rdist:0.987,type:'super',src:'NASA'},
  {date:'2016-11-14',dist:356523,rdist:1.000,type:'super',src:'NASA',note:'68년 만의 최근접'},
  {date:'2016-12-14',dist:359450,rdist:0.979,type:'super',src:'NASA'},
  // ── 2017 ──
  {date:'2017-01-12',dist:366880,rdist:0.913,type:'super',src:'NASA'},
  {date:'2017-11-04',dist:364004,rdist:0.941,type:'quasi',src:'NASA'},
  {date:'2017-12-03',dist:357987,rdist:0.990,type:'super',src:'NASA'},
  // ── 2018 ──
  {date:'2018-01-02',dist:356604,rdist:0.999,type:'super',src:'NASA'},
  {date:'2018-01-31',dist:360199,rdist:0.974,type:'blood',src:'NASA',eclipse:'t',note:'슈퍼 블러드 블루문'},
  {date:'2018-12-22',dist:363368,rdist:0.948,type:'quasi',src:'NASA'},
  // ── 2019 ──
  {date:'2019-01-21',dist:357715,rdist:0.992,type:'blood',src:'NASA',eclipse:'t',note:'슈퍼 블러드문'},
  {date:'2019-02-19',dist:356846,rdist:0.998,type:'super',src:'NASA'},
  {date:'2019-03-21',dist:360772,rdist:0.970,type:'quasi',src:'NASA'},
  // ── 2020 ──
  {date:'2020-02-09',dist:362479,rdist:0.955,type:'quasi',src:'NASA'},
  {date:'2020-03-09',dist:357404,rdist:0.994,type:'super',src:'NASA'},
  {date:'2020-04-08',dist:357035,rdist:0.997,type:'super',src:'NASA'},
  {date:'2020-05-07',dist:361184,rdist:0.967,type:'quasi',src:'NASA'},
  // ── 2021 ──
  {date:'2021-03-28',dist:362170,rdist:0.959,type:'quasi',src:'NASA'},
  {date:'2021-04-27',dist:357615,rdist:0.995,type:'super',src:'NASA'},
  {date:'2021-05-26',dist:357462,rdist:0.997,type:'blood',src:'NASA',eclipse:'t',note:'슈퍼 블러드문'},
  {date:'2021-06-24',dist:361558,rdist:0.965,type:'quasi',src:'NASA'},
  // ── 2022 ──
  {date:'2022-05-16',dist:362127,rdist:0.959,type:'quasi',src:'NASA',eclipse:'t'},
  {date:'2022-06-14',dist:357658,rdist:0.995,type:'super',src:'NASA'},
  {date:'2022-07-13',dist:357418,rdist:0.997,type:'super',src:'NASA'},
  {date:'2022-08-12',dist:361409,rdist:0.965,type:'quasi',src:'NASA'},
  // ── 2023 ──
  {date:'2023-07-03',dist:361934,rdist:0.961,type:'quasi',src:'NASA'},
  {date:'2023-08-01',dist:357530,rdist:0.996,type:'super',src:'NASA'},
  {date:'2023-08-31',dist:357344,rdist:0.997,type:'super',src:'NASA',note:'블루문'},
  {date:'2023-09-29',dist:361552,rdist:0.964,type:'quasi',src:'NASA'},
  // ── 2024 ──
  {date:'2024-08-19',dist:361970,rdist:0.961,type:'quasi',src:'NASA'},
  {date:'2024-09-18',dist:357486,rdist:0.996,type:'super',src:'NASA',eclipse:'p'},
  {date:'2024-10-17',dist:357364,rdist:0.996,type:'super',src:'NASA'},
  {date:'2024-11-15',dist:361867,rdist:0.961,type:'quasi',src:'NASA'},
  // ── 2025 ──
  {date:'2025-10-07',dist:361458,rdist:0.964,type:'quasi',src:'NASA'},
  {date:'2025-11-05',dist:356980,rdist:0.997,type:'super',src:'NASA'},
  {date:'2025-12-04',dist:357219,rdist:0.995,type:'super',src:'NASA'},

  // ── 2026 예측 ──
  {date:'2026-01-03',dist:362312,rdist:0.956,type:'quasi',src:'NASA예측'},
  {date:'2026-03-03',dist:358490,rdist:0.988,type:'blood',src:'NASA예측',eclipse:'t',note:'개기월식 블러드문 (슈퍼문 아님)'},
  {date:'2026-11-24',dist:360768,rdist:0.969,type:'quasi',src:'NASA예측'},
  {date:'2026-12-24',dist:356740,rdist:0.998,type:'super',src:'NASA예측'},

  // ── 2027 예측 ──
  {date:'2027-01-22',dist:357644,rdist:0.993,type:'super',src:'NASA예측'},
  {date:'2027-02-20',dist:363306,rdist:0.948,type:'penumbral',src:'NASA예측',eclipse:'n',note:'슈퍼 반영월식'},
  {date:'2027-07-18',dist:368100,rdist:0.898,type:'quasi',src:'NASA예측',eclipse:'n',note:'반영월식'},
  {date:'2027-08-17',dist:364200,rdist:0.940,type:'quasi',src:'NASA예측',eclipse:'n',note:'반영월식'},

  // ── 2028 예측 ──
  {date:'2028-01-12',dist:360266,rdist:0.974,type:'quasi',src:'NASA예측'},
  {date:'2028-02-10',dist:356720,rdist:0.999,type:'super',src:'NASA예측'},
  {date:'2028-03-11',dist:358074,rdist:0.990,type:'super',src:'NASA예측'},
  {date:'2028-04-09',dist:363867,rdist:0.943,type:'quasi',src:'NASA예측'},

  // ── 2029 예측 ──
  {date:'2029-01-30',dist:367046,rdist:0.911,type:'super',src:'NASA예측'},
  {date:'2029-02-28',dist:359659,rdist:0.978,type:'quasi',src:'NASA예측'},
  {date:'2029-03-30',dist:356683,rdist:1.000,type:'super',src:'NASA예측'},
  {date:'2029-04-28',dist:358383,rdist:0.989,type:'super',src:'NASA예측'},
  {date:'2029-05-27',dist:364262,rdist:0.938,type:'quasi',src:'NASA예측'},

  // ── 2030 예측 ──
  {date:'2030-03-19',dist:366439,rdist:0.917,type:'super',src:'NASA예측'},
  {date:'2030-04-18',dist:359654,rdist:0.980,type:'quasi',src:'NASA예측'},
  {date:'2030-05-17',dist:357028,rdist:1.000,type:'super',src:'NASA예측'},
  {date:'2030-06-15',dist:358779,rdist:0.987,type:'super',src:'NASA예측',eclipse:'p'},
  {date:'2030-07-15',dist:364530,rdist:0.936,type:'quasi',src:'NASA예측'},

  // ── 2031 예측 ──
  {date:'2031-05-07',dist:366293,rdist:0.918,type:'super',src:'NASA예측',eclipse:'n'},
  {date:'2031-06-05',dist:359674,rdist:0.980,type:'super',src:'NASA예측',eclipse:'n'},
  {date:'2031-07-04',dist:357018,rdist:1.000,type:'super',src:'NASA예측'},
  {date:'2031-08-03',dist:358651,rdist:0.988,type:'super',src:'NASA예측'},
  {date:'2031-09-01',dist:364383,rdist:0.938,type:'quasi',src:'NASA예측'},

  // ── 2037 ──
  {date:'2037-03-02',dist:356751,rdist:0.999,type:'super',src:'NASA예측',note:'2037 최근접'},
];
let schedFilter='all';
let schedAllData=[];

function buildSched(){
  makeItem._cache = {};  // 캐시 초기화
  schedAllData=[...NASA_DATA];
  schedAllData.sort((a,b)=>a.date.localeCompare(b.date));
  const seen=new Set(),deduped=[];
  for(const it of schedAllData){
    const k=it.date+it.type;
    if(!seen.has(k)){seen.add(k);deduped.push(it);}
  }
  schedAllData=deduped;
  updateSchedTodayBar();
  // 먼저 렌더링하고, 날짜 비교는 백그라운드로 처리
  renderSched(userToday);
  // appPredDate 캐시를 비동기로 미리 계산 (UI 블로킹 방지)
  _precalcCache();
}

function _precalcCache(){
  if(!makeItem._cache) makeItem._cache={};
  let idx=0;
  function _next(){
    if(idx>=schedAllData.length) return;
    const it=schedAllData[idx++];
    const key=it.date+it.type;
    if(makeItem._cache[key]===undefined){
      const nasaDate=parseDate(it.date);
      const searchFrom=new Date(nasaDate.getTime()-35*86400000);
      const thr=(it.type==='quasi')?null:0.90;
      let result=thr!==null?nextSM(searchFrom,thr):nextQSM(searchFrom);
      if(result&&Math.abs(result-nasaDate)>60*86400000) result=null;
      makeItem._cache[key]=result||null;
    }
    setTimeout(_next,0); // 다음 항목을 다음 이벤트루프에
  }
  setTimeout(_next,100); // 렌더링 후 시작
}

function renderSched(now){
  const list=document.getElementById('schedList');
  list.innerHTML='<div style="padding:20px;text-align:center;color:rgba(240,236,224,.4);font:400 12px/2 var(--mono)">불러오는 중…</div>';
  list.scrollTop=0;

  // setTimeout으로 UI 블로킹 방지 (안드로이드 WebView 호환)
  setTimeout(function(){
    list.innerHTML='';

    var data=schedAllData.filter(function(it){
      var d=parseDate(it.date);
      if(schedFilter==='super'&&it.type!=='super')return false;
      if(schedFilter==='quasi'&&it.type!=='quasi')return false;
      if(schedFilter==='blood'&&it.type!=='blood')return false;
      if(schedFilter==='penumbral'&&it.type!=='penumbral')return false;
      if(schedFilter==='special'&&it.type!=='blood'&&it.type!=='penumbral')return false;
      if(schedFilter==='future'&&d<now)return false;
      if(schedFilter==='past'&&d>=now)return false;
      return true;
    });

    if(!data.length){
      list.innerHTML='<div style="padding:30px;text-align:center;color:rgba(240,236,224,.3);font:400 13px/2 var(--mono)">해당하는 이벤트가 없습니다.</div>';
      return;
    }

    var nextIdx=data.findIndex(function(it){return parseDate(it.date)>=now;});
    var pivotIdx=nextIdx>=0?nextIdx:data.length;
    var past=data.slice(0,pivotIdx);
    var future=data.slice(pivotIdx);

    // 과거 아이템들
    past.forEach(function(it){list.appendChild(makeItem(it,now,false));});

    // 구분선
    var sep=document.createElement('div');
    sep.id='sched-sep';
    sep.setAttribute('data-sep','1');
    sep.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 4px;width:100%;margin-bottom:8px';
    sep.innerHTML='<div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(242,192,64,.5))"></div>'
      +'<span style="font:700 12px/1 var(--mono);color:var(--gold);letter-spacing:.14em;white-space:nowrap;padding:4px 10px;border:1px solid rgba(242,192,64,.3);border-radius:99px;background:rgba(242,192,64,.08)">▼ 지금 ▼</span>'
      +'<div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(242,192,64,.5),transparent)"></div>';
    list.appendChild(sep);

    // 미래 아이템들
    future.forEach(function(it){list.appendChild(makeItem(it,now,true));});

    // 구분선 위치로 스크롤
    setTimeout(function(){
      var listEl=document.getElementById('schedList');
      var sepEl=document.getElementById('sched-sep');
      if(!listEl||!sepEl)return;
      var listTop=listEl.getBoundingClientRect().top;
      var sepTop=sepEl.getBoundingClientRect().top;
      listEl.scrollTop+=(sepTop-listTop);
    },50);

  },10); // 10ms 후 실행 → UI가 먼저 '불러오는 중' 표시 후 렌더링
}

function makeItem(it,now,isFutureGroup){
  const d=parseDate(it.date);
  // D-day는 userToday(=now) 기준
  const dday=Math.ceil((d-now)/86400000);
  const isToday=dday===0;
  const isFuture=dday>0;

  // NASA rdist 기준 근접도 (있으면 rdist 사용, 없으면 dist로 계산)
  const nasaProxNum = it.rdist ? it.rdist*100 : prox(it.dist)*100;
  const nasaProx = nasaProxNum.toFixed(1);

  // 앱 예측 날짜 — NASA 날짜 기준 ±45일 범위에서 가장 가까운 보름달 탐색
  const cacheKey = it.date + it.type;
  if(!makeItem._cache) makeItem._cache = {};
  let appPredDate = makeItem._cache[cacheKey];
  if(appPredDate === undefined){
    // 아직 비동기 계산 안 됨 → null로 표시 (나중에 자동 갱신)
    appPredDate = null;
    makeItem._cache[cacheKey] = null;
  }
  const daysDiff = appPredDate
    ? Math.round((appPredDate - parseDate(it.date))/86400000)
    : null;
  const calcDist=Math.round(moonDist(parseDate(it.date)));
  const calcProxPct=(prox(calcDist)*100).toFixed(1);

  const typeLabels={super:'슈퍼문 🌕',quasi:'준 슈퍼문 🌔',blood:'슈퍼 블러드문 🩸',penumbral:'슈퍼 반영월식 🌕🌑'};
  const el=document.createElement('div');
  el.className=`si ${it.type} ${isToday?'today':''} ${isFutureGroup?'fut-item':''}`;

  // 출처 뱃지
  const srcBadge=it.src==='NASA'
    ?`<span style="font:600 10px/1 var(--mono);padding:2px 6px;border-radius:4px;background:rgba(58,123,224,.18);color:#60a0e0;border:1px solid rgba(58,123,224,.22)">NASA</span>`
    :it.src==='NASA예측'
    ?`<span style="font:600 10px/1 var(--mono);padding:2px 6px;border-radius:4px;background:rgba(58,123,224,.25);color:#80c0ff;border:1px solid rgba(96,160,255,.28)">(NASA 예측)</span>`
    :'';
  const noteBadge=it.note
    ?`<span style="font:400 10px/1 var(--mono);color:rgba(240,236,224,.38)">${it.note}</span>`:'';

  // NASA Relative Distance 표시
  const nasaRdist=it.rdist?(it.rdist*100).toFixed(1)+'%':nasaProx+'%';

  // 월식 뱃지
  const eclipseBadge=it.eclipse
    ?`<span style="font:600 10px/1 var(--mono);padding:2px 6px;border-radius:4px;background:rgba(180,30,0,.25);color:#ff8866;border:1px solid rgba(200,60,0,.3)">${it.eclipse==='t'?'🩸개기월식':it.eclipse==='p'?'🌑부분월식':'🌕반영월식'}</span>`
    :'';

  // 날짜 오차 표시
  const daysDiffStr = daysDiff===null ? '탐색실패'
    : daysDiff===0 ? '±0일 (일치)'
    : `${daysDiff>0?'+':''}${daysDiff}일`;
  const errColor = daysDiff===null ? 'rgba(240,236,224,.4)'
    : Math.abs(daysDiff)===0 ? 'rgba(80,200,120,.9)'
    : Math.abs(daysDiff)<=3  ? 'rgba(80,200,120,.8)'
    : Math.abs(daysDiff)<=7  ? 'rgba(242,192,64,.8)'
    : 'rgba(220,120,60,.8)';

  el.innerHTML=`<div class="si-inner"><div class="si-bar"></div><div class="si-body">
    <div class="si-top">
      <span class="si-date">${d.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})}</span>
      <span class="si-dday ${isToday?'now':isFuture?'fut':'past'}">${isToday?'오늘!':isFuture?'D-'+dday:(-dday)+'일 전'}</span>
    </div>
    <div class="si-meta">
      <span class="si-type ${it.type}">${typeLabels[it.type]||it.type}</span>
      ${srcBadge}${eclipseBadge}${noteBadge}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;padding:8px;background:rgba(255,255,255,.04);border-radius:8px;border:1px solid rgba(255,255,255,.06)">
      <div>
        <div style="font:400 9px/1 var(--mono);color:#60a0e0;letter-spacing:.1em;margin-bottom:3px">NASA 실측</div>
        <div style="font:600 12px/1.3 var(--mono);color:var(--paper)">${d.toLocaleDateString('ko-KR',{month:'short',day:'numeric'})}</div>
        <div style="font:600 10px/1 var(--mono);color:var(--gold);margin-top:2px">상대거리 ${nasaRdist}</div>
        <div style="font:400 10px/1 var(--mono);color:rgba(240,236,224,.4);margin-top:1px">${it.dist.toLocaleString()} km</div>
      </div>
      <div>
        <div style="font:400 9px/1 var(--mono);color:rgba(240,236,224,.4);letter-spacing:.1em;margin-bottom:3px">앱 예측 날짜</div>
        <div style="font:600 12px/1.3 var(--mono);color:var(--paper)">${appPredDate?appPredDate.toLocaleDateString('ko-KR',{month:'short',day:'numeric'}):'—'}</div>
        <div style="font:600 10px/1 var(--mono);color:${errColor};margin-top:2px">날짜 오차 ${daysDiffStr}</div>
        <div style="font:400 10px/1 var(--mono);color:rgba(240,236,224,.4);margin-top:1px">근접도 ${calcProxPct}%</div>
      </div>
    </div>
    <div class="si-prox-wrap">
      <div class="si-prox-track"><div class="si-prox-fill" style="width:${nasaProx}%"></div></div>
      <span class="si-prox-pct">${nasaProx}%</span>
    </div>
  </div></div>`;
  return el;
}

function setF(btn,f){
  document.querySelectorAll('.sched-filters .fc').forEach(b=>{b.classList.remove('on','on-blood','on-blue');});
  const cls=f==='blood'?'on-blood':f==='penumbral'?'on-blue':f==='special'?'on-blue':'on';
  btn.classList.add(cls);
  schedFilter=f;
  renderSched(userToday);  // userToday 기준
}

// ========================================
