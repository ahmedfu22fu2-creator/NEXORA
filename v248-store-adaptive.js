/* v248 — Adaptive in-game campaigns. All content comes from NEXORA's existing catalog.
   Preference signals stay on this device; no personal data, external ad pixels, or source-store identity. */
(()=>{'use strict';if(window.SquadStoreV248)return;
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const root=$('#catalog'),filters=$('#filters');if(!root||!filters)return;
 const key='squad_store_interest_v248',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let interest={car:0,estate:0,apartment:0},active='all',index=0,timer=0,paused=false,slides=[];
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}');for(const k of Object.keys(interest))interest[k]=Math.min(30,Math.max(0,Number(saved[k])||0))}catch{}
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(interest))}catch{}};
 const typeLabel=t=>t==='car'?'المركبات':t==='estate'?'الفلل والعقارات':'الشقق';
 const cards=()=>$$('.item[data-item-id]',root).map(el=>({el,id:el.dataset.itemId,type:el.dataset.itemType,name:$('.body h3',el)?.textContent?.trim()||el.dataset.itemId,icon:$('.art',el)?.textContent?.trim()||'✦',price:$('.price',el)?.textContent?.trim()||''}));
 const ranked=()=>{const all=cards();return all.map((p,n)=>({...p,score:(interest[p.type]||0)*3+(active===p.type?5:0)+(p.type==='car'?1:0)-n*.001})).sort((a,b)=>b.score-a.score)};
 const campaign=document.createElement('section');campaign.className='sq248-campaign';campaign.id='sq248Campaign';campaign.setAttribute('aria-label','إعلانات ومنتجات مميزة من متجر NEXORA');campaign.innerHTML='<div class="sq248-copy"><span class="sq248-kicker">NEXORA · STORE SPOTLIGHT</span><span class="sq248-label">إعلان داخل المتجر</span><h2></h2><p></p><button class="sq248-cta" type="button">اكتشف العنصر <span aria-hidden="true">←</span></button><div class="sq248-controls"><button class="sq248-arrow" type="button" data-step="-1" aria-label="الإعلان السابق">‹</button><div class="sq248-dots" aria-label="اختيار الإعلان"></div><button class="sq248-arrow" type="button" data-step="1" aria-label="الإعلان التالي">›</button></div></div><div class="sq248-art" aria-hidden="true">✦</div>';
 const recs=document.createElement('section');recs.className='sq248-recs';recs.id='sq248Recommendations';recs.setAttribute('aria-label','ترشيحات منتجات حسب القسم المعروض');recs.innerHTML='<div class="sq248-rec-head"><div><span class="sq248-label">SMART PICKS · NEXORA</span><h2>مختارة لك</h2><p>تتغير حسب القسم والمنتجات التي تستكشفها على هذا الجهاز.</p></div></div><div class="sq248-rec-list"></div>';
 filters.after(campaign);root.after(recs);
 function updateSlides(){const all=cards();slides=all.filter(p=>active==='all'||p.type===active);if(!slides.length)slides=all;if(!slides.length)return;index=index%slides.length;show(index);dots()}
 function dots(){const box=$('.sq248-dots',campaign);box.innerHTML=slides.slice(0,7).map((_,i)=>`<button type="button" data-index="${i}" aria-label="عرض الإعلان ${i+1}" aria-current="${i===index?'true':'false'}"></button>`).join('')}
 function show(n){if(!slides.length)return;index=(n+slides.length)%slides.length;const p=slides[index];$('h2',campaign).textContent=p.name;$('p',campaign).textContent=`${typeLabel(p.type)} · ${p.price} — اكتشف العنصر داخل عالم NEXORA.`;$('.sq248-art',campaign).textContent=p.icon;$$('.sq248-dots button',campaign).forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));}
 function schedule(){clearInterval(timer);if(!reduced.matches&&!paused&&!document.hidden&&slides.length>1)timer=setInterval(()=>show(index+1),6500)}
 function renderRecs(){const list=$('.sq248-rec-list',recs),rank=ranked().slice(0,3);list.innerHTML=rank.map(p=>`<button class="sq248-rec" type="button" data-target="${p.id}"><span class="sq248-rec-icon" aria-hidden="true">${p.icon}</span><span><b>${p.name}</b><small>${typeLabel(p.type)} · ${p.price}</small></span></button>`).join('');}
 function mark(type){if(!Object.hasOwn(interest,type))return;interest[type]=Math.min(30,interest[type]+1);save();renderRecs()}
 function focusProduct(id){const p=cards().find(x=>x.id===id);if(!p)return;const filterButton=$(`[data-filter="${p.type}"]`,filters);if(filterButton)filterButton.click();const card=cards().find(x=>x.id===id)?.el;card?.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'});card?.animate?.([{outline:'2px solid rgba(125,190,255,.9)'},{outline:'2px solid transparent'}],{duration:900});mark(p.type)}
 filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;active=b.dataset.filter;mark(active);updateSlides();renderRecs();schedule()});
 root.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;const p=cards().find(x=>x.id===b.dataset.id);if(p)mark(p.type)});
 campaign.addEventListener('click',e=>{const step=e.target.closest('[data-step]');if(step){show(index+Number(step.dataset.step));schedule();return}const dot=e.target.closest('[data-index]');if(dot){show(Number(dot.dataset.index));schedule();return}if(e.target.closest('.sq248-cta')){const p=slides[index];if(p)focusProduct(p.id)}});
 recs.addEventListener('click',e=>{const b=e.target.closest('[data-target]');if(b)focusProduct(b.dataset.target)});
 campaign.addEventListener('mouseenter',()=>{paused=true;schedule()});campaign.addEventListener('mouseleave',()=>{paused=false;schedule()});campaign.addEventListener('focusin',()=>{paused=true;schedule()});campaign.addEventListener('focusout',()=>{paused=false;schedule()});document.addEventListener('visibilitychange',schedule);reduced.addEventListener?.('change',schedule);
 updateSlides();renderRecs();schedule();
 new MutationObserver(()=>{if(cards().length){updateSlides();renderRecs();schedule()}}).observe(root,{childList:true});
 window.SquadStoreV248=Object.freeze({version:248,refresh:()=>{updateSlides();renderRecs();schedule()},getInterest:()=>({...interest})});
})();
