'use strict';
(()=>{
const COLORS=[{n:'Pink',c:'#ec6fae',d:'#b8457e',l:'#ffc4e1'},{n:'Yellow',c:'#fbc02d',d:'#c08a00',l:'#fff176'},{n:'Blue',c:'#1e88e5',d:'#115a9e',l:'#90caf9'},{n:'Green',c:'#43a047',d:'#2a6e2d',l:'#a5d6a7'}];
const BALLC=['#ff3b30','#ffcc00','#2f80ff','#34c759'];
const AW=100,AL=260,BR=6.5,START={x:50,y:238};let TRACK=24;
const SPEED=Math.max(1,Math.min(10,+(new URLSearchParams(location.search).get('speed')||1)));
const cv=document.getElementById('c');let cx=cv.getContext('2d');let shake=0;
const $=id=>document.getElementById(id);
// ---------- storage ----------
const SKEY='mollyGallopRoll.v1';
const STABLE=[{n:'Sparkle',w:0,c:'#f78fc4',d:'#c2507f',l:'#ffd3ea',m:'#9c6ade',uni:1},{n:'Sunny',w:1,c:'#f6b93b',d:'#b9770e',l:'#ffe08a',m:'#8d5524'},
 {n:'Minty',w:2,c:'#5fd3a6',d:'#2a9a73',l:'#b8f2dc',m:'#1f6e52'},{n:'Skye',w:3,c:'#5fb7f5',d:'#2b7cc0',l:'#bfe3ff',m:'#1d4f80'},
 {n:'Tango',w:4,c:'#ff9a3c',d:'#c8641a',l:'#ffd1a3',m:'#7a3a10'},{n:'Pepper',w:5,c:'#b0bec5',d:'#78909c',l:'#eceff1',m:'#455a64'},
 {n:'Lilac',w:6,c:'#b39ddb',d:'#7e57c2',l:'#e3d7ff',m:'#5e35b1',uni:1},{n:'Starlight',w:8,c:'#f5f5f5',d:'#b0bec5',l:'#ffffff',m:'#ffd54f',uni:1},
 {n:'Breeze',w:2,c:'#e8f4ff',d:'#8fb3d9',l:'#ffffff',m:'#7fc8f8',kind:'peg'},{n:'Ember',w:4,c:'#ff8a3d',d:'#d0531b',l:'#ffd08a',m:'#ffd54f',kind:'dragon'},
 {n:'Twilight',w:7,c:'#7e8cf0',d:'#4a55b8',l:'#c6ccff',m:'#ffd54f',kind:'peg'},{n:'Moss',w:9,c:'#6fd36a',d:'#2f8f3a',l:'#c8f5b0',m:'#ffb74d',kind:'dragon'},
 {n:'Coco',w:3,c:'#b9835a',d:'#7d5233',l:'#e2c09c',m:'#5d3a20',kind:'capy'},{n:'Pebble',w:5,c:'#7cd67a',d:'#3c9a48',l:'#c9f5b8',m:'#ffb300',kind:'dino'},
 {n:'Mango',w:6,c:'#f2b45a',d:'#b97a24',l:'#ffe0a8',m:'#7a4a12',kind:'capy'},{n:'Bloop',w:8,c:'#5ec4f0',d:'#2a86b8',l:'#c4ecff',m:'#ffd54f',kind:'dino'},
 {n:'Bluebell',w:11,c:'#8fb8e8',d:'#4f7fb8',l:'#d6e8ff',m:'#2f4f7a',kind:'capy'},{n:'Zuzu',w:12,c:'#a68cf0',d:'#6a4fc0',l:'#ddd0ff',m:'#4dd0a8',kind:'dino'}];
const STABLE_ORDER=STABLE.map((p,k)=>k).sort((a,b)=>STABLE[a].w-STABLE[b].w||a-b);
const HATS=[{n:'none',w:0},{n:'party',w:1},{n:'cowboy',w:2},{n:'crown',w:4},{n:'tophat',w:6},{n:'wizard',w:3},{n:'flowers',w:5},{n:'propeller',w:7},{n:'chef',w:8},{n:'bunny',w:10},{n:'cupcake',w:12},{n:'tiara',w:3},{n:'goldtiara',w:9},{n:'startiara',w:11}];
const CAPES=[{n:'none',w:0},{n:'red',w:2,c:'#e53935',d:'#a31f1c',l:'#ff8a80'},{n:'starry',w:4,c:'#1e5bb8',d:'#123c80',l:'#64b5f6',st:1},{n:'purple',w:6,c:'#8e24aa',d:'#5e1675',l:'#ce93d8',st:1},{n:'gold',w:9,c:'#ffb300',d:'#c77c00',l:'#ffe082'},{n:'leaf',w:11,c:'#43a047',d:'#2e7031',l:'#a5d6a7',dot:1}];
const CAPE_ORDER=CAPES.map((h,k)=>k).sort((a,b)=>CAPES[a].w-CAPES[b].w||a-b);
const BALLS=[{n:'Classic Red',w:0,c:'#e53935'},{n:'Sunny Stripes',w:1,c:'#ffca28',p:'stripe',q:'#ff7043'},{n:'Blue Spots',w:2,c:'#1e88e5',p:'dots',q:'#ffffff'},{n:'Starry Night',w:4,c:'#5e35b1',p:'stars',q:'#ffeb3b'},{n:'Candy Swirl',w:5,c:'#f06292',p:'swirl',q:'#ffffff'},{n:'Rainbow',w:7,c:'#ff5252',p:'rainbow'},{n:'Ladybird',w:8,c:'#e53935',p:'dots',q:'#212121'},{n:'Watermelon',w:10,c:'#66bb6a',p:'stripe',q:'#1b5e20'},{n:'Mint Hearts',w:12,c:'#4dd0b0',p:'stars',q:'#ff4081',h:1},{n:'Golden Sparkle',w:14,c:'#ffb300',p:'stars',q:'#fffde7'}];
const ALLEYS=([Object.assign(['#c98d4f','#e0a96d'],{r:['#e3ae74','#c98d55','#8f5a30'],lip:['#c58a55','#8a5a33'],tr:['#2a170a','#6b4224'],pat:'wood',dc:'#ffd54f'}),Object.assign(['#0a7fc0','#3fc6ec'],{r:['#f3e2b8','#d9bf86','#a5895a'],lip:['#f0dcae','#b89a66'],tr:['#0c3550','#1f6f94'],pat:'ocean',dc:'#ffffff'}),Object.assign(['#2f8a2a','#6cc04a'],{r:['#a57548','#7d5230','#4e321c'],lip:['#8a5d36','#5a3a20'],tr:['#1d2a12','#3d5526'],pat:'forest',dc:'#d8f5a2'}),Object.assign(['#3fd0a8','#b8f5e2'],{r:['#ffffff','#ff5252','#c62828'],lip:['#ffffff','#ff5252'],tr:['#3a6e60','#7fbfae'],pat:'candy',dc:'#ffeb3b'}),Object.assign(['#e8952f','#ffd27a'],{r:['#e08a5c','#c0643a','#8a4224'],lip:['#d27a4c','#9a4f2c'],tr:['#4a2a14','#8a5a33'],pat:'desert',dc:'#5aa04a'}),Object.assign(['#8fcaff','#e8f6ff'],{r:['#ffffff','#bcd4e6','#8aa7bd'],lip:['#ffffff','#a9c4d8'],tr:['#4a6a88','#8fb2cc'],pat:'snow',dc:'#7fb8e0'}),Object.assign(['#1a1060','#3a2fb0'],{r:['#7ff7ff','#6a5cff','#3a1f9e'],lip:['#8f7fff','#3a2a8e'],tr:['#05061a','#1c1f55'],pat:'space',dc:'#fff6a0'})]).concat([Object.assign(['#0b9a96','#6fe8d0'],{r:['#e8eef2','#aab8c2','#6f7f8a'],lip:['#d5dee4','#8a9aa4'],tr:['#1c2b33','#3d5966'],pat:'chem',dc:'#39d353'}),Object.assign(['#4a1890','#8a3fe0'],{r:['#fff2a8','#e6b422','#a87a00'],lip:['#ffd54f','#b38600'],tr:['#140829','#2e1757'],pat:'magic',dc:'#ffd54f'}),Object.assign(['#3aa8ff','#bfe6ff'],{r:['#ffffff','#ffe082','#d4a017'],lip:['#ffffff','#ffd54f'],tr:['#3a6fa0','#7fb4e0'],pat:'uni',dc:'#ffffff'}),Object.assign(['#17705a','#3fb08a'],{r:['#b0b4ba','#80868e','#4f545a'],lip:['#9aa0a8','#5f656c'],tr:['#122a24','#24524a'],pat:'myth',dc:'#ff9800'})]);
const ALLEY_INFO=[['Carnival Wood',0],['Ocean',2],['Forest',6],['Candy',4],['Desert',11],['Snow',9],['Space',3],['Chemistry',8],['Magic',5],['Unicorns',7],['Mythical Creatures',13]];ALLEY_INFO.forEach((a,k)=>{ALLEYS[k].n=a[0];ALLEYS[k].w=a[1]});
const ALLEY_ORDER=ALLEYS.map((a,k)=>k).sort((a,b)=>ALLEYS[a].w-ALLEYS[b].w||a-b);
const ALLEY=()=>{const h=save.alley|0;return ALLEYS[h]&&save.wins>=ALLEYS[h].w?h:0};
const BALL=()=>{const h=save.ball|0;return BALLS[h]&&save.wins>=BALLS[h].w?h:0};
function ballPat(g,x,y,r,k,rot){const B=BALLS[k]||BALLS[0];g.save();g.beginPath();g.arc(x,y,r,0,7);g.clip();g.fillStyle=B.c;g.fillRect(x-r,y-r,2*r,2*r);g.translate(x,y);g.rotate(rot||0);g.fillStyle=B.q||'#fff';
 if(B.p==='stripe'){for(let i=-3;i<=3;i+=2)g.fillRect(i*r*.3-r*.13,-r,r*.3,2*r)}
 else if(B.p==='dots'){[[0,0,.3],[-.55,-.45,.2],[.55,-.4,.2],[-.5,.5,.2],[.55,.5,.2],[0,-.85,.15],[0,.85,.15]].forEach(d=>{g.beginPath();g.arc(d[0]*r,d[1]*r,d[2]*r,0,7);g.fill()})}
 else if(B.p==='stars'){[[0,0,.38],[-.6,-.5,.22],[.6,-.45,.22],[-.5,.6,.2],[.6,.55,.2]].forEach(d=>{g.beginPath();if(B.h){const s=d[2]*r,cx0=d[0]*r,cy0=d[1]*r;g.moveTo(cx0,cy0+s*.8);g.bezierCurveTo(cx0-s*1.4,cy0-s*.2,cx0-s*.5,cy0-s*1.1,cx0,cy0-s*.35);g.bezierCurveTo(cx0+s*.5,cy0-s*1.1,cx0+s*1.4,cy0-s*.2,cx0,cy0+s*.8)}else for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=(i%2?.45:1)*d[2]*r;g.lineTo(d[0]*r+Math.cos(a)*rr,d[1]*r+Math.sin(a)*rr)}g.fill()})}
 else if(B.p==='swirl'){g.strokeStyle=B.q;g.lineWidth=r*.22;g.lineCap='round';g.beginPath();for(let t=0;t<12;t+=.2){const rr=r*t/11;g.lineTo(Math.cos(t)*rr,Math.sin(t)*rr)}g.stroke()}
 else if(B.p==='rainbow'){['#ff3b3b','#ff9800','#ffeb3b','#4cdf50','#2fa8ff','#a65cff'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(-r,-r+i*r/3,2*r,r/3+1)})}
 g.restore();const s=g.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r);s.addColorStop(0,'rgba(255,255,255,.85)');s.addColorStop(.3,'rgba(255,255,255,0)');s.addColorStop(.8,'rgba(0,0,0,0)');s.addColorStop(1,'rgba(0,0,0,.4)');g.fillStyle=s;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=Math.max(1,r*.05);g.stroke()}
const _aimg={};function alleyImg(k){if(_aimg[k])return _aimg[k];const T=ALLEYS[k],c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d'),real=cx;cx=g;try{
 const bg=g.createLinearGradient(0,0,0,96);bg.addColorStop(0,shadeHex(T[0],.8));bg.addColorStop(1,T[1]);g.fillStyle=bg;g.fillRect(0,0,96,96);
 g.fillStyle=T.r[1];g.fillRect(0,0,12,96);g.fillRect(84,0,12,96);g.fillStyle=T.r[0];g.fillRect(0,0,5,96);g.fillStyle=T.tr[0];g.fillRect(86,0,8,96);
 const D={wood:[['star',30,30,7,T.dc],['star',62,70,6,T.dc]],ocean:[['wave',30,30,7,'#fff'],['wave',62,62,7,'#fff'],['ring',40,78,5,'#e8fbff']],forest:[['leaf',30,30,9,T.dc,.5],['leaf',62,66,9,'#2f6b24',-.4]],candy:[['swirl',32,32,10,'#ff5252'],['swirl',62,68,10,'#ff5252']],desert:[['cactus',34,46,13,T.dc],['cactus',66,72,9,T.dc]],snow:[['flake',32,32,10,T.dc],['flake',64,66,10,T.dc]],space:[['star',30,28,8,T.dc],['dot',64,64,11,'#6a5cff'],['ring',64,64,15,'#7ff7ff']],chem:[['flask',32,48,14,'#39d353'],['mol',64,62,11,'#ffb300']],magic:[['wand',30,64,13,'#ffd54f'],['tophat',62,40,13,'#ffd54f'],['star',64,78,6,'#ffd54f']],uni:[['rainbow',48,40,22,'#fff'],['cloud',40,70,10,'#fff'],['horn',68,68,12,'#ffc107']],myth:[['scale',34,24,10,'#a8f0d0'],['castle',36,62,15,'#ff9800'],['feather',68,48,14,'#ff7043',.4]]}[T.pat]||[];
 D.forEach(d=>shpAt(d[0],d[1],d[2],d[3],1,d[4],d[5]||0));
 g.save();g.shadowColor='#39ff14';g.shadowBlur=6;g.strokeStyle='#39ff14';g.lineWidth=3;g.beginPath();g.ellipse(48,84,11,5,0,0,7);g.stroke();g.restore();g.fillStyle='#000';g.beginPath();g.ellipse(48,84,9,4,0,0,7);g.fill()
 }finally{cx=real}return _aimg[k]=c.toDataURL()}
