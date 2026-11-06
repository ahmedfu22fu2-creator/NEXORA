/* NEXORA v197 — Home Command Center.
   Additive dashboard: launches existing destinations and reads visible UI state only.
   No mock social counts, duplicate storage, Firebase writes or background polling. */
(()=>{'use strict';
 const main=document.getElementById('social-main');
 const screen=document.getElementById('dr-screen');
 const rail=document.getElementById('social-rail');
 if(!main||!screen||!rail||window.SquadHomeCommand)return;
 const $=(s,r=document)=>r.querySelector(s);
 const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let panel=null,observer=null;
 const countVisible=(selector)=>document.querySelectorAll(selector).length;
 const accountName=()=>{
  try{const u=window.firebase?.auth?.().currentUser;return (window.U&&U.name)||u?.displayName||u?.email?.split('@')[0]||'عضو NEXORA'}catch(_){return 'عضو NEXORA'}
 };
 const currentStatus=()=>{
  const signed=!!(()=>{try{return window.firebase?.auth?.().currentUser}catch(_){return null}})();
  return signed?'متصل بحسابك':'وضع المعاينة';
 };
 function make(){
  if(panel)return panel;
  panel=document.createElement('section');panel.id='sq197-command';panel.className='sq197-command';panel.hidden=true;
  panel.setAttribute('aria-label','مركز قيادة NEXORA');
  panel.innerHTML=`
   <div class="sq197-welcome">
    <div class="sq197-welcome-copy"><span class="sq197-eyebrow"><i></i> YOUR SOCIAL UNIVERSE · V197</span>
     <h2>أهلاً، <b data-sq197-name>عضو NEXORA</b></h2>
     <p>كل عالمك في مكان واحد. ابدأ من أصدقائك، أو افتح تجربة جديدة.</p>
     <div class="sq197-welcome-actions"><button type="button" data-sq197-go="messenger">افتح محادثاتك <span>↗</span></button><button type="button" class="sq197-quiet" data-sq197-go="world">ادخل العالم ثلاثي الأبعاد</button></div>
    </div><div class="sq197-orbit" aria-hidden="true"><span class="sq197-orbit-core">S</span><i></i><b></b><em></em></div>
   </div>
   <div class="sq197-section-head"><div><span class="sq197-eyebrow">YOUR CONTROL DECK</span><h3>مركز القيادة</h3></div><span class="sq197-live-label"><i></i><b data-sq197-status>...</b></span></div>
   <div class="sq197-metrics">
    <article><span class="sq197-metric-icon">✉</span><b data-sq197-messages>—</b><small>محادثات ظاهرة</small></article>
    <article><span class="sq197-metric-icon">◉</span><b data-sq197-stories>—</b><small>مساحات القصص</small></article>
    <article><span class="sq197-metric-icon">⌖</span><b>∞</b><small>عالمك الافتراضي</small></article>
    <article><span class="sq197-metric-icon">✧</span><b>AI</b><small>مساعداتك الذكية</small></article>
   </div>
   <div class="sq197-section-head sq197-second-head"><div><span class="sq197-eyebrow">PICK YOUR NEXT MOMENT</span><h3>بوابات عالمك</h3></div><span class="sq197-section-note">اختصارات مباشرة للأقسام الحالية</span></div>
   <div class="sq197-portals">
    <button type="button" class="sq197-portal sq197-portal-world" data-sq197-go="world"><span class="sq197-portal-art">⌖</span><span class="sq197-portal-copy"><b>Squad World</b><small>ادخل المدينة واستكشف عالمك</small><em>استكشف العالم <i>↗</i></em></span><span class="sq197-portal-glow"></span></button>
    <button type="button" class="sq197-portal sq197-portal-chat" data-sq197-go="messenger"><span class="sq197-portal-art">▤</span><span class="sq197-portal-copy"><b>Messenger</b><small>ارجع لمحادثاتك ومجموعاتك</small><em>ابدأ التواصل <i>↗</i></em></span><span class="sq197-portal-glow"></span></button>
    <button type="button" class="sq197-portal sq197-portal-cinema" data-sq197-go="cinema"><span class="sq197-portal-art">▣</span><span class="sq197-portal-copy"><b>3D Cinema</b><small>تجربة مشاهدة مشتركة</small><em>افتح السينما <i>↗</i></em></span><span class="sq197-portal-glow"></span></button>
    <button type="button" class="sq197-portal sq197-portal-people" data-sq197-go="accounts"><span class="sq197-portal-art">♙</span><span class="sq197-portal-copy"><b>Your Identity</b><small>ملفك الشخصي وهويتك</small><em>اعرض ملفك <i>↗</i></em></span><span class="sq197-portal-glow"></span></button>
   </div>
   <div class="sq197-bottom-grid">
    <article class="sq197-focus"><span class="sq197-eyebrow">NEXORA IDEA</span><h3>مش مجرد تطبيق.</h3><p>مكان تتواصل فيه، وتلعب، وتبني عالمك، وتشارك لحظاتك مع الناس اللي يهموك.</p><button type="button" data-sq197-go="civilization">اكتشف الحضارة <span>←</span></button></article>
    <article class="sq197-focus sq197-focus-tools"><span class="sq197-eyebrow">YOUR CREATIVE TOOLS</span><h3>أفكارك تستاهل مساحة.</h3><p>افتح أدواتك الذكية أو اكتشف العناصر الافتراضية المتاحة في المنصة.</p><div><button type="button" data-sq197-go="ai">AI Hub ↗</button><button type="button" data-sq197-go="store">Store ↗</button></div></article>
   </div>
   <p class="sq197-footnote">المؤشرات تعرض عناصر الواجهة الموجودة حاليًا فقط؛ لا يتم اختلاق أعداد أصدقاء أو نشاط غير متصل بالبيانات.</p>`;
  main.insertBefore(panel,screen);
  panel.addEventListener('click',e=>{const b=e.target.closest('[data-sq197-go]');if(!b)return;const key=b.dataset.sq197Go;window.SquadPremiumNavigation?.open(key)});
  return panel;
 }
 function refresh(){if(!panel)return;const n=$('[data-sq197-name]',panel),st=$('[data-sq197-status]',panel),m=$('[data-sq197-messages]',panel),stories=$('[data-sq197-stories]',panel);if(n)n.textContent=accountName();if(st)st.textContent=currentStatus();if(m)m.textContent=String(countVisible('#list > *, #recent > *'));if(stories)stories.textContent=String(countVisible('#dr-screen [data-story], #dr-screen .story-card, #dr-screen .story-item'));}
 function open(){make();panel.hidden=false;screen.hidden=true;refresh();rail.querySelectorAll('.sq195-subnav button').forEach(x=>x.classList.toggle('is-current',x.dataset.squadOpen==='home'));main.classList.add('sq197-home-active');}
 function close(){if(!panel)return;panel.hidden=true;screen.hidden=false;main.classList.remove('sq197-home-active')}
 // Keep the command center out of the way when the legacy social feed is selected.
 document.addEventListener('click',e=>{if(e.target.closest('.dr-mobile-nav [data-social]:not([data-social="feed"])')||e.target.closest('#social-rail [data-social]'))close()},{capture:true});
 window.SquadHomeCommand={open,close,refresh,version:197};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{make();refresh()},{once:true});else{make();refresh()}
})();
