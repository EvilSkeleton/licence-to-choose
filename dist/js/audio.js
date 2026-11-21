/* =====================================================================
   AUDIO: original spy-jazz score, sound effects, voices
   ===================================================================== */
const AUDIO = { music:true, voice:true, sfx:true };
let AC = null, MASTER = null, MUSICBUS = null, FXBUS = null;
function ctx(){
  try{
    if(!AC){ AC = new (window.AudioContext||window.webkitAudioContext)();
      MASTER = AC.createGain(); MASTER.gain.value = .9; MASTER.connect(AC.destination);
      MUSICBUS = AC.createGain(); MUSICBUS.gain.value = .32; MUSICBUS.connect(MASTER);
      FXBUS = AC.createGain(); FXBUS.gain.value = .5; FXBUS.connect(MASTER);
      const d = AC.createDelay(); d.delayTime.value = .36; const fb = AC.createGain(); fb.gain.value = .32;
      const wet = AC.createGain(); wet.gain.value = .35; d.connect(fb).connect(d); d.connect(wet).connect(MUSICBUS);
      MUSICBUS.echo = d;
    }
    if(AC.state==='suspended') AC.resume();
  }catch(e){ AC = null }
  return AC;
}
const mf = m => 440*Math.pow(2,(m-69)/12);
function note(type, m, t, dur, vol, bus, opts={}){
  const o = AC.createOscillator(), gn = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(mf(m), t);
  if(opts.vib){ const l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = 5.5; lg.gain.value = 4; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t+dur+.1); }
  let node = o;
  if(opts.lp){ const f = AC.createBiquadFilter(); f.type='lowpass'; f.frequency.setValueAtTime(opts.lp, t); if(opts.sweep) f.frequency.exponentialRampToValueAtTime(opts.sweep, t+dur); o.connect(f); node = f; }
  node.connect(gn); gn.connect(bus); if(opts.echo && bus.echo) gn.connect(bus.echo);
  gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t+(opts.atk||.01)); gn.gain.exponentialRampToValueAtTime(.0001, t+dur);
  o.start(t); o.stop(t+dur+.05);
}
let noiseBuf = null;
function noise(t, dur, vol, bus, freq=8000, type='highpass'){
  if(!noiseBuf){ noiseBuf = AC.createBuffer(1, AC.sampleRate*1, AC.sampleRate); const d = noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; }
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), gn = AC.createGain();
  s.buffer = noiseBuf; f.type = type; f.frequency.value = freq;
  gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t+dur);
  s.connect(f).connect(gn).connect(bus); s.start(t); s.stop(t+dur+.02);
}
/* Original composition: D-minor walking ostinato, minor-major 7th pad, surf-twang motif. */
const SCORE = {
  step:60/112/2,
  bass:[38,0,38,41, 43,0,44,43, 41,0,38,36, 38,0,0,45,  38,0,38,41, 43,0,44,46, 45,0,43,41, 38,0,36,37],
  lead:[[0,69,.5],[2,72,.3],[3,74,.9],[6,77,.3],[7,76,.6],[10,73,1.6],[16,69,.5],[18,72,.3],[19,74,.6],[21,72,.3],[22,70,.4],[24,69,1.8]]
};
const MUSIC = { on:false, next:0, i:0, timer:null };
function musicStart(){
  if(!AUDIO.music || MUSIC.on || !ctx()) return;
  MUSIC.on = true; MUSIC.next = AC.currentTime + .1; MUSIC.i = 0;
  MUSICBUS.gain.cancelScheduledValues(AC.currentTime); MUSICBUS.gain.setTargetAtTime(.32, AC.currentTime, .3);
  MUSIC.timer = setInterval(musicTick, 30);
}
function musicStop(){
  MUSIC.on = false; clearInterval(MUSIC.timer);
  if(AC) MUSICBUS.gain.setTargetAtTime(.0001, AC.currentTime, .2);
}
function musicTick(){
  while(MUSIC.next < AC.currentTime + .15){
    const t = MUSIC.next, i = MUSIC.i, st = SCORE.step;
    const b = SCORE.bass[i % 32];
    if(b){ note('triangle', b, t, st*1.6, .5, MUSICBUS, {lp:900}); note('sine', b-12, t, st*1.6, .35, MUSICBUS); }
    if(i % 2 === 1) noise(t, .04, .12, MUSICBUS, 7000);
    if(i % 8 === 4) noise(t, .12, .08, MUSICBUS, 1800, 'bandpass');
    if(i % 32 === 0){ [50,53,57,61].forEach(m=>note('sine', m, t, st*31, .05, MUSICBUS, {atk:.8, lp:1400})); }
    const phrase = Math.floor(i/64) % 2, inBar = i % 64;
    if(phrase===1){ SCORE.lead.forEach(([s,m,d])=>{ if(s===inBar-8) note('sawtooth', m, t, d, .09, MUSICBUS, {lp:2600, sweep:700, vib:true, echo:true}); }); }
    MUSIC.next += st; MUSIC.i++;
  }
}
function duck(on){ if(AC && MUSIC.on) MUSICBUS.gain.setTargetAtTime(on?.12:.32, AC.currentTime, .15); }
const FX = {
  whoosh(){ if(!AUDIO.sfx||!ctx()) return; const t=AC.currentTime; const s=AC.createBufferSource(); if(!noiseBuf) noise(t,.01,.0001,FXBUS); s.buffer=noiseBuf; const f=AC.createBiquadFilter(); f.type='bandpass'; f.Q.value=2; f.frequency.setValueAtTime(300,t); f.frequency.exponentialRampToValueAtTime(3000,t+.45); const gn=AC.createGain(); gn.gain.setValueAtTime(.0001,t); gn.gain.exponentialRampToValueAtTime(.4,t+.15); gn.gain.exponentialRampToValueAtTime(.0001,t+.5); s.connect(f).connect(gn).connect(FXBUS); s.start(t); s.stop(t+.55); },
  clue(){ if(!AUDIO.sfx||!ctx()) return; const t=AC.currentTime; note('triangle',81,t,.25,.25,FXBUS); note('triangle',86,t+.1,.4,.25,FXBUS); note('sine',93,t+.2,.6,.12,FXBUS); },
  tick(){ if(!AUDIO.sfx||!ctx()) return; const t=AC.currentTime; for(let k=0;k<3;k++) note('square',96,t+k*.12,.03,.05,FXBUS); },
  stamp(){ if(!AUDIO.sfx||!ctx()) return; const t=AC.currentTime; note('square',40,t,.18,.3,FXBUS,{lp:300}); noise(t,.08,.25,FXBUS,900,'lowpass'); },
  boom(){ if(!AUDIO.sfx||!ctx()) return; const t=AC.currentTime; noise(t,1.6,.9,FXBUS,400,'lowpass'); note('sine',30,t,1.4,.6,FXBUS); },
  sting(){ if(!AUDIO.sfx||!ctx()) return; const t=AC.currentTime; [50,53,57,61,64].forEach((m,k)=>note('sawtooth',m,t+k*.03,2.2,.06,FXBUS,{lp:1800,sweep:500,echo:true})); note('sine',38,t,2,.3,FXBUS); }
};