const _bimg={};function ballImg(k){if(_bimg[k])return _bimg[k];const c=document.createElement('canvas');c.width=c.height=96;ballPat(c.getContext('2d'),48,48,40,k,0);return _bimg[k]=c.toDataURL()}
const CAPE=()=>{const h=save.cape|0;return CAPES[h]&&save.wins>=CAPES[h].w?h:0};
const HAT_ORDER=HATS.map((h,k)=>k).sort((a,b)=>HATS[a].w-HATS[b].w||a-b);
let PORTRAIT=null;const PONY=()=>PORTRAIT!=null?PORTRAIT:(STABLE[save.pony]&&save.wins>=STABLE[save.pony].w?save.pony:0);
const HAT=()=>{const h=save.hat|0;return HATS[h]&&save.wins>=HATS[h].w?h:0};
let save={level:1,players:1,wins:0,races:0,muted:false,pony:0,hat:0,cape:0,ball:0,alley:0};
try{Object.assign(save,JSON.parse(localStorage.getItem(SKEY)||'{}'))}catch(e){}
const persist=()=>{try{localStorage.setItem(SKEY,JSON.stringify(save))}catch(e){}};
// ---------- seeded rng ----------
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
// ---------- audio ----------
let AC=null,noiseBuf=null,rollNode=null,rollGain=null;
function audio(){if(AC)return AC;try{AC=new (window.AudioContext||window.webkitAudioContext)();const len=AC.sampleRate;noiseBuf=AC.createBuffer(1,len,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1}catch(e){AC=null}return AC}
function unlock(){const a=audio();if(a&&a.state==='suspended')a.resume();if(a)musicStart()}
function tone(f,t0,dur,type='sine',vol=.2,f2){if(save.muted||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.01);g.gain.exponentialRampToValueAtTime(.001,t0+dur);o.connect(g).connect(AC.destination);o.start(t0);o.stop(t0+dur+.02)}
function noise(t0,dur,vol,freq,q=1,type='bandpass'){if(save.muted||!AC)return;const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=AC.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(f).connect(g).connect(AC.destination);s.start(t0,Math.random()*.5);s.stop(t0+dur)}
const SFX={
 rollStart(){if(!AC||save.muted||rollNode)return;rollNode=AC.createBufferSource();rollNode.buffer=noiseBuf;rollNode.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=240;f.Q.value=.3;const f2=AC.createBiquadFilter();f2.type='lowpass';f2.frequency.value=320;f2.Q.value=.2;rollGain=AC.createGain();rollGain.gain.value=0;rollNode.connect(f).connect(f2).connect(rollGain).connect(AC.destination);rollNode.start()},
 roll(sp){if(rollGain)rollGain.gain.setTargetAtTime(Math.min(.14,sp/1600),AC.currentTime,.12)},
 rollStop(){if(rollNode){try{rollGain.gain.setTargetAtTime(0,AC.currentTime,.08);rollNode.stop(AC.currentTime+.4)}catch(e){}rollNode=null;rollGain=null}},
 bump(){if(!AC)return;const t=AC.currentTime;tone(220,t,.08,'triangle',.15,140)},
 drop(){if(!AC)return;const t=AC.currentTime;tone(140,t,.12,'sine',.45,55);tone(300,t,.2,'sine',.25,90);for(let i=0;i<5;i++)noise(t+.08+i*.07,.06,.25,1800+Math.random()*900,4)},
 rattle(){if(!AC)return;const t=AC.currentTime;for(let i=0;i<7;i++)noise(t+i*.09,.05,.12,900+Math.random()*600,5)},
 clop(i){if(!AC)return;const t=AC.currentTime;noise(t,.05,.35,i%2?1200:900,6);noise(t+.09,.05,.3,i%2?1000:800,6)},
 ding(n){if(!AC)return;const t=AC.currentTime;for(let i=0;i<n;i++)tone(660*Math.pow(1.26,i),t+i*.1,.25,'sine',.15)},
 fanfare(){if(!AC)return;const t=AC.currentTime+.05;[[392,0,.14],[523,.15,.14],[659,.3,.14],[784,.45,.45],[659,.95,.14],[784,1.1,.6]].forEach(([f,d,l])=>{tone(f,t+d,l,'square',.07,f*1.002);tone(f*2,t+d,l,'triangle',.06)});tone(196,t+.45,1.2,'triangle',.08)},
 cheer(){if(!AC)return;const t=AC.currentTime;noise(t,1.6,.22,1400,.4);[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.14,.5,'triangle',.18));},
 miss(){if(!AC)return;const t=AC.currentTime;tone(400,t,.3,'sine',.12,250)}
};
// ---------- background music: an original, gentle music-box loop synthesised live ----------
const MUS={on:false,next:0,step:0,timer:null,bus:null,duck:1};
// melody in semitones above C5 (null = rest), 8 steps per bar; written for this game
const MEL=[4,7,12,7, 9,7,4,null, 5,9,14,9, 7,null,null,null, 4,7,12,16, 14,12,9,7, 5,4,2,4, 0,null,null,null,
           7,9,7,4, 5,4,2,null, 4,5,4,0, 2,null,7,null, 12,11,9,7, 9,12,14,16, 14,7,11,14, 12,null,null,null];
const CH=[[0,4,7],[5,9,0],[0,4,7],[7,11,2],[0,4,7],[5,9,0],[5,9,0],[7,11,2],[7,11,2],[0,4,7],[0,4,7],[7,11,2],[5,9,0],[5,9,0],[7,11,2],[0,4,7]];
const hz=n=>523.25*Math.pow(2,n/12);
function musicNote(f,t,dur,vol,type,cut){const o=AC.createOscillator(),o2=AC.createOscillator(),fl=AC.createBiquadFilter(),g=AC.createGain();
 o.type=o2.type=type;o.frequency.value=f;o2.frequency.value=f*1.004;fl.type='lowpass';fl.frequency.setValueAtTime(cut*.5,t);fl.frequency.linearRampToValueAtTime(cut,t+.04);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.025);g.gain.setTargetAtTime(vol*.6,t+.05,.08);g.gain.setTargetAtTime(0,t+dur*.85,.04);
 o.connect(fl);o2.connect(fl);fl.connect(g);g.connect(MUS.bus);o.start(t);o2.start(t);o.stop(t+dur+.3);o2.stop(t+dur+.3)}
function musicTick(){if(!AC||!MUS.on)return;const spb=60/104/2;   // gentle 104 bpm music box
 while(MUS.next<AC.currentTime+.3){const t=MUS.next,i=MUS.step%MEL.length,bar=Math.floor(i/8)%CH.length,b8=i%8,ch=CH[bar];
  const m=MEL[i];if(m!=null)musicNote(hz(m-12),t,spb*2.2,.55,'sine',1800);               // soft music-box lead
  if(b8===0)musicNote(hz(ch[0]-24),t,spb*3.5,.5,'sine',600);                             // round bass
  if(b8===2||b8===6)ch.forEach(n=>musicNote(hz(n-12),t,spb*1.6,.12,'triangle',900));      // light chord
  MUS.next+=spb;MUS.step++}
 // keep the music well under the sound effects; duck further while the ball rolls
 MUS.bus.gain.setTargetAtTime(save.muted?0:(rollNode?.012:.026),AC.currentTime,.12)}
function musicStart(){if(!AC||MUS.on||save.music===false||save.muted)return;if(!MUS.bus){MUS.bus=AC.createGain();MUS.bus.gain.value=0;MUS.bus.connect(AC.destination)}
 MUS.on=true;MUS.next=AC.currentTime+.1;MUS.timer=setInterval(musicTick,60);musicTick()}
function musicStop(){MUS.on=false;clearInterval(MUS.timer);if(MUS.bus&&AC)MUS.bus.gain.setTargetAtTime(0,AC.currentTime,.05)}
// ---------- race generation ----------
let G=null;
function makeRace(level,players){
 const r=rng(level*7919+13);
 const L=Math.min(level,10);
 TRACK=Math.min(30,20+(L-1));            // longer races later (20..29)
 const g=105+L*18;                       // steeper alley each race
 const gx=L>=3?(r()<.5?-1:1)*(3+L*2):0;  // sideways tilt from race 3, growing
 const HR=10.5,D=25,RG=D*Math.sqrt(3)/2;      // every hole the same size, every neighbour the same distance apart
 const top=40+r()*6,shift=(r()-.5)*(L>=3?8:0);
 const holes=[];
 for(let row=1;row<=4;row++){const y=top+(4-row)*RG;for(let k=0;k<row;k++){holes.push({x:50+shift+(k-(row-1)/2)*D,y,v:row,r:HR*(row>=3?Math.max(.8,1-(L-1)*(row===4?.025:.018)):1)})}}
 const pegs=[];if(Math.random()<.45){const cand=holes.filter(h=>h.v<=2);cand[Math.floor(Math.random()*cand.length)].bonus=true}

 const humans=Math.max(1,Math.min(4,players));
 return{level,g,gx,holes,pegs,theme:ALLEYS[ALLEY()],cpuSkill:Math.min(.75,.3+L*.045),
  horses:COLORS.map((c,i)=>({i,pos:0,shown:0,human:i<humans,finished:0,ga:null})),turn:0,humans,finishOrder:[]};
}
// ---------- state ----------
let state='menu',ball={x:START.x,y:START.y,vx:0,vy:0,on:false},msg=null,anim=null,effects=[],t0=performance.now(),lastT=t0,time=0;
let drag=null,L={};
const W=()=>cv.clientWidth,H=()=>cv.clientHeight;
function layout(){
 const dpr=Math.min(2.5,window.devicePixelRatio||1);cv.width=W()*dpr;cv.height=H()*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
 const w=W(),h=H(),land=w>h*1.1,top=58;L.land=land;
 if(land){const aw=Math.min(w*.46,(h-12)*1.05);L.track={x:8,y:top,w:w-aw-24,h:Math.min(h-top-8,(w-aw-24)*.6)};
  L.ax=w-aw-6;L.aw=aw;L.ay=8;L.ah=h-12}
 else{const tH=Math.min(h*.3,w*.55);L.track={x:8,y:top,w:w-16,h:tH-8};
  L.ax=4;L.aw=w-8;L.ay=top+tH+4;L.ah=h-L.ay-2}
 L.S=L.aw/128;L.s=L.S;
}
// perspective camera: low at the near end of the alley, looking up towards the horses
const PA=0.95,K0=1/(1+PA),XC=55;
function P(x,y){const t=y/AL,k=1/(1+PA*(1-t));return{x:L.ax+L.aw/2+(x-XC)*L.S*k,y:L.ay+L.ah*(k-K0)/(1-K0),k,t}}
const wx=x=>P(x,START.y).x,wy=y=>P(START.x,y).y;
function toWorld(px,py){let k=K0+(py-L.ay)/L.ah*(1-K0);k=Math.max(.2,k);const t=1-(1/k-1)/PA;return{x:XC+(px-L.ax-L.aw/2)/(L.S*k),y:t*AL}}
// ---------- turns ----------
function cur(){return G.horses[G.turn]}
function startTurn(){
 const h=cur();ball={x:START.x,y:START.y,vx:0,vy:0,on:false};
 if(h.human){state='aim';if(SOLO()){if(!G.started){G.started=1;showMsg('GO!',COLORS[0].c,1)}}else showMsg(COLORS[h.i].n.toUpperCase()+"'S TURN!",COLORS[h.i].c,1.4)}
 else{state='cpuwait';showMsg('',COLORS[h.i].c,0);setTimeout(()=>{if(state==='cpuwait')cpuRoll()},900/SPEED)}
}
const SOLO=()=>G&&G.humans===1;
function nextTurn(){
 if(SOLO()){if(G.finishOrder.length){state='settle';return}return startTurn()}
 if(G.finishOrder.length){return finishRace()}
 G.turn=(G.turn+1)%4;startTurn();
}
function launch(vx,vy){
 const sp=Math.hypot(vx,vy),max=360;if(sp>max){vx*=max/sp;vy*=max/sp}
 ball.vx=vx;ball.vy=vy;ball.on=true;state='rolling';ball.t=0;SFX.rollStart();
 // solo: CPU horses decide their own results off-screen on their own clocks (see update)
}
// simple, fair CPU roll for solo races: mostly small gallops, sometimes a miss, rarely a big one
function cpuQuickRoll(h){const L=Math.min(G.level,10),r=Math.random();
 const w=[.6-(L-1)*.02,.3,.1+(L-1)*.008,.04+(L-1)*.006,.01+(L-1)*.004]; /* gentle, flat: Molly should usually win */let a=0,v=0;const tot=w.reduce((x,y)=>x+y);for(let k=0;k<5;k++){a+=w[k]/tot;if(r<a){v=k;break}}
 if(v>0&&h.pos<TRACK)startGallop(h,v)}
function startGallop(h,n){if(h.ga){const add=Math.min(n,TRACK-(h.ga.from+h.ga.n));if(add>0){h.ga.n+=add;SFX.ding(add);effects.push({type:'plus',n:add,i:h.i,t:0})}return}
 n=Math.min(n,TRACK-h.pos);if(n<=0)return;h.ga={from:h.pos,n,t:0,k:0};SFX.ding(n);effects.push({type:'plus',n,i:h.i,t:0})}
function cpuRoll(){
 const sk=G.cpuSkill,r=Math.random;
 // pick a target: smarter CPUs go for valuable holes
 const pool=G.holes.slice().sort((a,b)=>b.v-a.v);
 let tgt=r()<sk*.7?pool[Math.floor(r()*4)]:pool[Math.floor(r()*pool.length)];
 const dy=START.y-tgt.y,arr=40+r()*30;
 let v=Math.sqrt(2*G.g*dy+arr*arr);
 const tt=dy/((v+arr)/2);
 const dx=tgt.x-START.x-.5*G.gx*tt*tt;
 let vx=dx/tt;
 const err=1-sk;vx+=(r()-.5)*err*70;v*=1+(r()-.5)*err*.45;
 ball.x=START.x;launch(vx,-v);
}
// ---------- physics ----------
function step(dt){
 const b=ball;b.t+=dt;
 b.vy+=G.g*dt;b.vx+=G.gx*dt;
 const sp=Math.hypot(b.vx,b.vy),fr=Math.max(0,1-dt*.35);b.vx*=fr;b.vy*=fr;
 b.x+=b.vx*dt;b.y+=b.vy*dt;
 if(b.x<BR){b.x=BR;b.vx=Math.abs(b.vx)*.55;SFX.bump()}
 if(b.x>AW-BR){b.x=AW-BR;b.vx=-Math.abs(b.vx)*.55;SFX.bump()}
 if(b.y<BR+4){b.y=BR+4;b.vy=Math.abs(b.vy)*.35;SFX.bump()}
 for(const h of G.holes){const dx=h.x-b.x,dy=h.y-b.y,d=Math.hypot(dx,dy);
  if(d<h.r){ // over the hole: lip pulls it in unless it's going too fast
   const cap=70+h.r*5;
   if(d<h.r-BR*.55&&sp<cap||d<h.r*.35&&sp<cap*1.5){return sink(h)}
   const pull=900*(1-d/h.r);b.vx+=dx/d*pull*dt;b.vy+=dy/d*pull*dt;
  }}
 if(b.y>START.y+6&&b.vy>0&&b.t>.3)return missed();
 SFX.roll(sp);
}
function sink(h){
 SFX.rollStop();SFX.drop();ball.on=false;state='dropping';
 const hv=cur();anim={type:'drop',h,t:0,x:ball.x,y:ball.y};effects.push({type:'sparkle',x:h.x,y:h.y,t:0,seed:Math.random()*6});
 effects.push({type:'ring',x:h.x,y:h.y,t:0,c:['#fbc02d','#e53935','#43a047','#1e88e5'][(h.v-1)%4]});shake=.18;
}
function missed(){SFX.rollStop();SFX.miss();ball.on=false;state='returning';SFX.rollStart();SFX.roll(500);anim={type:'back',t:0,x:ball.x,y:ball.y,v:0}}
// ---------- update ----------
function update(dt){
 time+=dt;
 if(SOLO()&&state!=='finish'&&state!=='menu'&&!G.finishOrder.length)for(const h of G.horses){if(h.human)continue;if(h.next==null)h.next=.6+Math.random()*1.2;h.next-=dt;if(h.next<=0){cpuQuickRoll(h);h.next=Math.max(2.6,3.6-(Math.min(G.level,10)-1)*.11)+Math.random()*1.2}}if(shake>0)shake=Math.max(0,shake-dt);
 if(state==='rolling'){const pd=dt*1.15,n=Math.ceil(pd/(1/240));for(let i=0;i<n&&state==='rolling';i++)step(pd/n)} // brisker, less floaty roll (same paths)
 else if(state==='dropping'){anim.t+=dt;if(anim.t>.32){state='returning';SFX.rollStart();SFX.roll(500);anim={type:'trough',t:0,v:anim.h.v*(anim.h.bonus?2:1),bonus:!!anim.h.bonus,y:anim.h.y}}}
 else if(state==='returning'){anim.t+=dt;const dur=anim.type==='trough'?.65:.4;if(anim.t>=dur){SFX.rollStop();
   ball={x:START.x,y:START.y,vx:0,vy:0,on:false};
   if(anim.type==='trough'){if(anim.bonus){SFX.ding(4);effects.push({type:'x2',t:0})}gallop(anim.v)}else{nextTurn()} }}
 for(const h of G?G.horses:[]){const g=h.ga;if(!g)continue;g.t+=dt;const per=.52;const k=Math.min(g.n,Math.floor(g.t/per));
   h.shown=g.from+Math.min(g.n,g.t/per);if(k>g.k){g.k=k;SFX.clop(k)}
   if(g.t>=g.n*per+.35){h.pos=g.from+g.n;h.shown=h.pos;h.ga=null;
     if(h.pos>=TRACK){h.pos=TRACK;h.shown=TRACK;if(!G.finishOrder.includes(h.i))G.finishOrder.push(h.i);SFX.cheer()}
     if(state==='galloping'&&h===cur())nextTurn()}}
 if(SOLO()&&G.finishOrder.length&&(state==='aim'||state==='settle')&&!G.horses.some(h=>h.ga))finishRace();
 for(const e of effects)e.t+=dt;effects=effects.filter(e=>e.t<2);
 if(msg){msg.t+=dt;if(msg.t>msg.d)msg=null}
}
function gallop(n){const h=cur();if(SOLO()){startGallop(h,n);return nextTurn()} // solo: keep playing while your horse runs
 state='galloping';startGallop(h,n);if(!h.ga)nextTurn()}
