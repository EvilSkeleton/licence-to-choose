/* =====================================================================
   ART: layered, animated SVG scenes (all original artwork)
   Every scene is 800x280. Motion comes from CSS classes in style.css.
   ===================================================================== */
function rng(seed){ let r = seed; return () => { r = (r*9301+49297)%233280; return r/233280; }; }

function windows(seed, x0, y0, w, h, col='#f2c96b', p=.32){
  const R = rng(seed); let out = '';
  for(let x=x0+6; x<x0+w-6; x+=12) for(let y=y0+8; y<y0+h-6; y+=16){
    const v = R(); if(v < p) out += `<rect x="${x}" y="${y}" width="5" height="7" fill="${col}" opacity="${(.45+v).toFixed(2)}"${v<.05?' class="tw"':''}/>`;
  }
  return out;
}
function stars(seed, n, h=160){
  const R = rng(seed);
  return Array.from({length:n},()=>`<circle class="tw" style="animation-delay:${(R()*4).toFixed(1)}s" cx="${(R()*800).toFixed(0)}" cy="${(R()*h).toFixed(0)}" r="${(R()*1.1+.3).toFixed(1)}" fill="#fff" opacity="${(R()*.6+.3).toFixed(2)}"/>`).join('');
}
function rain(seed, n=48, col='#a9bde0', op=.45){
  const R = rng(seed); let l = '';
  for(let i=0;i<n;i++){
    const x=(R()*840-20).toFixed(0), y=(R()*280).toFixed(0), len=(8+R()*12).toFixed(0);
    l += `<line x1="${x}" y1="${y}" x2="${x-3}" y2="${+y+ +len}"/><line x1="${x}" y1="${y-280}" x2="${x-3}" y2="${y-280+ +len}"/>`;
  }
  return `<g class="rain" stroke="${col}" stroke-width="1" opacity="${op}">${l}</g>`;
}
function fog(y, cls='driftA', op=1){
  return `<g class="${cls}" opacity="${op}"><ellipse cx="200" cy="${y}" rx="280" ry="26" fill="url(#fogg)"/><ellipse cx="650" cy="${y+10}" rx="320" ry="30" fill="url(#fogg)"/></g>`;
}
function motes(seed, n, x0, x1, y0, y1){
  const R = rng(seed);
  return Array.from({length:n},()=>`<circle class="mote" style="animation-delay:${(R()*9).toFixed(1)}s;animation-duration:${(7+R()*6).toFixed(1)}s" cx="${(x0+R()*(x1-x0)).toFixed(0)}" cy="${(y0+R()*(y1-y0)).toFixed(0)}" r="${(R()*1.4+.6).toFixed(1)}" fill="#ffe9ad"/>`).join('');
}

/* People: edge-lit silhouettes. g = ground line (feet), s = scale. */
function man(x, g, s=1, o={}){
  const c = o.fill || '#05070b', rim = o.rim || 'rgba(255,226,160,.55)';
  const sh = 22*s, hem = o.long ? g-6*s : g;
  const body = `M${x-sh} ${g-116*s} Q${x} ${g-132*s} ${x+sh} ${g-116*s} L${x+27*s} ${g-58*s} ${o.long?`L${x+27*s} ${hem-30*s} L${x+22*s} ${hem}`:`L${x+19*s} ${g}`} L${x+4*s} ${g} L${x} ${g-48*s} L${x-4*s} ${g} L${x-19*s} ${g} ${o.long?`L${x-22*s} ${hem} L${x-27*s} ${hem-30*s}`:''} L${x-27*s} ${g-58*s}Z`;
  const hat = o.hat ? `<ellipse cx="${x}" cy="${g-146*s}" rx="${19*s}" ry="${3.2*s}"/><path d="M${x-11*s} ${g-146*s} q${11*s} ${-14*s} ${22*s} 0z"/>` : '';
  const cane = o.cane ? `<g class="tap" style="transform-origin:${x+31*s}px ${g-64*s}px"><line x1="${x+31*s}" y1="${g-64*s}" x2="${x+35*s}" y2="${g}" stroke="#0a0b0d" stroke-width="${3.6*s}" stroke-linecap="round"/><circle cx="${x+31*s}" cy="${g-67*s}" r="${5*s}" fill="#d3d7de" stroke="none"/><circle cx="${x+29.6*s}" cy="${g-68.4*s}" r="${1.6*s}" fill="#fff" stroke="none"/></g>` : '';
  const tie = o.tie ? `<path d="M${x-2.2*s} ${g-120*s} h${4.4*s} l${1.4*s} ${26*s} l${-3.6*s} ${5*s} l${-3.6*s} ${-5*s}z" fill="${o.tie}" stroke="none"/>` : '';
  const glass = o.glass ? `<g fill="none" stroke="#d6f6ff" stroke-width="${1.1*s}" opacity=".9"><circle cx="${x-4.6*s}" cy="${g-138*s}" r="${3.4*s}"/><circle cx="${x+4.6*s}" cy="${g-138*s}" r="${3.4*s}"/></g>` : '';
  const drink = o.drink ? `<g stroke="none"><rect x="${x+24*s}" y="${g-88*s}" width="${7*s}" height="${10*s}" fill="rgba(240,200,120,.9)"/><rect x="${x+25*s}" y="${g-87*s}" width="${2*s}" height="${8*s}" fill="rgba(255,255,255,.55)"/></g>` : '';
  const ear = o.guard ? `<rect x="${x+8*s}" y="${g-140*s}" width="${2*s}" height="${6*s}" fill="#7be0a8" stroke="none"/>` : '';
  return `<g><ellipse cx="${x}" cy="${g+2}" rx="${30*s}" ry="${4.5*s}" fill="#000" opacity=".45"/><g fill="${c}" stroke="${rim}" stroke-width="${1.1*s}" stroke-linejoin="round"><circle cx="${x}" cy="${g-138*s}" r="${11*s}"/>${hat}<path d="${body}"/>${cane}</g>${tie}${glass}${drink}${ear}</g>`;
}
function woman(x, g, s=1, o={}){
  const c = o.fill || '#05070b', rim = o.rim || 'rgba(255,226,160,.5)';
  const body = `M${x-17*s} ${g-114*s} Q${x} ${g-128*s} ${x+17*s} ${g-114*s} L${x+19*s} ${g-66*s} L${x+27*s} ${g-8*s} L${x+12*s} ${g} L${x-12*s} ${g} L${x-27*s} ${g-8*s} L${x-19*s} ${g-66*s}Z`;
  const hair = `<path d="M${x-12.5*s} ${g-134*s} q${12.5*s} ${-22*s} ${25*s} 0 v${14*s} q${-12.5*s} ${6*s} ${-25*s} 0z"/>`;
  const bag = o.case ? `<g stroke="none"><rect x="${x+20*s}" y="${g-30*s}" width="${22*s}" height="${16*s}" rx="${2*s}" fill="#2b1d12"/><rect x="${x+26*s}" y="${g-34*s}" width="${10*s}" height="${5*s}" fill="none" stroke="#7a5a30" stroke-width="${1.6*s}"/></g>` : '';
  return `<g><ellipse cx="${x}" cy="${g+2}" rx="${28*s}" ry="${4*s}" fill="#000" opacity=".45"/><g fill="${c}" stroke="${rim}" stroke-width="${1.1*s}" stroke-linejoin="round"><circle cx="${x}" cy="${g-132*s}" r="${10.5*s}"/>${hair}<path d="${body}"/></g>${bag}</g>`;
}
function bust(x, y, s=1, o={}){
  const c = o.fill || '#05070b', rim = o.rim || 'rgba(255,226,160,.5)';
  const hair = o.bob ? `<path d="M${x-15*s} ${y-62*s} q${15*s} ${-26*s} ${30*s} 0 v${18*s} q${-15*s} ${7*s} ${-30*s} 0z"/>` : '';
  const glass = o.glass ? `<g fill="none" stroke="#d6f6ff" stroke-width="${1.2*s}"><circle cx="${x-5.5*s}" cy="${y-57*s}" r="${4*s}"/><circle cx="${x+5.5*s}" cy="${y-57*s}" r="${4*s}"/><path d="M${x-1.5*s} ${y-57*s}h${3*s}"/></g><rect class="glint" x="${x-9*s}" y="${y-60*s}" width="${2*s}" height="${5*s}" fill="#fff" opacity=".0"/>` : '';
  return `<g fill="${c}" stroke="${rim}" stroke-width="${1.1*s}" stroke-linejoin="round"><circle cx="${x}" cy="${y-56*s}" r="${13*s}"/>${hair}<path d="M${x-38*s} ${y} Q${x-34*s} ${y-34*s} ${x-14*s} ${y-42*s} L${x+14*s} ${y-42*s} Q${x+34*s} ${y-34*s} ${x+38*s} ${y}Z"/></g>${glass}`;
}

