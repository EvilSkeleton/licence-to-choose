/* =====================================================================
   BRIEFING FILM: an animated motion-comic with camera moves, kinetic
   captions, suspect tags, a ticking clock and a title reveal.
   ===================================================================== */
const SHOTS = [
  {art:'london', cam:'in',  cap:'LONDON · 02:14 AM', who:'Narrator', big:{text:'02:14', cls:'red'},
   line:"London. Three nights ago. Fourteen minutes past two in the morning."},
  {art:'vault',  cam:'in',  cap:'MI6 · VAULT LEVEL -4', who:'Narrator', stamp:'BREACH',
   line:"Someone opened the MI6 vault and walked out with the launch key for Project Halo, Britain's spy satellite."},
  {art:'orbit',  cam:'out', cap:"M · VOICE OVER", who:'M', big:{text:'HALO', cls:'gold'},
   line:"Whoever holds that key can blind every British satellite in the sky. I want it back, 007. And I want to know who took it."},
  {art:'office', cam:'r', opts:{cast:'both'}, cap:"M'S OFFICE · 08:00", who:'Sir Edmund Crane',
   line:"It's obviously Viktor Kael. Arms dealer. Runs a casino in Monte Carlo. Get on a plane tonight, 007. There's no need to waste time here."},
  {art:'casino', cam:'in', cap:'MONTE CARLO · CASINO', who:'Narrator', tag:{k:'SUSPECT 01', n:'Viktor Kael', s:'Arms dealer'},
   line:"Viktor Kael. He buys and sells anything that can start a war."},
  {art:'harbour',cam:'l',  cap:'MONTE CARLO · HARBOUR', who:'Narrator', tag:{k:'SUSPECT 02', n:'Elena Voss', s:"Kael's accountant"},
   line:"His accountant, Elena Voss, knows where every penny goes. Lately, she looks ready to run."},
  {art:'flight', cam:'in', cap:"M'S OFFICE · 08:05", who:'M', big:{text:'24:00:00', cls:'count', count:true},
   line:"You have twenty-four hours before the key is sold on. Follow the evidence, 007. Not the obvious answer."},
  {art:'title', title:true}
];
let introI = 0, introTimer = null, digitTimer = null;
const wordsOf = s => s.split(' ').length;
const shotDur = sh => sh.title ? 6 : Math.max(5, wordsOf(sh.line)*.36 + 2.4);

function introPlay(i){
  introI = i; clearTimeout(introTimer); clearInterval(digitTimer); hush();
  render();
  const sh = SHOTS[i];
  if(sh.title){ FX.sting(); return; }
  FX.whoosh();
  if(sh.big && sh.big.count){
    let t = 24*3600; const el = () => document.getElementById('bigdigits');
    digitTimer = setInterval(()=>{ t -= 41; const e = el(); if(!e) return clearInterval(digitTimer);
      const h = Math.floor(t/3600), m = Math.floor(t%3600/60), s = t%60; e.textContent = [h,m,s].map(n=>String(n).padStart(2,'0')).join(':'); }, 60);
  }
  introTimer = setTimeout(()=>speak(sh.who, sh.line, ()=>{ if(S.screen==='intro' && introI===i) introPlay(i+1); }), 900);
}
function introSkip(){ clearTimeout(introTimer); clearInterval(digitTimer); hush(); introPlay(SHOTS.length-1); }

function introView(){
  const sh = SHOTS[introI], dur = shotDur(sh).toFixed(1);
  let inner;
  if(sh.title){
    inner = `<div class="titlecard"><div class="iris"></div><div class="tc-in">
      <p class="tc-top">MI6 · CASE FILE 007</p>
      <h1>${'Licence'.split('').map((c,i)=>`<i style="animation-delay:${.5+i*.06}s">${c}</i>`).join('')} <span>${'to'.split('').map((c,i)=>`<i style="animation-delay:${.95+i*.06}s">${c}</i>`).join('')}</span> ${'Choose'.split('').map((c,i)=>`<i style="animation-delay:${1.1+i*.06}s">${c}</i>`).join('')}</h1>
      <p class="tc-sub">24 HOURS · 4 SUSPECTS · 1 TRUTH</p></div></div>`;
  } else {
    const words = sh.line.split(' ').map((w,i)=>`<span class="w" style="animation-delay:${(.9+i*.27).toFixed(2)}s">${w}</span>`).join(' ');
    inner = `<div class="cap" style="--n:${sh.cap.length}">${sh.cap}</div>
      ${sh.big?`<div class="big ${sh.big.cls}" id="bigdigits">${sh.big.text}</div>`:''}
      ${sh.stamp?`<div class="cstamp">${sh.stamp}</div>`:''}
      ${sh.tag?`<div class="lower"><small>${sh.tag.k}</small><b>${sh.tag.n}</b><span>${sh.tag.s}</span></div>`:''}
      <div class="subs"><span class="who">${sh.who}</span><span class="line">${words}</span></div>`;
  }
  return `<section class="cinema">
    <div class="screen" style="--dur:${dur}s">
      <div class="still cam-${sh.cam||'in'}">${art(sh.art, sh.opts)}</div>
      <div class="grain"></div><div class="flare"></div><div class="vig"></div>
      <div class="lbox top"></div><div class="lbox bot"></div>
      ${inner}
      ${sh.title?'':`<div class="prog"><i style="animation-duration:${dur}s"></i></div>`}
    </div>
    <div class="cine-bar"><div class="dots">${SHOTS.map((_,i)=>`<i class="${i<introI?'done':i===introI?'on':''}"></i>`).join('')}</div>
      <div class="row">${sh.title?`<button class="cine-btn" data-a="replay">Watch again</button><button class="cine-btn main" data-a="begin">Begin the investigation</button>`:`<button class="cine-btn" data-a="skip">Skip</button>`}</div></div>
  </section>`;
}