function showMsg(text,c,d){msg=text?{text,c,d,t:0}:null}
// ---------- finish ----------
function finishRace(){
 state='finish';
 const fo=i=>{const k=G.finishOrder.indexOf(i);return k<0?99:k};const order=G.horses.slice().sort((a,b)=>(fo(a.i)-fo(b.i))||(b.pos-a.pos));
 G.podium=order.map(h=>h.i);
 const winner=G.horses[G.podium[0]];
 save.races++;G.newUnlocks=[];if(winner.human){const before=save.wins;save.wins++;STABLE.forEach((p,k)=>{if(p.w>before&&p.w<=save.wins)G.newUnlocks.push({pony:k})});CAPES.forEach((h,k)=>{if(h.w>before&&h.w<=save.wins)G.newUnlocks.push({cape:k})});BALLS.forEach((h,k)=>{if(h.w>before&&h.w<=save.wins)G.newUnlocks.push({ball:k})});ALLEYS.forEach((h,k)=>{if(h.w>before&&h.w<=save.wins)G.newUnlocks.push({alley:k})});HATS.forEach((h,k)=>{if(h.w>before&&h.w<=save.wins)G.newUnlocks.push({hat:k})});setTimeout(()=>{SFX.fanfare();setTimeout(()=>SFX.cheer(),1300)},350)}
 if(winner.human||G.humans>1)save.level=Math.min(99,save.level+1);
 persist();
 setTimeout(()=>{showUnlocks();$('end').classList.remove('hide');$('end').classList.add('on')},(winner.human?2600:900)/SPEED);
}
// ---------- drawing ----------
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
const _cache={};
function cached(name,fn){const k=[name,cv.width,cv.height,G.level,G.theme&&G.theme.pat,G.holes.map(h=>h.x+','+h.y).join(';')].join('|');let e=_cache[name.replace(/\d.*$/,'')+name];
 if(!e||e.k!==k){const off=e&&e.c||document.createElement('canvas');off.width=cv.width;off.height=cv.height;const o=off.getContext('2d');const dpr=cv.width/W();o.setTransform(dpr,0,0,dpr,0,0);
  const real=cx;cx=o;try{fn()}finally{cx=real}e=_cache[name.replace(/\d.*$/,'')+name]={k,c:off}}
 cx.save();cx.setTransform(1,0,0,1,0,0);cx.drawImage(e.c,0,0);cx.restore()}
function rg(x,y,r,c0,c1,c2){const g=cx.createRadialGradient(x-r*.35,y-r*.45,r*.05,x,y,r*1.15);g.addColorStop(0,c0);g.addColorStop(.45,c1);g.addColorStop(1,c2);return g}
function blob(x,y,rx,ry,rot,fill){cx.fillStyle=fill;cx.beginPath();cx.ellipse(x,y,rx,ry,rot||0,0,7);cx.fill()}
// chunky shaded cartoon horse with a friendly jockey; origin = ground under the belly
let HATNONE=false;const GUT=[];window.__alleys=()=>ALLEYS.map(a=>[a.n,a.w,a.pat]);window.__balls=()=>BALLS.map(b=>[b.n,b.w]);window.__gut=()=>GUT.slice();
function drawHat(h,ax=25,ay=-36,ro=.25){if(!h)return;cx.save();cx.translate(ax,ay);cx.rotate(ro);
 if(h===1){cx.fillStyle='#4fc3f7';cx.beginPath();cx.moveTo(-6,0);cx.lineTo(6,0);cx.lineTo(0,-16);cx.closePath();cx.fill();cx.fillStyle='#ffeb3b';for(const [x,y] of [[-2,-4],[2,-8],[-1,-11]]){cx.beginPath();cx.arc(x,y,1.3,0,7);cx.fill()}cx.fillStyle='#ff9800';cx.beginPath();cx.arc(0,-17,2.6,0,7);cx.fill()}
 else if(h===2){cx.fillStyle='#a0682f';cx.beginPath();cx.ellipse(0,0,13,3.5,0,0,7);cx.fill();cx.fillStyle='#8a5526';cx.beginPath();cx.moveTo(-6,0);cx.quadraticCurveTo(-7,-11,0,-10);cx.quadraticCurveTo(7,-11,6,0);cx.closePath();cx.fill();cx.fillStyle='#e53935';cx.fillRect(-6,-3,12,2)}
 else if(h===3){drawCrown(0,0,1)}
 else if(h===4){cx.fillStyle='#263238';cx.beginPath();cx.ellipse(0,0,10,2.8,0,0,7);cx.fill();cx.fillRect(-6,-13,12,13);cx.fillStyle='#1e88e5';cx.fillRect(-6,-4,12,3)}
 else if(h===5){cx.fillStyle='#7e57c2';cx.beginPath();cx.ellipse(0,0,11,3,0,0,7);cx.fill();cx.beginPath();cx.moveTo(-7,0);cx.quadraticCurveTo(-2,-10,3,-20);cx.quadraticCurveTo(4,-9,7,0);cx.closePath();cx.fill();cx.fillStyle='#ffeb3b';for(const [x,y] of [[-1,-5],[2,-11],[-2,-2.5]]){drawStar(x,y,2,0)}}
 else if(h===6){const F=['#ff7043','#ffeb3b','#42a5f5','#ab47bc','#66bb6a'];cx.strokeStyle='#4caf50';cx.lineWidth=1.6;cx.beginPath();cx.ellipse(0,-1,10,3,0,Math.PI,2*Math.PI);cx.stroke();for(let k=0;k<5;k++){const x=-9+k*4.5,y=-1-Math.sin(k/4*Math.PI)*3;cx.fillStyle=F[k];for(let p=0;p<5;p++){cx.beginPath();cx.arc(x+Math.cos(p*1.26)*1.7,y+Math.sin(p*1.26)*1.7,1.4,0,7);cx.fill()}cx.fillStyle='#fff59d';cx.beginPath();cx.arc(x,y,1,0,7);cx.fill()}}
 else if(h===7){const a=['#e53935','#fbc02d','#1e88e5','#43a047'];for(let k=0;k<4;k++){cx.fillStyle=a[k];cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,8,Math.PI+k*Math.PI/4,Math.PI+(k+1)*Math.PI/4);cx.closePath();cx.fill()}cx.fillStyle='#455a64';cx.fillRect(-.6,-12,1.2,4);const r=Math.sin(time*12)*7;cx.fillStyle='#ff7043';cx.beginPath();cx.ellipse(0,-12,Math.abs(r)+1,1.4,0,0,7);cx.fill()}
 else if(h===8){cx.fillStyle='#fff';cx.fillRect(-6,-7,12,7);for(const x of [-5,0,5]){cx.beginPath();cx.arc(x,-9,4.2,0,7);cx.fill()}cx.strokeStyle='#cfd8dc';cx.lineWidth=.8;cx.strokeRect(-6,-3,12,3)}
 else if(h===9){for(const [x,a] of [[-3,-.2],[3,.2]]){cx.save();cx.translate(x,0);cx.rotate(a);cx.fillStyle='#fff';cx.beginPath();cx.ellipse(0,-8,3,8,0,0,7);cx.fill();cx.fillStyle='#ffc1d9';cx.beginPath();cx.ellipse(0,-8,1.5,5.5,0,0,7);cx.fill();cx.restore()}cx.fillStyle='#fff';cx.beginPath();cx.ellipse(0,0,7,2,0,0,7);cx.fill()}
 else if(h===10){cx.fillStyle='#d7a15e';cx.beginPath();cx.moveTo(-7,0);cx.lineTo(7,0);cx.lineTo(8,-6);cx.lineTo(-8,-6);cx.closePath();cx.fill();cx.strokeStyle='#b07a3a';cx.lineWidth=.7;for(let x=-6;x<=6;x+=3){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x*1.1,-6);cx.stroke()}cx.fillStyle='#b3e5fc';for(const [x,y,r] of [[-5,-7,3.5],[0,-9,4.5],[5,-7,3.5]]){cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()}cx.fillStyle='#e53935';cx.beginPath();cx.arc(0,-14,2.2,0,7);cx.fill();cx.fillStyle='#fbc02d';cx.fillRect(-4,-9,1.2,.8);cx.fillRect(3,-8,1.2,.8);cx.fillStyle='#43a047';cx.fillRect(-1,-7,1.2,.8)}
 else if(h>=11&&h<=13){const M=h===11?['#eceff1','#90a4ae','#4fc3f7']:h===12?['#ffe082','#c99400','#e53935']:['#fff59d','#f9a825','#7e57c2'];
  cx.fillStyle=M[0];cx.strokeStyle=M[1];cx.lineWidth=.9;cx.beginPath();cx.moveTo(-9,0);cx.lineTo(-8,-4);cx.lineTo(-5,-3);cx.lineTo(-3,-7);cx.lineTo(0,-4);cx.lineTo(0,-11);cx.lineTo(0,-4);cx.lineTo(3,-7);cx.lineTo(5,-3);cx.lineTo(8,-4);cx.lineTo(9,0);cx.quadraticCurveTo(0,-2,-9,0);cx.closePath();cx.fill();cx.stroke();
  cx.beginPath();cx.moveTo(-1.8,-4);cx.lineTo(0,-11.5);cx.lineTo(1.8,-4);cx.closePath();cx.fill();cx.stroke();
  if(h===13)drawStar(0,-12,3,0);else{cx.fillStyle=M[2];cx.beginPath();if(h===12){cx.moveTo(0,-8);cx.bezierCurveTo(-3,-11,-3,-13.5,0,-12);cx.bezierCurveTo(3,-13.5,3,-11,0,-8)}else cx.arc(0,-10,1.8,0,7);cx.fill()}
  cx.fillStyle=M[2];for(const x of [-5,5]){cx.beginPath();cx.arc(x,-3,1.1,0,7);cx.fill()}}
 cx.restore()}
function drawCape(k,ph){const C=CAPES[k];if(!k||!C)return;const f=Math.sin(ph*1.6)*2.5;cx.save();
 const g=cx.createLinearGradient(0,-22,-24,4);g.addColorStop(0,C.l);g.addColorStop(.35,C.c);g.addColorStop(1,C.d);cx.fillStyle=g;cx.beginPath();cx.moveTo(-1,-23);cx.quadraticCurveTo(6,-22,7,-18);
 cx.quadraticCurveTo(-4,-10,-12,4+f*.4);cx.quadraticCurveTo(-17,1+f,-21,6+f*.6);cx.quadraticCurveTo(-25,2+f,-29,4+f*.8);cx.quadraticCurveTo(-24,-10-f*.3,-1,-23);cx.closePath();cx.fill();
 cx.strokeStyle=C.d;cx.lineWidth=1;cx.stroke();
 if(C.st){cx.fillStyle='#fff59d';for(const [x,y] of [[-8,-10],[-16,-4],[-21,1],[-12,-1]]){cx.beginPath();for(let p=0;p<10;p++){const rr=p%2?.8:1.9,a=-Math.PI/2+p*Math.PI/5;cx.lineTo(x+Math.cos(a)*rr,y+f*.3+Math.sin(a)*rr)}cx.fill()}}
 if(C.dot){cx.fillStyle='rgba(255,255,255,.55)';for(const [x,y] of [[-7,-11],[-15,-5],[-22,1],[-11,0]]){cx.beginPath();cx.ellipse(x,y+f*.3,2.2,1.2,-.6,0,7);cx.fill()}}
 cx.fillStyle='#ffd54f';cx.beginPath();cx.arc(2,-21,1.8,0,7);cx.fill();cx.restore()}
function drawCrown(x,y,k){cx.save();cx.translate(x,y);cx.scale(k,k);const g=cx.createLinearGradient(0,-12,0,0);g.addColorStop(0,'#fff59d');g.addColorStop(1,'#f9a825');cx.fillStyle=g;
 cx.beginPath();cx.moveTo(-8,0);cx.lineTo(-9,-11);cx.lineTo(-4,-5);cx.lineTo(0,-13);cx.lineTo(4,-5);cx.lineTo(9,-11);cx.lineTo(8,0);cx.closePath();cx.fill();cx.strokeStyle='#c17900';cx.lineWidth=1;cx.stroke();
 cx.fillStyle='#e53935';cx.beginPath();cx.arc(0,-4,1.8,0,7);cx.fill();cx.fillStyle='#1e88e5';cx.beginPath();cx.arc(-5,-3,1.3,0,7);cx.arc(5,-3,1.3,0,7);cx.fill();cx.restore()}
