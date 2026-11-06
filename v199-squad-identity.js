/* NEXORA v199 — Squad Identity.
   Enhances the existing profile route using already-loaded account/social data.
   No new collections, fake counters, profile writes, or replacement auth logic. */
(()=>{'use strict';
 if(window.SquadIdentity)return;
 const $=(s,r=document)=>r.querySelector(s);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=(v,f='')=>typeof v==='string'&&v.trim()?v.trim():f;
 const user=()=>{try{return window.firebase?.auth?.().currentUser||null}catch(_){return null}};
 const model=()=>{const u=user(),d=window.U||{};return {uid:u?.uid||window.me?.uid||'',name:text(d.name,u?.displayName||u?.email?.split('@')[0]||'عضو NEXORA'),handle:text(d.un,''),bio:text(d.bio,''),city:text(d.city,''),sid:text(d.sid,''),photo:text(d.photoURL||d.photo||d.avatar,''),email:u?.email||''}};
 const stats=()=>{const n=[...document.querySelectorAll('.dr-profile-stats b')].map(x=>x.textContent.trim());return {posts:n[0]||'—',followers:n[1]||'—',following:n[2]||'—'}};
 const completeness=m=>{const fields=[m.name,m.handle,m.bio,m.city,m.photo];return Math.round(fields.filter(Boolean).length/fields.length*100)};
 function panel(){const root=$('#dr-screen'),legacy=root?.querySelector('.dr-panel');if(!root||!legacy||root.querySelector('#sq199-identity'))return;const m=model(),s=stats(),pct=completeness(m),initial=(m.name.trim()[0]||'S').toUpperCase();
  const el=document.createElement('section');el.id='sq199-identity';el.className='sq199-identity';el.setAttribute('aria-label','Squad Identity profile dashboard');
  el.innerHTML=`<div class="sq199-id-head"><div><span class="sq199-eyebrow">NEXORA · YOUR DIGITAL IDENTITY</span></div><span class="sq199-live"><i></i>${m.uid?'حسابك الحالي':'وضع المعاينة'}</span></div>
   <div class="sq199-hero"><div><div class="sq199-person"><div class="sq199-avatar">${m.photo?`<img src="${esc(m.photo)}" alt="الصورة الشخصية" loading="lazy">`:esc(initial)}</div><div class="sq199-person-copy"><h2>${esc(m.name)} <span class="sq199-verified" data-sq199-verified hidden aria-label="حساب موثّق" title="حساب موثّق بعد بلوغ 5000 متابع">✓</span></h2>${m.handle?`<span class="sq199-handle">@${esc(m.handle)}</span>`:`<span class="sq199-handle">أضف اسم مستخدم مميزًا من إعدادات الحساب</span>`}<p class="sq199-bio">${esc(m.bio||'ملفك الشخصي هو مساحتك لتعريف مجتمع NEXORA بك.')}${m.city?`<br>⌖ ${esc(m.city)}`:''}</p></div></div>
   <div class="sq199-id-actions"><button type="button" data-sq199-action="settings">تعديل بيانات الحساب ↗</button><button type="button" class="quiet" data-sq199-action="discover">اكتشف الأعضاء</button><button type="button" class="quiet" data-sq199-action="messages">افتح المحادثات</button></div></div>
   <div class="sq199-rank" style="--sq199-progress:${pct}%"><div><b>${pct}%</b><small>اكتمال الملف</small></div></div></div><p class="sq199-verification-progress" data-sq199-verification-progress hidden></p>
   <div class="sq199-section"><div><h3>بصمتك الاجتماعية</h3><p>الأرقام التالية مأخوذة من إحصائيات ملفك الحالية.</p></div></div>
   <div class="sq199-grid"><article class="sq199-card"><span class="ico">✦</span><b>المنشورات</b><p data-sq199-stat="posts">${esc(s.posts)} · محتوى ملفك</p></article><article class="sq199-card"><span class="ico">♧</span><b>المتابعون</b><p data-sq199-stat="followers">${esc(s.followers)} · مجتمعك</p></article><article class="sq199-card"><span class="ico">◎</span><b>تتابع</b><p data-sq199-stat="following">${esc(s.following)} · الحسابات التي تتابعها</p></article></div>
   <div class="sq199-section"><div><h3>إدارة هويتك</h3><p>تحكم في حسابك وظهورك من الأدوات الحالية.</p></div></div>
   <div class="sq199-grid"><article class="sq199-card"><span class="ico">⌘</span><b>بيانات الحساب</b><p>الاسم، اسم المستخدم، المدينة والبيانات الإضافية.</p><button type="button" data-sq199-action="settings">فتح الإعدادات</button></article><article class="sq199-card"><span class="ico">◈</span><b>الخصوصية والأمان</b><p>راجع إعدادات الخصوصية والحماية المتاحة في حسابك.</p><button type="button" data-sq199-action="privacy">إعدادات الأمان</button></article><article class="sq199-card"><span class="ico">♙</span><b>اكتشاف المجتمع</b><p>انتقل إلى مساحة اكتشاف الأعضاء والبحث.</p><button type="button" data-sq199-action="discover">اكتشف الآن</button></article></div>
   <p class="sq199-note">اكتمال الملف مؤشر إرشادي يعتمد على الحقول المتاحة في جلسة الحساب الحالية، وليس تقييمًا للمستخدم. لا يتم عرض البريد أو رقم الهاتف أو تاريخ الميلاد في هذه اللوحة.</p>`;
  legacy.insertAdjacentElement('afterend',el);
  loadVerification(m.uid,el);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-sq199-action]');if(!b)return;const a=b.dataset.sq199Action;if(a==='settings')$('#gear')?.click();else if(a==='privacy'){$('#gear')?.click();}else if(a==='discover')$('#nav [data-go="find"]')?.click();else if(a==='messages')document.querySelector('.dr-mobile-nav [data-social="messages"]')?.click()});
 }
 async function loadVerification(uid,root){
  const badge=root?.querySelector('[data-sq199-verified]');if(!uid||!badge||!window.firebase?.firestore)return;
  try{const current=firebase.auth?.().currentUser;if(current?.uid===uid&&firebase.app?.().functions){await firebase.app().functions('europe-west1').httpsCallable('refreshMyProfileVerification')({}).catch(()=>{});}
   const snap=await firebase.firestore().doc(`publicProfiles/${uid}`).get();if(!badge.isConnected)return;const data=snap.exists?snap.data()||{}:{};badge.hidden=data.verified!==true;badge.title=data.verified===true?'حساب موثّق — وصل إلى 5000 متابع':'غير موثّق';const progress=root.querySelector('[data-sq199-verification-progress]');if(progress&&data.verified!==true&&Number.isFinite(Number(data.followerCount))){const n=Math.max(0,Number(data.followerCount));progress.hidden=false;progress.textContent=`${n.toLocaleString('ar-EG')} من 5,000 متابع للوصول إلى التوثيق التلقائي.`}else if(progress)progress.hidden=true;}
  catch(_){badge.hidden=true;}
 }
 function refresh(){const root=$('#dr-screen');if(!root)return;if(root.querySelector('.dr-profile-cover')){panel();const s=stats();for(const k of ['posts','followers','following']){const el=root.querySelector(`[data-sq199-stat="${k}"]`);if(el)el.textContent=(s[k]||'—')+({posts:' · محتوى ملفك',followers:' · مجتمعك',following:' · الحسابات التي تتابعها'}[k])}}}
 document.addEventListener('click',e=>{if(e.target.closest('.dr-mobile-nav [data-social="profile"]')||e.target.closest('#nav [data-go="me"]'))setTimeout(refresh,80)});
 const mo=new MutationObserver(()=>{if($('#dr-screen .dr-profile-cover'))refresh()});
 const start=()=>{const r=$('#dr-screen');if(r)mo.observe(r,{childList:true,subtree:true,characterData:true});refresh()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.SquadIdentity={version:199,refresh,completeness};
})();
