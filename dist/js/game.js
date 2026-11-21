/* =====================================================================
   GAME STATE
   ===================================================================== */
function fresh(){ return { screen:'title', scene:'brief', hours:START_HOURS, clues:[], cluePlace:{}, asked:{}, path:['brief'], kaelDead:false,
  last:null, suspect:null, picked:[], timeUp:false, accused:null, newClue:null, enter:false, dockOpen: window.innerWidth>=700 } }
let S = fresh();
let THEME = 'dark';
try{ THEME = localStorage.getItem('ltc-theme') || 'dark'; }catch(e){}
document.documentElement.dataset.theme = THEME;

/* Spoken-line highlighting: words light up as the voice reaches them. */
const SAY = {key:'', n:-1};
function karaoke(text, key){ return text.split(/\s+/).map((w,i)=>`<span class="kw${SAY.key===key && i<=SAY.n ? ' on' : ''}" data-k="${key}">${w}</span>`).join(' '); }
function sayHook(key){ SAY.key = key; SAY.n = -1; document.querySelectorAll(`.kw[data-k="${key}"]`).forEach(w=>w.classList.remove('on'));
  return n => { SAY.n = n; document.querySelectorAll(`.kw[data-k="${key}"]`).forEach((w,j)=>{ if(j<=n) w.classList.add('on'); }); }; }

function spend(h){ if(h>0){ S.hours = Math.max(0, S.hours - h); FX.tick(); } }
function travel(i){
  const g = SCENES[S.scene].go[i]; if(!g) return;
  hush(); spend(g.h);
  let to = g.to;
  if(S.hours<=0 && to!=='accuse'){ to = 'accuse'; S.timeUp = true; }
  S.scene = to; S.path.push(to); S.last = null; S.enter = true;
  if(to==='yacht') spend(3);
  FX.whoosh(); render(); window.scrollTo({top:0,behavior:'smooth'});
  const sc = SCENES[to];
  if(sc.quote) sayLater(500, ()=>speak(sc.speaker, sc.quote, null, sayHook('q:'+to)));
}
function ask(i){
  const sc = SCENES[S.scene], a = sc.ask[i];
  if(!a || S.asked[S.scene]!==undefined) return;
  hush();
  S.asked[S.scene] = i;
  spend(S.scene==='island' ? 0 : 2);
  if(S.scene==='yacht' && i===2) spend(1);
  if(a.fx==='boom'){ S.kaelDead = true; FX.boom(); }
  if(a.clue && !S.clues.includes(a.clue)){ S.clues.push(a.clue); S.cluePlace[a.clue] = S.scene; S.newClue = a.clue; S.dockOpen = true; if(window.innerWidth<700) setTimeout(()=>{ if(S.screen==='play' && S.scene!=='accuse'){ S.dockOpen=false; render(); } }, 3000); setTimeout(FX.clue, a.fx==='boom'?900:350); }
  S.last = {reply:a.reply, speaker:a.speaker, clue:a.clue};
  if(S.hours<=0 && S.scene!=='island'){ S.timeUp = true; }
  render();
  const say = a.speaker ? (a.reply + (a.clue && CLUES[a.clue].text.startsWith('"') ? ' ' + CLUES[a.clue].text : '')) : null;
  if(say) speak(a.speaker, say, null, sayHook('r:'+S.scene));
}
function forceAccuse(){ S.scene='accuse'; S.path.push('accuse'); S.last=null; S.enter=true; FX.stamp(); render(); }

function verdict(){
  const x = S.suspect, sel = S.picked;
  const need = Math.min(3, S.clues.length);
  const all = sel.length===3 && sel.every(c=>CLUES[c].pts.includes(x));
  const unique = sel.some(c=>CLUES[c].pts.length===1 && CLUES[c].pts[0]===x);
  return {strong: all && unique, all, need};
}
function accuse(){
  S.accused = S.suspect; S.screen = 'ending'; hush(); FX.stamp(); setTimeout(FX.sting, 300);
  render(); window.scrollTo({top:0,behavior:'smooth'});
  const e = endingInfo(); sayLater(1200, ()=>speak(e.quote[0], e.quote[1], null, sayHook('end')));
}

/* =====================================================================
   VIEWS
   ===================================================================== */
