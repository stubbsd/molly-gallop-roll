'use strict';
(()=>{
const COLORS=[{n:'Red',c:'#e53935',d:'#a91f1c',l:'#ff8a80'},{n:'Yellow',c:'#fbc02d',d:'#c08a00',l:'#fff176'},{n:'Blue',c:'#1e88e5',d:'#115a9e',l:'#90caf9'},{n:'Green',c:'#43a047',d:'#2a6e2d',l:'#a5d6a7'}];
const BALLC=['#ff3b30','#ffcc00','#2f80ff','#34c759'];
const AW=100,AL=260,BR=6.5,START={x:50,y:238},TRACK=16;
const SPEED=Math.max(1,Math.min(10,+(new URLSearchParams(location.search).get('speed')||1)));
const cv=document.getElementById('c');let cx=cv.getContext('2d');let shake=0;
const $=id=>document.getElementById(id);
// ---------- storage ----------
const SKEY='mollyGallopRoll.v1';
let save={level:1,players:1,wins:0,races:0,muted:false};
try{Object.assign(save,JSON.parse(localStorage.getItem(SKEY)||'{}'))}catch(e){}
const persist=()=>{try{localStorage.setItem(SKEY,JSON.stringify(save))}catch(e){}};
// ---------- seeded rng ----------
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
// ---------- audio ----------
let AC=null,noiseBuf=null,rollNode=null,rollGain=null;
function audio(){if(AC)return AC;try{AC=new (window.AudioContext||window.webkitAudioContext)();const len=AC.sampleRate;noiseBuf=AC.createBuffer(1,len,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1}catch(e){AC=null}return AC}
function unlock(){const a=audio();if(a&&a.state==='suspended')a.resume()}
function tone(f,t0,dur,type='sine',vol=.2,f2){if(save.muted||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.01);g.gain.exponentialRampToValueAtTime(.001,t0+dur);o.connect(g).connect(AC.destination);o.start(t0);o.stop(t0+dur+.02)}
function noise(t0,dur,vol,freq,q=1,type='bandpass'){if(save.muted||!AC)return;const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=AC.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(f).connect(g).connect(AC.destination);s.start(t0,Math.random()*.5);s.stop(t0+dur)}
const SFX={
 rollStart(){if(!AC||save.muted||rollNode)return;rollNode=AC.createBufferSource();rollNode.buffer=noiseBuf;rollNode.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=380;f.Q.value=.8;rollGain=AC.createGain();rollGain.gain.value=0;rollNode.connect(f).connect(rollGain).connect(AC.destination);rollNode.start()},
 roll(sp){if(rollGain)rollGain.gain.setTargetAtTime(Math.min(.25,sp/900)*(.7+.3*Math.random()),AC.currentTime,.03)},
 rollStop(){if(rollNode){try{rollGain.gain.setTargetAtTime(0,AC.currentTime,.03);rollNode.stop(AC.currentTime+.15)}catch(e){}rollNode=null;rollGain=null}},
 bump(){if(!AC)return;const t=AC.currentTime;tone(220,t,.08,'triangle',.15,140)},
 drop(){if(!AC)return;const t=AC.currentTime;tone(140,t,.12,'sine',.45,55);tone(300,t,.2,'sine',.25,90);for(let i=0;i<5;i++)noise(t+.08+i*.07,.06,.25,1800+Math.random()*900,4)},
 rattle(){if(!AC)return;const t=AC.currentTime;for(let i=0;i<7;i++)noise(t+i*.09,.05,.12,900+Math.random()*600,5)},
 clop(i){if(!AC)return;const t=AC.currentTime;noise(t,.05,.35,i%2?1200:900,6);noise(t+.09,.05,.3,i%2?1000:800,6)},
 ding(n){if(!AC)return;const t=AC.currentTime;for(let i=0;i<n;i++)tone(660*Math.pow(1.26,i),t+i*.1,.25,'sine',.15)},
 cheer(){if(!AC)return;const t=AC.currentTime;noise(t,1.6,.22,1400,.4);[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.14,.5,'triangle',.18));},
 miss(){if(!AC)return;const t=AC.currentTime;tone(400,t,.3,'sine',.12,250)}
};
// ---------- race generation ----------
let G=null;
function makeRace(level,players){
 const r=rng(level*7919+13);
 const L=Math.min(level,8);
 const g=110+L*14;                       // steeper alley each race
 const gx=L>=4?(r()<.5?-1:1)*(6+L*2):0;  // sideways tilt later on
 const HR=10.5,D=25,RG=D*Math.sqrt(3)/2;      // every hole the same size, every neighbour the same distance apart
 const top=40+r()*6,shift=(r()-.5)*(L>=3?8:0);
 const holes=[];
 for(let row=1;row<=4;row++){const y=top+(4-row)*RG;for(let k=0;k<row;k++){holes.push({x:50+shift+(k-(row-1)/2)*D,y,v:row,r:HR})}}
 const pegs=[];
 if(L>=3){const n=L>=6?3:2;for(let i=0;i<n;i++)pegs.push({x:22+56*(n===1?.5:i/(n-1))+(r()-.5)*8,y:top+3*RG+40+r()*14,r:4.5})}
 const themes=[['#c98d4f','#e0a96d'],['#b77b45','#d89c62'],['#cf9a5d','#ecc08a'],['#a8703f','#d0955a']];
 const humans=Math.max(1,Math.min(4,players));
 return{level,g,gx,holes,pegs,theme:themes[(level-1)%themes.length],cpuSkill:Math.min(.92,.45+L*.06),
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
 if(h.human){state='aim';showMsg(G.humans===1?'YOUR TURN!':COLORS[h.i].n.toUpperCase()+"'S TURN!",COLORS[h.i].c,1.4)}
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
function cpuQuickRoll(h){const L=Math.min(G.level,8),r=Math.random();
 const w=[.44-L*.016,.3,.19+L*.004,.11+L*.004,.06+L*.004];let a=0,v=0;const tot=w.reduce((x,y)=>x+y);for(let k=0;k<5;k++){a+=w[k]/tot;if(r<a){v=k;break}}
 if(v>0&&!h.ga&&h.pos<TRACK)startGallop(h,v)}
function startGallop(h,n){n=Math.min(n,TRACK-h.pos);if(n<=0)return;h.ga={from:h.pos,n,t:0,k:0};SFX.ding(n);effects.push({type:'plus',n,i:h.i,t:0})}
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
 for(const p of G.pegs){const dx=b.x-p.x,dy=b.y-p.y,d=Math.hypot(dx,dy),m=p.r+BR;if(d<m&&d>0){const nx=dx/d,ny=dy/d;b.x=p.x+nx*m;b.y=p.y+ny*m;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.7*vn*nx;b.vy-=1.7*vn*ny;SFX.bump()}}}
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
 const hv=cur();anim={type:'drop',h,t:0,x:ball.x,y:ball.y};
 effects.push({type:'ring',x:h.x,y:h.y,t:0,c:COLORS[hv.i].c});shake=.18;
}
function missed(){SFX.rollStop();SFX.miss();ball.on=false;state='returning';anim={type:'back',t:0,x:ball.x,y:ball.y,v:0}}
// ---------- update ----------
function update(dt){
 time+=dt;
 if(SOLO()&&state!=='finish'&&state!=='menu'&&!G.finishOrder.length)for(const h of G.horses){if(h.human)continue;if(h.next==null)h.next=2.2+h.i*.9+Math.random();h.next-=dt;if(h.next<=0&&!h.ga){cpuQuickRoll(h);h.next=3.4+Math.random()*1.8}}if(shake>0)shake=Math.max(0,shake-dt);
 if(state==='rolling'){const pd=dt*1.35,n=Math.ceil(pd/(1/240));for(let i=0;i<n&&state==='rolling';i++)step(pd/n)} // brisker, less floaty roll (same paths)
 else if(state==='dropping'){anim.t+=dt;if(anim.t>.32){SFX.rattle();state='returning';anim={type:'trough',t:0,v:anim.h.v,y:anim.h.y}}}
 else if(state==='returning'){anim.t+=dt;const dur=anim.type==='trough'?.5:.3;if(anim.t>=dur){
   ball={x:START.x,y:START.y,vx:0,vy:0,on:false};
   if(anim.type==='trough'){gallop(anim.v)}else{nextTurn()} }}
 for(const h of G?G.horses:[]){const g=h.ga;if(!g)continue;g.t+=dt;const per=.42;const k=Math.min(g.n,Math.floor(g.t/per));
   h.shown=g.from+Math.min(g.n,g.t/per);if(k>g.k){g.k=k;SFX.clop(k)}
   if(g.t>=g.n*per+.35){h.pos=g.from+g.n;h.shown=h.pos;h.ga=null;
     if(h.pos>=TRACK){h.pos=TRACK;h.shown=TRACK;if(!G.finishOrder.includes(h.i))G.finishOrder.push(h.i);SFX.cheer()}
     if(state==='galloping'&&h===cur())nextTurn()}}
 if(SOLO()&&G.finishOrder.length&&(state==='aim'||state==='settle')&&!G.horses.some(h=>h.ga))finishRace();
 for(const e of effects)e.t+=dt;effects=effects.filter(e=>e.t<2);
 if(msg){msg.t+=dt;if(msg.t>msg.d)msg=null}
}
function gallop(n){const h=cur();state='galloping';startGallop(h,n);if(!h.ga)nextTurn()}
function showMsg(text,c,d){msg=text?{text,c,d,t:0}:null}
// ---------- finish ----------
function finishRace(){
 state='finish';
 const fo=i=>{const k=G.finishOrder.indexOf(i);return k<0?99:k};const order=G.horses.slice().sort((a,b)=>(fo(a.i)-fo(b.i))||(b.pos-a.pos));
 G.podium=order.map(h=>h.i);
 const winner=G.horses[G.podium[0]];
 save.races++;if(winner.human){save.wins++}
 if(winner.human||G.humans>1)save.level=Math.min(99,save.level+1);
 persist();
 setTimeout(()=>{$('end').classList.remove('hide');$('end').classList.add('on')},900/SPEED);
}
// ---------- drawing ----------
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
const _cache={};
function cached(name,fn){const k=[name,cv.width,cv.height,G.level,G.holes.map(h=>h.x+','+h.y).join(';')].join('|');let e=_cache[name.replace(/\d.*$/,'')+name];
 if(!e||e.k!==k){const off=e&&e.c||document.createElement('canvas');off.width=cv.width;off.height=cv.height;const o=off.getContext('2d');const dpr=cv.width/W();o.setTransform(dpr,0,0,dpr,0,0);
  const real=cx;cx=o;try{fn()}finally{cx=real}e=_cache[name.replace(/\d.*$/,'')+name]={k,c:off}}
 cx.save();cx.setTransform(1,0,0,1,0,0);cx.drawImage(e.c,0,0);cx.restore()}
function rg(x,y,r,c0,c1,c2){const g=cx.createRadialGradient(x-r*.35,y-r*.45,r*.05,x,y,r*1.15);g.addColorStop(0,c0);g.addColorStop(.45,c1);g.addColorStop(1,c2);return g}
function blob(x,y,rx,ry,rot,fill){cx.fillStyle=fill;cx.beginPath();cx.ellipse(x,y,rx,ry,rot||0,0,7);cx.fill()}
// chunky shaded cartoon horse with a friendly jockey; origin = ground under the belly
function drawHorse(x,y,s,i,phase,glow){
 const c=COLORS[i];cx.save();cx.translate(x,y);cx.scale(s,s);
 if(glow){const g=cx.createRadialGradient(0,-10,4,0,-10,48);g.addColorStop(0,'rgba(255,240,140,.7)');g.addColorStop(1,'rgba(255,240,140,0)');cx.fillStyle=g;cx.fillRect(-50,-60,100,90)}
 blob(2,24,30,6,0,'rgba(40,60,20,.28)');
 const leg=Math.sin(phase),bob=Math.abs(Math.sin(phase))*3.2;
 cx.translate(0,-bob);
 const legD=(lx,a,far)=>{const col=far?c.d:c.c;const kx=lx+Math.sin(a)*7,ky=10+Math.cos(a)*8,fx=kx+Math.sin(a*1.4-.3)*6,fy=ky+9;
  cx.strokeStyle=col;cx.lineCap='round';cx.lineWidth=far?7:8;cx.beginPath();cx.moveTo(lx,4);cx.lineTo(kx,ky);cx.lineTo(fx,fy);cx.stroke();
  blob(fx+1,fy+2,5,3.4,0,far?'#3b2a20':'#55402f')};
 // far legs, tail
 legD(-13,-leg*.7,1);legD(13,leg*.7,1);
 cx.fillStyle=c.d;cx.beginPath();cx.moveTo(-20,-6);cx.bezierCurveTo(-36,-8,-38+leg*3,10,-30,16);cx.bezierCurveTo(-30,6,-26,2,-20,2);cx.fill();
 // body
 blob(0,-1,26,16,0,rg(0,-1,26,c.l,c.c,c.d));
 // mane behind the neck
 for(let k=0;k<4;k++)blob(10+k*3,-9-k*5.5,3.6,4.4,0,c.d);
 // neck + head
 cx.fillStyle=rg(18,-14,14,c.l,c.c,c.d);cx.beginPath();cx.moveTo(10,-8);cx.quadraticCurveTo(16,-26,24,-28);cx.lineTo(30,-20);cx.quadraticCurveTo(24,-6,20,2);cx.closePath();cx.fill();
 blob(28,-25,11,8.5,.3,rg(28,-25,11,c.l,c.c,c.d));
 blob(35,-21,7,5.6,.3,rg(35,-21,7,'#fff1e6','#f8cfb2','#d9a585'));blob(37,-21,1.2,1,0,'#a0705a');
 blob(26.5,-28,3.2,3.6,0,'#fff');blob(27.2,-27.6,2.2,2.6,0,'#2b1d16');blob(26.4,-28.6,.9,.9,0,'#fff');
 cx.fillStyle=c.d;cx.beginPath();cx.moveTo(20,-31);cx.quadraticCurveTo(20,-41,24,-40);cx.quadraticCurveTo(25,-35,24,-31);cx.fill();
 // near legs
 legD(-9,leg*.7,0);legD(17,-leg*.7,0);
 blob(0,-1,25,15,0,rg(0,-1,25,c.l,c.c,c.d));
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
 const sky=cx.createLinearGradient(0,0,0,t.y+20);sky.addColorStop(0,'#9fdcff');sky.addColorStop(1,'#d8f2ff');cx.fillStyle=sky;cx.fillRect(0,0,W(),t.y+10);
 for(const [fx,fy,r] of [[.18,.35,16],[.5,.25,13],[.8,.4,18]]){const X=W()*fx,Y=t.y*fy;cx.fillStyle='rgba(255,255,255,.92)';[[0,0,1],[-.9,.25,.7],[.9,.25,.75],[.35,-.35,.7]].forEach(([a,b,m])=>{cx.beginPath();cx.arc(X+a*r,Y+b*r,r*m,0,7);cx.fill()})}
 cx.fillStyle='#8fd27a';cx.beginPath();cx.moveTo(0,t.y+12);for(let x=0;x<=W();x+=20)cx.lineTo(x,t.y-4-Math.sin(x/90)*8-Math.sin(x/37)*3);cx.lineTo(W(),t.y+12);cx.fill();
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
  if(state!=='finish'&&G.turn===i){cx.strokeStyle='rgba(255,210,63,.95)';cx.lineWidth=4;cx.lineJoin='round';cx.beginPath();cx.moveTo(q.l0+2,q.y+2);cx.lineTo(q.r0-2,q.y+2);cx.lineTo(q.r1-2,q.y+q.h-2);cx.lineTo(q.l1+2,q.y+q.h-2);cx.closePath();cx.stroke()}
  // finish (checks, in perspective)
  const n=Math.max(3,Math.round(q.h/9));for(let k=0;k<n;k++)for(let j=0;j<2;j++){const y0=q.y+q.h*k/n,y1=q.y+q.h*(k+1)/n,cw=6*q.k;cx.fillStyle=(k+j)%2?'#333':'#fff';cx.fillRect(q.fx+q.h*.35+j*cw,y0,cw,y1-y0+.5)}
 }
 // white rails between lanes (rounded, with shadow)
 for(let j=0;j<=4;j++){const q=laneGeo(Math.min(j,3)),y=j<4?q.y:q.y+q.h,l=j<4?q.l0:q.l1,r=j<4?q.r0:q.r1;
  cx.strokeStyle='rgba(60,60,40,.18)';cx.lineWidth=5;cx.beginPath();cx.moveTo(l,y+2);cx.lineTo(r,y+2);cx.stroke();
  cx.strokeStyle='#fff';cx.lineWidth=3.2;cx.lineCap='round';cx.beginPath();cx.moveTo(l,y);cx.lineTo(r,y);cx.stroke()}
}
function drawTrack(){
 const t=L.track;cached('track'+G.turn+(state==='finish'),()=>trackStatic());
 // badges + horses, far to near so nearer horses overlap
 for(let i=0;i<4;i++){const q=laneGeo(i),h=G.horses[i];const bx=q.lm+q.h*.45,by=q.y+q.h/2,br=Math.min(q.h*.36,22);
  blob(bx,by+2,br,br,0,'rgba(0,0,0,.15)');blob(bx,by,br,br,0,rg(bx,by,br,COLORS[i].l,COLORS[i].c,COLORS[i].d));
  cx.fillStyle='#fff';cx.font=`900 ${br*.78}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(h.human?(G.humans===1?'YOU':'P'+(i+1)):'🤖',bx,by+1)}
 for(let i=0;i<4;i++){const q=laneGeo(i),h=G.horses[i],moving=!!h.ga;
  const x=q.sx+(q.fx-q.sx)*h.shown/TRACK,y=q.y+q.h*.7,hs=Math.min(q.h/50,(q.fx-q.sx)/TRACK/22,2.4);
  if(moving){cx.fillStyle='rgba(120,70,30,.3)';for(let k=h.ga?h.ga.from:0;h.ga&&k<h.shown-.2;k+=.5){const px=q.sx+(q.fx-q.sx)*k/TRACK;cx.beginPath();cx.ellipse(px,y+2,3*q.k,1.8*q.k,0,0,7);cx.fill()}}
  drawHorse(x,y-20*hs*.0,hs,i,moving?time*14:0,G.turn===i&&state!=='finish')}
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
function alleyStatic(){
 const S=L.S,yb=AL+40;   // board runs off the bottom edge, towards the player
 cx.save();
 // soft shadow under the board
 cx.shadowColor='rgba(40,60,20,.45)';cx.shadowBlur=18*S;cx.shadowOffsetY=6*S;quad(-10,-8,120,yb);cx.fillStyle='#7a4a26';cx.fill();cx.restore();
 // far end lip (front face facing us)
 {const a=P(-10,-8),b=P(120,-8);const th=7*S*a.k;cx.fillStyle='#5e381b';cx.fillRect(a.x,a.y-th,b.x-a.x,th);
  const g=cx.createLinearGradient(0,a.y-th,0,a.y);g.addColorStop(0,'#c58a55');g.addColorStop(1,'#8a5a33');cx.fillStyle=g;cx.fillRect(a.x,a.y-th,b.x-a.x,th*.6)}
 // side rails with bevel lighting
 const rail=(x0,x1,lit)=>{quad(x0,-8,x1,yb);const A=P(x0,AL),B=P(x1,AL);const g=cx.createLinearGradient(A.x,0,B.x,0);
  g.addColorStop(0,lit?'#e3ae74':'#9c6638');g.addColorStop(.5,lit?'#c98d55':'#b5784a');g.addColorStop(1,lit?'#8f5a30':'#e0aa70');cx.fillStyle=g;cx.fill()};
 rail(-10,0,true);rail(100,104,false);rail(116,120,false);
 // playfield wood, lit nearer the player
 quad(0,-6,100,yb);const pf=P(0,-6),pn=P(0,AL);const wg=cx.createLinearGradient(0,pf.y,0,pn.y);
 wg.addColorStop(0,shadeHex(G.theme[0],.72));wg.addColorStop(.45,G.theme[0]);wg.addColorStop(1,G.theme[1]);cx.fillStyle=wg;cx.fill();
 // planks + grain
 cx.save();quad(0,-6,100,yb);cx.clip();
 for(let i=0;i<13;i++){const x0=i*100/13;if(i%2){quad(x0,-6,x0+100/13,yb);cx.fillStyle='rgba(255,230,190,.07)';cx.fill()}
  const a=P(x0,-6),b=P(x0,yb);cx.strokeStyle='rgba(100,55,20,.28)';cx.lineWidth=Math.max(.6,S*.5);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
 for(let y=10;y<yb;y+=31){for(let i=0;i<13;i+=2){const x=(i+(y/31|0)%2)*100/13;const a=P(x,y),b=P(x+100/13,y);cx.strokeStyle='rgba(100,55,20,.18)';cx.lineWidth=Math.max(.5,S*.4*a.k);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
 // glossy sheen like varnished wood
 const sh=P(20,AL-20);const sg=cx.createRadialGradient(sh.x,sh.y,0,sh.x,sh.y,60*S);sg.addColorStop(0,'rgba(255,255,255,.35)');sg.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=sg;cx.fillRect(sh.x-60*S,sh.y-60*S,120*S,120*S);
 // far end falls into shade
 const fg=cx.createLinearGradient(0,pf.y,0,pf.y+L.ah*.25);fg.addColorStop(0,'rgba(60,30,10,.35)');fg.addColorStop(1,'rgba(60,30,10,0)');cx.fillStyle=fg;cx.fillRect(L.ax-20,pf.y,L.aw+40,L.ah*.25);
 cx.restore();
 // return trough: a sunken channel
 quad(104,-6,116,yb);{const a=P(104,AL),b=P(116,AL);const g=cx.createLinearGradient(a.x,0,b.x,0);g.addColorStop(0,'#2a170a');g.addColorStop(.35,'#6b4224');g.addColorStop(.7,'#8a5a33');g.addColorStop(1,'#3a2210');cx.fillStyle=g;cx.fill()}
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
  cx.fillStyle=hg;cx.beginPath();cx.ellipse(c.x,c.y+ry*.5,rx*.97,ry*.95,0,0,7);cx.fill();cx.restore()}
 // pegs as little 3D posts
 for(const p of G.pegs){const c=P(p.x,p.y),r=p.r*S*c.k,ry=r*(.42+.3*c.t),hh=r*1.3;
  cx.fillStyle='rgba(0,0,0,.25)';cx.beginPath();cx.ellipse(c.x+r*.3,c.y+ry*.3,r*1.1,ry*1.1,0,0,7);cx.fill();
  cx.fillStyle='#c8417f';cx.fillRect(c.x-r,c.y-hh,2*r,hh);cx.beginPath();cx.ellipse(c.x,c.y,r,ry,0,0,7);cx.fill();
  cx.fillStyle='#ff8cc0';cx.beginPath();cx.ellipse(c.x,c.y-hh,r,ry,0,0,7);cx.fill()}
}
function drawAlley(){
 const S=L.S;cached('alley',()=>alleyStatic());
 for(const e of effects)if(e.type==='ring'){const c=P(e.x,e.y),r=(8+e.t*30)*S*c.k;cx.strokeStyle=e.c;cx.globalAlpha=Math.max(0,1-e.t);cx.lineWidth=3;cx.beginPath();cx.ellipse(c.x,c.y,r,r*(.42+.3*c.t),0,0,7);cx.stroke();cx.globalAlpha=1}
 // ball
 const bc=BALLC[G.turn];let bx=ball.x,by=ball.y,bs=1,sink=0;
 if(state==='dropping'){let k=Math.min(1,anim.t/.16);k=k*k;bx=anim.x+(anim.h.x-anim.x)*k;by=anim.y+(anim.h.y-anim.y)*k;sink=k}
 else if(state==='returning'){
  if(anim.type==='trough'){const k=anim.t/.5;if(k<.7){bx=110;by=anim.y+(AL-6-anim.y)*(k/.7)}else{const q=(k-.7)/.3;bx=110+(START.x-110)*q;by=AL-6+(START.y-(AL-6))*q}}
  else{const k=anim.t/.3;bx=anim.x+(START.x-anim.x)*k;by=anim.y+(START.y-anim.y)*k}}
 else if(state==='galloping'||state==='finish'){bx=START.x;by=START.y}
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
 const g=cx.createRadialGradient(q.x-r*.35,cy-r*.4,r*.08,q.x,cy,r);g.addColorStop(0,'#fff');g.addColorStop(.22,c);g.addColorStop(.85,shade(c));g.addColorStop(1,shade(shade(c)));
 cx.fillStyle=g;cx.beginPath();cx.arc(q.x,cy,r,0,7);cx.fill();cx.restore()}
function shadeHex(c,f){const n=parseInt(c.slice(1),16);return`rgb(${(n>>16)*f|0},${(n>>8&255)*f|0},${(n&255)*f|0})`}
function shade(c){const n=parseInt(c.slice(1),16);const r=(n>>16)*.6|0,g=(n>>8&255)*.6|0,b=(n&255)*.6|0;return`rgb(${r},${g},${b})`}
function drawMsg(){if(!msg)return;const w=W(),k=Math.min(1,msg.t*4),a=Math.min(1,(msg.d-msg.t)*3);cx.globalAlpha=Math.max(0,a);
 const fs=Math.min(w*.09,54),y=L.track.y+L.track.h+fs*1.1;cx.font=`900 ${fs*k}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.lineWidth=fs*.18;cx.strokeStyle='#fff';cx.strokeText(msg.text,w/2,y);cx.fillStyle=msg.c;cx.fillText(msg.text,w/2,y);cx.globalAlpha=1}
function drawFinish(){
 const w=W(),h=H();cx.fillStyle='rgba(255,250,235,.92)';cx.fillRect(0,0,w,h);
 const win=G.horses[G.podium[0]];const txt=win.human?(G.humans===1?'YOU WIN!':'HOORAY!'):'HOORAY!';
 const fs=Math.min(w*.13,h*.1);cx.font=`900 ${fs}px system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';
 const cols=['#e53935','#fb8c00','#fbc02d','#43a047','#1e88e5','#8e24aa'];let x0=w/2-cx.measureText(txt).width/2;
 for(let i=0;i<txt.length;i++){const ch=txt[i],cw=cx.measureText(ch).width;cx.fillStyle=cols[i%6];cx.fillText(ch,x0+cw/2,h*.14+Math.sin(time*4+i)*4);x0+=cw}
 const base=h*.68,pw=Math.min(w*.26,h*.22),hts=[h*.2,h*.14,h*.1],xs=[w/2,w/2-pw,w/2+pw];
 [1,2,0].forEach(p=>{const x=xs[p],ph=hts[p];rr(x-pw/2+4,base-ph,pw-8,ph,10);cx.fillStyle=['#ffd23f','#cfd8dc','#e0a96d'][p];cx.fill();
  cx.fillStyle='#fff';cx.font=`900 ${ph*.5}px system-ui`;cx.fillText(p+1,x,base-ph/2);
  drawHorse(x,base-ph-pw*.24,pw/75,G.podium[p],time*6,p===0)});
 const fourth=G.podium[3];drawHorse(w/2+pw*1.9>w-30?w-40:w/2+pw*1.9,base-10,pw/120,fourth,time*6,false);
 // confetti
 for(let i=0;i<60;i++){const x=(i*97+time*40*(1+i%3))%w,y=(i*53+time*90*(1+i%4))%h;cx.fillStyle=cols[i%6];cx.fillRect(x,y,6,10)}
}
function frame(now){const dt=Math.min(.05,(now-lastT)/1000)*SPEED;lastT=now;
 if(G&&state!=='menu')update(dt);else time+=dt;
 if(SOLO()&&state!=='finish'&&state!=='menu'&&!G.finishOrder.length)for(const h of G.horses){if(h.human)continue;if(h.next==null)h.next=2.2+h.i*.9+Math.random();h.next-=dt;if(h.next<=0&&!h.ga){cpuQuickRoll(h);h.next=3.4+Math.random()*1.8}}
 cx.clearRect(0,0,W(),H());
 const bg=cx.createLinearGradient(0,0,0,H());bg.addColorStop(0,'#bfe9ff');bg.addColorStop(.35,'#9be08a');bg.addColorStop(1,'#6fc25d');cx.fillStyle=bg;cx.fillRect(0,0,W(),H());
 if(G){drawTrack();const sk=shake>0?shake*14:0;cx.save();cx.translate(0,sk*Math.sin(time*90)*.5+sk*.3);drawAlley();cx.restore();drawMsg();if(state==='finish')drawFinish()}
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
function buildMenu(){const p=$('picks');p.innerHTML='';for(let n=1;n<=4;n++){const b=document.createElement('button');b.className='pick'+(save.players===n?' sel':'');b.style.background=`conic-gradient(${COLORS.slice(0,n).map((c,i)=>`${c.c} ${i*100/n}% ${(i+1)*100/n}%`).join(',')})`;b.textContent=n;b.onclick=()=>{unlock();save.players=n;persist();buildMenu();SFX.ding(1)};p.appendChild(b)}
 $('stars').textContent='Race '+save.level+'  '+'★'.repeat(Math.min(5,Math.ceil(save.level/2)))}
function begin(){unlock();$('menu').classList.add('hide');$('menu').classList.remove('on');$('end').classList.add('hide');$('end').classList.remove('on');$('home').classList.remove('hide');
 G=makeRace(save.level,save.players);effects=[];startTurn()}
function home(){SFX.rollStop();state='menu';G=null;$('end').classList.add('hide');$('menu').classList.remove('hide');$('menu').classList.add('on');$('home').classList.add('hide');buildMenu()}
$('play').onclick=begin;$('next').onclick=begin;$('again').onclick=home;$('home').onclick=home;
$('mute').onclick=()=>{save.muted=!save.muted;persist();$('mute').textContent=save.muted?'🔇':'🔊';if(save.muted)SFX.rollStop()};$('mute').textContent=save.muted?'🔇':'🔊';
document.addEventListener('visibilitychange',()=>{if(document.hidden)SFX.rollStop()});
window.addEventListener('resize',layout);window.addEventListener('orientationchange',()=>setTimeout(layout,200));
document.addEventListener('gesturestart',e=>e.preventDefault());
layout();buildMenu();
// demo race behind the menu
G=makeRace(save.level,save.players);state='menu';
requestAnimationFrame(frame);
// test hooks (harmless in play)
window.__gr={drawHorse:(...a)=>drawHorse(...a),get state(){return state},get G(){return G},get ball(){return ball},launch:(vx,vy)=>{if(state==='aim')launch(vx,vy)},begin,home,save:()=>save,toScreen:(x,y)=>{const q=P(x,y);return{x:q.x,y:q.y}}};
})();