function drawHorse(x,y,s,i,phase,glow){
 const pn=i===0?STABLE[PONY()]:null,uni=!!(pn&&pn.uni),kind=pn&&pn.kind,dra=kind==='dragon',capy=kind==='capy',dino=kind==='dino',c=pn||COLORS[i],mc=pn?pn.m:c.d;cx.save();cx.translate(x,y);cx.scale(s,s);
 if(glow){const g=cx.createRadialGradient(0,-10,4,0,-10,48);g.addColorStop(0,'rgba(255,240,140,.7)');g.addColorStop(1,'rgba(255,240,140,0)');cx.fillStyle=g;cx.fillRect(-50,-60,100,90)}
 blob(2,24,30,6,0,'rgba(40,60,20,.28)');
 const leg=Math.sin(phase),bob=Math.abs(Math.sin(phase))*3.2;
 cx.translate(0,-bob);
 const legD=(lx,a,far)=>{const col=far?c.d:c.c;const kx=lx+Math.sin(a)*7,ky=10+Math.cos(a)*8,fx=kx+Math.sin(a*1.4-.3)*6,fy=ky+9;
  cx.strokeStyle=col;cx.lineCap='round';cx.lineWidth=(far?7:8)*(capy||dino?1.4:1);cx.beginPath();cx.moveTo(lx,4);cx.lineTo(kx,ky);cx.lineTo(fx,fy);cx.stroke();
  blob(fx+1,fy+2,5,3.4,0,far?'#3b2a20':'#55402f')};
 // far legs, tail
 legD(-13,-leg*.7,1);legD(13,leg*.7,1);
 if(dino){cx.fillStyle=rg(-28,0,16,c.l,c.c,c.d);cx.beginPath();cx.moveTo(-18,-10);cx.quadraticCurveTo(-34,-4,-44+leg*2,8);cx.quadraticCurveTo(-30,8,-18,8);cx.closePath();cx.fill()}else if(!capy){cx.fillStyle=mc;cx.beginPath();cx.moveTo(-20,-6);cx.bezierCurveTo(-36,-8,-38+leg*3,10,-30,16);cx.bezierCurveTo(-30,6,-26,2,-20,2);cx.fill();}
 if(dra){cx.fillStyle=c.d;cx.beginPath();cx.moveTo(-30,16);cx.lineTo(-38,12);cx.lineTo(-35,20);cx.closePath();cx.fill()}
 // body
 blob(0,-1,26,16,0,rg(0,-1,26,c.l,c.c,c.d));
 // mane behind the neck
 if(dino){for(let k=0;k<5;k++){const bx=-16+k*7,by=-15-Math.sin(k/4*Math.PI)*2;blob(bx,by-3,3.4,5,0,mc)}}else if(capy){}else if(dra){cx.fillStyle=mc;for(let k=0;k<6;k++){const bx=-14+k*6+(k>3?(k-3)*2:0),by=-15-(k>3?(k-3)*6:0);cx.beginPath();cx.moveTo(bx-3,by+2);cx.lineTo(bx,by-6);cx.lineTo(bx+3,by+2);cx.closePath();cx.fill()}}else
 for(let k=0;k<4;k++)blob(10+k*3,-9-k*5.5,uni?4.6:3.6,uni?5.4:4.4,0,uni?[mc,'#5fb7f5','#ffd54f',mc][k]:mc);
 if(capy){cx.fillStyle=rg(28,-18,16,c.l,c.c,c.d);cx.beginPath();cx.roundRect(14,-27,28,18,[9,7,8,10]);cx.fill();
  blob(40,-22,2.6,2,0,'#3b2a20');blob(18,-27,3.2,2.6,0,c.d);blob(24,-28,3,2.4,0,c.d);blob(27,-21,2.4,2.6,0,'#fff');blob(27.5,-20.8,1.6,1.9,0,'#2b1d16');blob(27,-21.6,.6,.6,0,'#fff');
  cx.strokeStyle='#3b2a20';cx.lineWidth=1;cx.beginPath();cx.arc(37,-16,3,.3,2.4);cx.stroke();blob(31,-15,2.4,1.4,0,'rgba(255,140,140,.5)')}
 else if(dino){cx.fillStyle=rg(18,-18,16,c.l,c.c,c.d);cx.beginPath();cx.moveTo(8,-8);cx.quadraticCurveTo(16,-34,26,-36);cx.lineTo(30,-28);cx.quadraticCurveTo(22,-14,22,2);cx.closePath();cx.fill();
  blob(30,-33,10,7,.15,rg(30,-35,10,c.l,c.c,c.d));blob(29,-36,2.6,2.8,0,'#fff');blob(29.6,-35.6,1.7,2,0,'#2b1d16');blob(29,-36.6,.7,.7,0,'#fff');cx.strokeStyle=c.d;cx.lineWidth=1.2;cx.beginPath();cx.arc(34,-31,3,.2,1.6);cx.stroke();blob(37,-33,.9,.7,0,c.d);blob(31,-30,2,1.2,0,'rgba(255,140,140,.45)')}
 else{
 // neck + head
 cx.fillStyle=rg(18,-14,14,c.l,c.c,c.d);cx.beginPath();cx.moveTo(10,-8);cx.quadraticCurveTo(16,-26,24,-28);cx.lineTo(30,-20);cx.quadraticCurveTo(24,-6,20,2);cx.closePath();cx.fill();
 blob(28,-25,11,8.5,.3,rg(28,-25,11,c.l,c.c,c.d));
 blob(35,-21,7,5.6,.3,rg(35,-21,7,'#fff1e6','#f8cfb2','#d9a585'));blob(37,-21,1.2,1,0,'#a0705a');
 blob(26.5,-28,3.2,3.6,0,'#fff');blob(27.2,-27.6,2.2,2.6,0,'#2b1d16');blob(26.4,-28.6,.9,.9,0,'#fff');
 cx.fillStyle=c.d;cx.beginPath();cx.moveTo(20,-31);cx.quadraticCurveTo(20,-41,24,-40);cx.quadraticCurveTo(25,-35,24,-31);cx.fill();
 }
 if(uni){cx.fillStyle=rg(31,-38,8,'#fff8c4','#ffd54f','#d4a017');cx.beginPath();cx.moveTo(27,-32);cx.lineTo(36,-49);cx.lineTo(32.5,-31);cx.closePath();cx.fill();cx.strokeStyle='#c99a12';cx.lineWidth=1;cx.beginPath();cx.moveTo(29,-36);cx.lineTo(33,-37);cx.moveTo(31,-41);cx.lineTo(34,-42);cx.stroke()}
 if(dra){cx.fillStyle='#fff3c4';cx.strokeStyle='#c9a24a';cx.lineWidth=1;for(const hx of [22,27]){cx.beginPath();cx.moveTo(hx,-31);cx.quadraticCurveTo(hx-3,-40,hx-6,-42);cx.quadraticCurveTo(hx-1,-38,hx+3,-31);cx.closePath();cx.fill();cx.stroke()}blob(38,-23,1,.8,0,'#7a3a10')}
 // near legs
 legD(-9,leg*.7,0);legD(17,-leg*.7,0);
 blob(0,-1,25,15,0,rg(0,-1,25,c.l,c.c,c.d));
 if(kind==='peg'||dra){const fl=Math.sin(phase*1.3)*.35;cx.save();cx.translate(-2,-12);cx.rotate(-.5+fl);cx.scale(1.4,1.4);
  if(kind==='peg'){for(let k=0;k<5;k++)blob(-6-k*5,-4-k*1.5,7-k*.6,3.6,-.2-k*.08,k%2?c.l:'#ffffff');for(let k=0;k<4;k++)blob(-4-k*4.5,1,5,3,-.1,c.l);cx.strokeStyle=c.d;cx.lineWidth=.8;cx.beginPath();cx.moveTo(0,0);cx.quadraticCurveTo(-16,-10,-30,-9);cx.stroke()}
  else{cx.fillStyle=mc;cx.globalAlpha=.92;cx.beginPath();cx.moveTo(0,0);cx.lineTo(-8,-14);cx.lineTo(-30,-12);cx.quadraticCurveTo(-25,-6,-24,-2);cx.quadraticCurveTo(-18,-3,-15,2);cx.quadraticCurveTo(-9,0,0,4);cx.closePath();cx.fill();cx.globalAlpha=1;cx.strokeStyle=c.d;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(0,0);cx.lineTo(-8,-14);cx.lineTo(-30,-12);cx.moveTo(-8,-14);cx.lineTo(-24,-2);cx.moveTo(-8,-14);cx.lineTo(-15,2);cx.stroke()}
  cx.restore()}
 if(capy)blob(0,1,28,18,0,rg(0,-2,28,c.l,c.c,c.d));
 if(i===0&&!HATNONE)drawCape(CAPE(),phase);
 // saddlecloth with number
 cx.fillStyle='#fff';cx.beginPath();cx.roundRect?cx.roundRect(-14,-6,17,16,5):cx.rect(-14,-6,17,16);cx.fill();cx.strokeStyle=c.d;cx.lineWidth=1.8;cx.stroke();
 cx.fillStyle=c.d;cx.font='900 13px system-ui,sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(i+1,-5.5,2.5);
 // jockey (rides with the bob, leans a little into the gallop)
 cx.save();cx.translate(0,-13+Math.sin(phase*2)*.8);cx.rotate(.18);cx.scale(.82,.82);
 blob(1,-1,8,6,0,rg(1,-1,8,'#ffffff',c.l,c.c));                 // seat/legs
 blob(3,-11,7.5,9,0,rg(3,-11,9,'#ffffff',c.l,c.c));               // silks
 cx.strokeStyle=c.d;cx.lineWidth=2.5;cx.beginPath();cx.moveTo(-3,-16);cx.lineTo(9,-7);cx.stroke();          // sash
 cx.strokeStyle=c.l;cx.lineCap='round';cx.lineWidth=4.5;cx.beginPath();cx.moveTo(7,-13);cx.quadraticCurveTo(13,-10,16,-6);cx.stroke(); // arm
 blob(16.5,-5.5,2.6,2.6,0,'#f8cfb2');
 cx.strokeStyle='rgba(80,50,30,.8)';cx.lineWidth=1;cx.beginPath();cx.moveTo(16.5,-5.5);cx.lineTo(26,-18);cx.stroke(); // reins
 blob(5,-24,7,7,0,rg(5,-24,7,'#fff1e6','#f8cfb2','#d9a585'));     // face
 blob(7.5,-24.5,1.2,1.4,0,'#2b1d16');blob(3,-24.5,1.2,1.4,0,'#2b1d16');
 cx.strokeStyle='#b5574b';cx.lineWidth=1.2;cx.beginPath();cx.arc(5.3,-22.3,2.4,.3,2.8);cx.stroke();
 blob(9,-22,1.6,1,0,'rgba(255,120,120,.45)');blob(1.5,-22,1.6,1,0,'rgba(255,120,120,.45)');
 cx.fillStyle=rg(5,-29,8,'#ffffff',c.c,c.d);cx.beginPath();cx.arc(5,-27,7.6,Math.PI,0);cx.fill();   // helmet
 cx.fillStyle=c.d;cx.beginPath();cx.ellipse(10,-27,5,1.6,0,0,7);cx.fill();
 cx.fillStyle='#fff';cx.fillRect(4,-34.4,2,7);
 cx.restore();
 if(i===0&&!HATNONE){const hh=HAT();if(capy)drawHat(hh,28,-26.5,.04);else if(dino)drawHat(hh,29,-39,.15);else drawHat(hh,25.5,-32.3,.3);
  if(uni&&hh){cx.fillStyle=rg(31,-38,8,'#fff8c4','#ffd54f','#d4a017');cx.beginPath();cx.moveTo(28.5,-33);cx.lineTo(36,-49);cx.lineTo(32.5,-31);cx.closePath();cx.fill()}}
 cx.restore();
}
// perspective race track: far lane at the top, near lane at the bottom, receding like the alley
function laneGeo(i){const t=L.track,K=[.8,.86,.92,.98,1.04],tot=K[0]+K[1]+K[2]+K[3];
 let y=t.y+6;for(let j=0;j<i;j++)y+=(t.h-10)*K[j]/tot;const h=(t.h-10)*K[i]/tot;
 const cxm=t.x+t.w/2,hw=(kk)=>t.w/2*(.86+.14*(kk-.8)/.24);
 const k0=K[i],k1=K[i+1],l0=cxm-hw(k0),r0=cxm+hw(k0),l1=cxm-hw(k1),r1=cxm+hw(k1);
 const km=(k0+k1)/2,lm=cxm-hw(km),rm=cxm+hw(km);const sx=lm+h*1.55+12,fx=rm-h*.55;
 return{y,h,l0,r0,l1,r1,lm,rm,sx,fx,k:km}}