const still = (kind, hud, o) => `<div class="still">${art(kind, o)}<div class="hud"><span>${hud}</span><span class="rec"><i></i>REC</span></div></div>`;

function header(){
  const tg = (k,l) => `<button class="ghost" data-a="tog" data-k="${k}" aria-pressed="${AUDIO[k]}">${l}</button>`;
  return `<header class="top"><div class="brand"><svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="20" cy="20" r="3" fill="var(--accent)"/></svg>
    <div><b>Licence <span>to</span> Choose</b><small>Case file 007 · Operation Black Halo</small></div></div>
    <div class="tools">${tg('music','Music')}${tg('voice','Voices')}${tg('sfx','Effects')}
    <button class="ghost" data-a="theme" aria-label="Switch light or dark theme">${THEME==='dark'?'Light':'Dark'}</button>
    ${S.screen!=='title'?'<button class="ghost" data-a="restart">Start over</button>':''}</div></header>`;
}
function titleView(){
  return `<section class="sheet enter">${still('london','LONDON · 02:14 AM')}<span class="stamp">TOP SECRET</span>
    <div class="inner">
    <div class="eyebrow">MI6 · Case file 007</div>
    <h1>Licence <span>to</span> Choose</h1>
    <p class="story">You are James Bond. The launch key for Britain's spy satellite has been stolen. You have 24 hours, one question per place, and a tray of evidence that does not always tell the truth.</p>
    <ul class="rules">
      <li><b>Travel costs hours.</b> London to Monaco is 6 hours. You can't go everywhere.</li>
      <li><b>One question per place.</b> Each costs 2 hours. Pick the wrong one and you learn little, or something misleading.</li>
      <li><b>Some clues are red herrings.</b> The evidence cards don't tell you which.</li>
      <li><b>To win,</b> accuse the right suspect and back it with exactly 3 clues that all point to them, including at least one that points <i>only</i> to them.</li>
      <li>If the clock hits zero, M calls you back to accuse with whatever you have.</li>
    </ul>
    <div class="row"><button class="go" data-a="intro">Play the briefing film</button><button class="go alt" data-a="skipstart">Skip to the case</button></div>
    <p class="eyebrow">Sound on for music and voices. Subtitles always show.</p>
    </div></section>`;
}

