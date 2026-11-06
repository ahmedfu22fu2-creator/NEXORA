/* NEXORA v160 — Aurora Command Center.
   Additive layer: command palette (Ctrl/Cmd+K), adaptive performance governor, live HUD, Neon Dash mini-game.
   Reads the existing DOM through public selectors only; never touches Firebase, auth, chat or economy code. */
(()=>{'use strict';
if(window.SquadAurora)return;
const d=document,root=d.documentElement,$=(s,r=d)=>r.querySelector(s),$$=(s,r=d)=>[...r.querySelectorAll(s)];
const store={get:k=>{try{return localStorage.getItem(k)}catch(_){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(_){}}};
const say=m=>{try{window.toast&&window.toast(m)}catch(_){}};
const el=(t,c,x)=>{const n=d.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n};
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz=()=>{try{if(!reduced()&&navigator.vibrate)navigator.vibrate(8)}catch(_){}};
const idle=f=>(window.requestIdleCallback||setTimeout)(f,{timeout:400});

/* ───────── Performance ───────── */
const perf={
 mode:()=>store.get('sq160.perf')||'auto',
 apply(){const m=perf.mode();if(m==='lite'||(m==='auto'&&store.get('sq160.autolite')==='1'))root.classList.add('squad-lite');else if(m==='full')root.classList.remove('squad-lite')},
 cycle(){const o=['auto','lite','full'],n=o[(o.indexOf(perf.mode())+1)%3];store.set('sq160.perf',n);if(n==='auto')store.set('sq160.autolite','0');perf.apply();if(n==='lite')root.classList.add('squad-lite');say('Performance mode: '+n);return n},
 /* Samples real frame pacing once the app is in use; weak devices get the existing lightweight profile automatically. */
 watch(){if(perf.mode()!=='auto'||root.classList.contains('squad-lite'))return;
  setTimeout(()=>{let last=0,n=0,slow=0;const tick=t=>{if(d.hidden){last=0;return setTimeout(()=>requestAnimationFrame(tick),800)}
   if(last){const dt=t-last;if(dt<250){n++;if(dt>26)slow++}}last=t;
   if(n<150)return requestAnimationFrame(tick);
   if(slow/n>.5){root.classList.add('squad-lite');store.set('sq160.autolite','1');say('Smoother mode enabled for this device')}};
   requestAnimationFrame(tick)},4000)}
};
perf.apply();
d.addEventListener('visibilitychange',()=>root.classList.toggle('sq160-hidden',d.hidden));

/* Decode images off the main thread and lazy-load anything created after startup. */
{const q=new Set();let s=0;
 const fix=i=>{if(!i.hasAttribute('decoding'))i.decoding='async';if(!i.hasAttribute('loading')&&!i.closest('#splash,#auth'))i.loading='lazy'};
 const flush=()=>{s=0;q.forEach(n=>n.tagName==='IMG'?fix(n):n.querySelectorAll&&n.querySelectorAll('img').forEach(fix));q.clear()};
 new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)q.add(n);if(!s&&q.size){s=1;idle(flush)}}).observe(d.body,{childList:true,subtree:true});
 idle(()=>$$('img').forEach(fix))}

/* ───────── Live HUD (FPS · LCP · CLS · long tasks · heap) ───────── */
const hud={on:false,node:null,seen:false,fps:0,lcp:0,cls:0,lt:0,
 obs(){if(hud.seen)return;hud.seen=true;const po=(type,cb)=>{try{new PerformanceObserver(l=>cb(l.getEntries())).observe({type,buffered:true})}catch(_){}};
  po('largest-contentful-paint',e=>{hud.lcp=e[e.length-1].startTime});po('layout-shift',e=>e.forEach(x=>{if(!x.hadRecentInput)hud.cls+=x.value}));po('longtask',e=>{hud.lt+=e.length})},
 paint(){const m=performance.memory?` · ${Math.round(performance.memory.usedJSHeapSize/1048576)}MB`:'';hud.node.textContent=`${hud.fps} FPS · LCP ${(hud.lcp/1000).toFixed(2)}s · CLS ${hud.cls.toFixed(3)} · LT ${hud.lt}${m}`},
 start(){hud.on=true;store.set('sq160.hud','1');hud.obs();hud.node=hud.node||el('div','sq160-hud');hud.node.setAttribute('role','status');d.body.appendChild(hud.node);
  let f=0,t0=performance.now();const loop=t=>{if(!hud.on)return;f++;if(t-t0>=1000){hud.fps=Math.round(f*1000/(t-t0));f=0;t0=t;hud.paint()}requestAnimationFrame(loop)};requestAnimationFrame(loop);hud.paint()},
 stop(){hud.on=false;store.set('sq160.hud','0');hud.node&&hud.node.remove()},
 toggle(){hud.on?hud.stop():hud.start()}
};

