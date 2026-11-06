/* NEXORA v171 — Member Journey & Achievements.
   Local-first profile progress based only on the signed-in user's existing Workspace data.
   No public ranking, no fabricated server stats, and no changes to Firebase rules. */
(()=>{'use strict';
if(window.SquadV171)return;
const $=(s,r=document)=>r.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const user=()=>window.firebase?.auth?.().currentUser||null;
const uid=()=>user()?.uid||'guest';
const read=(name,fallback)=>{try{return JSON.parse(localStorage.getItem(`squad.v165.${uid()}.${name}`)||'null')??fallback}catch(_){return fallback}};
const stateKey=()=>`squad.v171.${uid()}.journey`;
const readState=()=>{try{return JSON.parse(localStorage.getItem(stateKey())||'{}')}catch(_){return {}}};
const saveState=x=>{try{localStorage.setItem(stateKey(),JSON.stringify(x))}catch(_){notice('تعذر حفظ تقدمك محليًا.')}};
const notice=m=>window.toast?window.toast(m):console.info('[Squad v171]',m);
let panel=null;
const achievements=[
 {id:'starter',icon:'🌟',name:'بداية الرحلة',desc:'أنشئ أول مهمة أو ملاحظة أو ذكرى',test:s=>s.tasks+s.notes+s.memories>=1},
 {id:'planner',icon:'🗓️',name:'صانع الخطط',desc:'اجمع 5 مهام في مساحة العمل',test:s=>s.tasks>=5},
 {id:'writer',icon:'✍️',name:'صاحب الأفكار',desc:'اكتب 5 ملاحظات',test:s=>s.notes>=5},
 {id:'memory',icon:'💡',name:'حافظ الذكريات',desc:'احفظ 5 ذكريات',test:s=>s.memories>=5},
 {id:'organizer',icon:'🏅',name:'منظّم محترف',desc:'استخدم الأقسام الثلاثة معًا',test:s=>s.tasks>0&&s.notes>0&&s.memories>0},
 {id:'builder',icon:'🚀',name:'باني العالم',desc:'اجمع 15 عنصرًا في مساحة العمل',test:s=>s.tasks+s.notes+s.memories>=15}
];
function stats(){return {tasks:read('tasks',[]).length,notes:read('notes',[]).length,memories:read('memories',[]).length}}
function unlocked(){const s=stats();return achievements.filter(a=>a.test(s))}
function refreshAwards(){const st=readState(),now=unlocked().map(a=>a.id),old=Array.isArray(st.unlocked)?st.unlocked:[];const fresh=now.filter(id=>!old.includes(id));if(fresh.length){st.unlocked=[...new Set([...old,...now])];st.lastUnlockAt=Date.now();saveState(st);if(st.announced!==true){notice(`إنجاز جديد: ${achievements.find(a=>a.id===fresh[0]).name}`);st.announced=true;saveState(st)}}else if(!st.unlocked){st.unlocked=now;saveState(st)}return now}
function open(){if(!user())return notice('سجّل الدخول لعرض رحلة عضويتك.');if(!panel){panel=document.createElement('section');panel.id='sq171-journey';panel.hidden=true;panel.innerHTML=`<div class="sq171-window" role="dialog" aria-modal="true" aria-labelledby="sq171-title"><header><div><small>NEXORA · MEMBER JOURNEY</small><h2 id="sq171-title">رحلتي وإنجازاتي</h2><p>مساحة شخصية تتابع تقدمك بدون ترتيب أو مقارنة بين الأعضاء</p></div><button type="button" data-close aria-label="إغلاق">×</button></header><main id="sq171-content"></main><footer>v171 · الإحصاءات محلية على هذا الجهاز وليست أرقامًا عامة أو موثقة من الخادم.</footer></div>`;panel.addEventListener('click',e=>{if(e.target.closest('[data-close]'))panel.hidden=true;if(e.target.closest('[data-refresh]'))render()});document.body.append(panel)}panel.hidden=false;render()}
function render(){if(!panel)return;const s=stats(),got=refreshAwards(),total=achievements.length,pct=Math.round(got.length/total*100);$('#sq171-content',panel).innerHTML=`<section class="sq171-hero"><span>YOUR PERSONAL JOURNEY</span><h3>${esc(user()?.displayName||'عضو NEXORA')}</h3><p>كل خطوة صغيرة بتضيف حاجة لرحلتك. إنجازاتك خاصة بيك ومش بتعمل ترتيب تنافسي بين الناس.</p><div class="sq171-progress"><b>${got.length} / ${total}</b><span>إنجازات مفتوحة</span><div><i style="width:${pct}%"></i></div></div></section><div class="sq171-stats"><article><b>${s.tasks}</b><span>مهام</span></article><article><b>${s.notes}</b><span>ملاحظات</span></article><article><b>${s.memories}</b><span>ذكريات</span></article></div><section class="sq171-section"><div class="sq171-section-head"><h3>شارة رحلتك</h3><button type="button" data-refresh>تحديث التقدم ↻</button></div><div class="sq171-grid">${achievements.map(a=>{const yes=got.includes(a.id);return `<article class="sq171-award ${yes?'is-open':'is-locked'}"><span>${yes?a.icon:'🔒'}</span><div><b>${esc(a.name)}</b><p>${esc(a.desc)}</p><small>${yes?'تم فتح الإنجاز':'لم يُفتح بعد'}</small></div></article>`}).join('')}</div></section><p class="sq171-note">ملاحظة: الإنجازات تُحسب من عدد عناصر مساحة العمل المحفوظة محليًا. لا توجد نقاط قابلة للبيع أو التحويل، ولا يتم إرسال نشاطك الخاص إلى أعضاء آخرين.</p>`}
function launch(){const hosts=[$('#squadHub'),$('#social-main .dr-actions')].filter(Boolean);for(const host of hosts){if(host.querySelector('[data-sq171-open]'))continue;const b=document.createElement('button');b.type='button';b.dataset.sq171Open='1';if(host.id==='squadHub'){b.className='hubTile sq171-launch';b.innerHTML='<i>🏅</i><b>رحلتي وإنجازاتي</b><small>تابع تقدمك وافتح شارات جديدة</small><span>اكتشف إنجازاتك ←</span>'}else{b.className='dr-icon-btn sq171-launch';b.textContent='🏅 رحلتي';}b.addEventListener('click',open);host.append(b)}}
const mo=new MutationObserver(launch);if(document.body)mo.observe(document.body,{childList:true,subtree:true});launch();window.firebase?.auth?.().onAuthStateChanged?.(()=>{if(panel&&!panel.hidden)render();launch()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden)panel.hidden=true});window.SquadV171={open,stats,unlocked,version:171};
})();