function clockView(){
  const low = S.hours<=6, C = 213.6, off = C*(1-S.hours/START_HOURS);
  const ticks = Array.from({length:24},(_,i)=>{ const a=i*15*Math.PI/180; return `<line x1="${45+38*Math.sin(a)}" y1="${45-38*Math.cos(a)}" x2="${45+(i%6?41:43.5)*Math.sin(a)}" y2="${45-(i%6?41:43.5)*Math.cos(a)}"/>`; }).join('');
  return `<div class="clock ${low?'low':''}"><svg viewBox="0 0 90 90" aria-hidden="true"><g class="ticks">${ticks}</g><circle class="trk" cx="45" cy="45" r="34"/><circle class="arc" cx="45" cy="45" r="34" stroke-dasharray="${C}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 45 45)"/></svg>
    <div class="ctxt"><b>${S.hours}</b><span>hours left</span></div></div>`;
}
function notebook(){
  const n = S.clues.length;
  return `<aside class="notebook">
    <div class="nbtop">${clockView()}<div class="nbinfo"><span class="label">Mission board</span><b>${n}</b> <span class="sm">clue${n===1?'':'s'} filed</span><span class="sm">${S.path.length-1} move${S.path.length===2?'':'s'} made</span></div></div>
    <div><div class="label">Case map</div><div class="mapbox" data-k="${S.path.join('>')}">${mapSvg()}</div>
    <div class="legend"><span><i class="lg-here"></i>You are here</span><span><i class="lg-vis"></i>Visited</span><span><i class="lg-new"></i>Unexplored</span></div></div>
  </aside>`;
}
function sceneView(){
  if(S.scene==='accuse') return accuseView();
  const sc = SCENES[S.scene], asked = S.asked[S.scene];
  let mid = '';
  if(sc.ask){
    if(asked===undefined){
      mid += `<div class="label">Investigate · <em>choose one</em>${S.scene==='island'?'':' · 2 hours'}</div>
        <div class="opts">${sc.ask.map((a,i)=>`<button class="opt ask" data-a="ask" data-i="${i}"><span class="k">${'ABC'[i]}</span><span class="t">${a.t}</span><span class="s">${S.scene==='island'?'You only get one chance':'Ask or search'}</span></button>`).join('')}</div>`;
    } else if(S.last){
      const l = S.last;
      mid += l.speaker ? `<blockquote class="quote">${karaoke(l.reply,'r:'+S.scene)}<cite>${l.speaker}</cite></blockquote>` : `<p class="story">${l.reply}</p>`;
      mid += l.clue ? `<div class="found"><span class="fico">${ico(CLUEICON[l.clue],26)}</span><div><small>Filed to the evidence tray · ${CLUES[l.clue].name}</small>${CLUES[l.clue].text}</div></div>` : `<div class="nothing">Nothing useful. That cost you time.</div>`;
    } else {
      mid += `<div class="nothing">You've already investigated here.</div>`;
    }
  }
  let travelBlock;
  if(S.timeUp){
    travelBlock = `<div class="warn">Time's up. The key has been sold on. M is calling you back to London to make your accusation with what you have.</div><div class="row"><button class="go" data-a="force">Go to M's office</button></div>`;
  } else {
    const locked = sc.ask && asked===undefined && S.scene==='island';
    travelBlock = locked ? '' : `<div class="label">Where next?</div><div class="opts">${sc.go.map((g,i)=>`<button class="opt" data-a="go" data-i="${i}"><span class="k">${i+1}</span><span class="t">${g.t}</span><span class="s">${g.s}</span><span class="h">${g.h?'−'+g.h+'h':'0h'}</span></button>`).join('')}</div>`;
  }
  const enter = S.enter ? ' enter' : '';
  return `<div class="desk"><section class="sheet${enter}">
    ${still(sc.art, sc.place.toUpperCase())}<span class="stamp${enter?' slam':''}">${sc.city.toUpperCase()}</span>
    <div class="inner">
      <div class="eyebrow">${sc.place}</div>
      <h2>${sc.title}</h2>
      <p class="story">${sc.text}</p>
      ${sc.quote && asked===undefined ? `<blockquote class="quote">${karaoke(sc.quote,'q:'+S.scene)}<cite>${sc.speaker}</cite></blockquote>` : ''}
      ${mid}
      ${travelBlock}
    </div></section>${notebook()}</div>`;
}
function accuseView(){
  const need = Math.min(3, S.clues.length);
  const ready = S.suspect && S.picked.length===need;
  return `<div class="desk"><section class="sheet enter">
    ${still('accuse',"MI6 · M'S OFFICE · 08:00")}<span class="stamp slam">FINAL REPORT</span>
    <div class="inner">
      <div class="eyebrow">MI6 · M's office</div>
      <h2>The Accusation</h2>
      <p class="story">M, Crane and Q are waiting. Name the thief, then lay down ${need===3?'exactly 3 pieces':`your ${need} piece${need===1?'':'s'}`} of evidence from the tray below. A strong case needs 3 clues that all point to that person, and at least one that points only to them.</p>
      <div class="label">1 · Who stole the key?</div>
      <div class="pick">${Object.entries(SUSPECTS).map(([id,p])=>`<button class="sus" data-a="sus" data-id="${id}" aria-pressed="${S.suspect===id}"><b>${p.name}</b><span>${p.note}${id==='kael'&&S.kaelDead?' · died on the island':''}</span></button>`).join('')}</div>
      <div class="label">2 · Lay down your evidence (${S.picked.length}/${need}) · <em>tap cards in the tray</em></div>
      ${need ? `<div class="slots">${Array.from({length:need},(_,i)=>{const c=S.picked[i];return `<div class="slot ${c?'on':''}"><small>EXHIBIT ${'ABC'[i]}</small>${c?`<span>${ico(CLUEICON[c],18)}<b>${CLUES[c].name}</b></span>`:'<i>Choose a card</i>'}</div>`}).join('')}</div>` : '<div class="nothing">Your tray is empty. You can only accuse on a hunch.</div>'}
      <div class="row"><button class="go" data-a="accuse" ${ready?'':'disabled'}>Make the accusation</button></div>
    </div></section>${notebook()}</div>`;
}