/* voices (browser text-to-speech; subtitles always show) */
const TTS = 'speechSynthesis' in window ? window.speechSynthesis : null;
let VOICES = [];
function loadVoices(){ try{ VOICES = TTS ? TTS.getVoices() : []; }catch(e){ VOICES = []; } }
if(TTS){ loadVoices(); try{ TTS.addEventListener('voiceschanged', loadVoices); }catch(e){} }
const CAST = {
  'Narrator':        {sex:'m', pitch:.85, rate:.92},
  'M':               {sex:'f', pitch:1,   rate:.95},
  'Sir Edmund Crane':{sex:'m', pitch:.7,  rate:.9, pick:1},
  'Viktor Kael':     {sex:'m', pitch:.6,  rate:.88, pick:2},
  'Elena Voss':      {sex:'f', pitch:1.15,rate:1.02, pick:1},
  'Q':               {sex:'m', pitch:1.15,rate:1.05, pick:1},
  'Night guard':     {sex:'m', pitch:1.05,rate:1.05, pick:2}
};
function voiceFor(who){
  const c = CAST[who] || CAST.Narrator;
  const en = VOICES.filter(v=>/^en/i.test(v.lang));
  const gb = en.filter(v=>/GB|UK|United Kingdom/i.test(v.lang+v.name));
  const isF = v => /female|hazel|susan|libby|sonia|maisie|kate|serena|zira|aria|jenny|samantha|karen|moira|tessa|fiona/i.test(v.name);
  const pool = (gb.length?gb:en);
  const bySex = pool.filter(v => c.sex==='f' ? isF(v) : !isF(v));
  const list = bySex.length ? bySex : pool;
  return list.length ? list[(c.pick||0) % list.length] : null;
}
let speakToken = 0;
function speak(who, text, done){
  const token = ++speakToken;
  const finish = () => { if(token===speakToken){ duck(false); done && done(); } };
  if(!AUDIO.voice || !TTS || !text){ setTimeout(finish, Math.max(2200, text ? text.split(' ').length*330+900 : 1500)); return; }
  try{
    TTS.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[“”"]/g,''));
    const c = CAST[who] || CAST.Narrator, v = voiceFor(who);
    if(v){ u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
    u.pitch = c.pitch; u.rate = c.rate;
    let ended = false;
    u.onend = u.onerror = () => { if(!ended){ ended = true; setTimeout(finish, 450); } };
    duck(true); TTS.speak(u);
    setTimeout(()=>{ if(!ended){ ended = true; finish(); } }, text.split(' ').length*520 + 3500);
  }catch(e){ setTimeout(finish, 2500); }
}
function hush(){ speakToken++; try{ TTS && TTS.cancel(); }catch(e){} duck(false); }
