/* NEXORA v200 — Stories & Channels Evolution.
   Additive experience layer over the existing Firestore-backed stories/channels system.
   Does not create collections, alter schemas, or replace legacy publishing/follow flows. */
(()=>{'use strict';
 if(window.SquadStories200)return;
 const $=(s,r=document)=>r.querySelector(s);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let filter='all',term='',observer=null;
 const rows=()=>[...$('#oth')?.querySelectorAll('.wi')||[]];
 const mineId=()=>$('#oth [data-sn]')?.closest('[data-su]')?.dataset.su||'';
 function header(){
  const host=$('#oth');if(!host||host.hidden)return;
  let bar=$('#sq200-stories-hub',host);
  if(!bar){
   bar=document.createElement('section');bar.id='sq200-stories-hub';bar.className='sq200-hub';
   bar.innerHTML=`<div class="sq200-top"><div><span class="sq200-kicker">NEXORA · SOCIAL PULSE</span><h2>لحظاتك ومجتمعاتك <span>∞</span></h2><p>تابع يوم أصحابك، واكتشف القنوات، وشارك لحظتك في مكان واحد.</p></div><div class="sq200-actions"><button type="button" data-sq200="story">＋ حالة جديدة</button><button type="button" class="sq200-secondary" data-sq200="channel">＋ إنشاء قناة</button></div></div>
    <div class="sq200-tools"><div class="sq200-filters" role="tablist" aria-label="تصفية التحديثات"><button type="button" data-filter="all" role="tab">الكل</button><button type="button" data-filter="stories" role="tab">الحالات</button><button type="button" data-filter="channels" role="tab">القنوات</button><button type="button" data-filter="mine" role="tab">تحديثاتي</button></div><label class="sq200-search"><span>⌕</span><input type="search" id="sq200-search" placeholder="ابحث في الحالات والقنوات..." autocomplete="off" aria-label="ابحث في الحالات والقنوات"></label></div>
    <div class="sq200-summary" aria-live="polite"><span data-count="stories">الحالات <b>—</b></span><span data-count="channels">القنوات <b>—</b></span><span data-count="visible">المعروض <b>—</b></span></div>`;
   host.prepend(bar);
   bar.addEventListener('click',e=>{const b=e.target.closest('[data-filter],[data-sq200]');if(!b)return;
    if(b.dataset.filter){filter=b.dataset.filter;apply();return}
    if(b.dataset.sq200==='story')host.querySelector('[data-sn]')?.click();
    if(b.dataset.sq200==='channel')host.querySelector('[data-nc]')?.click();
   });
   $('#sq200-search',bar).addEventListener('input',e=>{term=e.target.value.trim().toLocaleLowerCase();apply()});
  }
  apply();
 }
 function apply(){
  const host=$('#oth'),bar=$('#sq200-stories-hub',host);if(!host||!bar)return;
  const all=rows(),stories=all.filter(x=>x.hasAttribute('data-su')),channels=all.filter(x=>x.hasAttribute('data-ch'));
  const own=mineId();let shown=0;
  for(const el of all){
   const isStory=el.hasAttribute('data-su'),isMine=isStory&&el.dataset.su===own;
   const typeOk=filter==='all'||(filter==='stories'&&isStory)||(filter==='channels'&&!isStory)||(filter==='mine'&&isMine);
   const textOk=!term||el.textContent.toLocaleLowerCase().includes(term);
   el.hidden=!(typeOk&&textOk);if(!el.hidden)shown++;
  }
  host.querySelectorAll('.up-h').forEach(h=>{
   const next=h.nextElementSibling;let visible=false;
   for(let n=next;n&&!n.classList.contains('up-h');n=n.nextElementSibling)if(n.classList.contains('wi')&&!n.hidden){visible=true;break}
   h.hidden=!visible;
  });
  bar.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
  const put=(key,n)=>{const b=bar.querySelector(`[data-count="${key}"] b`);if(b)b.textContent=n};
  put('stories',stories.length);put('channels',channels.length);put('visible',shown);
  let empty=$('#sq200-empty',host);
  if(!shown){if(!empty){empty=document.createElement('div');empty.id='sq200-empty';empty.className='sq200-empty';empty.textContent=term?'مفيش نتائج مطابقة لبحثك. جرّب كلمة تانية.':'مفيش محتوى في التصفية دي لسه. ابدأ بمشاركة حالة أو اكتشف قناة جديدة.';host.append(empty)}else empty.textContent=term?'مفيش نتائج مطابقة لبحثك. جرّب كلمة تانية.':'مفيش محتوى في التصفية دي لسه. ابدأ بمشاركة حالة أو اكتشف قناة جديدة.'}
  else empty?.remove();
 }
 function start(){
  const host=$('#oth');if(!host)return;
  observer=new MutationObserver(()=>{if(!host.hidden)header();else $('#sq200-stories-hub',host)?.remove()});
  observer.observe(host,{childList:true,subtree:true});
  if(!host.hidden)header();
  const nav=$('#nav [data-go="up"]');nav?.addEventListener('click',()=>setTimeout(header,100));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.SquadStories200={version:200,refresh:header,setFilter:v=>{filter=['all','stories','channels','mine'].includes(v)?v:'all';apply()}};
})();