/* Evidence dock: animated cards pinned to the bottom of the screen */
function dockView(){
  if(S.screen!=='play') return '';
  const acc = S.scene==='accuse', n = S.clues.length;
  const hint = acc ? `Tap a card to lay it down as an exhibit · ${S.picked.length}/${Math.min(3,n)} chosen` : (n ? 'New evidence drops in here. Hover a card to read it.' : 'Nothing yet. Investigate a location to fill this tray.');
  const cards = S.clues.map((c,i)=>{
    const cl = CLUES[c], on = S.picked.includes(c), k = S.picked.indexOf(c), isNew = S.newClue===c;
    const rot = (((i*37)%7)-3)*.8;
    const body = `<span class="ctab"><span>FILE ${String(i+1).padStart(2,'0')} · ${SHORT[S.cluePlace[c]]||''}</span>${ico(CLUEICON[c],18)}</span><b class="ctitle">${cl.name}</b><span class="ctext">${cl.text}</span>${acc&&on?`<span class="exh">EXHIBIT ${'ABC'[k]}</span>`:''}${isNew?'<span class="newtag">NEW</span>':''}`;
    const cls = `card${isNew?' fresh':''}${on?' sel':''}`;
    return acc ? `<button class="${cls}" data-a="pickev" data-id="${c}" aria-pressed="${on}" style="--r:${rot}deg">${body}</button>`
               : `<article class="${cls}" tabindex="0" style="--r:${rot}deg">${body}</article>`;
  }).join('');
  const ghosts = n<3 ? Array.from({length:3-n},()=>'<div class="card ghostcard"><span class="ctab"><span>EMPTY SLOT</span></span><span class="ctext">Evidence will appear here.</span></div>').join('') : '';
  return `<div class="dockhead"><button class="dtog" data-a="dock" aria-expanded="${S.dockOpen}">${ico('search',16)}<b>Evidence tray</b><span class="cnt">${n}</span><span class="chev">${S.dockOpen?'▾':'▴'}</span></button><span class="hint">${hint}</span></div>
    <div class="deck" role="list">${cards}${ghosts}</div>`;
}

