/* =====================================================================
   ICONS + CASE MAP
   ===================================================================== */
const ICONS = {
  brief:  '<rect x="3" y="8" width="18" height="12" rx="1.5"/><path d="M9 8V5.5h6V8M3 13h18"/>',
  vault:  '<rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 018 0v3"/><circle cx="12" cy="16" r="1.3"/>',
  qlab:   '<path d="M9.5 3h5M10.5 3v6L5.5 18a2 2 0 001.8 3h9.4a2 2 0 001.8-3l-5-9V3M8 15h8"/>',
  crane:  '<path d="M9.5 21V9a3.5 3.5 0 117 0"/><path d="M5 21h9"/>',
  casino: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.8"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/>',
  harbour:'<circle cx="12" cy="5" r="2"/><path d="M12 7v14M7.5 11h9M4.5 14c.5 4 3.5 7 7.5 7s7-3 7.5-7"/>',
  yacht:  '<path d="M3 16h18l-3 4.5H6zM12 3v13M12 4l6 10h-6M11 7L6 14h5"/>',
  island: '<path d="M2.5 20L9 8l3 4 2-3 7.5 11z"/><path d="M9 5c0-1.5 1.5-2 1.5-3.5"/>',
  accuse: '<path d="M9 4h6v6l3.5 3.5V16h-13v-2.5L9 10z"/><path d="M4.5 20h15"/>',
  plane:  '<path d="M21 3L3 10.5l6.5 2.5L12 20.5z"/>',
  keypad: '<rect x="5" y="3" width="14" height="18" rx="2"/><g fill="currentColor" stroke="none"><circle cx="9" cy="8" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="15" cy="8" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="16" r="1"/><circle cx="12" cy="16" r="1"/><circle cx="15" cy="16" r="1"/></g>',
  cufflink:'<circle cx="6.5" cy="12" r="3.5"/><circle cx="17.5" cy="12" r="3.5"/><path d="M10 12h4M5 12h3M16 12h3"/>',
  phone:  '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  cash:   '<rect x="2.5" y="6" width="19" height="12" rx="1.5"/><circle cx="12" cy="12" r="3"/><path d="M6 9.5v5M18 9.5v5"/>',
  diary:  '<path d="M5 3.5h12a2 2 0 012 2V21H7a2 2 0 01-2-2z"/><path d="M9 8h6M9 12h6"/>',
  bin:    '<path d="M6 7h12l-1 14H7zM4 7h16M9 7V4h6v3"/>',
  quote:  '<path d="M4 5h16v11H11l-4.5 4v-4H4z"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0115 0"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  check:  '<path d="M4 12.5l5 5L20 6.5"/>'
};
const CLUEICON = {mcode:'keypad',cuff:'cufflink',tap:'crane',calls:'phone',keyinfo:'vault',elenacall:'plane',bin:'bin',diary:'diary',buyer:'quote',elenamoney:'cash',ledger:'diary',escape:'person',cane:'crane',witness:'person'};
function ico(name, size=22, cls=''){
  return `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||''}</svg>`;
}

/* Node positions on a 400x300 schematic map */
const PLACES = {
  brief:  {x:58,  y:66,  icon:'brief',  city:'London'},
  vault:  {x:112, y:46,  icon:'vault',  city:'London'},
  qlab:   {x:150, y:92,  icon:'qlab',   city:'London'},
  crane:  {x:104, y:126, icon:'crane',  city:'London'},
  accuse: {x:52,  y:122, icon:'accuse', city:'London'},
  casino: {x:262, y:130, icon:'casino', city:'Monaco'},
  harbour:{x:326, y:118, icon:'harbour',city:'Monaco'},
  yacht:  {x:300, y:182, icon:'yacht',  city:'Monaco'},
  island: {x:332, y:256, icon:'island', city:'Island'}
};
const CITYPOS = {London:{x:100,y:90}, Monaco:{x:296,y:142}, Island:{x:332,y:256}};

