/* NEXORA v202 — Social Feed Evolution.
   UI-only filtering/sorting over already loaded posts; existing Firestore schema and auth flows remain unchanged. */
(()=>{'use strict';
 const original=window.SquadSocial;
 if(!original?.state)return;
 const state=original.state;
 const ui={term:'',kind:'all',sort:'newest'};
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const stamp=p=>p.createdAt?.toMillis?.()??(p.createdAt instanceof Date?p.createdAt.getTime():new Date(p.createdAt||0).getTime());
 const oldRender=(()=>{let fn=null;return fn})();
 // Wrap the feed renderer by observing the feed root and enhancing its output after each render.
 let scheduled=false;
 const enhance=()=>{
  scheduled=false;
  const host=document.querySelector('#dr-screen');if(!host)return;
  let bar=host.querySelector('#sq202-feed-tools');
  if(!bar){
   bar=document.createElement('section');bar.id='sq202-feed-tools';bar.className='sq202-feed-tools';
   bar.innerHTML=`<div class="sq202-feed-heading"><div><span>NEXORA · SOCIAL FEED</span><h2>مساحة مجتمعك</h2><p>رتّب المنشورات وابحث في المحتوى المحمّل.</p></div><label class="sq202-feed-search"><span>⌕</span><input type="search" maxlength="80" placeholder="ابحث في المنشورات..." aria-label="ابحث في المنشورات"></label></div><div class="sq202-feed-controls"><div class="sq202-feed-filters" role="group" aria-label="نوع المنشورات"><button type="button" data-kind="all" class="active">الكل</button><button type="button" data-kind="text">نصوص</button><button type="button" data-kind="images">صور</button></div><label class="sq202-sort-label">الترتيب <select id="sq202-feed-sort"><option value="newest">الأحدث</option><option value="popular">الأكثر تفاعلًا</option></select></label></div><small class="sq202-feed-note">البحث والتصفية يطبّقان على المنشورات التي تم تحميلها حاليًا.</small>`;
   host.prepend(bar);
   const input=bar.querySelector('input');
   input.addEventListener('input',()=>{ui.term=input.value.trim().toLocaleLowerCase();apply()});
   bar.addEventListener('click',e=>{const b=e.target.closest('[data-kind]');if(!b)return;ui.kind=b.dataset.kind;bar.querySelectorAll('[data-kind]').forEach(x=>x.classList.toggle('active',x===b));apply()});
   bar.querySelector('#sq202-feed-sort').addEventListener('change',e=>{ui.sort=e.target.value;apply()});
  }
  apply();
 };
 const apply=()=>{
  const host=document.querySelector('#dr-screen');if(!host)return;
  const feed=host.querySelector('.dr-feed');if(!feed)return;
  const cards=[...feed.querySelectorAll('[data-post]')];
  cards.forEach(card=>{
   const text=card.textContent.toLocaleLowerCase(),hasImage=!!card.querySelector('img');
   const kindOk=ui.kind==='all'||(ui.kind==='images'&&hasImage)||(ui.kind==='text'&&!hasImage);
   card.hidden=!(kindOk&&(!ui.term||text.includes(ui.term)));
  });
  const ordered=[...cards].sort((a,b)=>{
   const pa=state.items.find(x=>x.id===a.dataset.post)||{},pb=state.items.find(x=>x.id===b.dataset.post)||{};
   return ui.sort==='popular'?((pb.likeCount||0)+(pb.commentCount||0))-((pa.likeCount||0)+(pa.commentCount||0)):stamp(pb)-stamp(pa);
  });
  if(ordered.some((card,i)=>card!==cards[i]))ordered.forEach(card=>feed.append(card));
  let empty=host.querySelector('#sq202-feed-empty');
  const visible=cards.filter(c=>!c.hidden).length;
  if(!visible){if(!empty){empty=document.createElement('p');empty.id='sq202-feed-empty';empty.className='sq202-feed-empty';empty.textContent='مفيش منشورات مطابقة للتصفية أو البحث الحالي.';feed.after(empty)}}else empty?.remove();
 };
 const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)});
 const start=()=>{const host=document.querySelector('#dr-screen');if(host)observer.observe(host,{childList:true,subtree:true});enhance()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.SquadSocial202={version:202,refresh:enhance,filters:ui};
})();