function endingInfo(){
  const v = verdict(), a = S.accused;
  if(a==='crane' && v.strong) return {win:true, kicker:'The truth', title:'Case Solved',
    text:"You lay three pieces of evidence on M's desk. Crane's hand tightens on his silver cane. E.C. Holdings is his company. He sold the key to Kael, used M's code to open the vault, and sent you to Monaco to blame the man he sold it to.",
    quote:['M',"Take him away. And 007... well done."]};
  if(a==='crane') return {kicker:'Right person, weak case', title:'He Walks Free',
    text:"You point at Crane, but your evidence doesn't hold together. Some of it points at other people too. Crane laughs it off, and M can't arrest her own chief of staff on a hunch.",
    quote:['Sir Edmund Crane',"Interesting theory, 007. Do let me know when you have proof."]};
  if(a==='m' && v.strong) return {kicker:'A perfect frame', title:'The Wrong Desk',
    text:"Your evidence looks airtight: her code opened the vault, and the calls went to her floor. M is suspended. Two weeks later, Crane is promoted to her job. Someone built this case for you to find.",
    quote:['Sir Edmund Crane',"A tragedy. Still, the service must go on."]};
  if(a==='m') return {kicker:'Close, but wrong', title:'Not M',
    text:"You accuse M. She's furious, and she has an alibi: she was in Washington the night of the theft. But someone used her code.",
    quote:['M',"Look at who has been standing next to me, 007."]};
  if(a==='kael') return {kicker:'The easy answer', title:'Case Closed?',
    text: S.kaelDead ? "You blame Viktor Kael, the man who died on the island. A neat story: foreign villain, big explosion, case closed. Crane congratulates you warmly. Too warmly."
                     : "You blame Viktor Kael. He's an arms dealer, so everyone believes it. Crane congratulates you warmly. Too warmly.",
    quote:['Sir Edmund Crane',"Splendid work, 007. Exactly as I said from the start."]};
  return {kicker:'Wrong person', title:'The Wrong Hands',
    text:"You accuse Elena Voss. Her flights and the missing money looked bad, but she was running from Kael, not selling secrets. The real thief is still inside MI6.",
    quote:['Elena Voss',"I showed you who was paid. You just didn't look."]};
}
function endingView(){
  const e = endingInfo();
  const reds = S.clues.filter(c=>!CLUES[c].pts.includes('crane')).length;
  const tagFor = c => { const p = CLUES[c].pts; if(p.length===1 && p[0]==='crane') return ['k','Real lead']; if(p.includes('crane')) return ['n','Narrows it down']; if(!p.length) return ['n','Clears someone']; return ['r','Red herring']; };
  return `<section class="sheet enter">
    ${still(e.win?'london':'accuse', e.win?'CASE SOLVED':'CASE OPEN')}<span class="stamp slam">${e.win?'CASE SOLVED':'CASE OPEN'}</span>
    <div class="inner">
    <div class="eyebrow"><span class="ending-kicker">${e.kicker}</span> · You accused ${SUSPECTS[S.accused].name}</div>
    <h1>${e.title}</h1>
    <p class="story">${e.text}</p>
    <blockquote class="quote">${karaoke(e.quote[1],'end')}<cite>${e.quote[0]}</cite></blockquote>
    <div class="stats">
      <div class="stat"><b>${START_HOURS - S.hours}h</b><span>hours used</span></div>
      <div class="stat"><b>${S.path.length-1}</b><span>places visited</span></div>
      <div class="stat"><b>${S.clues.length}</b><span>clues found</span></div>
      <div class="stat"><b>${reds}</b><span>red herrings or side leads</span></div>
    </div>
    <div><div class="label">The real culprit</div><p class="story" style="margin-top:4px">Sir Edmund Crane. As M's chief of staff he knew her vault code, opened the vault at 02:14 with his cane tapping, sold the key to Kael through his company E.C. Holdings, and pushed MI6 to blame the foreign arms dealer.</p></div>
    <div><div class="label">What your clues really meant</div>
      <ul class="evidence" style="margin-top:8px">${S.clues.length?S.clues.map(c=>{const [k,l]=tagFor(c);return `<li><span class="eico ${k}">${ico(CLUEICON[c],20)}</span><span><span class="tag ${k}">${l}</span> <b>${CLUES[c].name}:</b> ${CLUES[c].real}</span></li>`}).join(''):'<li>You found no clues.</li>'}</ul></div>
    <div><div class="label">Your route through the case</div>
      <div class="mapbox xl" style="margin-top:8px">${mapSvg({big:true, static:true})}</div>
      <p class="mapnote">Numbers show the order you first reached each place. Faded places were never visited.</p></div>
    <div class="theory">
      <article><h3>MDA framework</h3>
        <p>Hunicke, LeBlanc and Zubek split a game into three layers. Designers build the mechanics; players feel the aesthetics.</p>
        <table class="mda"><tbody>
          <tr><th>Mechanics</th><td>24-hour clock, travel costs, one question per place, red-herring clues, choosing 3 pieces of evidence.</td></tr>
          <tr><th>Dynamics</th><td>Deciding where to spend time, doubting authority (Crane), being misled, building a case.</td></tr>
          <tr><th>Aesthetics</th><td>Challenge, discovery, spy fantasy, and the shock of the twist.</td></tr>
        </tbody></table></article>
      <article><h3>Ludo hermeneutics</h3>
        <p>Meaning is made through play. The game never tells you who did it. The evidence cards don't label which clues are true, so the story only makes sense through how you read them.</p>
        <p>Two players can visit the same places and reach different conclusions. You ended with <b>${e.title}</b> because of how <i>you</i> interpreted what you found.</p>
      </article>
    </div>
    <div class="row"><button class="go" data-a="restart">Investigate again</button><button class="go alt" data-a="replay">Watch the briefing film</button></div>
    </div></section>`;
}
let lastKey = '';
function render(){
  let h = header();
  if(S.screen==='title') h += titleView();
  else if(S.screen==='intro') h += introView();
  else if(S.screen==='play') h += sceneView();
  else h += endingView();
  const app = document.getElementById('app'), dock = document.getElementById('dock');
  /* Same screen and scene: swap only the parts that changed, so the scene art and
     map keep animating instead of restarting on every click. */
  const key = [S.screen, S.scene, S.accused].join('|');
  if(key===lastKey && S.screen!=='intro' && app.querySelector('.sheet > .inner')){
    const t = document.createElement('template'); t.innerHTML = h;
    ['header.top', '.sheet > .inner', '.notebook .nbtop'].forEach(sel=>{ const a = app.querySelector(sel), b = t.content.querySelector(sel); if(a && b) a.replaceWith(b); });
    const am = app.querySelector('.notebook .mapbox'), bm = t.content.querySelector('.notebook .mapbox');
    if(am && bm && am.dataset.k!==bm.dataset.k) am.replaceWith(bm);
  } else app.innerHTML = h;
  lastKey = key;
  const old = dock.querySelector('.deck'), sl = old ? old.scrollLeft : 0;
  dock.innerHTML = dockView();
  const dk = dock.querySelector('.deck'); if(dk){ dk.scrollLeft = S.newClue ? dk.scrollWidth : sl; }
  const show = S.screen==='play';
  dock.hidden = !show; document.body.classList.toggle('hasdock', show); document.body.classList.toggle('dockshut', show && !S.dockOpen);
  document.body.dataset.screen = S.screen;
  S.newClue = null; S.enter = false;
}