/* ───────── Command palette ───────── */
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640\u0300-\u036f]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
const rank=(q,t)=>{if(!q)return 1;let tot=0;for(const w of q.split(' ')){const i=t.indexOf(w);let s=0;if(i===0)s=100;else if(i>0)s=t[i-1]===' '?80:60;else{let p=0;for(const c of t){if(c===w[p])p++;if(p===w.length){s=20;break}}}if(!s)return 0;tot+=s}return tot};
let installEvt=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e});
const press=s=>()=>{const n=$(s);n?n.click():say('Not available right now')};
const appReady=()=>{const a=$('#app');return !!a&&!a.hidden};
function actions(){
 const go=[['Home','feed','الرئيسية البيت','⌂'],['Videos','videos','فيديو فيديوهات','▶'],['Create','create','انشاء نشر بوست','＋'],['Explore','explore','استكشاف اكتشف بحث','◎'],['My Profile','profile','بروفايل حسابي ملفي','☺'],['Messages & Calls','messages','رسائل شات محادثات مكالمات','✉']]
  .map(([label,k,kw,icon])=>({g:'Go to',label,kw,icon,run:press(`[data-social="${k}"]`)}));
 go.push({g:'Go to',label:'Open City',hint:'3D world',kw:'مدينه عالم سيارات city',icon:'🏙',run:async()=>{try{await window.SQUAD_LOAD_DISTRICT();window.DISTRICT&&DISTRICT.enter({})}catch(_){say('Could not load the city. Check your connection.')}}},
  {g:'Go to',label:'The Café',hint:'3D lounge',kw:'كافيه قهوه cafe',icon:'☕',run:async()=>{try{await window.SQUAD_LOAD_WORLD();window.WORLD&&WORLD.enter()}catch(_){say('Could not load the café. Check your connection.')}}},
  {g:'Go to',label:'Cinema',hint:'Watch together',kw:'سينما فيلم cinema',icon:'▣',run:press('#social-aside [data-hub="cinema"]')},
  {g:'Go to',label:'Services Hub',kw:'خدمات مساعد متجر العاب',icon:'✧',run:()=>{location.href='chanse3/services-hub.html'}});
 const chats=$$('#list .wi,#dr-chat-list>*').slice(0,80).map(n=>{const t=(($('b,strong,.nm,.n,h4',n)||n).textContent||'').replace(/\s+/g,' ').trim().slice(0,60);return t&&{g:'Conversations',label:t,icon:'💬',kw:'',run:()=>n.click()}}).filter(Boolean);
 const sys=[
  {g:'System',label:'Toggle light / dark theme',kw:'مظهر ثيم داكن فاتح theme',icon:'◐',run:()=>{const b=$('#thm');if(!b)return;d.startViewTransition&&!reduced()?d.startViewTransition(()=>b.click()):b.click()}},
  {g:'System',label:'Performance mode: '+perf.mode(),hint:'auto → lite → full',kw:'اداء سرعه خفيف performance',icon:'⚡',run:perf.cycle},
  {g:'System',label:(hud.on?'Hide':'Show')+' performance HUD',kw:'فريمات سرعه hud fps',icon:'◔',run:hud.toggle},
  {g:'System',label:(root.classList.contains('sq160-noaurora')?'Enable':'Disable')+' ambient aurora',kw:'خلفيه اضاءه aurora',icon:'✦',run:()=>{const o=root.classList.toggle('sq160-noaurora');store.set('sq160.aurora',o?'0':'1')}},
  {g:'System',label:'Play Neon Dash',hint:'works offline',kw:'لعبه العاب game اوفلاين',icon:'🎮',run:()=>game.open()},
  {g:'System',label:'Check for updates',kw:'تحديث update',icon:'⟳',run:async()=>{try{const r=await navigator.serviceWorker.getRegistration();r&&await r.update()}catch(_){}location.reload()}}];
 if(installEvt)sys.push({g:'System',label:'Install NEXORA app',kw:'تثبيت تنصيب install',icon:'⬇',run:()=>{installEvt.prompt();installEvt=null}});
 return appReady()?[...go,...chats,...sys]:sys;
}
const pal={node:null,input:null,list:null,all:[],shown:[],sel:0,prev:null,
 build(){const n=pal.node=el('div','sq160-pal');n.hidden=true;n.setAttribute('role','dialog');n.setAttribute('aria-modal','true');n.setAttribute('aria-label','Command palette');
  const c=el('div','sq160-card'),i=pal.input=el('input','sq160-in');i.type='search';i.placeholder='Search chats, places and actions…';i.setAttribute('role','combobox');i.setAttribute('aria-expanded','true');i.setAttribute('aria-controls','sq160-lb');i.autocomplete='off';i.spellcheck=false;i.enterKeyHint='go';
  const l=pal.list=el('ul','sq160-list');l.id='sq160-lb';l.setAttribute('role','listbox');
  c.append(i,l,el('div','sq160-ft','↑↓ navigate · Enter open · Esc close'));n.append(c);d.body.append(n);
  n.addEventListener('pointerdown',e=>{if(e.target===n)pal.close()});
  i.addEventListener('input',()=>pal.render(i.value));
  l.addEventListener('click',e=>{const o=e.target.closest('.sq160-o');if(o)pal.pick(+o.dataset.i)});
  l.addEventListener('pointermove',e=>{const o=e.target.closest('.sq160-o');if(o&&+o.dataset.i!==pal.sel)pal.move(+o.dataset.i,false)});
  n.addEventListener('keydown',e=>{const k=e.key;
   if(k==='Escape'){e.preventDefault();pal.close()}
   else if(k==='ArrowDown'){e.preventDefault();pal.move(Math.min(pal.sel+1,pal.shown.length-1))}
   else if(k==='ArrowUp'){e.preventDefault();pal.move(Math.max(pal.sel-1,0))}
   else if(k==='Home'&&pal.shown.length){e.preventDefault();pal.move(0)}
   else if(k==='End'&&pal.shown.length){e.preventDefault();pal.move(pal.shown.length-1)}
   else if(k==='Enter'){e.preventDefault();pal.pick(pal.sel)}
   else if(k==='Tab'){e.preventDefault();i.focus()}})},
 render(raw){const q=norm(raw);let r=pal.all.map(a=>({a,s:rank(q,norm(a.label+' '+(a.kw||'')+' '+(a.hint||'')))})).filter(x=>x.s>0);
  if(q)r.sort((x,y)=>y.s-x.s);else{let c=0;r=r.filter(x=>x.a.g!=='Conversations'||++c<=6)}
  pal.shown=r.slice(0,40).map(x=>x.a);pal.list.textContent='';
  if(!pal.shown.length){pal.list.append(el('li','sq160-empty','No matches'));pal.input.removeAttribute('aria-activedescendant');return}
  let g='';pal.shown.forEach((a,i)=>{if(a.g!==g){g=a.g;const h=el('li','sq160-h',g);h.setAttribute('role','presentation');pal.list.append(h)}
   const li=el('li','sq160-o');li.id='sq160-o'+i;li.dataset.i=i;li.setAttribute('role','option');li.append(el('i',0,a.icon),el('b',0,a.label));if(a.hint)li.append(el('small',0,a.hint));pal.list.append(li)});
  pal.move(0)},
 move(i,scroll=true){pal.sel=i;$$('.sq160-o',pal.list).forEach(o=>o.setAttribute('aria-selected',String(+o.dataset.i===i)));const o=$('#sq160-o'+i,pal.list);if(o){pal.input.setAttribute('aria-activedescendant',o.id);if(scroll)o.scrollIntoView({block:'nearest'})}},
 pick(i){const a=pal.shown[i];if(!a)return;buzz();pal.close(true);Promise.resolve().then(a.run).catch(e=>console.error('[sq160]',e))},
 open(){if(!pal.node)pal.build();if(!pal.node.hidden)return;pal.prev=d.activeElement;pal.all=actions();pal.input.value='';pal.node.hidden=false;pal.render('');pal.input.focus()},
 close(skip){if(!pal.node||pal.node.hidden)return;pal.node.hidden=true;if(!skip&&pal.prev&&pal.prev.focus)try{pal.prev.focus()}catch(_){}},
 toggle(){pal.node&&!pal.node.hidden?pal.close():pal.open()}
};
const typing=t=>t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&e.key.toLowerCase()==='k'){e.preventDefault();pal.toggle()}
 else if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!typing(e.target)&&!(pal.node&&!pal.node.hidden)){e.preventDefault();pal.open()}},true);