function mapSvg(opts={}){
  const big = !!opts.big, path = S.path, vis = new Set(path), cur = path[path.length-1];
  const order = {}; path.forEach((p,i)=>{ if(order[p]===undefined) order[p] = i+1; });
  let segs = '', plane = '';
  for(let i=1;i<path.length;i++){
    const a = PLACES[path[i-1]], b = PLACES[path[i]]; if(!a||!b||path[i-1]===path[i]) continue;
    const last = i===path.length-1 && !opts.static;
    let d;
    if(a.city===b.city){ const mx=(a.x+b.x)/2, my=(a.y+b.y)/2, dx=b.y-a.y, dy=a.x-b.x, k=.18; d = `M${a.x} ${a.y} Q${mx+dx*k} ${my+dy*k} ${b.x} ${b.y}`; }
    else { const mx=(a.x+b.x)/2, my=Math.min(a.y,b.y)-60-Math.abs(a.x-b.x)*.08; d = `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`; }
    if(last){
      segs += `<path id="mseg-last" class="seg-draw" pathLength="1" d="${d}"/>`;
      if(a.city!==b.city) plane = `<g class="planeg"><path d="M-6 0 L-2 -1.6 L-1.4 -6 L1 -6 L1.6 -1.6 L6 0 L1.6 1.6 L1 6 L-1.4 6 L-2 1.6z" fill="var(--brass)"/><animateMotion dur="1.5s" begin="0s" fill="freeze" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#mseg-last"/></animateMotion></g>`;
    } else segs += `<path class="seg" d="${d}"/>`;
  }
  const labels = [['LONDON',CITYPOS.London.x,26],['MONACO',CITYPOS.Monaco.x+8,86],['THE ISLAND',CITYPOS.Island.x-6,296]];
  const nodes = Object.entries(PLACES).map(([id,p])=>{
    const v = vis.has(id), here = id===cur;
    return `<g class="mnode ${v?'v':''} ${here?'here':''}" transform="translate(${p.x} ${p.y})">
      ${here?'<circle class="pulse" r="18"/><circle class="pulse p2" r="18"/>':''}
      <circle class="disc" r="18"/>
      <g transform="translate(-11 -11) scale(.92)" class="mico">${ICONS[p.icon]}</g>
      ${v?`<g class="badge" transform="translate(14 -14)"><circle r="7.5"/><text y="3.2" text-anchor="middle">${order[id]}</text></g>`:''}
      ${big?`<text class="nlabel" y="33" text-anchor="middle">${SHORT[id]}</text>`:`<title>${SHORT[id]}</title>`}
    </g>`;
  }).join('');
  return `<svg class="mapsvg" viewBox="0 0 400 300" role="img" aria-label="Case map. Route so far: ${path.map(p=>SHORT[p]).join(', then ')}.">
    <defs><pattern id="mgrid${big?'b':''}" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="var(--grid)" stroke-width=".6"/></pattern></defs>
    <rect width="400" height="300" class="sea"/><rect width="400" height="300" fill="url(#mgrid${big?'b':''})"/>
    <path class="land" d="M18 58 Q40 16 104 20 Q164 24 172 70 Q190 112 160 152 Q110 168 56 154 Q8 132 18 58Z"/>
    <path class="land" d="M196 0 H400 V112 Q372 150 336 144 Q308 134 286 150 Q246 172 224 150 Q196 124 214 92 Q184 56 196 0Z"/>
    <path class="land" d="M290 232 Q312 222 344 232 Q372 244 366 266 Q344 282 312 276 Q284 262 290 232Z"/>
    <g class="compass" transform="translate(366 36)"><circle r="14" fill="none"/><path d="M0 -12 L3 0 L0 12 L-3 0z" fill="var(--brass)" stroke="none"/><text y="-17" text-anchor="middle">N</text></g>
    ${labels.map(([t,x,y])=>`<text class="region" x="${x}" y="${y}" text-anchor="middle">${t}</text>`).join('')}
    ${segs}${plane}${nodes}</svg>`;
}