/* =====================================================================
   EVENTS
   ===================================================================== */
function beginGame(){ hush(); clearTimeout(introTimer); clearInterval(digitTimer); S.screen='play'; S.scene='brief'; S.enter=true; musicStart(); FX.stamp(); render(); window.scrollTo({top:0,behavior:'smooth'}); sayLater(600, ()=>speak('M', SCENES.brief.quote, null, sayHook('q:brief'))); }
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-a]'); if(!b || b.disabled) return;
  const a = b.dataset.a;
  switch(a){
    case 'intro': ctx(); loadVoices(); S.screen='intro'; musicStart(); introPlay(0); break;
    case 'replay': ctx(); S = Object.assign(S.screen==='ending'?fresh():S, {screen:'intro'}); musicStart(); introPlay(0); window.scrollTo({top:0,behavior:'smooth'}); break;
    case 'skip': introSkip(); break;
    case 'skipstart': ctx(); beginGame(); break;
    case 'begin': beginGame(); break;
    case 'ask': ask(+b.dataset.i); break;
    case 'go': travel(+b.dataset.i); break;
    case 'force': forceAccuse(); break;
    case 'sus': S.suspect = b.dataset.id; FX.tick(); render(); break;
    case 'pickev': { const id=b.dataset.id, k=S.picked.indexOf(id), need=Math.min(3,S.clues.length);
      if(k>=0) S.picked.splice(k,1); else if(S.picked.length<need) S.picked.push(id); FX.tick(); render(); break; }
    case 'accuse': accuse(); break;
    case 'dock': S.dockOpen = !S.dockOpen; render(); break;
    case 'theme': THEME = THEME==='dark'?'light':'dark'; document.documentElement.dataset.theme = THEME; try{ localStorage.setItem('ltc-theme', THEME); }catch(err){} render(); break;
    case 'restart': hush(); clearTimeout(introTimer); clearInterval(digitTimer); S = fresh(); render(); window.scrollTo({top:0}); break;
    case 'tog': { const k=b.dataset.k; AUDIO[k]=!AUDIO[k];
      if(k==='music'){ if(AUDIO.music && S.screen!=='title') musicStart(); else musicStop(); }
      if(k==='voice' && !AUDIO.voice) hush();
      render(); break; }
  }
});
document.addEventListener('keydown', e=>{
  if(S.screen!=='play' || S.scene==='accuse') return;
  const sc = SCENES[S.scene], k = e.key.toLowerCase();
  if(sc.ask && S.asked[S.scene]===undefined && 'abc'.includes(k) && k.length===1){ const i='abc'.indexOf(k); if(sc.ask[i]) ask(i); return; }
  const n = parseInt(k,10);
  if(!S.timeUp && n>=1 && sc.go && n<=sc.go.length && !(S.scene==='island' && S.asked.island===undefined)) travel(n-1);
});
render();