function trackStatic(){
 const t=L.track;
 // sky band, clouds, soft hills behind the track
 const sky=cx.createLinearGradient(0,0,0,t.y+20);sky.addColorStop(0,bgT()[1]);sky.addColorStop(1,bgT()[2]);cx.fillStyle=sky;cx.fillRect(0,0,W(),t.y+10);
 for(const [fx,fy,r] of [[.18,.35,16],[.5,.25,13],[.8,.4,18]]){const X=W()*fx,Y=t.y*fy;cx.fillStyle='rgba(255,255,255,.92)';[[0,0,1],[-.9,.25,.7],[.9,.25,.75],[.35,-.35,.7]].forEach(([a,b,m])=>{cx.beginPath();cx.arc(X+a*r,Y+b*r,r*m,0,7);cx.fill()})}
 cx.fillStyle=bgT()[7];cx.beginPath();cx.moveTo(0,t.y+12);for(let x=0;x<=W();x+=20)cx.lineTo(x,t.y-4-Math.sin(x/90)*8-Math.sin(x/37)*3);cx.lineTo(W(),t.y+12);cx.fill();
 // track bed with front edge thickness
 const g3=laneGeo(3);cx.fillStyle='#e8dcc8';cx.beginPath();cx.moveTo(laneGeo(0).l0-4,t.y+2);cx.lineTo(laneGeo(0).r0+4,t.y+2);cx.lineTo(g3.r1+4,g3.y+g3.h+4);cx.lineTo(g3.l1-4,g3.y+g3.h+4);cx.fill();
 cx.fillStyle='#c9b79a';cx.beginPath();cx.moveTo(g3.l1-4,g3.y+g3.h+4);cx.lineTo(g3.r1+4,g3.y+g3.h+4);cx.lineTo(g3.r1+2,g3.y+g3.h+10);cx.lineTo(g3.l1-2,g3.y+g3.h+10);cx.fill();
 for(let i=0;i<4;i++){const q=laneGeo(i),h=G.horses[i];
  cx.beginPath();cx.moveTo(q.l0,q.y);cx.lineTo(q.r0,q.y);cx.lineTo(q.r1,q.y+q.h);cx.lineTo(q.l1,q.y+q.h);cx.closePath();
  const lg=cx.createLinearGradient(0,q.y,0,q.y+q.h);lg.addColorStop(0,COLORS[i].l);lg.addColorStop(.6,mix(COLORS[i].l,COLORS[i].c,.45));lg.addColorStop(1,mix(COLORS[i].l,COLORS[i].c,.7));cx.fillStyle=lg;cx.fill();
  // soft turf stripes for depth
  cx.save();cx.clip();cx.fillStyle='rgba(255,255,255,.10)';for(let k=0;k<TRACK;k+=2){const x0=q.sx+(q.fx-q.sx)*k/TRACK,x1=q.sx+(q.fx-q.sx)*(k+1)/TRACK;cx.fillRect(x0,q.y,x1-x0,q.h)}cx.restore();
  // step dots
  cx.fillStyle='rgba(255,255,255,.75)';for(let k=0;k<=TRACK;k++){const x=q.sx+(q.fx-q.sx)*k/TRACK;cx.beginPath();cx.ellipse(x,q.y+q.h-5,2.2*q.k,1.3*q.k,0,0,7);cx.fill()}
  if(state!=='finish'&&G.turn===i&&!SOLO()){cx.strokeStyle='rgba(255,210,63,.95)';cx.lineWidth=4;cx.lineJoin='round';cx.beginPath();cx.moveTo(q.l0+2,q.y+2);cx.lineTo(q.r0-2,q.y+2);cx.lineTo(q.r1-2,q.y+q.h-2);cx.lineTo(q.l1+2,q.y+q.h-2);cx.closePath();cx.stroke()}
  // finish (checks, in perspective)
  const n=Math.max(3,Math.round(q.h/9));for(let k=0;k<n;k++)for(let j=0;j<2;j++){const y0=q.y+q.h*k/n,y1=q.y+q.h*(k+1)/n,cw=6*q.k;cx.fillStyle=(k+j)%2?'#333':'#fff';cx.fillRect(q.fx+q.h*.35+j*cw,y0,cw,y1-y0+.5)}
 }
 // white rails between lanes (rounded, with shadow)
 for(let j=0;j<=4;j++){const q=laneGeo(Math.min(j,3)),y=j<4?q.y:q.y+q.h,l=j<4?q.l0:q.l1,r=j<4?q.r0:q.r1;
  cx.strokeStyle='rgba(60,60,40,.18)';cx.lineWidth=5;cx.beginPath();cx.moveTo(l,y+2);cx.lineTo(r,y+2);cx.stroke();
  if(G.level>=3){const gg=cx.createLinearGradient(0,y-2,0,y+2);gg.addColorStop(0,'#fff6c2');gg.addColorStop(.5,'#ffcf40');gg.addColorStop(1,'#c99400');cx.strokeStyle=gg;cx.lineWidth=4}else{cx.strokeStyle='#fff';cx.lineWidth=3.2}cx.lineCap='round';cx.beginPath();cx.moveTo(l,y);cx.lineTo(r,y);cx.stroke()}
}
function drawTrack(){
 const t=L.track;cached('track'+G.turn+(state==='finish'),()=>trackStatic());
 if(G.level>=4)for(let i=0;i<4;i++){const q=laneGeo(i),fx=q.fx+q.h*.35+6*q.k;for(let k=0;k<4;k++){const ph=time*2.5+i*1.7+k*2.1,a=Math.max(0,Math.sin(ph));if(a<.05)continue;const y=q.y+q.h*((k*.27+i*.13+Math.floor(ph/Math.PI)*.37)%1);cx.globalAlpha=a;drawStar(fx+Math.sin(ph*1.3)*5*q.k,y,(2.5+2.5*a)*q.k,time+k);cx.globalAlpha=1}}
 if(G.level>=7){const q0=laneGeo(0),q3=laneGeo(3),x=q0.fx+q0.h*.35+12*q0.k,top=q0.y-26*q0.k;cx.strokeStyle='#c99400';cx.lineWidth=3;cx.beginPath();cx.moveTo(x,q0.y);cx.lineTo(x,top);cx.stroke();cx.fillStyle='#ffd54f';cx.beginPath();cx.moveTo(x,top);cx.lineTo(x+16*q0.k+Math.sin(time*4)*2,top+5*q0.k);cx.lineTo(x,top+10*q0.k);cx.fill();drawStar(x,top,4*q0.k,time)}
 // badges + horses, far to near so nearer horses overlap
 for(let i=0;i<4;i++){const q=laneGeo(i),h=G.horses[i];const bx=q.lm+q.h*.45,by=q.y+q.h/2,br=Math.min(q.h*.36,22);
  blob(bx,by+2,br,br,0,'rgba(0,0,0,.15)');blob(bx,by,br,br,0,rg(bx,by,br,COLORS[i].l,COLORS[i].c,COLORS[i].d));
  cx.fillStyle='#fff';cx.font=`900 ${br*.78}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(h.human?(G.humans===1?'YOU':'P'+(i+1)):'🤖',bx,by+1)}
 for(let i=0;i<4;i++){const q=laneGeo(i),h=G.horses[i],moving=!!h.ga;
  const x=q.sx+(q.fx-q.sx)*h.shown/TRACK,y=q.y+q.h/2+11*Math.min(q.h/50,(q.fx-q.sx)/16/22,2.4),hs=Math.min(q.h/50,(q.fx-q.sx)/16/22,2.4);
  if(moving){cx.fillStyle='rgba(120,70,30,.3)';for(let k=h.ga?h.ga.from:0;h.ga&&k<h.shown-.2;k+=.5){const px=q.sx+(q.fx-q.sx)*k/TRACK;cx.beginPath();cx.ellipse(px,y+2,3*q.k,1.8*q.k,0,0,7);cx.fill()}}
  if(moving){const dp=i===0?STABLE[PONY()]:COLORS[i];cx.save();cx.fillStyle=dp.c;cx.strokeStyle=dp.d;cx.lineWidth=1.2*hs;for(let k=0;k<5;k++){const ph=(time*2.2+k/5+i*.13)%1;cx.globalAlpha=.75*(1-ph);cx.beginPath();cx.arc(x-(16+ph*30)*hs,y+(20-ph*8-(k%2)*3)*hs,(3+ph*6)*hs,0,7);cx.fill();cx.globalAlpha*=.8;cx.stroke()}cx.restore()}
  drawHorse(x,y-(moving?Math.abs(Math.sin(time*7+i))*3.2*hs:0),hs,i,moving?time*14:0,G.turn===i&&state!=='finish'&&!SOLO())}
 for(const e of effects)if(e.type==='cpuball'&&e.t<1.2){const q=laneGeo(e.i),bx=q.lm+q.h*.45+q.h*.55,by=q.y+q.h*.5-Math.abs(Math.sin(e.t*7))*q.h*.25*(1-e.t/1.2),r=q.h*.14;
  cx.globalAlpha=Math.min(1,(1.2-e.t)*3);blob(bx,by,r,r,0,rg(bx,by,r,'#fff',BALLC[e.i],shade(BALLC[e.i])));
  if(e.v===0&&e.t>.5){cx.fillStyle='rgba(255,255,255,.9)';cx.font=`900 ${q.h*.3}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('oops',bx+q.h*.4,q.y+q.h*.3)}
  cx.globalAlpha=1}
 for(const e of effects)if(e.type==='plus'){const i=e.i,q=laneGeo(i),h=G.horses[i];const x=q.sx+(q.fx-q.sx)*h.shown/TRACK+q.h*.9,y=q.y+q.h*.15-e.t*8,r=q.h*.32;
  cx.globalAlpha=Math.max(0,1-e.t/2);blob(x,y,r,r,0,rg(x,y,r,'#9ff0a8','#3fbf5a','#2e9e44'));
  cx.fillStyle='#fff';cx.font=`900 ${r*1.05}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('+'+e.n,x,y+1);cx.globalAlpha=1}
}
function mix(a,b,f){const p=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];const A=p(a),B=p(b);return`rgb(${A.map((v,k)=>Math.round(v+(B[k]-v)*f)).join(',')})`}
function quad(x0,y0,x1,y1){const a=P(x0,y0),b=P(x1,y0),c=P(x1,y1),d=P(x0,y1);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.lineTo(c.x,c.y);cx.lineTo(d.x,d.y);cx.closePath()}
function shp(kind,x,y,sz,col,rot){const q=P(x,y);shpAt(kind,q.x,q.y,sz*L.S*q.k,.45+.3*q.t,col,rot)}
function shpAt(kind,X,Y,r,sy,col,rot){cx.save();cx.translate(X,Y);cx.scale(1,sy);cx.rotate(rot||0);cx.fillStyle=col;cx.strokeStyle=col;cx.lineWidth=Math.max(1,r*.18);cx.lineCap='round';cx.beginPath();
 if(kind==='star'){for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=(i%2?.45:1)*r;cx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}cx.fill()}
 else if(kind==='dot'){cx.arc(0,0,r,0,7);cx.fill()}
 else if(kind==='ring'){cx.arc(0,0,r,0,7);cx.stroke()}
 else if(kind==='leaf'){cx.ellipse(0,0,r,r*.45,0,0,7);cx.fill();cx.strokeStyle='rgba(0,0,0,.25)';cx.lineWidth=Math.max(.6,r*.08);cx.beginPath();cx.moveTo(-r,0);cx.lineTo(r,0);cx.stroke()}
 else if(kind==='flake'){for(let i=0;i<3;i++){cx.rotate(Math.PI/3);cx.moveTo(-r,0);cx.lineTo(r,0)}cx.stroke()}
 else if(kind==='wave'){cx.moveTo(-r*1.5,0);cx.quadraticCurveTo(-r*.75,-r*.6,0,0);cx.quadraticCurveTo(r*.75,r*.6,r*1.5,0);cx.stroke()}
 else if(kind==='cactus'){cx.fillRect(-r*.2,-r,r*.4,r*1.6);cx.fillRect(-r*.7,-r*.4,r*.5,r*.25);cx.fillRect(-r*.7,-r*.75,r*.25,r*.5);cx.fillRect(r*.2,-r*.2,r*.5,r*.25);cx.fillRect(r*.45,-r*.6,r*.25,r*.5)}
 else if(kind==='flask'){cx.fillStyle='rgba(255,255,255,.75)';cx.moveTo(-r*.25,-r);cx.lineTo(r*.25,-r);cx.lineTo(r*.25,-r*.3);cx.lineTo(r*.8,r*.8);cx.lineTo(-r*.8,r*.8);cx.lineTo(-r*.25,-r*.3);cx.closePath();cx.fill();cx.fillStyle=col;cx.beginPath();cx.moveTo(-r*.55,r*.35);cx.lineTo(r*.55,r*.35);cx.lineTo(r*.8,r*.8);cx.lineTo(-r*.8,r*.8);cx.fill();cx.beginPath();cx.arc(r*.1,-r*1.3,r*.18,0,7);cx.arc(-r*.15,-r*1.7,r*.12,0,7);cx.fill()}
 else if(kind==='beaker'){cx.fillStyle='rgba(255,255,255,.75)';cx.fillRect(-r*.6,-r*.8,r*1.2,r*1.6);cx.fillStyle=col;cx.fillRect(-r*.6,0,r*1.2,r*.8);cx.strokeStyle='rgba(60,80,90,.6)';cx.lineWidth=Math.max(.6,r*.08);for(let i=-1;i<2;i++){cx.beginPath();cx.moveTo(-r*.6,i*r*.3);cx.lineTo(-r*.3,i*r*.3);cx.stroke()}}
 else if(kind==='mol'){const pts=[[0,0],[r,-r*.4],[-r*.9,-r*.5],[r*.2,r]];cx.lineWidth=Math.max(.8,r*.12);cx.strokeStyle='rgba(60,80,90,.6)';pts.slice(1).forEach(p=>{cx.beginPath();cx.moveTo(0,0);cx.lineTo(p[0],p[1]);cx.stroke()});pts.forEach((p,i)=>{cx.fillStyle=i?'#2fa8ff':col;cx.beginPath();cx.arc(p[0],p[1],r*(i?.28:.38),0,7);cx.fill()})}
 else if(kind==='wand'){cx.strokeStyle='#222';cx.lineWidth=Math.max(1,r*.18);cx.moveTo(-r,r);cx.lineTo(r*.5,-r*.5);cx.stroke();cx.strokeStyle='#fff';cx.beginPath();cx.moveTo(-r,r);cx.lineTo(-r*.7,r*.7);cx.stroke();cx.beginPath();cx.fillStyle=col;for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=(i%2?.2:.45)*r;cx.lineTo(r*.6+Math.cos(a)*rr,-r*.6+Math.sin(a)*rr)}cx.fill()}
 else if(kind==='tophat'){cx.fillStyle='#1a1a2e';cx.fillRect(-r,r*.4,r*2,r*.3);cx.fillRect(-r*.6,-r*.8,r*1.2,r*1.25);cx.fillStyle=col;cx.fillRect(-r*.6,r*.1,r*1.2,r*.25)}
 else if(kind==='rainbow'){cx.lineWidth=Math.max(1,r*.18);['#ff3b3b','#ff9800','#ffeb3b','#4cdf50','#2fa8ff','#a65cff'].forEach((c,i)=>{cx.strokeStyle=c;cx.beginPath();cx.arc(0,r*.5,r*(1-i*.15),Math.PI,0);cx.stroke()})}
 else if(kind==='cloud'){[[-.5,0,.45],[0,-.25,.55],[.5,0,.45],[0,.15,.5]].forEach(c=>{cx.moveTo(c[0]*r+c[2]*r,c[1]*r);cx.arc(c[0]*r,c[1]*r,c[2]*r,0,7)});cx.fill()}
 else if(kind==='horn'){const g=cx.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#fff8d0');g.addColorStop(1,col);cx.fillStyle=g;cx.moveTo(0,-r*1.1);cx.lineTo(r*.35,r*.8);cx.lineTo(-r*.35,r*.8);cx.closePath();cx.fill();cx.strokeStyle='rgba(180,130,0,.6)';cx.lineWidth=Math.max(.6,r*.08);for(let i=0;i<3;i++){const y=-r*.4+i*r*.4,w=r*(.12+i*.1);cx.beginPath();cx.moveTo(-w,y+r*.1);cx.lineTo(w,y-r*.1);cx.stroke()}}
 else if(kind==='scale'){cx.lineWidth=Math.max(.8,r*.15);cx.arc(0,0,r,0,Math.PI);cx.stroke()}
 else if(kind==='feather'){cx.ellipse(0,0,r*.35,r,0,0,7);cx.fill();cx.strokeStyle='rgba(120,40,0,.6)';cx.lineWidth=Math.max(.6,r*.08);cx.beginPath();cx.moveTo(0,-r);cx.lineTo(0,r*1.2);cx.stroke();cx.fillStyle='#ffeb3b';cx.beginPath();cx.ellipse(0,-r*.4,r*.15,r*.35,0,0,7);cx.fill()}
 else if(kind==='wing'){cx.fillStyle='#ffffff';for(let i=0;i<4;i++){cx.beginPath();cx.ellipse(-r*.2+i*r*.25,-i*r*.2,r*.7-i*r*.1,r*.22,-.5,0,7);cx.fill()}}
 else if(kind==='castle'){cx.fillStyle='#d6d2c8';cx.fillRect(-r,-r*.3,r*2,r*1.1);cx.fillRect(-r,-r*.9,r*.5,r*.7);cx.fillRect(r*.5,-r*.9,r*.5,r*.7);for(let i=0;i<3;i++){cx.fillRect(-r+i*r*.75,-r*.5,r*.25,r*.25)}cx.fillStyle=col;cx.beginPath();cx.moveTo(-r*.75,-r*1.5);cx.lineTo(-r*.5,-r*.9);cx.lineTo(-r,-r*.9);cx.fill();cx.fillStyle='#5a4a3a';cx.beginPath();cx.arc(0,r*.8,r*.3,Math.PI,0);cx.fill()}
 else if(kind==='balloon'){const g=cx.createRadialGradient(-r*.3,-r*.5,r*.1,0,-r*.2,r);g.addColorStop(0,'#fff');g.addColorStop(.3,col);g.addColorStop(1,shade(col));cx.fillStyle=g;cx.ellipse(0,-r*.2,r*.75,r*.9,0,0,7);cx.fill();cx.strokeStyle='#fff';cx.lineWidth=Math.max(1,r*.06);cx.beginPath();cx.moveTo(0,r*.7);cx.quadraticCurveTo(r*.3,r*1.2,0,r*1.7);cx.stroke()}
 else if(kind==='bulb'){cx.fillStyle=col;cx.globalAlpha*=.35;cx.arc(0,0,r*1.8,0,7);cx.fill();cx.globalAlpha/=.35;cx.beginPath();cx.fillStyle='#fff';cx.arc(0,0,r*.7,0,7);cx.fill();cx.beginPath();cx.fillStyle=col;cx.arc(0,0,r*.5,0,7);cx.fill()}
 else if(kind==='fish'){cx.fillStyle=col;cx.ellipse(0,0,r,r*.6,0,0,7);cx.fill();cx.beginPath();cx.moveTo(-r*.8,0);cx.lineTo(-r*1.5,-r*.6);cx.lineTo(-r*1.5,r*.6);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(r*.5,-r*.15,r*.22,0,7);cx.fill();cx.fillStyle='#111';cx.beginPath();cx.arc(r*.55,-r*.15,r*.11,0,7);cx.fill();cx.strokeStyle='rgba(255,255,255,.6)';cx.lineWidth=r*.12;cx.beginPath();cx.moveTo(0,-r*.55);cx.lineTo(0,r*.55);cx.stroke()}
 else if(kind==='mush'){cx.fillStyle='#fff5e0';cx.fillRect(-r*.3,-r*.1,r*.6,r);cx.fillStyle=col;cx.arc(0,-r*.1,r,Math.PI,0);cx.fill();cx.fillStyle='#fff';[[-.5,-.45,.18],[.1,-.7,.2],[.55,-.35,.15]].forEach(d=>{cx.beginPath();cx.arc(d[0]*r,d[1]*r,d[2]*r,0,7);cx.fill()})}
 else if(kind==='tree'){cx.fillStyle='#6d4524';cx.fillRect(-r*.15,r*.3,r*.3,r*.7);[[.3,.9,'#2e7d32'],[-.2,.75,'#43a047'],[-.65,.55,'#66bb6a']].forEach(d=>{cx.fillStyle=d[2];cx.beginPath();cx.moveTo(0,(d[0]-d[1]*1.2)*r);cx.lineTo(d[1]*r,d[0]*r+r*.1);cx.lineTo(-d[1]*r,d[0]*r+r*.1);cx.fill()})}
 else if(kind==='lolly'){cx.fillStyle='#fff';cx.fillRect(-r*.07,0,r*.14,r*1.6);cx.fillStyle=col;cx.arc(0,0,r*.8,0,7);cx.fill();cx.strokeStyle='#fff';cx.lineWidth=r*.16;cx.beginPath();for(let t=0;t<12;t+=.3){const rr=r*.75*t/12;cx.lineTo(Math.cos(t)*rr,Math.sin(t)*rr)}cx.stroke()}
 else if(kind==='gum'){const g=cx.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);g.addColorStop(0,'#fff');g.addColorStop(.35,col);g.addColorStop(1,shade(col));cx.fillStyle=g;cx.moveTo(-r,r*.5);cx.quadraticCurveTo(-r,-r,0,-r);cx.quadraticCurveTo(r,-r,r,r*.5);cx.closePath();cx.fill()}
 else if(kind==='sun'){cx.fillStyle=col;for(let i=0;i<12;i++){cx.save();cx.rotate(i*Math.PI/6);cx.beginPath();cx.moveTo(-r*.18,-r*.7);cx.lineTo(0,-r*1.25);cx.lineTo(r*.18,-r*.7);cx.fill();cx.restore()}cx.beginPath();cx.fillStyle='#ffeb3b';cx.arc(0,0,r*.7,0,7);cx.fill();cx.fillStyle='#5d3a00';cx.beginPath();cx.arc(-r*.25,-r*.1,r*.08,0,7);cx.arc(r*.25,-r*.1,r*.08,0,7);cx.fill();cx.strokeStyle='#5d3a00';cx.lineWidth=r*.07;cx.beginPath();cx.arc(0,r*.05,r*.3,.3,Math.PI-.3);cx.stroke()}
 else if(kind==='pyr'){cx.fillStyle='#f5c26b';cx.moveTo(0,-r);cx.lineTo(r*1.2,r*.7);cx.lineTo(-r*1.2,r*.7);cx.fill();cx.fillStyle='#d99a3c';cx.beginPath();cx.moveTo(0,-r);cx.lineTo(r*1.2,r*.7);cx.lineTo(r*.2,r*.7);cx.fill()}
 else if(kind==='snowman'){cx.fillStyle='#fff';cx.arc(0,r*.45,r*.6,0,7);cx.moveTo(r*.4,-r*.3);cx.arc(0,-r*.3,r*.4,0,7);cx.fill();cx.fillStyle='#ff7a00';cx.beginPath();cx.moveTo(0,-r*.3);cx.lineTo(r*.45,-r*.25);cx.lineTo(0,-r*.2);cx.fill();cx.fillStyle='#111';[[-.14,-.4],[.14,-.4],[0,.25],[0,.5]].forEach(d=>{cx.beginPath();cx.arc(d[0]*r,d[1]*r,r*.06,0,7);cx.fill()});cx.fillStyle=col;cx.fillRect(-r*.45,-r*.05,r*.9,r*.14)}
 else if(kind==='planet'){const g=cx.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r*.8);g.addColorStop(0,'#fff');g.addColorStop(.3,col);g.addColorStop(1,shade(col));cx.fillStyle=g;cx.arc(0,0,r*.8,0,7);cx.fill();cx.strokeStyle='#ffe082';cx.lineWidth=r*.14;cx.beginPath();cx.ellipse(0,0,r*1.35,r*.35,-.35,0,7);cx.stroke()}
 else if(kind==='rocket'){cx.fillStyle='#ff9800';cx.beginPath();cx.moveTo(-r*.25,r*.7);cx.lineTo(0,r*(1.2+.3*Math.sin(time*25)));cx.lineTo(r*.25,r*.7);cx.fill();cx.fillStyle='#ffeb3b';cx.beginPath();cx.moveTo(-r*.13,r*.7);cx.lineTo(0,r*.95);cx.lineTo(r*.13,r*.7);cx.fill();cx.fillStyle='#e53935';cx.beginPath();cx.moveTo(-r*.3,r*.3);cx.lineTo(-r*.6,r*.75);cx.lineTo(r*.6,r*.75);cx.lineTo(r*.3,r*.3);cx.fill();cx.fillStyle='#eceff1';cx.beginPath();cx.moveTo(0,-r);cx.quadraticCurveTo(r*.45,-r*.4,r*.32,r*.7);cx.lineTo(-r*.32,r*.7);cx.quadraticCurveTo(-r*.45,-r*.4,0,-r);cx.fill();cx.fillStyle='#2fa8ff';cx.beginPath();cx.arc(0,-r*.1,r*.17,0,7);cx.fill();cx.fillStyle='#e53935';cx.beginPath();cx.moveTo(0,-r);cx.quadraticCurveTo(r*.25,-r*.75,r*.3,-r*.55);cx.lineTo(-r*.3,-r*.55);cx.quadraticCurveTo(-r*.25,-r*.75,0,-r);cx.fill()}
 else if(kind==='unihead'){cx.fillStyle='#fff';cx.ellipse(0,0,r*.55,r*.7,.3,0,7);cx.fill();cx.beginPath();cx.ellipse(r*.35,r*.45,r*.35,r*.28,.3,0,7);cx.fill();['#ff3b3b','#ff9800','#ffeb3b','#4cdf50','#2fa8ff','#a65cff'].forEach((c,i)=>{cx.fillStyle=c;cx.beginPath();cx.arc(-r*.5,-r*.5+i*r*.22,r*.2,0,7);cx.fill()});cx.fillStyle='#ffd54f';cx.beginPath();cx.moveTo(r*.05,-r*.6);cx.lineTo(r*.35,-r*1.35);cx.lineTo(r*.3,-r*.5);cx.fill();cx.fillStyle='#222';cx.beginPath();cx.arc(r*.15,-r*.05,r*.1,0,7);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(r*.18,-r*.08,r*.04,0,7);cx.fill()}
 else if(kind==='dragon'){cx.fillStyle=col;cx.ellipse(0,0,r*.6,r*.55,0,0,7);cx.fill();cx.beginPath();cx.ellipse(r*.5,r*.2,r*.45,r*.3,0,0,7);cx.fill();cx.fillStyle='#ffd54f';[[-.4,-.4],[-.05,-.6],[.3,-.45]].forEach(d=>{cx.beginPath();cx.moveTo(d[0]*r-r*.12,d[1]*r+r*.1);cx.lineTo(d[0]*r,d[1]*r-r*.3);cx.lineTo(d[0]*r+r*.12,d[1]*r+r*.1);cx.fill()});cx.fillStyle='#fff';cx.beginPath();cx.arc(r*.15,-r*.1,r*.17,0,7);cx.fill();cx.fillStyle='#111';cx.beginPath();cx.arc(r*.2,-r*.1,r*.09,0,7);cx.fill();cx.fillStyle='#ff7043';const f=.7+.3*Math.sin(time*9);cx.beginPath();cx.moveTo(r*.9,r*.2);cx.quadraticCurveTo(r*1.4,0,r*(1.3+.4*f),r*.25);cx.quadraticCurveTo(r*1.4,r*.45,r*.9,r*.3);cx.fill()}
 else if(kind==='bubble'){cx.strokeStyle='rgba(255,255,255,.9)';cx.lineWidth=Math.max(1,r*.15);cx.arc(0,0,r,0,7);cx.stroke();cx.fillStyle='rgba(255,255,255,.25)';cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(-r*.35,-r*.35,r*.2,0,7);cx.fill()}
 else if(kind==='spark'){cx.moveTo(0,-r);cx.quadraticCurveTo(0,0,r,0);cx.quadraticCurveTo(0,0,0,r);cx.quadraticCurveTo(0,0,-r,0);cx.quadraticCurveTo(0,0,0,-r);cx.fill()}
 else if(kind==='swirl'){for(let t=0;t<10;t+=.3){const rr=r*t/10;cx.lineTo(Math.cos(t)*rr,Math.sin(t)*rr)}cx.stroke()}
 cx.restore()}
function boardDeco(){const T=G.theme,k=T.pat,yb=AL+40;let sd=7;const R=()=>(sd=(sd*9301+49297)%233280)/233280;cx.save();
 if(k==='ocean'){for(let y=0;y<yb;y+=22)for(let x=8+(y/22%2)*9;x<100;x+=18){cx.globalAlpha=.28;shp('wave',x,y,3.2,'#ffffff')}for(let i=0;i<18;i++){cx.globalAlpha=.35;shp('ring',R()*96+2,R()*yb,1+R()*1.8,'#e8fbff')}}
 else if(k==='forest'){for(let i=0;i<13;i++){const x0=i*100/13,a=P(x0,-6),b=P(x0,yb);cx.strokeStyle='rgba(30,60,20,.25)';cx.lineWidth=Math.max(.6,L.S*.5);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}for(let i=0;i<30;i++){cx.globalAlpha=.45;shp('leaf',R()*96+2,R()*yb,2+R()*2,R()<.5?T.dc:'#2f6b24',R()*6)}}
 else if(k==='candy'){for(let i=-12;i<20;i++){cx.globalAlpha=.32;cx.fillStyle=i%2?'#ffffff':'#ffe66d';const x=i*9;const a=P(x,-6),b=P(x+5,-6),c=P(x+5+40,yb),d=P(x+40,yb);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.lineTo(c.x,c.y);cx.lineTo(d.x,d.y);cx.fill()}for(let i=0;i<12;i++){cx.globalAlpha=.5;shp('swirl',R()*92+4,R()*yb,2.5,'#ff5252')}}
 else if(k==='desert'){for(let y=6;y<yb;y+=14){cx.globalAlpha=.25;cx.strokeStyle='#a0682c';cx.lineWidth=Math.max(.8,L.S*.6);cx.beginPath();for(let x=0;x<=100;x+=5){const q=P(x,y+Math.sin(x*.12+y)*3);x?cx.lineTo(q.x,q.y):cx.moveTo(q.x,q.y)}cx.stroke()}for(let i=0;i<8;i++){cx.globalAlpha=.6;shp('cactus',R()*92+4,R()*yb,3,T.dc)}}
 else if(k==='snow'){for(let i=0;i<34;i++){cx.globalAlpha=.55;shp('flake',R()*96+2,R()*yb,1.2+R()*2,T.dc,R())}}
 else if(k==='space'){for(let i=0;i<60;i++){cx.globalAlpha=.4+R()*.5;shp('dot',R()*100,R()*yb,.3+R()*.6,'#ffffff')}for(let i=0;i<9;i++){cx.globalAlpha=.8;shp('star',R()*94+3,R()*yb,1.5+R()*1.5,T.dc)}cx.globalAlpha=.22;shp('ring',30,120,14,'#7ff7ff');shp('dot',30,120,9,'#6a5cff')}
 else if(k==='chem'){const L2=['flask','beaker','mol'],C2=['#39d353','#2fa8ff','#ffb300','#a65cff'];for(let i=0;i<16;i++){cx.globalAlpha=.6;shp(L2[i%3],R()*92+4,R()*yb,2.6,C2[i%4],0)}for(let i=0;i<24;i++){cx.globalAlpha=.4;shp('ring',R()*96+2,R()*yb,.6+R()*1.2,'#5fb8c8')}}
 else if(k==='magic'){for(let i=0;i<14;i++){cx.globalAlpha=.4;shp('swirl',R()*92+4,R()*yb,2.5,'#c9a0ff')}for(let i=0;i<20;i++){cx.globalAlpha=.75;shp('star',R()*94+3,R()*yb,1+R()*1.4,'#ffd54f')}for(let i=0;i<4;i++){cx.globalAlpha=.8;shp('wand',R()*90+5,R()*yb,3,'#ffd54f')}for(let i=0;i<3;i++){cx.globalAlpha=.8;shp('tophat',R()*90+5,R()*yb,3,'#ffd54f')}}
 else if(k==='uni'){for(let i=0;i<7;i++){cx.globalAlpha=.55;shp('rainbow',R()*88+6,R()*yb,4,'#fff')}for(let i=0;i<9;i++){cx.globalAlpha=.85;shp('cloud',R()*90+5,R()*yb,3,'#ffffff')}for(let i=0;i<6;i++){cx.globalAlpha=.85;shp('horn',R()*90+5,R()*yb,2.8,'#ffc107')}for(let i=0;i<16;i++){cx.globalAlpha=.8;shp('star',R()*94+3,R()*yb,.8+R(),'#fffbe0')}}
 else if(k==='myth'){for(let y=0;y<yb;y+=6)for(let x=(y/6%2)*4;x<=100;x+=8){cx.globalAlpha=.22;shp('scale',x,y,3.6,'#a8f0d0')}const F=['#ff7043','#ffb300','#e53935'];for(let i=0;i<8;i++){cx.globalAlpha=.75;shp('feather',R()*90+5,R()*yb,3,F[i%3],R()*2-1)}for(let i=0;i<4;i++){cx.globalAlpha=.8;shp('wing',R()*90+5,R()*yb,3.4,'#fff')}for(let i=0;i<3;i++){cx.globalAlpha=.85;shp('castle',R()*86+7,R()*yb,3.4,'#ff9800')}}
 else{for(let i=0;i<10;i++){cx.globalAlpha=.25;shp('star',R()*94+3,R()*yb,1.6,T.dc)}}
 cx.restore()}
function railDeco(x0,x1){const k=G.theme.pat,yb=AL+40;cx.save();quad(x0,-8,x1,yb);cx.clip();
 if(k==='candy'){for(let y=-20;y<yb;y+=12){cx.fillStyle='#ffffff';const a=P(x0,y),b=P(x1,y-4),c=P(x1,y+1),d=P(x0,y+5);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.lineTo(c.x,c.y);cx.lineTo(d.x,d.y);cx.fill()}}
 else if(k==='ocean'){for(let y=-6;y<yb;y+=7){cx.strokeStyle='rgba(120,90,50,.55)';cx.lineWidth=Math.max(.6,L.S*.5);const a=P(x0,y),b=P(x1,y+4);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
 else if(k==='forest'){for(let y=0;y<yb;y+=24){cx.globalAlpha=.7;shp('leaf',(x0+x1)/2,y,2.2,'#6fbf4a',.6)}}
 else if(k==='snow'){const a=P(x0,-8),b=P(x1,-8),c=P(x1,yb),d=P(x0,yb);cx.fillStyle='rgba(255,255,255,.55)';cx.fillRect(Math.min(a.x,d.x),a.y,Math.abs(b.x-a.x)*.5,c.y-a.y)}
 else if(k==='space'){for(let y=0;y<yb;y+=16)shp('dot',(x0+x1)/2,y,.8,'#fff6a0')}
 else if(k==='magic'||k==='uni'){for(let y=0;y<yb;y+=14)shp('star',(x0+x1)/2,y,1,k==='magic'?'#fff8c0':'#ffffff')}
 else if(k==='myth'){for(let y=0;y<yb;y+=10){const a=P(x0,y),b=P(x1,y);cx.strokeStyle='rgba(40,40,40,.5)';cx.lineWidth=Math.max(.6,L.S*.4);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
 else if(k==='desert'){for(let y=0;y<yb;y+=18)shp('dot',(x0+x1)/2,y,.7,'#fbe3b0')}
 cx.restore()}

const FXP={wood:{L:[['balloon','#ff3b3b'],['balloon','#2fa8ff'],['balloon','#ffeb3b'],['balloon','#4cdf50']],F:[['star','#ffd54f'],['balloon','#a65cff'],['star','#ffd54f']],lt:['#ffeb3b','#ff3b3b','#2fa8ff'],pt:'spark',pc:'#fff3a0'},
 ocean:{L:[['fish','#ff9800'],['fish','#ffeb3b'],['fish','#ff5252'],['fish','#4cdf50']],F:[['fish','#a65cff'],['bubble','#fff'],['fish','#ff9800']],lt:['#7ff7ff','#ffffff'],pt:'bubble',pc:'#fff',up:1},
 forest:{L:[['tree','#2e7d32'],['mush','#e53935'],['tree','#2e7d32'],['mush','#ff9800']],F:[['tree'],['mush','#e53935'],['tree']],lt:['#d4ff5a','#fff59d'],pt:'dot',pc:'#eaff7a'},
 candy:{L:[['lolly','#e53935'],['gum','#ffeb3b'],['lolly','#2fa8ff'],['gum','#4cdf50']],F:[['lolly','#a65cff'],['gum','#ff9800'],['lolly','#4cdf50']],lt:['#ff3b3b','#ffffff','#ffeb3b'],pt:'spark',pc:'#ffffff'},
 desert:{L:[['cactus','#43a047'],['pyr'],['cactus','#2e7d32'],['pyr']],F:[['pyr'],['sun','#ffb300'],['pyr']],lt:['#ffeb3b','#ff9800'],pt:'dot',pc:'#fff3c0'},
 snow:{L:[['snowman','#e53935'],['tree'],['snowman','#2fa8ff'],['tree']],F:[['tree'],['snowman','#4cdf50'],['tree']],lt:['#7fdcff','#ffffff'],pt:'flake',pc:'#ffffff',down:1},
 space:{L:[['planet','#ff9800'],['rocket'],['planet','#2fa8ff'],['rocket']],F:[['planet','#a65cff'],['rocket'],['planet','#4cdf50']],lt:['#7ff7ff','#ffeb3b','#a65cff'],pt:'star',pc:'#fff6a0'},
 chem:{L:[['flask','#39d353'],['beaker','#2fa8ff'],['flask','#a65cff'],['mol','#ffb300']],F:[['flask','#ff9800'],['mol','#39d353'],['beaker','#ffeb3b']],lt:['#39ff14','#00e5ff'],pt:'bubble',pc:'#c8fff0',up:1},
 magic:{L:[['wand','#ffd54f'],['tophat','#ffd54f'],['wand','#7ff7ff'],['swirl','#ffd54f']],F:[['tophat','#a65cff'],['star','#ffd54f'],['wand','#ffd54f']],lt:['#ffd54f','#c9a0ff'],pt:'spark',pc:'#ffe680'},
 uni:{L:[['unihead'],['rainbow'],['cloud','#ffffff'],['unihead']],F:[['rainbow'],['unihead'],['rainbow']],lt:['#ff3b3b','#ffeb3b','#4cdf50','#2fa8ff','#a65cff'],pt:'spark',pc:'#ffffff'},
 myth:{L:[['dragon','#43a047'],['wing'],['castle','#ff9800'],['dragon','#2fa8ff']],F:[['castle','#ff9800'],['dragon','#e53935'],['castle','#a65cff']],lt:['#ff9800','#ffeb3b'],pt:'feather',pc:'#ff7043',down:1}};
function alleyFx(){const T=G.theme,D=FXP[T.pat];if(!D)return;const S=L.S;cx.save();
 // chase lights along both rails
 let n=0;for(let y=0;y<AL+30;y+=16){for(const x of[-5,118]){const q=P(x,y),on=((n+((time*6)|0))%3)===0;cx.globalAlpha=on?1:.45;shpAt('bulb',q.x,q.y,1.5*S*q.k,1,D.lt[n%D.lt.length]);n++}}
 cx.globalAlpha=1;
 // far-end props
 D.F.forEach((p,i)=>{const q=P(15+i*35,-14),r=14*S*q.k,b=Math.sin(time*2+i)*r*.12;shpAt(p[0],q.x,q.y-r*.6+b,r,1,p[1]||'#fff',p[0]==='wand'?Math.sin(time*2)*.3:0)});
 // rail props, bobbing
 for(let i=0;i<4;i++)for(const sd of[0,1]){const p=D.L[(i+sd*2)%4],y=40+i*58+sd*29,q=P(sd?126:-16,y),r=11*S*q.k,b=Math.sin(time*2.2+i+sd*1.7)*r*.1;cx.globalAlpha=1;shpAt(p[0],q.x,q.y-r*.5+b,r,1,p[1]||'#fff',p[0]==='swirl'||p[0]==='mol'?time*1.5:p[0]==='fish'?(sd?Math.PI:0)*0:0)}
 // drifting particles on the board, kept away from holes
 for(let i=0;i<22;i++){const sp=.5+((i*37)%10)/12;let y=((i*53)%AL+(D.up?-1:D.down?1:0)*time*18*sp)%AL;if(y<0)y+=AL;const x=8+((i*61)%84)+Math.sin(time*1.3+i)*3;
  if(G.holes.some(h=>Math.hypot(h.x-x,h.y-y)<h.r+9))continue;const q=P(x,y),tw=.5+.5*Math.sin(time*4+i*1.9);cx.globalAlpha=.35+.45*tw;shpAt(D.pt,q.x,q.y,(1+tw*.6)*S*q.k*(D.pt==='bubble'?1.4:1.6),1,D.pc,D.pt==='feather'?Math.sin(time+i):time*.5)}
 // shimmer sweep
 {const ph=(time*.25)%1.6-.3,yy=AL*ph;const a=P(0,yy),b=P(0,yy+30);const g=cx.createLinearGradient(0,a.y,0,b.y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.14)');g.addColorStop(1,'rgba(255,255,255,0)');cx.globalAlpha=1;cx.fillStyle=g;quad(0,yy,100,yy+30);cx.fill()}
 cx.restore()}
function alleyStatic(){
 const S=L.S,yb=AL+40;   // board runs off the bottom edge, towards the player
 cx.save();
 // soft shadow under the board
 cx.shadowColor='rgba(40,60,20,.45)';cx.shadowBlur=18*S;cx.shadowOffsetY=6*S;quad(-10,-8,120,yb);cx.fillStyle='#7a4a26';cx.fill();cx.restore();
 // far end lip (front face facing us)
 {const a=P(-10,-8),b=P(120,-8);const th=7*S*a.k;cx.fillStyle='#5e381b';cx.fillRect(a.x,a.y-th,b.x-a.x,th);
  const g=cx.createLinearGradient(0,a.y-th,0,a.y);const LP=G.theme.lip||['#c58a55','#8a5a33'];g.addColorStop(0,LP[0]);g.addColorStop(1,LP[1]);cx.fillStyle=g;cx.fillRect(a.x,a.y-th,b.x-a.x,th*.6)}
 // side rails with bevel lighting
 const rail=(x0,x1,lit)=>{quad(x0,-8,x1,yb);const A=P(x0,AL),B=P(x1,AL);const g=cx.createLinearGradient(A.x,0,B.x,0);
  const R=G.theme.r||['#e3ae74','#c98d55','#8f5a30'];g.addColorStop(0,lit?R[0]:R[2]);g.addColorStop(.5,R[1]);g.addColorStop(1,lit?R[2]:R[0]);cx.fillStyle=g;cx.fill();railDeco(x0,x1)};
 rail(-10,0,true);rail(100,104,false);rail(116,120,false);
 // playfield wood, lit nearer the player
 quad(0,-6,100,yb);const pf=P(0,-6),pn=P(0,AL);const wg=cx.createLinearGradient(0,pf.y,0,pn.y);
 wg.addColorStop(0,shadeHex(G.theme[0],.72));wg.addColorStop(.45,G.theme[0]);wg.addColorStop(1,G.theme[1]);cx.fillStyle=wg;cx.fill();
 // planks + grain
 cx.save();quad(0,-6,100,yb);cx.clip();
 if((G.theme.pat||'wood')==='wood'){for(let i=0;i<13;i++){const x0=i*100/13;if(i%2){quad(x0,-6,x0+100/13,yb);cx.fillStyle='rgba(255,230,190,.07)';cx.fill()}
  const a=P(x0,-6),b=P(x0,yb);cx.strokeStyle='rgba(100,55,20,.28)';cx.lineWidth=Math.max(.6,S*.5);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
 for(let y=10;y<yb;y+=31){for(let i=0;i<13;i+=2){const x=(i+(y/31|0)%2)*100/13;const a=P(x,y),b=P(x+100/13,y);cx.strokeStyle='rgba(100,55,20,.18)';cx.lineWidth=Math.max(.5,S*.4*a.k);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}}
 boardDeco();
 // glossy sheen like varnished wood
 const sh=P(20,AL-20);const sg=cx.createRadialGradient(sh.x,sh.y,0,sh.x,sh.y,60*S);sg.addColorStop(0,'rgba(255,255,255,.35)');sg.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=sg;cx.fillRect(sh.x-60*S,sh.y-60*S,120*S,120*S);
 // far end falls into shade
 const fg=cx.createLinearGradient(0,pf.y,0,pf.y+L.ah*.25);fg.addColorStop(0,'rgba(60,30,10,.35)');fg.addColorStop(1,'rgba(60,30,10,0)');cx.fillStyle=fg;cx.fillRect(L.ax-20,pf.y,L.aw+40,L.ah*.25);
 cx.restore();
 // return trough: a sunken channel
 quad(104,-6,116,yb);{const a=P(104,AL),b=P(116,AL);const g=cx.createLinearGradient(a.x,0,b.x,0);const TR=G.theme.tr||['#2a170a','#6b4224'];g.addColorStop(0,TR[0]);g.addColorStop(.4,TR[1]);g.addColorStop(.7,TR[1]);g.addColorStop(1,TR[0]);cx.fillStyle=g;cx.fill()}
 cx.fillStyle='rgba(255,255,255,.35)';for(let y=30;y<AL;y+=40){const a=P(107,y),b=P(113,y),c=P(110,y+7);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.lineTo(c.x,c.y);cx.fill()}
 // tilt hint arrows
 if(G.gx){cx.fillStyle='rgba(255,255,255,.4)';cx.textAlign='center';cx.textBaseline='middle';for(let y=180;y<230;y+=25){const q=P(50,y);cx.font=`900 ${12*S*q.k}px system-ui`;cx.fillText(G.gx>0?'›':'‹',q.x,q.y)}}
 // foul line
 quad(0,221,100,223);cx.fillStyle='rgba(255,255,255,.6)';cx.fill();
 // holes: equal size, cut into the wood, with a visible far inner wall
 for(const h of G.holes){const c=P(h.x,h.y),rx=h.r*S*c.k,ry=rx*(.42+.3*c.t);
  cx.fillStyle='rgba(255,240,215,.55)';cx.beginPath();cx.ellipse(c.x,c.y+ry*.12,rx*1.12,ry*1.18,0,0,7);cx.fill();
  cx.fillStyle='rgba(90,50,20,.55)';cx.beginPath();cx.ellipse(c.x,c.y-ry*.06,rx*1.1,ry*1.12,0,0,7);cx.fill();
  cx.save();cx.beginPath();cx.ellipse(c.x,c.y,rx,ry,0,0,7);cx.clip();
  const wg2=cx.createLinearGradient(0,c.y-ry,0,c.y+ry);wg2.addColorStop(0,'#3a2412');wg2.addColorStop(.5,'#140b05');wg2.addColorStop(1,'#000');cx.fillStyle=wg2;cx.fillRect(c.x-rx,c.y-ry,rx*2,ry*2);
  const hg=cx.createRadialGradient(c.x,c.y+ry*.55,0,c.x,c.y+ry*.55,rx);hg.addColorStop(0,'#000');hg.addColorStop(.8,'#050505');hg.addColorStop(1,'rgba(0,0,0,.9)');
  cx.fillStyle=hg;cx.beginPath();cx.ellipse(c.x,c.y+ry*.5,rx*.97,ry*.95,0,0,7);cx.fill();
  cx.strokeStyle='rgba(0,0,0,.55)';cx.lineWidth=Math.max(2,ry*.5);cx.beginPath();cx.ellipse(c.x,c.y+ry*.12,rx,ry,0,Math.PI*1.05,Math.PI*1.95);cx.stroke();cx.restore();
  cx.strokeStyle='rgba(255,236,200,.7)';cx.lineWidth=Math.max(1.5,ry*.16);cx.beginPath();cx.ellipse(c.x,c.y+ry*.04,rx*1.02,ry*1.04,0,Math.PI*.12,Math.PI*.88);cx.stroke()
  {const NE=['#ffef00','#ff2a4f','#39ff14','#00b3ff'][(h.v-1)%4];cx.save();cx.shadowColor=NE;cx.shadowBlur=Math.max(6,rx*.5);cx.strokeStyle=NE;cx.lineWidth=Math.max(2,rx*.15);for(let k=0;k<2;k++){cx.beginPath();cx.ellipse(c.x,c.y,rx*1.1,ry*1.1,0,0,7);cx.stroke()}cx.shadowBlur=0;cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=Math.max(.8,rx*.045);cx.beginPath();cx.ellipse(c.x,c.y,rx*1.1,ry*1.1,0,0,7);cx.stroke();cx.restore()}
  }
}
function drawStar(x,y,r,t){cx.save();cx.translate(x,y);cx.rotate(Math.sin(t*2)*.15);const g=cx.createRadialGradient(0,-r*.3,0,0,0,r);g.addColorStop(0,'#fffde7');g.addColorStop(.5,'#ffd54f');g.addColorStop(1,'#f9a825');cx.fillStyle=g;cx.beginPath();for(let p=0;p<10;p++){const rr=p%2?r*.45:r,a=-Math.PI/2+p*Math.PI/5;cx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}cx.closePath();cx.fill();cx.strokeStyle='#e08e00';cx.lineWidth=Math.max(1,r*.08);cx.stroke();cx.restore()}
function drawAlley(){
 const S=L.S;cached('alley',()=>alleyStatic());alleyFx();
 for(const e of effects)if(e.type==='sparkle'&&e.t<1.1){const c=P(e.x,e.y),k=e.t/1.1,u=S*c.k,a=Math.max(0,1-k);
  cx.save();cx.globalCompositeOperation='lighter';const gl=cx.createRadialGradient(c.x,c.y,0,c.x,c.y,26*u*(.6+k));gl.addColorStop(0,`rgba(255,250,200,${.7*a})`);gl.addColorStop(1,'rgba(255,250,200,0)');cx.fillStyle=gl;cx.beginPath();cx.arc(c.x,c.y,26*u*(.6+k),0,7);cx.fill();cx.restore();
  for(let n=0;n<20;n++){const ang=e.seed+n*Math.PI*2/20,d=(8+46*Math.sqrt(k))*u*(.7+.3*(n%3)),px=c.x+Math.cos(ang)*d,py=c.y+Math.sin(ang)*d*.6-30*u*k*(n%2),sz=(6-3.5*k)*u*(n%2?1:.75)*(.8+.4*Math.sin(time*20+n));
   cx.globalAlpha=a;cx.fillStyle=['#ffeb3b','#4fc3f7','#aed581','#ffb74d','#ffffff','#fff59d'][n%6];cx.beginPath();for(let p=0;p<8;p++){const rr=p%2?sz*.38:sz,aa=p*Math.PI/4+time*3;cx.lineTo(px+Math.cos(aa)*rr,py+Math.sin(aa)*rr)}cx.closePath();cx.fill()}cx.globalAlpha=1}
 for(const h of G.holes)if(h.bonus){const c=P(h.x,h.y),u=S*c.k;cx.save();for(let k=0;k<8;k++){const an=k*Math.PI/4+time*.6,ph=time*2.2+k*1.3,al=.35+.65*Math.max(0,Math.sin(ph));cx.globalAlpha=al;drawStar(c.x+Math.cos(an)*h.r*u*1.55,c.y+Math.sin(an)*h.r*u*.75*1.55,(2.2+1.3*Math.sin(ph))*u,ph)}cx.restore();const y=c.y-h.r*u*.55-12*u+Math.sin(time*3)*2*u;drawStar(c.x,y,8*u,time);cx.fillStyle='#fff';cx.strokeStyle='#7a4a00';cx.lineWidth=3;cx.font=`900 ${9*u}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.strokeText('×2',c.x,y+.5*u);cx.fillText('×2',c.x,y+.5*u)}
 for(const e of effects)if(e.type==='ring'){const c=P(e.x,e.y),r=(8+e.t*30)*S*c.k;cx.strokeStyle=e.c;cx.globalAlpha=Math.max(0,1-e.t);cx.lineWidth=3;cx.beginPath();cx.ellipse(c.x,c.y,r,r*(.42+.3*c.t),0,0,7);cx.stroke();cx.globalAlpha=1}
 // ball
 const bc=BALLC[G.turn];let bx=ball.x,by=ball.y,bs=1,sink=0;
 if(state==='dropping'){let k=Math.min(1,anim.t/.16);k=k*k;bx=anim.x+(anim.h.x-anim.x)*k;by=anim.y+(anim.h.y-anim.y)*k;sink=k}
 else if(state==='returning'){
  if(anim.type==='trough'){const k=anim.t/.65;if(k<.7){bx=110;by=anim.y+(AL-6-anim.y)*(k/.7)}else{const q=(k-.7)/.3;bx=110+(START.x-110)*q;by=AL-6+(START.y-(AL-6))*q}}
  else{const k=anim.t/.4;bx=anim.x+(START.x-anim.x)*k;by=anim.y+(START.y-anim.y)*k}}
 else if(state==='galloping'||state==='finish'){bx=START.x;by=START.y}
 if(state==='returning'){const gy=anim.type==='trough'?Math.min(AL,by):(anim.t/.4)*AL;for(let y=30,j=0;y<AL;y+=40,j++)if(gy>=y&&!GUT[j])GUT[j]=time}else if(state==='aim'||state==='menu')GUT.length=0;
 if(GUT.length){const GC=['#ff3b3b','#ff9800','#ffeb3b','#4cdf50','#2fa8ff','#a65cff'];cx.save();for(let y=30,j=0;y<AL;y+=40,j++){if(!GUT[j])continue;const e=time-GUT[j],a=Math.max(.35,1-e*1.2);const A=P(107,y),B=P(113,y),C=P(110,y+7),col=GC[j%6];
   cx.globalAlpha=a;cx.shadowColor=col;cx.shadowBlur=14*S;cx.fillStyle=col;cx.beginPath();cx.moveTo(A.x,A.y);cx.lineTo(B.x,B.y);cx.lineTo(C.x,C.y);cx.closePath();cx.fill();cx.fill();
   if(e<.25){cx.globalAlpha=(.25-e)*3;cx.fillStyle='#fff';cx.beginPath();cx.arc((A.x+B.x+C.x)/3,(A.y+B.y+C.y)/3,6*S*A.k,0,7);cx.fill()}}cx.restore()}
 drawBall(bx,by,bs,bc,sink);
 if(state==='aim'&&!drag){const pulse=(Math.sin(time*5)+1)/2;const a=P(START.x,START.y-14),b=P(START.x,START.y-70);cx.strokeStyle=`rgba(255,255,255,${.4+pulse*.4})`;cx.lineWidth=3;cx.setLineDash([6,8]);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();cx.setLineDash([]);
  const f=P(START.x+16,START.y+6+pulse*-8);cx.font=`${20*S}px system-ui`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('👆',f.x,f.y)}
 if(drag&&drag.pts.length>1){const a=drag.pts[0],b=drag.pts[drag.pts.length-1];cx.strokeStyle='rgba(255,255,255,.8)';cx.lineWidth=4;cx.beginPath();cx.moveTo(a.px,a.py);cx.lineTo(b.px,b.py);cx.stroke()}
}
function drawBall(x,y,sc,c,sink=0){const q=P(x,y),r=BR*L.S*q.k*sc,ry=r*(.42+.3*q.t);
 cx.save();
 if(sink>0){const hy=q.y;cx.beginPath();cx.rect(q.x-3*r,hy-4*r,6*r,4*r+ry*.4);cx.clip()}
 if(!sink){cx.fillStyle='rgba(40,20,5,.3)';cx.beginPath();cx.ellipse(q.x+r*.35,q.y+ry*.2,r*1.05,ry*1.1,0,0,7);cx.fill()}
 const cy=q.y-r*.85+sink*r*2.2;
 ballPat(cx,q.x,cy,r,BALL(),(y+x)*.06);cx.restore()}