function wrap(defs, body, extra=''){
  return `<svg viewBox="0 0 800 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <radialGradient id="fogg"><stop offset="0" stop-color="#a9b8d0" stop-opacity=".30"/><stop offset="1" stop-color="#a9b8d0" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffe3a0" stop-opacity="0"/></radialGradient>
    <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".42"/><stop offset="1" stop-color="#ffe3a0" stop-opacity="0"/></linearGradient>
    ${defs}</defs>${body}${extra}<rect width="800" height="280" fill="url(#vig)"/></svg>`;
}

function skyline(seed, base, minH, maxH, fill, x0=0, x1=800){
  const R = rng(seed); let x = x0, out = '';
  while(x < x1){ const w = 24+R()*40, h = minH+R()*(maxH-minH); out += `<rect x="${x.toFixed(0)}" y="${(base-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}"/>`; x += w+2; }
  return `<g fill="${fill}">${out}</g>`;
}

function art(kind, o={}){
  switch(kind){

  case 'london': return wrap(
    `<linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040613"/><stop offset=".55" stop-color="#14224a"/><stop offset="1" stop-color="#6b3b36"/></linearGradient>
     <linearGradient id="thames" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2a4a"/><stop offset="1" stop-color="#050912"/></linearGradient>`,
    `<rect width="800" height="280" fill="url(#lsky)"/>${stars(3,60,130)}
     <circle cx="120" cy="62" r="60" fill="url(#halo)" opacity=".35"/><circle cx="120" cy="62" r="22" fill="#efe3c0"/><circle cx="112" cy="56" r="5" fill="#d6c9a2" opacity=".6"/>
     ${skyline(5,236,40,95,'#0b1430')}${skyline(9,238,25,70,'#080e22',0,380)}
     <g fill="#070b1c"><rect x="380" y="178" width="170" height="60"/>${[392,420,448,476,504,530].map(x=>`<path d="M${x} 178 l8 -22 l8 22z"/>`).join('')}<rect x="544" y="94" width="32" height="146"/><rect x="538" y="84" width="44" height="30"/><rect x="546" y="60" width="28" height="26"/><path d="M546 60 L560 8 L574 60z"/><rect x="535" y="112" width="50" height="5"/>
     ${[540,579].map(x=>`<path d="M${x} 84 l3 -16 l3 16z"/>`).join('')}</g>
     ${windows(14,380,178,170,60,'#f2c96b',.35)}
     <circle cx="560" cy="99" r="16" fill="url(#halo)"/><circle cx="560" cy="99" r="11.5" fill="#f8e2a0"/>
     <g stroke="#2a1d08" stroke-width="1.6" stroke-linecap="round"><line class="spin" style="transform-origin:560px 99px;animation-duration:60s" x1="560" y1="99" x2="560" y2="90"/><line class="spin" style="transform-origin:560px 99px;animation-duration:720s" x1="560" y1="99" x2="566" y2="99"/></g>
     <rect y="236" width="800" height="44" fill="url(#thames)"/>
     <g class="shim" style="transform-origin:560px 250px"><rect x="552" y="238" width="16" height="30" fill="#f2c96b" opacity=".28"/></g><g class="shim" style="transform-origin:120px 250px"><rect x="112" y="238" width="16" height="22" fill="#efe3c0" opacity=".22"/></g>
     <g stroke="#cdd9f2" opacity=".14">${[244,252,260,268].map((y,i)=>`<line x1="${40+i*90}" y1="${y}" x2="${130+i*90}" y2="${y}"/>`).join('')}</g>
     <path d="M0 226 h800 v14 H0z" fill="#03050a"/><g fill="#03050a">${Array.from({length:9},(_,i)=>`<path d="M${i*100-6} 240 a52 30 0 0 1 104 0z"/>`).join('')}</g>
     ${[70,230,390,550,710].map(x=>`<g><rect x="${x-1}" y="196" width="2" height="30" fill="#03050a"/><circle cx="${x}" cy="196" r="14" fill="url(#halo)" opacity=".6"/><circle cx="${x}" cy="196" r="3" fill="#ffe3a0"/></g>`).join('')}
     ${man(300,226,.34,{long:1,hat:1})}${man(322,226,.3,{long:1})}`,
    `${fog(222,'driftA',.9)}${rain(21,56)}<rect class="flash" width="800" height="280" fill="#cfe0ff"/>`);

  case 'vault': return wrap(
    `<radialGradient id="vg" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#2f3744"/><stop offset="1" stop-color="#07090e"/></radialGradient>
     <radialGradient id="steel" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#7d8798"/><stop offset=".5" stop-color="#3b4352"/><stop offset="1" stop-color="#1b2029"/></radialGradient>
     <radialGradient id="inside" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#7be0a8" stop-opacity=".8"/><stop offset="1" stop-color="#7be0a8" stop-opacity="0"/></radialGradient>
     <linearGradient id="torch" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>
     <pattern id="tape" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="13" height="26" fill="#e8c23a"/><rect x="13" width="13" height="26" fill="#111"/></pattern>`,
    `<rect width="800" height="280" fill="url(#vg)"/>
     <g stroke="#0c0f15" stroke-width="3" opacity=".8">${[0,1,2,3,4,5,6,7].map(i=>`<line x1="${i*115}" y1="0" x2="${i*115}" y2="236"/>`).join('')}${[60,130,200].map(y=>`<line x1="0" y1="${y}" x2="800" y2="${y}"/>`).join('')}</g>
     <circle cx="330" cy="132" r="104" fill="#03100a"/><circle cx="330" cy="132" r="104" fill="url(#inside)"/>
     <polygon points="318,40 342,40 372,226 288,226" fill="#bff5d8" opacity=".10"/>
     <rect x="318" y="160" width="24" height="66" fill="#0a2a1c"/><rect x="310" y="154" width="40" height="7" fill="#7be0a8" opacity=".85"/><rect x="322" y="146" width="16" height="8" fill="none" stroke="#7be0a8" stroke-dasharray="2 2" opacity=".9"/>
     <circle cx="470" cy="132" r="112" fill="url(#steel)" stroke="#12161d" stroke-width="5"/><circle cx="464" cy="132" r="112" fill="none" stroke="#000" stroke-width="10" opacity=".25"/>
     <circle cx="470" cy="132" r="92" fill="none" stroke="#12161d" stroke-width="3"/>${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return `<circle cx="${(470+102*Math.cos(a)).toFixed(1)}" cy="${(132+102*Math.sin(a)).toFixed(1)}" r="4.5" fill="#222934" stroke="#7d8798" stroke-width="1"/>`}).join('')}
     <g class="spin" style="transform-origin:470px 132px;animation-duration:60s"><circle cx="470" cy="132" r="64" fill="#2a303b" stroke="#8b94a6" stroke-width="2"/><g stroke="#9aa4b7" stroke-width="7" stroke-linecap="round"><line x1="470" y1="76" x2="470" y2="188"/><line x1="414" y1="132" x2="526" y2="132"/><line x1="430" y1="92" x2="510" y2="172"/><line x1="510" y1="92" x2="430" y2="172"/></g><circle cx="470" cy="132" r="17" fill="#161a21" stroke="#9aa4b7" stroke-width="2"/></g>
     <rect x="620" y="92" width="56" height="84" rx="4" fill="#0c1016" stroke="#4a5262"/><rect x="628" y="100" width="40" height="14" fill="#06251a"/><text x="648" y="111" fill="#7be0a8" font-family="Courier New,monospace" font-size="11" text-anchor="middle" class="blink">02:14</text>
     <g fill="#7be0a8">${[0,1,2,3].map(r=>[0,1,2].map(c=>`<rect x="${628+c*14}" y="${120+r*13}" width="10" height="8" rx="1" opacity="${(r+c)%3?.55:.95}"/>`).join('')).join('')}</g>
     <rect y="226" width="800" height="54" fill="#0a0d12"/><rect y="226" width="800" height="2" fill="#4a5262" opacity=".6"/>
     <rect y="262" width="800" height="12" fill="url(#tape)" opacity=".85"/>
     <g transform="translate(250 240)"><ellipse rx="4" ry="2" fill="#c9a24a"/><path class="glint" d="M0 -9 L1.2 -1.2 L9 0 L1.2 1.2 L0 9 L-1.2 1.2 L-9 0 L-1.2 -1.2z" fill="#fff3c4"/></g>
     ${o.thief ? `<g class="walkout">${man(300,232,.74,{fill:'#010203',rim:'rgba(123,224,168,.35)'})}</g>` : `
     <g class="sweep" style="transform-origin:96px 38px;animation-duration:2.2s"><polygon points="96,38 -40,16 -40,66" fill="#ff4a3a" opacity=".32"/><polygon points="96,38 232,16 232,66" fill="#ff4a3a" opacity=".32"/></g>
     <circle class="alarm" cx="96" cy="38" r="46" fill="#d42a1e" opacity=".5"/><circle cx="96" cy="38" r="10" fill="#ff5b4a"/><rect x="84" y="46" width="24" height="8" fill="#222"/>
     <g class="sweepS" style="transform-origin:142px 200px"><polygon points="142,200 300,212 300,246" fill="url(#torch)"/></g>${man(122,246,.62,{guard:1})}<rect x="136" y="196" width="9" height="5" rx="1" fill="#222" transform="rotate(8 140 198)"/>`}`,
    `${fog(238,'driftB',.55)}`);

  case 'office': case 'craneoffice': case 'accuse': {
    const isC = kind==='craneoffice', isA = kind==='accuse';
    const both = isA || o.cast==='both';
    const board = isA ? `<rect x="470" y="30" width="290" height="166" rx="3" fill="#4b3a27" stroke="#2a1e12" stroke-width="4"/><g fill="#efe6cf">${[[492,48],[590,44],[680,58],[520,116],[640,120]].map(([x,y],i)=>`<g transform="rotate(${[-3,2,-2,3,-1][i]} ${x+26} ${y+20})"><rect x="${x}" y="${y}" width="52" height="50"/><rect x="${x+4}" y="${y+4}" width="44" height="32" fill="#3a3a3a"/>${i===4?`<text x="${x+26}" y="${y+28}" fill="#efe6cf" font-family="Georgia,serif" font-size="20" text-anchor="middle">?</text>`:`<circle cx="${x+26}" cy="${y+16}" r="6" fill="#111"/><path d="M${x+14} ${y+36} q12 -16 24 0z" fill="#111"/>`}<text x="${x+26}" y="${y+46}" fill="#2a2a2a" font-family="Courier New,monospace" font-size="7.5" font-weight="700" text-anchor="middle">${['KAEL','CRANE','M','VOSS','THE KEY'][i]}</text></g>`).join('')}</g>
      <g stroke="#e0382c" stroke-width="2" fill="none" stroke-dasharray="130" stroke-dashoffset="130" class="drawin"><path d="M518 69 L616 65 L706 79"/><path d="M546 137 L666 141"/><path d="M616 65 L666 141"/><path d="M518 69 L546 137"/></g>${[[518,69],[616,65],[706,79],[546,137],[666,141]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="#e0382c"/>`).join('')}` : '';
    const win = !isC ? `<clipPath id="wclip"><rect x="46" y="30" width="200" height="148"/></clipPath><rect x="46" y="30" width="200" height="148" fill="#0b1226"/><g clip-path="url(#wclip)">${stars(7,24,90)}${skyline(31,178,30,90,'#070b18',46,246)}${windows(23,46,100,200,78,'#f2c96b',.2)}${rain(33,26)}<rect class="flash" x="46" y="30" width="200" height="148" fill="#cfe0ff"/></g><g stroke="#140f0a" stroke-width="5"><line x1="146" y1="30" x2="146" y2="178"/><line x1="46" y1="104" x2="246" y2="104"/></g><rect x="40" y="24" width="212" height="160" fill="none" stroke="#2a1f14" stroke-width="8"/>` : '';
    const cr = isC ? `
      <rect x="520" y="40" width="240" height="150" fill="#1a1510" stroke="#0e0b08" stroke-width="3"/>${[[536,54,54,40],[606,60,50,36],[670,52,70,48],[546,114,40,60],[600,118,64,60]].map(([x,y,w,h],i)=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c8b48a" opacity=".75"/><rect x="${x+4}" y="${y+4}" width="${w-8}" height="${h-8}" fill="#2a241c"/><circle cx="${x+w/2}" cy="${y+h*.42}" r="${Math.min(w,h)*.16}" fill="#c8b48a" opacity=".5"/></g>`).join('')}
      <g fill="#241a12"><rect x="40" y="40" width="190" height="150"/></g>${[0,1,2,3].map(r=>`<g>${Array.from({length:11},(_,i)=>`<rect x="${46+i*16}" y="${48+r*36}" width="${11+(i*r%3)}" height="${28-(i%4)*2}" fill="${['#6b2a2a','#2a4a6b','#3a5a3a','#7a5a30','#4a3a5a'][(i+r)%5]}" transform="translate(0 ${(i%4)*2})"/>`).join('')}<rect x="42" y="${80+r*36-4}" width="186" height="3" fill="#0e0a07"/></g>`).join('')}` : '';
    return wrap(
    `<linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1510"/><stop offset="1" stop-color="#33241a"/></linearGradient>
     <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a281a"/><stop offset="1" stop-color="#150e08"/></linearGradient>`,
    `<rect width="800" height="280" fill="url(#og)"/><rect y="204" width="800" height="76" fill="#0d0907"/>
     <g opacity=".5" stroke="#120c08" stroke-width="2">${[0,1,2,3,4,5,6,7,8,9].map(i=>`<line x1="${i*90}" y1="0" x2="${i*90}" y2="204"/>`).join('')}</g>
     ${win}${cr}${board}
     ${(()=>{const cx=isC?300:430;return `<g><circle cx="${cx}" cy="52" r="20" fill="#0d0a07" stroke="#8a6a1c" stroke-width="3"/><circle cx="${cx}" cy="52" r="16" fill="#e8dcb8"/>${[0,3,6,9].map(h=>`<rect x="${cx-.8}" y="38" width="1.6" height="3" fill="#555" transform="rotate(${h*30} ${cx} 52)"/>`).join('')}<line class="spin" style="transform-origin:${cx}px 52px;animation-duration:60s" x1="${cx}" y1="52" x2="${cx}" y2="40" stroke="#222" stroke-width="2"/><line class="spin" style="transform-origin:${cx}px 52px;animation-duration:720s" x1="${cx}" y1="52" x2="${cx+8}" y2="52" stroke="#222" stroke-width="2"/></g>`})()}
     ${(()=>{const px=isC?415:332, py=isC?96:100;return `<line x1="${px}" y1="0" x2="${px}" y2="${py-14}" stroke="#0e0a07" stroke-width="2"/><polygon points="${px-38},${py} ${px-116},214 ${px+116},214 ${px+38},${py}" fill="url(#cone)"/><path d="M${px-40} ${py} q40 -30 80 0z" fill="#2a1f14" stroke="#8a6a3a" stroke-width="1"/><ellipse cx="${px}" cy="${py}" rx="38" ry="3.5" fill="#ffe3a0" opacity=".9"/>`})()}
     ${isC ? '' : bust(380,214,1.12,{bob:1})}${isC ? '' : `<g transform="rotate(-5 470 206)"><rect x="446" y="200" width="54" height="10" fill="#8a1c1c"/><rect x="452" y="203" width="22" height="2.4" fill="#f3ead2" opacity=".85"/></g>`}
     <rect x="${isC?260:210}" y="212" width="${isC?300:360}" height="68" fill="url(#wood)"/><rect x="${isC?260:210}" y="212" width="${isC?300:360}" height="3" fill="#8a6a3a" opacity=".7"/>
     <g><rect x="${isC?318:262}" y="196" width="26" height="6" fill="#0a1a10" rx="2"/><path d="M${isC?331:275} 196 v-24 l-16 -4 h32z" fill="#1c5a38"/><rect x="${isC?328:272}" y="168" width="6" height="2" fill="#7be0a8" opacity=".8"/></g>
     ${isC ? `<rect x="420" y="203" width="46" height="9" fill="#7a5a30"/><rect x="426" y="206" width="34" height="3" fill="#c9a24a"/><rect x="480" y="204" width="30" height="8" fill="#e8dcb8" opacity=".6"/>
              <g><path d="M338 262 l-6 -34 h42 l-6 34z" fill="#0c0a08" stroke="#3a3026"/><g stroke="#efe6cf" opacity=".7">${[0,1,2,3,4].map(i=>`<line x1="${340+i*7}" y1="${226-(i%2)*6}" x2="${344+i*7}" y2="${238}"/>`).join('')}</g></g>
              <g><rect x="676" y="70" width="84" height="196" fill="#160f0a" stroke="#0a0705" stroke-width="3"/><rect x="684" y="256" width="68" height="4" fill="#ffe3a0" opacity=".85"/><rect class="step" x="690" y="256" width="9" height="4" fill="#06040a"/><rect class="step" style="animation-delay:.25s" x="716" y="256" width="9" height="4" fill="#06040a"/><circle cx="740" cy="170" r="3" fill="#c9a24a"/></g>
              <g><g stroke="#0d0906" stroke-width="4" stroke-linecap="round"><line x1="626" y1="118" x2="626" y2="258"/><line x1="610" y1="262" x2="642" y2="262"/><line x1="626" y1="126" x2="612" y2="112"/><line x1="626" y1="126" x2="640" y2="112"/></g><ellipse cx="610" cy="114" rx="13" ry="2.5" fill="#0d0906"/><path d="M601 114 q9 -16 18 0z" fill="#0d0906"/><path d="M640 112 q8 4 10 26 l4 74 q-12 7 -26 0 l3 -74 q2 -22 9 -26z" fill="#1a130d" stroke="#2c2117"/><rect x="588" y="236" width="18" height="26" fill="#0d0906" stroke="#2c2117"/><line x1="592" y1="236" x2="590" y2="214" stroke="#0d0906" stroke-width="2.5"/><path d="M590 214 q-6 -4 -2 -9" fill="none" stroke="#0d0906" stroke-width="2.5"/></g>${motes(5,16,330,520,120,210)}` : ''}
     ${both ? `<g class="enter">${man(isA?640:610,262,1.12,{cane:1,long:1,tie:'#7a1c1c'})}</g>` : ''}
     ${isA ? man(158,262,1.02,{glass:1,fill:'#05070b'}) : ''}`,
    `${isC ? '' : fog(236,'driftB',.4)}`);
  }

  case 'qlab': return wrap(
    `<linearGradient id="qbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05161d"/><stop offset="1" stop-color="#020a0e"/></linearGradient>
     <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4fe0cf" stop-opacity="0"/><stop offset=".5" stop-color="#4fe0cf" stop-opacity=".5"/><stop offset="1" stop-color="#4fe0cf" stop-opacity="0"/></linearGradient>`,
    `<rect width="800" height="280" fill="url(#qbg)"/>
     <g stroke="#0f3542" opacity=".8">${Array.from({length:20},(_,i)=>`<line x1="${i*42}" y1="0" x2="${i*42}" y2="280"/>`).join('')}${Array.from({length:7},(_,i)=>`<line x1="0" y1="${i*42}" x2="800" y2="${i*42}"/>`).join('')}</g>
     ${[[40,40],[560,40]].map(([x,y],k)=>`<g><rect x="${x}" y="${y}" width="200" height="118" rx="4" fill="#07202a" stroke="#2fb3a7"/>
        <polyline class="march" fill="none" stroke="#4fe0cf" stroke-width="2" stroke-dasharray="7 4" points="${Array.from({length:20},(_,i)=>`${x+10+i*9.5},${y+66+Math.sin(i*(k+1.6)*.8)*30*((i%3)?.6:1)}`).join(' ')}"/>
        ${[0,1,2,3,4,5].map(i=>`<rect class="bar" style="animation-delay:${i*.3}s;transform-origin:${x+16+i*14}px ${y+108}px" x="${x+12+i*14}" y="${y+84}" width="8" height="24" fill="#2fb3a7" opacity=".75"/>`).join('')}
        <text x="${x+10}" y="${y+16}" fill="#4fe0cf" font-family="Courier New,monospace" font-size="9" opacity=".8">${k?'TRACE // HALO-7':'SIGNAL // 0214'}</text></g>`).join('')}
     <rect class="scanv" x="40" y="40" width="720" height="3" fill="url(#beam)"/>
     <g transform="translate(400 88) scale(.9)"><circle r="62" fill="#07202a" stroke="#2fb3a7" opacity=".9"/><circle r="62" fill="url(#halo)" opacity=".0"/>
       <g fill="none" stroke="#4fe0cf" stroke-width="1.2" opacity=".85"><circle r="62"/><line x1="-62" y1="0" x2="62" y2="0"/><path d="M-55 -28 Q0 -18 55 -28 M-55 28 Q0 38 55 28"/>${[0,1,2,3].map(k=>`<ellipse cx="0" cy="0" rx="62" ry="62"><animate attributeName="rx" values="62;0;62" dur="8s" begin="-${k*2}s" repeatCount="indefinite"/></ellipse>`).join('')}</g><circle class="blink" cx="18" cy="-22" r="3.5" fill="#ff5b4a"/><circle class="ring" cx="18" cy="-22" r="6" fill="none" stroke="#ff5b4a"/>
       <g class="spin" style="animation-duration:9s;animation-direction:reverse" fill="none" stroke="#7bf0e4" stroke-width="1" stroke-dasharray="3 5"><circle r="74"/></g></g>
     <g font-family="Courier New,monospace" font-size="10" fill="#4fe0cf">${[270,300,330,490,520,550].map((x,i)=>`<text class="fall" style="animation-delay:${i*.7}s;animation-duration:${4+i*.5}s" x="${x}" y="60">${['0A','F3','7C','D1','9E','42'][i]}<tspan x="${x}" dy="12">${['E1','55','B9','3A','C0','8F'][i]}</tspan><tspan x="${x}" dy="12">${['7D','A2','19','FE','63','D4'][i]}</tspan></text>`).join('')}</g>
     <rect y="214" width="800" height="66" fill="#04090c"/><rect y="214" width="800" height="3" fill="#2fb3a7" opacity=".6"/>
     ${[60,100,140,620,660,700].map((x,i)=>`<circle class="${i%2?'blink':'alarm'}" style="animation-delay:${i*.3}s" cx="${x}" cy="232" r="3" fill="${i%3?'#4fe0cf':'#ff6b5a'}"/>`).join('')}
     <g stroke="#2fb3a7" fill="#0a1a20"><rect x="520" y="196" width="60" height="18"/><rect x="590" y="200" width="30" height="14" rx="7"/><circle cx="650" cy="204" r="10"/><path d="M652 204 l8 -8" /></g>
     ${bust(400,282,1.25,{glass:1,rim:'rgba(79,224,207,.7)'})}`,
    `${fog(250,'driftB',.35)}`);

  case 'casino': return wrap(
    `<radialGradient id="cg" cx=".5" cy=".25" r=".9"><stop offset="0" stop-color="#5a1820"/><stop offset="1" stop-color="#110306"/></radialGradient>
     <radialGradient id="felt" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#17644a"/><stop offset="1" stop-color="#07271c"/></radialGradient>`,
    `<rect width="800" height="280" fill="url(#cg)"/>
     <g fill="#2a0a10" opacity=".9">${[60,200,600,740].map(x=>`<rect x="${x}" y="0" width="34" height="230"/>`).join('')}</g><g fill="#c9a24a" opacity=".5">${[60,200,600,740].map(x=>`<rect x="${x-3}" y="30" width="40" height="5"/><rect x="${x-3}" y="200" width="40" height="5"/>`).join('')}</g>
     <g transform="translate(400 0)"><line x1="0" y1="0" x2="0" y2="14" stroke="#c9a24a"/><ellipse cy="24" rx="92" ry="12" fill="none" stroke="#c9a24a" stroke-width="3"/><ellipse cy="24" rx="92" ry="12" fill="url(#halo)" opacity=".35"/>
       ${Array.from({length:15},(_,i)=>{const a=i/14*Math.PI;const x=(-92*Math.cos(a)).toFixed(0),y=(24+12*Math.sin(a)).toFixed(0);return `<circle class="tw" style="animation-delay:${(i*.23).toFixed(2)}s" cx="${x}" cy="${y}" r="3.4" fill="#ffe3a0"/><path d="M${x} ${+y+2} l-2 10 l2 -2 l2 2z" fill="#ffe3a0" opacity=".7"/>`}).join('')}</g>
     <text class="flick" x="104" y="38" fill="#ff5fa0" font-family="Special Elite,Courier New,monospace" font-size="22" letter-spacing="6" style="filter:drop-shadow(0 0 6px #ff5fa0)">CASINO</text>
     <g opacity=".9"><rect x="560" y="70" width="60" height="100" rx="5" fill="#16060a" stroke="#c9a24a"/><rect x="568" y="80" width="44" height="30" fill="#2a0a10"/><text class="blink" x="590" y="101" fill="#ffe3a0" font-family="Courier New,monospace" font-size="16" text-anchor="middle">777</text></g>
     <g>${man(180,196,.95,{guard:1,fill:'#080406'})}${man(630,196,.95,{guard:1,fill:'#080406'})}</g>
     <ellipse cx="400" cy="250" rx="360" ry="62" fill="url(#felt)" stroke="#6b4a1c" stroke-width="12"/><ellipse cx="400" cy="250" rx="352" ry="56" fill="none" stroke="#c9a24a" stroke-width="1" opacity=".5"/>
     ${man(400,216,1.1,{drink:1,tie:'#a01c24',fill:'#06070a'})}
     <g transform="translate(250 244)"><ellipse rx="52" ry="15" fill="#2a1a10" stroke="#c9a24a"/><ellipse class="march" style="animation-duration:.5s" rx="40" ry="11" fill="none" stroke="#e8dcb8" stroke-dasharray="6 5" stroke-width="6" opacity=".8"/><circle r="2.8" fill="#fff"><animateMotion dur="1.2s" repeatCount="indefinite" path="M-46 0 a46 12.5 0 1 0 92 0 a46 12.5 0 1 0 -92 0"/></circle><ellipse rx="14" ry="4" fill="#c9a24a"/></g>
     <g>${[[470,248],[484,246],[470,242],[540,252],[552,250]].map(([x,y],i)=>`<g><ellipse cx="${x}" cy="${y+4}" rx="12" ry="4" fill="#000" opacity=".4"/><ellipse cx="${x}" cy="${y}" rx="11" ry="4" fill="${['#b3242a','#111','#c9a24a','#b3242a','#111'][i]}" stroke="#f4efe2" stroke-width="1"/></g>`).join('')}</g>
     <g fill="#f4efe2" stroke="#222"><rect x="330" y="232" width="22" height="30" transform="rotate(-12 341 247)"/><rect x="352" y="230" width="22" height="30" transform="rotate(4 363 245)"/></g>
     <g stroke="#dcd4c4" stroke-width="2" fill="none" opacity=".55"><path class="smoke" d="M352 142 q-8 -14 4 -26 q10 -12 -2 -26"/><path class="smoke" style="animation-delay:1.8s" d="M352 142 q8 -14 -4 -26 q-10 -12 2 -26"/></g><line x1="369" y1="150" x2="355" y2="146" stroke="#6a4424" stroke-width="3.4" stroke-linecap="round"/><circle class="alarm" style="animation-duration:2s" cx="354" cy="146" r="2" fill="#ff8a3a"/>`,
    `${fog(180,'driftA',.5)}`);

  case 'harbour': return wrap(
    `<linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c1c"/><stop offset=".55" stop-color="#1c3556"/><stop offset="1" stop-color="#0a1626"/></linearGradient>
     <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16294a"/><stop offset="1" stop-color="#050a14"/></linearGradient>`,
    `<rect width="800" height="280" fill="url(#hg)"/>${stars(4,40,110)}<circle cx="640" cy="54" r="46" fill="url(#halo)" opacity=".28"/><circle cx="640" cy="54" r="19" fill="#efe3c0"/>
     <path d="M0 150 Q100 90 220 120 T440 100 T660 118 T800 96 V170 H0z" fill="#0a1428"/>${windows(55,0,100,800,60,'#f2c96b',.16)}
     <g fill="#060b17">${[[30,128,60,40],[120,116,50,52],[200,124,70,46],[300,110,54,58],[390,120,66,48],[500,108,50,60],[580,122,64,46],[670,112,56,56],[740,126,60,44]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}</g>
     ${windows(61,0,110,800,60,'#ffd98a',.3)}
     <rect y="172" width="800" height="108" fill="url(#sea)"/>
     <g class="bob"><path d="M100 196 h250 l-30 28 h-190z" fill="#04080f"/><rect x="150" y="170" width="140" height="26" fill="#04080f"/><rect x="190" y="152" width="66" height="18" fill="#04080f"/><line x1="224" y1="152" x2="224" y2="104" stroke="#04080f" stroke-width="3"/><circle class="blink" cx="224" cy="104" r="3" fill="#ff5b4a"/>${windows(71,150,172,140,24,'#ffe3a0',.5)}</g>
     <g class="bob" style="animation-delay:1.2s"><path d="M430 200 h220 l-26 24 h-170z" fill="#04080f"/><rect x="480" y="176" width="104" height="24" fill="#04080f"/><line x1="548" y1="176" x2="548" y2="110" stroke="#04080f" stroke-width="3"/><path d="M548 114 l36 56 h-36z" fill="#0b1426"/><circle cx="548" cy="108" r="3" fill="#ffe3a0"/></g>
     <g stroke="#f2c96b" opacity=".35">${[[120,236],[190,244],[470,238],[560,246],[640,240]].map(([x,y],i)=>`<line class="shim" style="transform-origin:${x+20}px ${y}px;animation-delay:${i*.4}s" x1="${x}" y1="${y}" x2="${x+40}" y2="${y}"/>`).join('')}</g>
     <g transform="translate(0 236)"><g class="approach"><path d="M-40 6 q20 -4 40 0" stroke="#cdd9f2" stroke-width="1.5" opacity=".45" fill="none"/><path d="M0 0 h40 l-7 8 h-28z" fill="#04080f"/><rect x="10" y="-7" width="14" height="7" fill="#04080f"/><circle cx="40" cy="2" r="2.2" fill="#ffe3a0"/><polygon points="40,2 90,-6 90,10" fill="#ffe3a0" opacity=".14"/></g></g>
     <rect x="490" y="214" width="310" height="66" fill="#0a0806"/><rect x="490" y="214" width="310" height="3" fill="#6b5a3a"/>
     ${[520,660,770].map(x=>`<g><rect x="${x-1}" y="146" width="2" height="68" fill="#05070b"/><circle cx="${x}" cy="146" r="22" fill="url(#halo)" opacity=".55"/><circle cx="${x}" cy="146" r="3.5" fill="#ffe3a0"/></g>`).join('')}
     ${woman(566,262,1.12,{case:1})}`,
    `${fog(214,'driftA',.8)}${rain(81,24,'#b9c8e6',.28)}`);

  case 'yacht': return wrap(
    `<linearGradient id="yw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b0f08"/><stop offset=".5" stop-color="#3a2414"/><stop offset="1" stop-color="#150a05"/></linearGradient>
     <clipPath id="port"><circle cx="632" cy="104" r="52"/></clipPath>`,
    `<rect width="800" height="280" fill="url(#yw)"/>
     <g stroke="#0f0804" stroke-width="3" opacity=".8">${Array.from({length:14},(_,i)=>`<line x1="${i*60}" y1="0" x2="${i*60}" y2="240"/>`).join('')}</g>
     <circle cx="632" cy="104" r="62" fill="#a9843a"/><circle cx="632" cy="104" r="56" fill="#0b1a2e"/>
     <g clip-path="url(#port)"><rect x="570" y="52" width="124" height="104" fill="#0f2442"/><circle cx="662" cy="80" r="14" fill="#efe3c0"/><g class="bob" style="animation-duration:3s">${[0,1,2,3,4].map(i=>`<path d="M560 ${100+i*14} q15 -8 30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#6f9ad0" stroke-width="2" opacity="${.65-i*.1}"/>`).join('')}</g></g>
     <circle cx="632" cy="104" r="56" fill="none" stroke="#c9a24a" stroke-width="5"/>
     <g class="swing" style="transform-origin:400px 0px"><line x1="400" y1="0" x2="400" y2="56" stroke="#8a6a3a" stroke-width="2"/><path d="M376 74 q24 -30 48 0z" fill="#c9a24a"/><circle cx="400" cy="76" r="5" fill="#fff6c8"/><polygon points="392,78 408,78 520,250 280,250" fill="url(#cone)" opacity=".85"/></g>
     <rect y="236" width="800" height="44" fill="#0c0603"/><rect y="236" width="800" height="3" fill="#5a3a1c"/>
     <g><rect x="250" y="186" width="78" height="60" rx="6" fill="#1a0f08" stroke="#6b4a2a"/><rect x="254" y="238" width="6" height="12" fill="#1a0f08"/><rect x="318" y="238" width="6" height="12" fill="#1a0f08"/>${bust(289,238,1.05,{fill:'#07090d',rim:'rgba(255,226,160,.65)'})}
        <g stroke="#a9843a" stroke-width="3" opacity=".95"><line x1="258" y1="204" x2="320" y2="230"/><line x1="258" y1="230" x2="320" y2="204"/><line x1="256" y1="217" x2="322" y2="217"/></g></g>
     <g>${man(500,246,1.12,{drink:1,tie:'#a01c24'})}<polygon points="520,248 640,248 770,260 640,262" fill="#000" opacity=".28"/></g>
     <g><rect x="410" y="196" width="34" height="50" fill="#1a0f08" stroke="#6b4a2a"/><rect x="418" y="176" width="9" height="20" fill="#2f6a4a" opacity=".85"/><ellipse cx="430" cy="196" rx="8" ry="3" fill="#cfe9d8" opacity=".5"/></g>`,
    `${fog(246,'driftB',.35)}`);

  case 'island': return wrap(
    `<linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150b27"/><stop offset=".55" stop-color="#6a2c3e"/><stop offset=".85" stop-color="#e0703a"/><stop offset="1" stop-color="#ffb86a"/></linearGradient>
     <linearGradient id="isea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5532f"/><stop offset=".3" stop-color="#2a1a2f"/><stop offset="1" stop-color="#07050c"/></linearGradient>
     <radialGradient id="lava" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a"/><stop offset=".5" stop-color="#ff5b2a" stop-opacity=".8"/><stop offset="1" stop-color="#ff5b2a" stop-opacity="0"/></radialGradient>`,
    `<rect width="800" height="280" fill="url(#ig)"/>${stars(8,26,70)}<circle cx="120" cy="190" r="70" fill="#ffd28a" opacity=".5"/><circle cx="120" cy="190" r="34" fill="#ffe7b0"/>
     <path d="M0 220 L140 176 L240 196 L360 70 L420 60 L500 150 L580 130 L800 220z" fill="#0a0710"/>
     <circle class="alarm" cx="390" cy="66" r="34" fill="url(#lava)" style="animation-duration:2.4s"/><path d="M372 66 q18 -10 36 0 l-6 8 h-24z" fill="#ff7a3a" opacity=".9"/>
     <g stroke="#2a2030" fill="none" opacity=".8" stroke-width="10" stroke-linecap="round"><path class="smoke" d="M392 56 q-10 -20 6 -40"/><path class="smoke" style="animation-delay:2s" d="M388 56 q14 -22 -4 -42"/></g>
     <g fill="#0f0b16"><rect x="470" y="150" width="150" height="62"/><rect x="494" y="124" width="20" height="26"/><rect x="560" y="132" width="40" height="18"/></g>${windows(17,470,150,150,62,'#ffd98a',.4)}
     <g stroke="#ffd98a" stroke-width="1.5" fill="none" opacity=".7"><ellipse cx="594" cy="150" rx="20" ry="4"/></g><text x="594" y="153" fill="#ffd98a" font-family="Arial,sans-serif" font-weight="700" font-size="7" text-anchor="middle" opacity=".8">H</text>
     <g class="run">${man(520,150,.24,{fill:'#000',rim:'rgba(255,190,120,.8)'})}</g>
     <g class="sweep" style="transform-origin:504px 124px;animation-duration:6s"><polygon points="504,124 330,60 330,150" fill="#fff6c8" opacity=".16"/></g>
     <circle class="alarm" cx="504" cy="122" r="5" fill="#ff5b4a"/><circle class="alarm" cx="504" cy="122" r="22" fill="#ff5b4a" opacity=".4"/>
     <g transform="translate(660 82)"><g class="bob" style="animation-duration:1.6s"><ellipse rx="34" ry="12" fill="#07050c"/><path d="M30 -2 l44 -4 v6 l-44 4z" fill="#07050c"/><rect x="-6" y="-17" width="12" height="6" fill="#07050c"/><rect class="flick" style="animation-duration:.18s;transform-origin:0 -17px" x="-60" y="-19" width="120" height="2.5" fill="#07050c"/><circle cx="-22" cy="4" r="3" fill="#ffe3a0"/><polygon points="-22,4 -60,40 -4,40" fill="#ffe3a0" opacity=".16"/></g></g>
     <rect y="214" width="800" height="66" fill="url(#isea)"/>
     <g stroke="#ffcf8a" opacity=".5">${[[60,226],[150,236],[330,230],[450,240],[560,232],[690,242]].map(([x,y],i)=>`<line class="shim" style="transform-origin:${x+20}px ${y}px;animation-delay:${i*.35}s" x1="${x}" y1="${y}" x2="${x+44}" y2="${y}"/>`).join('')}</g>
     <g fill="#05030a"><path d="M20 280 q8 -90 16 -150 l5 0 q-5 60 -3 150z"/><path d="M36 130 q-34 -6 -52 26 q30 -14 52 -6z M36 130 q4 -34 36 -42 q-20 18 -30 44z M36 130 q38 -4 60 22 q-34 -10 -58 -6z"/><path d="M780 280 q-8 -80 -14 -130 l-5 0 q4 50 3 130z"/><path d="M764 150 q30 -2 46 24 q-26 -12 -46 -10z M764 150 q-2 -30 -30 -38 q16 16 24 40z"/></g>
     <g transform="translate(400 262)"><rect x="-64" y="-18" width="128" height="30" rx="3" fill="#06040a" stroke="#ff5b4a"/><text class="flick" x="0" y="5" fill="#ff5b4a" font-family="Courier New,monospace" font-size="22" text-anchor="middle" letter-spacing="3">00:59</text></g>`,
    `${fog(232,'driftA',.5)}`);

  case 'orbit': return wrap(
    `<radialGradient id="earth" cx=".5" cy=".5" r=".5"><stop offset=".92" stop-color="#0b2a5a"/><stop offset=".97" stop-color="#4fa0ff"/><stop offset="1" stop-color="#4fa0ff" stop-opacity="0"/></radialGradient>
     <radialGradient id="eg" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="#14407a"/><stop offset="1" stop-color="#030a18"/></radialGradient>`,
    `<rect width="800" height="280" fill="#02040c"/>${stars(12,120,280)}
     <circle cx="400" cy="560" r="360" fill="url(#earth)" opacity=".7"/><circle cx="400" cy="560" r="330" fill="url(#eg)"/>
     <g fill="#ffd98a">${Array.from({length:60},(_,i)=>{const R=rng(i*7+3);const x=120+R()*560;const y=240+R()*40;return `<circle class="tw" style="animation-delay:${(R()*3).toFixed(1)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(R()+.5).toFixed(1)}" opacity=".8"/>`}).join('')}</g>
     <path id="orb" d="M-40 190 Q400 20 840 190" fill="none" stroke="#7bb8ff" stroke-width="1.2" stroke-dasharray="4 6" opacity=".6"/>
     <g><g><circle r="30" fill="none" stroke="#ff5b4a" opacity=".6" class="ring"/><circle r="30" fill="none" stroke="#ff5b4a" opacity=".6" class="ring" style="animation-delay:.8s"/>
        <rect x="-9" y="-6" width="18" height="12" fill="#cfd5e0" stroke="#fff"/><rect x="-34" y="-5" width="22" height="10" fill="#2f5aa8" stroke="#8fb6ff"/><rect x="12" y="-5" width="22" height="10" fill="#2f5aa8" stroke="#8fb6ff"/><path d="M0 -6 v-9 M-5 -15 h10" stroke="#fff"/><circle class="alarm" cx="0" cy="0" r="3" fill="#ff5b4a"/></g>
        <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#orb"/></animateMotion></g>
     `);

  case 'flight': return wrap(
    `<linearGradient id="fbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07101e"/><stop offset="1" stop-color="#030610"/></linearGradient>`,
    `<rect width="800" height="280" fill="url(#fbg)"/>
     <g stroke="#14304f" opacity=".8">${Array.from({length:21},(_,i)=>`<line x1="${i*40}" y1="0" x2="${i*40}" y2="280"/>`).join('')}${Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*40}" x2="800" y2="${i*40}"/>`).join('')}</g>
     <path d="M60 80 Q120 50 190 78 Q230 110 200 150 Q150 170 100 150 Q50 130 60 80z M250 40 L700 30 L760 120 L640 190 L560 180 Q480 200 420 170 Q360 150 330 100 Q290 70 250 40z" fill="#0d2038" stroke="#1d3f66"/>
     <path id="fl" d="M215 112 Q400 -20 585 168" fill="none" stroke="#d8b768" stroke-width="2" stroke-dasharray="5 6"/>
     ${[[215,112,'LONDON'],[585,168,'MONACO']].map(([x,y,l])=>`<g><circle class="ring" cx="${x}" cy="${y}" r="16" fill="none" stroke="#e0554a"/><circle cx="${x}" cy="${y}" r="5" fill="#e0554a"/><text x="${x}" y="${y+28}" fill="#d8b768" font-family="Courier New,monospace" font-size="12" text-anchor="middle" letter-spacing="3">${l}</text></g>`).join('')}
     <g><path d="M-9 0 L-3 -2.4 L-2 -9 L1.4 -9 L2.4 -2.4 L9 0 L2.4 2.4 L1.4 9 L-2 9 L-3 2.4z" fill="#f3ead2"/><animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto"><mpath href="#fl"/></animateMotion></g>
     `);

  case 'title': return wrap('',
    `<rect width="800" height="280" fill="#040405"/><g fill="none" stroke="#d8b768" opacity=".28">${[34,70,110,150,196].map((r,i)=>`<circle class="ring" style="animation-delay:${i*.5}s" cx="400" cy="140" r="${r}"/>`).join('')}</g>
     <g class="spin" style="transform-origin:400px 140px;animation-duration:18s" stroke="#d8b768" opacity=".35"><line x1="400" y1="-40" x2="400" y2="320"/><line x1="220" y1="140" x2="580" y2="140"/></g>`);
  }
  return wrap('', '<rect width="800" height="280" fill="#05070b"/>');
}