/* ───────── Neon Dash (offline mini-game) ───────── */
const game={node:null,stop:null,
 open(){pal.close(true);if(!game.node)game.build();game.node.hidden=false;game.run()},
 close(){if(game.stop)game.stop();game.node&&(game.node.hidden=true)},
 build(){const n=game.node=el('div','sq160-game');n.hidden=true;n.setAttribute('role','dialog');n.setAttribute('aria-modal','true');n.setAttribute('aria-label','Neon Dash');
  const c=el('div','sq160-card'),cv=el('canvas');cv.width=960;cv.height=440;cv.setAttribute('aria-label','Neon Dash game. Press Space, Up Arrow or tap to jump.');
  const p=el('p');p.append(el('span',0,'Space / ↑ / tap to jump · Esc to exit'),el('b',0,''));c.append(cv,p);n.append(c);d.body.append(n);
  n.addEventListener('pointerdown',e=>{if(e.target===n)game.close()})},
 run(){const cv=$('canvas',game.node),x=cv.getContext('2d'),W=480,H=220,G=176,hud2=$('b',game.node),lite=root.classList.contains('squad-lite');
  const dpr=Math.min(devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
  let y,vy,ob,sc,sp,last,dead,raf,best=+store.get('sq160.best')||0,trail;
  const reset=()=>{y=0;vy=0;ob=[];sc=0;sp=230;dead=false;trail=[];last=0};reset();
  const jump=()=>{if(dead)reset();else if(y===0)vy=-600};
  const key=e=>{if(e.key==='Escape')return game.close();if(e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W'){e.preventDefault();jump()}};
  const down=e=>{e.preventDefault();jump()};
  const frame=t=>{raf=requestAnimationFrame(frame);if(d.hidden){last=0;return}
   const dt=last?Math.min((t-last)/1000,.034):0;last=t;
   if(!dead){vy+=1700*dt;y=Math.min(0,y+vy*dt);if(y===0)vy=0;sc+=dt*12;sp=Math.min(540,sp+dt*7);
    const lo=ob[ob.length-1];if(!lo||lo.x<W-(190+Math.random()*150+sp*.18))ob.push({x:W+20,w:16+Math.random()*14,h:26+Math.random()*30});
    for(const o of ob)o.x-=sp*dt;if(ob.length&&ob[0].x+ob[0].w<0)ob.shift();
    for(const o of ob)if(o.x<72&&o.x+o.w>48&&y>4-o.h){dead=true;if(sc>best){best=Math.floor(sc);store.set('sq160.best',String(best))}buzz()}
    trail.push(y);if(trail.length>9)trail.shift()}
   x.fillStyle='#070b11';x.fillRect(0,0,W,H);
   const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0c1522');g.addColorStop(1,'#141024');x.fillStyle=g;x.fillRect(0,0,W,G+14);
   x.fillStyle='#d2b27a';x.fillRect(0,G+14,W,2);
   x.fillStyle='#e9cf9a';for(const o of ob)x.fillRect(o.x,G+14-o.h,o.w,o.h);
   trail.forEach((ty,i)=>{x.globalAlpha=i/trail.length*.35;x.fillStyle='#7fd4ff';x.beginPath();x.arc(60-(trail.length-i)*5,G+ty,10*(i/trail.length),0,6.3);x.fill()});x.globalAlpha=1;
   x.fillStyle='#7fd4ff';if(!lite){x.shadowColor='#7fd4ff';x.shadowBlur=14}x.beginPath();x.arc(60,G+y,12,0,6.3);x.fill();x.shadowBlur=0;
   x.fillStyle='#f4f2ed';x.font='600 13px Inter,sans-serif';x.fillText(String(Math.floor(sc)),14,24);
   if(dead){x.fillStyle='rgba(3,6,10,.62)';x.fillRect(0,0,W,H);x.textAlign='center';x.font='700 22px Inter,sans-serif';x.fillStyle='#f0dcb2';x.fillText('Game over',W/2,H/2-6);x.font='500 12px Inter,sans-serif';x.fillStyle='#9ba8b5';x.fillText('Tap or press Space to retry',W/2,H/2+16);x.textAlign='start'}
   hud2.textContent='Best '+best};
  addEventListener('keydown',key,true);cv.addEventListener('pointerdown',down);raf=requestAnimationFrame(frame);
  game.stop=()=>{cancelAnimationFrame(raf);removeEventListener('keydown',key,true);cv.removeEventListener('pointerdown',down);game.stop=null}}
};

/* ───────── Boot ───────── */
const fab=el('button','sq160-fab','⌘K');fab.type='button';fab.setAttribute('aria-label','Open command palette');fab.title='Command palette (Ctrl/Cmd + K)';fab.addEventListener('click',()=>pal.open());d.body.append(fab);
if(store.get('sq160.aurora')==='0')root.classList.add('sq160-noaurora');
if(store.get('sq160.hud')==='1'||/[?&]perf\b/.test(location.search))hud.start();
const app=$('#app');if(app&&app.hidden){const mo=new MutationObserver(()=>{if(!app.hidden){mo.disconnect();perf.watch()}});mo.observe(app,{attributes:true,attributeFilter:['hidden']})}else perf.watch();
window.SquadAurora=Object.freeze({version:'v160',palette:pal,perf,hud,game});
})();