function shadeHex(c,f){const n=parseInt(c.slice(1),16);return`rgb(${(n>>16)*f|0},${(n>>8&255)*f|0},${(n&255)*f|0})`}
function shade(c){const n=parseInt(c.slice(1),16);const r=(n>>16)*.6|0,g=(n>>8&255)*.6|0,b=(n&255)*.6|0;return`rgb(${r},${g},${b})`}
function drawX2(){for(const e of effects)if(e.type==='x2'&&e.t<1.3){const w=W(),h=H(),k=Math.min(1,e.t*5),a=Math.min(1,(1.3-e.t)*3),sz=Math.min(w,h)*.12*(0.6+.4*k);
 cx.globalAlpha=a;drawStar(w/2-sz*.9,h*.5,sz*.7,time);drawStar(w/2+sz*.9,h*.5,sz*.7,time+1);cx.font=`900 ${sz}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.lineWidth=sz*.12;cx.strokeStyle='#7a4a00';cx.strokeText('×2',w/2,h*.5);cx.fillStyle='#ffd54f';cx.fillText('×2',w/2,h*.5);cx.globalAlpha=1}}
function drawMsg(){if(!msg)return;const w=W(),k=Math.min(1,msg.t*4),a=Math.min(1,(msg.d-msg.t)*3);cx.globalAlpha=Math.max(0,a);
 const fs=Math.min(w*.09,54),y=L.track.y+L.track.h+fs*1.1;cx.font=`900 ${fs*k}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.lineWidth=fs*.18;cx.strokeStyle='#fff';cx.strokeText(msg.text,w/2,y);cx.fillStyle=msg.c;cx.fillText(msg.text,w/2,y);cx.globalAlpha=1}
function drawFinish(){
 const w=W(),h=H();cx.fillStyle='rgba(255,250,235,.92)';cx.fillRect(0,0,w,h);
 const win=G.horses[G.podium[0]];const txt=win.human?(G.humans===1?'YOU WIN!':'HOORAY!'):'HOORAY!';
 const fs=Math.min(w*.13,h*.1);cx.font=`900 ${fs}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';
 const cols=['#e53935','#fb8c00','#fbc02d','#43a047','#1e88e5','#8e24aa'];let x0=w/2-cx.measureText(txt).width/2;
 for(let i=0;i<txt.length;i++){const ch=txt[i],cw=cx.measureText(ch).width;cx.fillStyle=cols[i%6];cx.fillText(ch,x0+cw/2,h*.14+Math.sin(time*4+i)*4);x0+=cw}
 const up=!$('picker').classList.contains('hide')&&!$('end').classList.contains('hide'),base=up?h*.5:h*.68,pw=up?Math.min(w*.2,h*.15):Math.min(w*.26,h*.22),hts=[h*.2,h*.14,h*.1],xs=[w/2,w/2-pw,w/2+pw];
 [1,2,0].forEach(p=>{const x=xs[p],ph=hts[p];rr(x-pw/2+4,base-ph,pw-8,ph,10);cx.fillStyle=['#ffd23f','#cfd8dc','#e0a96d'][p];cx.fill();
  cx.fillStyle='#fff';cx.font=`900 ${ph*.5}px system-ui`;cx.fillText(p+1,x,base-ph/2);
  drawHorse(x,base-ph-pw*.24,pw/75,G.podium[p],time*6,p===0);});
 const fourth=G.podium[3];drawHorse(w/2+pw*1.9>w-30?w-40:w/2+pw*1.9,base-10,pw/120,fourth,time*6,false);
 // gentle fireworks for a win
 if(G.horses[G.podium[0]].human){const FC=['#ffb300','#1e88e5','#43a047','#fb8c00','#8e24aa','#00acc1','#e53935'];cx.save();
  for(let b=0;b<5;b++){const per=1.8,t0=time+b*.37,cyc=Math.floor(t0/per),k=(t0%per)/per;const bx=w*(.12+((cyc*.37+b*.23)%1)*.76),by=h*(.08+((cyc*.53+b*.31)%1)*.25),R=Math.min(w,h)*(.07+.03*(b%2)),col=FC[(cyc+b)%FC.length];
   if(k<.15){cx.globalAlpha=.6;cx.fillStyle=col;cx.beginPath();cx.arc(bx,by+(1-k/.15)*h*.25,2.5,0,7);cx.fill();continue}
   const e=(k-.15)/.85,r=R*(1-Math.pow(1-e,3)),a=Math.max(0,1-e);cx.fillStyle=col;
   for(let p=0;p<14;p++){const an=p/14*Math.PI*2;cx.globalAlpha=a*.85;cx.beginPath();cx.arc(bx+Math.cos(an)*r,by+Math.sin(an)*r+e*e*12,2.6*(1-e*.5),0,7);cx.fill();cx.globalAlpha=a*.35;cx.beginPath();cx.arc(bx+Math.cos(an)*r*.6,by+Math.sin(an)*r*.6+e*e*8,1.8,0,7);cx.fill()}
   if(e<.25){cx.globalAlpha=(.25-e)*2;cx.fillStyle='#fff59d';cx.beginPath();cx.arc(bx,by,R*.25,0,7);cx.fill()}}
  cx.restore()}
 // confetti
 for(let i=0;i<60;i++){const x=(i*97+time*40*(1+i%3))%w,y=(i*53+time*90*(1+i%4))%h;cx.fillStyle=cols[i%6];cx.fillRect(x,y,6,10)}
}
const BGS=[
 ['meadow','#9fdcff','#d8f2ff','#bfe9ff','#9be08a','#6fc25d',['#b5e6a0','#93d67e','#77c765'],'#8fd27a','sun'],
 ['golden','#ffd27a','#fff1c9','#ffe3a3','#c9df7a','#9cc25a',['#e4e39a','#c6d873','#a6c95b'],'#bcd96e','bunting'],
 ['seaside','#7fd8f0','#e3f8ff','#a8e6f7','#f3dfa6','#e6c47f',['#9fd8ee','#5bbbe0','#f1d79a'],'#f0d796','balloons'],
 ['evening','#8fa3f0','#ffd9a8','#a9b8f5','#7fcfa6','#4fae86',['#9fd6c0','#78c3a6','#58b08e'],'#86cfa8','stars'],
 ['autumn','#a9d8ff','#fff3d6','#c4e4ff','#e0b45c','#c98a3c',['#e8c56f','#d9a24b','#c2843a'],'#d8b25a','leaves'],
 ['night','#1f2f6b','#4a5fa8','#283a7c','#3f8a6a','#2c6b50',['#3d6f8f','#3a7f6a','#2f6e55'],'#3f8a6a','lights']];
function bgT(){return BGS[((G?G.level:1)-1)%BGS.length]}
function drawDeco(w,h){const T=bgT(),d=T[8];
 if(d==='sun'){cx.fillStyle='rgba(255,236,120,.9)';cx.beginPath();cx.arc(w*.88,h*.08,Math.min(w,h)*.05,0,7);cx.fill()}
 else if(d==='bunting'){for(let r=0;r<2;r++){const y0=h*(.05+r*.07);cx.strokeStyle='rgba(120,80,40,.5)';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(0,y0);cx.quadraticCurveTo(w/2,y0+18,w,y0);cx.stroke();
  for(let k=0;k<14;k++){const x=(k+.5)*w/14,y=y0+18*(1-Math.pow(2*x/w-1,2))*.5;cx.fillStyle=['#e53935','#fbc02d','#1e88e5','#43a047','#fb8c00','#8e24aa'][(k+r)%6];cx.beginPath();cx.moveTo(x-7,y);cx.lineTo(x+7,y);cx.lineTo(x,y+12+Math.sin(time*2+k)*1.5);cx.fill()}}}
 else if(d==='balloons'){for(let k=0;k<5;k++){const x=w*(.1+k*.2)+Math.sin(time*.6+k)*8,y=h*(.12+.05*(k%2))-((time*8+k*40)%(h*.15));cx.strokeStyle='rgba(80,80,80,.4)';cx.lineWidth=1;cx.beginPath();cx.moveTo(x,y+12);cx.lineTo(x,y+30);cx.stroke();cx.fillStyle=['#1e88e5','#fbc02d','#43a047','#fb8c00','#e53935'][k];cx.beginPath();cx.ellipse(x,y,9,12,0,0,7);cx.fill()}}
 else if(d==='stars'||d==='lights'){for(let k=0;k<22;k++){const x=(k*137.5%100)/100*w,y=(k*61.8%30)/100*h,a=.5+.5*Math.sin(time*2+k);cx.fillStyle=`rgba(255,250,200,${.4+.5*a})`;cx.beginPath();cx.arc(x,y,1.2+(k%3)*.6,0,7);cx.fill()}
  if(d==='lights'){cx.strokeStyle='rgba(255,255,255,.35)';cx.lineWidth=1;cx.beginPath();cx.moveTo(0,h*.04);cx.quadraticCurveTo(w/2,h*.1,w,h*.04);cx.stroke();for(let k=0;k<18;k++){const x=(k+.5)*w/18,y=h*.04+h*.06*(1-Math.pow(2*x/w-1,2))*.5;cx.fillStyle=['#ffeb3b','#4fc3f7','#aed581','#ffb74d'][k%4];cx.globalAlpha=.6+.4*Math.sin(time*3+k);cx.beginPath();cx.arc(x,y+3,3,0,7);cx.fill()}cx.globalAlpha=1}}
 else if(d==='leaves'){for(let k=0;k<10;k++){const x=((k*w/9+time*14)%(w+40))-20,y=h*.05+((time*18+k*53)%(h*.35));cx.fillStyle=['#e67e22','#f4b400','#c0592b','#d4a017'][k%4];cx.save();cx.translate(x,y);cx.rotate(time+k);cx.beginPath();cx.ellipse(0,0,5,2.6,0,0,7);cx.fill();cx.restore()}}}
function drawParallax(){const w=W(),h=H(),bx=(typeof ball!=='undefined'&&ball?ball.x-50:0)/50;
 const HC=bgT()[6];drawDeco(w,h);const layers=[[.30,HC[0],.06,26,.9],[.42,HC[1],.11,34,1.3],[.56,HC[2],.18,44,1.8]];
 for(const [yy,col,amp,hh,sp] of layers){const off=-bx*amp*w*.15+Math.sin(time*.15*sp)*6*sp;cx.fillStyle=col;cx.beginPath();cx.moveTo(-20,h);
  for(let x=-20;x<=w+20;x+=16){cx.lineTo(x,h*yy-hh*(.6+.4*Math.sin((x-off)/(w*.16)+sp)))}cx.lineTo(w+20,h);cx.closePath();cx.fill()}
 for(let k=0;k<6;k++){const x=((k*w/5+time*(6+k%3*3)-bx*w*.02*(1+k%3))%(w+80)+w+80)%(w+80)-40,y=h*(.62+.06*(k%3));
  cx.fillStyle=['#ffeb3b','#fff','#ffb74d','#4fc3f7','#fff','#aed581'][k];cx.globalAlpha=.55;cx.beginPath();cx.arc(x,y,3+k%2,0,7);cx.fill()}cx.globalAlpha=1}
function frame(now){const dt=Math.min(.05,(now-lastT)/1000)*SPEED;lastT=now;
 if(G&&state!=='menu')update(dt);else time+=dt;
 cx.clearRect(0,0,W(),H());
 const bg=cx.createLinearGradient(0,0,0,H());const T=bgT();bg.addColorStop(0,T[3]);bg.addColorStop(.35,T[4]);bg.addColorStop(1,T[5]);cx.fillStyle=bg;cx.fillRect(0,0,W(),H());
 if(G)drawParallax();
 if(G){drawTrack();const sk=shake>0?shake*14:0;cx.save();cx.translate(0,sk*Math.sin(time*90)*.5+sk*.3);drawAlley();cx.restore();drawMsg();drawX2();if(state==='finish')drawFinish()}
 requestAnimationFrame(frame)}
// ---------- input ----------
cv.addEventListener('pointerdown',e=>{unlock();if(state!=='aim')return;const p=toWorld(e.offsetX,e.offsetY);
 if(p.y<150||p.x<-5||p.x>AW+5)return;
 drag={id:e.pointerId,pts:[{x:p.x,y:p.y,px:e.offsetX,py:e.offsetY,t:performance.now()}]};ball.x=Math.max(BR,Math.min(AW-BR,p.x));try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const p=toWorld(e.offsetX,e.offsetY);drag.pts.push({x:p.x,y:p.y,px:e.offsetX,py:e.offsetY,t:performance.now()});if(drag.pts.length>30)drag.pts.shift();
 if(p.y>200){ball.x=Math.max(BR,Math.min(AW-BR,p.x));ball.y=Math.max(205,Math.min(START.y+8,p.y))}});
function release(e){if(!drag||e.pointerId!==drag.id)return;const now=performance.now();const all=drag.pts,last=all[all.length-1].t;let pts=all.filter(q=>last-q.t<80);if(pts.length<2)pts=all.slice(-2);drag=null;if(now-last>350)pts=[];
 if(pts.length<2||state!=='aim'){ball.x=START.x;ball.y=START.y;return}
 const a=pts[0],b=pts[pts.length-1],dt=Math.max(.016,(b.t-a.t)/1000);let vx=(b.x-a.x)/dt,vy=(b.y-a.y)/dt;
 if(vy>-60){ball.x=START.x;ball.y=START.y;return} // too gentle or wrong way: just put the ball back
 vx*=.85;launch(vx,vy*1.0)}
cv.addEventListener('pointerup',release);cv.addEventListener('pointercancel',e=>{drag=null;ball.x=START.x;ball.y=START.y});
// ---------- menus ----------
function buildMenu(){save.players=1;if($('cupcount'))$('cupcount').textContent='🏆'+save.wins;const p=$('picks');if(p){p.innerHTML='';}if(p)for(let n=1;n<=4;n++){const b=document.createElement('button');b.className='pick'+(save.players===n?' sel':'');b.style.background=`conic-gradient(${COLORS.slice(0,n).map((c,i)=>`${c.c} ${i*100/n}% ${(i+1)*100/n}%`).join(',')})`;b.textContent=n;b.onclick=()=>{unlock();save.players=n;persist();buildMenu();SFX.ding(1)};p.appendChild(b)}
 $('stars').textContent='Race '+save.level+'  '+'★'.repeat(Math.min(5,Math.ceil(save.level/2)))}
function begin(){unlock();$('stable').classList.add('hide');$('stable').classList.remove('on');$('menu').classList.add('hide');$('menu').classList.remove('on');$('end').classList.add('hide');$('end').classList.remove('on');$('home').classList.remove('hide');
 G=makeRace(save.level,1);effects=[];startTurn()}
function home(){SFX.rollStop();state='menu';G=null;$('end').classList.add('hide');$('menu').classList.remove('hide');$('menu').classList.add('on');$('home').classList.add('hide');buildMenu()}
function portrait(pony,hat,cape){const c=document.createElement('canvas');c.width=160;c.height=130;const g=c.getContext('2d');const real=cx;cx=g;try{
 if(cape!=null){g.translate(95,85);g.scale(3,3);g.translate(8,8);drawCape(cape,0)}else if(pony!=null){PORTRAIT=pony;HATNONE=true;drawHorse(70,92,1.35,0,0,false)}else{g.translate(80,90);g.scale(3.2,3.2);g.translate(-25,36);drawHat(hat)}}finally{cx=real;PORTRAIT=null;HATNONE=false}return c.toDataURL()}
const _pc={};function pimg(k,pony,hat,cape){return _pc[k]||(_pc[k]=portrait(pony,hat,cape))}
function tile(src,locked,need,sel,onclick){const b=document.createElement('button');b.className='tile'+(locked?' lock':'')+(sel?' sel':'');const im=new Image();im.src=src;b.appendChild(im);
 if(locked){const n=document.createElement('div');n.className='num';n.textContent=need;b.appendChild(n)}b.onclick=()=>{unlock();if(locked){SFX.bump&&SFX.bump();return}onclick()};return b}
function buildStable(P=$('ponies'),Hh=$('hats'),nu=[]){if(P.id==='ponies')$('stablecups').textContent='🏆 '+save.wins;const re=()=>{const rs=[P,Hh,$('endcapes'),$('endballs'),$('endalleys')].map(e=>e.scrollLeft);buildStable(P,Hh,nu);[P,Hh,$('endcapes'),$('endballs'),$('endalleys')].forEach((e,j)=>e.scrollLeft=rs[j])};P.innerHTML='';Hh.innerHTML='';
 STABLE_ORDER.forEach(k=>{const p=STABLE[k];const b=tile(pimg('p'+k,k),save.wins<p.w,p.w,PONY()===k,()=>{save.pony=k;persist();SFX.ding(1);re()});if(nu.some(u=>u.pony===k))b.classList.add('new');P.appendChild(b)});
 HAT_ORDER.forEach(k=>{const x=HATS[k];const b=tile(k?pimg('h'+k,null,k):'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 130"><circle cx="80" cy="65" r="34" fill="none" stroke="#b0bec5" stroke-width="10"/><line x1="56" y1="89" x2="104" y2="41" stroke="#b0bec5" stroke-width="10"/></svg>'),save.wins<x.w,x.w,HAT()===k,()=>{save.hat=k;persist();SFX.ding(1);re()});if(nu.some(u=>u.hat===k))b.classList.add('new');Hh.appendChild(b)});
 const Cc=P.id==='endponies'?$('endcapes'):null;if(Cc){Cc.innerHTML='';CAPE_ORDER.forEach(k=>{const x=CAPES[k];const b=tile(k?pimg('c'+k,null,null,k):Hh.firstChild.querySelector('img').src,save.wins<x.w,x.w,CAPE()===k,()=>{save.cape=k;persist();SFX.ding(1);re()});if(nu.some(u=>u.cape===k))b.classList.add('new');Cc.appendChild(b)});const Bb=$('endballs');Bb.innerHTML='';BALLS.forEach((x,k)=>{const b=tile(ballImg(k),save.wins<x.w,x.w,BALL()===k,()=>{save.ball=k;persist();SFX.ding(1);re()});b.title=x.n;if(nu.some(u=>u.ball===k))b.classList.add('new');Bb.appendChild(b)});const Ab=$('endalleys');Ab.innerHTML='';ALLEY_ORDER.forEach(k=>{const x=ALLEYS[k];const b=tile(alleyImg(k),save.wins<x.w,x.w,ALLEY()===k,()=>{save.alley=k;persist();SFX.ding(1);re()});b.title=x.n;if(nu.some(u=>u.alley===k))b.classList.add('new');Ab.appendChild(b)})}}
function openStable(){unlock();buildStable();$('menu').classList.add('hide');$('menu').classList.remove('on');$('stable').classList.remove('hide');$('stable').classList.add('on')}
function closeStable(){$('stable').classList.add('hide');$('stable').classList.remove('on');$('menu').classList.remove('hide');$('menu').classList.add('on');buildMenu()}
function showUnlocks(){const won=G&&G.horses[G.podium[0]].human;$('picker').classList.toggle('hide',!won);$('end').classList.toggle('won',!!won);if(won)buildStable($('endponies'),$('endhats'),G.newUnlocks||[])}
$('stablebtn').onclick=openStable;$('stabledone').onclick=closeStable;
$('play').onclick=begin;$('next').onclick=begin;$('again').onclick=home;$('home').onclick=home;
$('mute').onclick=()=>{save.muted=!save.muted;persist();$('mute').textContent=save.muted?'🔇':'🔊';if(save.muted){SFX.rollStop();musicStop()}else{unlock();musicStart()}};
$('music').onclick=()=>{unlock();save.music=save.music===false;persist();musicIcon();if(save.music)musicStart();else musicStop()};
function musicIcon(){$('music').classList.toggle('off',save.music===false)}musicIcon();
window.__music=MUS;$('mute').textContent=save.muted?'🔇':'🔊';
document.addEventListener('visibilitychange',()=>{if(document.hidden)SFX.rollStop()});
window.addEventListener('resize',layout);window.addEventListener('orientationchange',()=>setTimeout(layout,200));
document.addEventListener('gesturestart',e=>e.preventDefault());
layout();buildMenu();
// demo race behind the menu
G=makeRace(save.level,1);state='menu';
requestAnimationFrame(frame);
// test hooks (harmless in play)
window.__sheet=(c,ponies,hats,ph,capes)=>{const g=c.getContext('2d');const real=cx,sh=save.hat,sw=save.wins,sc=save.cape;cx=g;save.wins=99;try{g.fillStyle='#e8f0f8';g.fillRect(0,0,c.width,c.height);ponies.forEach((p,r)=>hats.forEach((h,k)=>{PORTRAIT=p;save.hat=h;save.cape=capes?capes[k]:0;drawHorse(110+k*260,170+r*250,3.2,0,ph||0,false)}))}finally{cx=real;PORTRAIT=null;save.hat=sh;save.wins=sw;save.cape=sc}};
window.__gr={drawHorse:(...a)=>drawHorse(...a),get state(){return state},get G(){return G},get ball(){return ball},launch:(vx,vy)=>{if(state==='aim')launch(vx,vy)},begin,home,save:()=>save,win:()=>{G.finishOrder=[0];finishRace()},toScreen:(x,y)=>{const q=P(x,y);return{x:q.x,y:q.y}}};
})();
