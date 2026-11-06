/* NEXORA v162 — Global Hub: discovery, creator workspace and privacy controls.
   Additive client module. Uses only existing Firestore paths and SquadSocial APIs. */
(()=>{'use strict';
if(window.SquadGlobalHub)return;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const db=()=>window.firebase?.firestore?firebase.firestore():null;
const auth=()=>window.firebase?.auth?firebase.auth().currentUser:null;
const uid=()=>auth()?.uid||null;
const storeKey=()=>`sq162.draft.${uid()||'guest'}`;
const say=m=>window.toast?toast(m):console.info(m);
let modal=null,tab='discover',searchTimer=0,searchSeq=0,blocked=[],searchCache=null;
const normalizeSearch=s=>String(s??'').normalize('NFKC').toLocaleLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[\u0622\u0623\u0625]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').trim();
const open=()=>{
 if(!uid()||!db()){say('سجّل الدخول أولًا لفتح مركز NEXORA');return}
 if(modal){modal.hidden=false;return}
 modal=document.createElement('section');modal.className='sq162-overlay';modal.id='sq162-hub';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','sq162-title');
 modal.innerHTML=`<div class="sq162-panel"><header class="sq162-head"><div><small>NEXORA · GLOBAL</small><h2 id="sq162-title">مركز المنصة</h2><p>اكتشف مجتمعك، طوّر محتواك، وتحكم في خصوصيتك.</p></div><button class="sq162-close" data-sq162-close aria-label="إغلاق">×</button></header>
 <nav class="sq162-tabs" aria-label="أقسام مركز المنصة"><button data-sq162-tab="discover" class="active">استكشاف</button><button data-sq162-tab="creator">استوديو المبدعين</button><button data-sq162-tab="privacy">مركز الخصوصية</button><button data-sq162-tab="tools">خدمات المنصة</button></nav><main class="sq162-content" id="sq162-content"></main><footer class="sq162-foot"><span>إضافات v162 · لا تستبدل أنظمتك الحالية</span><span>ESC للإغلاق</span></footer></div>`;
 document.body.append(modal);modal.addEventListener('click',handle);modal.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 render();modal.querySelector('[data-sq162-close]').focus();
};
function close(){if(modal)modal.hidden=true}
function setTab(t){tab=t;modal.querySelectorAll('[data-sq162-tab]').forEach(b=>b.classList.toggle('active',b.dataset.sq162Tab===t));render();if(t==='privacy')loadBlocked()}
function render(){if(!modal)return;const c=$('#sq162-content',modal);if(tab==='discover')c.innerHTML=discoverView();else if(tab==='creator')c.innerHTML=creatorView();else if(tab==='privacy')c.innerHTML=privacyView();else c.innerHTML=toolsView()}
function discoverView(){return `<section class="sq162-intro"><div><span class="sq162-kicker">SQUAD SEARCH · v256</span><h3>اكتشف عالم NEXORA</h3><p>ابحث في الحسابات العامة والمنشورات والمجتمعات ومحادثاتك المسموح لك بالوصول إليها.</p></div><div class="sq162-orb" aria-hidden="true">◎</div></section>
 <label class="sq162-search-label" for="sq162-query">البحث الشامل</label><div class="sq162-searchbox"><span aria-hidden="true">⌕</span><input id="sq162-query" class="sq162-input" type="search" maxlength="60" autocomplete="off" spellcheck="false" placeholder="اكتب اسمًا أو كلمة للبحث…" aria-describedby="sq162-search-help"><button type="button" data-sq162-clear aria-label="مسح البحث" title="مسح البحث">×</button></div><p id="sq162-search-help" class="sq162-search-help">اكتب حرفين على الأقل. يتم توحيد بعض اختلافات الكتابة العربية لتحسين النتائج.</p><p id="sq162-search-status" class="sq162-search-status" role="status" aria-live="polite">جاهز للبحث.</p>
 <div class="sq162-result-grid"><section class="sq162-card"><h4>الأشخاص <span id="sq162-count-people">—</span></h4><div id="sq162-people" class="sq162-results"><p class="sq162-muted">ستظهر الحسابات العامة المطابقة هنا.</p></div></section><section class="sq162-card"><h4>المنشورات العامة <span id="sq162-count-posts">—</span></h4><div id="sq162-posts" class="sq162-results"><p class="sq162-muted">ستظهر المنشورات العامة المطابقة هنا.</p></div></section><section class="sq162-card"><h4>المجتمعات <span id="sq162-count-communities">—</span></h4><div id="sq162-communities" class="sq162-results"><p class="sq162-muted">ستظهر المجتمعات المطابقة هنا.</p></div></section><section class="sq162-card"><h4>محادثاتك <span id="sq162-count-chats">—</span></h4><div id="sq162-chats" class="sq162-results"><p class="sq162-muted">يبحث داخل أسماء محادثاتك وآخر رسالة فقط.</p></div></section></div>
 <p class="sq162-note">المنشورات المعروضة عامة ومنشورة فقط. البحث في المحادثات يقتصر على المحادثات التي أنت عضو فيها، ويطابق الاسم وآخر رسالة فقط؛ لا يتم البحث في رسائل الآخرين الخاصة أو سجل الرسائل الكامل.</p>`}
function creatorView(){let draft={text:'',visibility:'public'};try{draft=JSON.parse(localStorage.getItem(storeKey())||'{}')}catch(_){}return `<section class="sq162-intro"><div><span class="sq162-kicker">CREATOR STUDIO</span><h3>مساحتك لصناعة المحتوى</h3><p>جهّز منشورك، احفظ مسودتك على هذا الجهاز، وانشره في الفيد الحالي.</p></div><div class="sq162-orb">✦</div></section>
 <section class="sq162-card"><label class="sq162-search-label" for="sq162-draft">ماذا تريد أن تشارك؟</label><textarea id="sq162-draft" class="sq162-input sq162-textarea" maxlength="2000" placeholder="اكتب فكرة أو قصة أو تحديثًا لمجتمعك…">${esc(draft.text||'')}</textarea>
 <label class="sq162-search-label" for="sq162-files">صور المنشور (حتى 4 صور)</label><input id="sq162-files" class="sq162-input" type="file" accept="image/jpeg,image/png,image/webp" multiple>
 <div class="sq162-actions"><button class="sq162-btn secondary" data-sq162-save>حفظ المسودة</button><button class="sq162-btn primary" data-sq162-publish>نشر في المنصة</button></div><p id="sq162-creator-status" class="sq162-muted">المسودات محفوظة محليًا على هذا الجهاز فقط.</p></section>
 <section class="sq162-card"><h4>أدوات المبدع</h4><div class="sq162-mini-grid"><div><b>ملكية المحتوى</b><span>انشر المحتوى الذي تملكه أو لديك إذن باستخدامه.</span></div><div><b>جودة النشر</b><span>الصور المدعومة JPEG وPNG وWebP، بحدود نظام النشر الحالي.</span></div><div><b>إدارة المحتوى</b><span>يمكنك متابعة منشوراتك وحذف منشوراتك من الفيد الحالي.</span></div></div></section>`}
function privacyView(){return `<section class="sq162-intro"><div><span class="sq162-kicker">PRIVACY CENTER</span><h3>خصوصيتك تحت سيطرتك</h3><p>إدارة الحظر ومراجعة إعدادات الخصوصية الحالية.</p></div><div class="sq162-orb">⌑</div></section>
 <section class="sq162-card"><div class="sq162-card-title"><h4>الحسابات المحظورة</h4><button class="sq162-btn secondary" data-sq162-refresh-blocks>تحديث</button></div><div id="sq162-blocked" class="sq162-results"><p class="sq162-muted">جارٍ تحميل القائمة…</p></div></section>
 <section class="sq162-card"><h4>إعدادات الحساب</h4><p class="sq162-muted">إعدادات الصورة وآخر ظهور والقراءة موجودة بالفعل في إعدادات الحساب. افتحها لمراجعة خياراتك بدل إنشاء إعدادات مكررة أو غير متوافقة مع قواعد الأمان.</p><button class="sq162-btn primary" data-sq162-settings>فتح إعدادات الحساب</button></section>
 <p class="sq162-note">لا يغيّر هذا المركز إعدادات الخصوصية تلقائيًا، ولا يقرأ الرسائل الخاصة أو كلمات المرور أو بيانات الدفع.</p>`}
function toolsView(){return `<section class="sq162-intro"><div><span class="sq162-kicker">ONE SQUAD · MANY WORLDS</span><h3>كل تجاربك في مكان واحد</h3><p>افتح الأنظمة الموجودة بالفعل دون مغادرة المنصة.</p></div><div class="sq162-orb">✧</div></section><div class="sq162-tools">
 <button data-sq162-go="messages"><b>الرسائل والمكالمات</b><span>محادثاتك واتصالاتك</span></button><button data-sq162-go="feed"><b>المنشورات والقصص</b><span>مجتمعك ومحتواك</span></button><button data-sq162-go="friends"><b>الأصدقاء والمجتمعات</b><span>طلبات الصداقة والغرف</span></button><button data-sq162-go="city"><b>المدينة ثلاثية الأبعاد</b><span>العالم الافتراضي عند الطلب</span></button><button data-sq162-go="cafe"><b>الكافيه ثلاثي الأبعاد</b><span>مساحة اجتماعية</span></button><button data-sq162-go="cinema"><b>السينما</b><span>مشاهدة جماعية</span></button><button data-sq162-go="ai"><b>مركز الخدمات الذكية</b><span>الأدوات والخدمات المتاحة</span></button></div>
 <p class="sq162-note">بعض التجارب تحتاج اتصالًا وقواعد Firebase أو إعدادات تشغيل إضافية. فتح القسم لا يعني أن الخدمات الخارجية مفعّلة.</p>`}
async function loadSearchData(){
 const user=uid(),now=Date.now();
 if(searchCache&&searchCache.uid===user&&now-searchCache.at<30000)return searchCache.data;
 const database=db();if(!database)throw Error('Firebase غير متاح');
 const tasks=[
  database.collection('publicProfiles').limit(150).get(),
  database.collection('posts').where('visibility','==','public').where('status','==','published').orderBy('createdAt','desc').limit(60).get(),
  database.collection('communities').limit(100).get(),
  database.collection('chats').where('members','array-contains',uid()).limit(100).get()
 ];
 const settled=await Promise.allSettled(tasks),keys=['people','posts','communities','chats'],data={};
 settled.forEach((r,i)=>{data[keys[i]]=r.status==='fulfilled'?r.value.docs.map(d=>({id:d.id,...d.data()})):null});
 searchCache={uid:user,at:now,data};return data;
}
function setSearchSection(key,html,count){const el=$(`#sq162-${key}`,modal),badge=$(`#sq162-count-${key}`,modal);if(el)el.innerHTML=html;if(badge)badge.textContent=count==null?'!':String(count)}
async function search(q){
 const seq=++searchSeq,needle=normalizeSearch(q),status=$('#sq162-search-status',modal);
 const keys=['people','posts','communities','chats'];if(!modal||modal.hidden)return;
 if(needle.length<2){for(const key of keys)setSearchSection(key,'<p class="sq162-muted">اكتب حرفين على الأقل لبدء البحث.</p>','—');if(status)status.textContent='اكتب حرفين على الأقل.';return}
 for(const key of keys)setSearchSection(key,'<p class="sq162-muted sq162-loading">جارٍ البحث…</p>','…');
 if(status)status.textContent='جارٍ البحث في الأقسام المتاحة…';
 try{
  const data=await loadSearchData();if(seq!==searchSeq||!modal||modal.hidden)return;
  const match=value=>normalizeSearch(value).includes(needle),limit=12;
  if(data.people){const hits=data.people.filter(p=>p.id!==uid()&&match(`${p.name||''} ${p.un||''} ${p.bio||''}`)).slice(0,limit);setSearchSection('people',hits.map(p=>`<article class="sq162-person"><span class="sq162-avatar" aria-hidden="true">${esc((p.name||'ع').slice(0,1))}</span><div><b>${esc(p.name||'عضو')} ${p.verified===true?'<span class="sq199-verified" aria-label="حساب موثّق" title="حساب موثّق بعد بلوغ 5000 متابع">✓</span>':''}</b><small>${p.un?'@'+esc(p.un):'عضو في NEXORA'}</small></div><button class="sq162-follow" type="button" data-sq162-follow="${esc(p.id)}">${window.SquadSocial?.state?.following?.has(p.id)?'إلغاء المتابعة':'متابعة'}</button></article>`).join('')||'<p class="sq162-muted">لا توجد حسابات عامة مطابقة.</p>',hits.length)}else setSearchSection('people','<p class="sq162-muted">تعذر تحميل الحسابات العامة. تحقق من الاتصال والصلاحيات.</p>',null);
  if(data.posts){const hits=data.posts.filter(p=>p.status==='published'&&p.visibility==='public'&&match(p.text||'')).slice(0,limit);setSearchSection('posts',hits.map(p=>`<article class="sq162-post"><b>${esc(p.authorName||'عضو')}</b><p>${esc((p.text||'').slice(0,220))}</p><small>${Number(p.likeCount||0)} إعجاب · ${Number(p.commentCount||0)} تعليق</small><button class="sq162-follow" type="button" data-sq162-open-feed>فتح الفيد</button></article>`).join('')||'<p class="sq162-muted">لا توجد منشورات عامة مطابقة.</p>',hits.length)}else setSearchSection('posts','<p class="sq162-muted">تعذر تحميل المنشورات العامة.</p>',null);
  if(data.communities){const hits=data.communities.filter(c=>!c.par&&match(`${c.nm||''} ${c.ds||''} ${c.cat||''}`)).slice(0,limit);setSearchSection('communities',hits.map(c=>`<article class="sq162-post"><b>${esc(c.nm||'مجتمع')}</b><p>${esc(c.ds||'')}</p><small>${esc(c.cat||'عام')} · ${Number(c.mc||0)} عضو</small></article>`).join('')||'<p class="sq162-muted">لا توجد مجتمعات مطابقة.</p>',hits.length)}else setSearchSection('communities','<p class="sq162-muted">تعذر تحميل المجتمعات.</p>',null);
  if(data.chats){const hits=data.chats.filter(c=>{const peer=(c.members||[]).find(x=>x!==uid()),title=c.type==='g'?(c.nm||''):((c.names||{})[peer]||'محادثة');return match(`${title} ${c.last?.tx||''} ${c.last?.n||''}`)}).slice(0,limit);setSearchSection('chats',hits.map(c=>{const peer=(c.members||[]).find(x=>x!==uid()),title=c.type==='g'?(c.nm||'مجموعة'):((c.names||{})[peer]||'محادثة خاصة');return `<article class="sq162-post"><b>${esc(title)}</b><p>${esc((c.last?.tx||'لا توجد رسائل بعد').slice(0,160))}</p><button class="sq162-follow" type="button" data-sq162-open-chat="${esc(c.id)}">فتح المحادثة</button></article>`}).join('')||'<p class="sq162-muted">لا توجد محادثات مطابقة.</p>',hits.length)}else setSearchSection('chats','<p class="sq162-muted">تعذر تحميل محادثاتك. قد تكون صلاحية القراءة غير متاحة.</p>',null);
  if(status)status.textContent=`اكتمل البحث. ${keys.filter(k=>data[k]!==null).length} من 4 أقسام متاحة.`;
 }catch(e){if(seq!==searchSeq)return;console.warn('Global search',e);for(const key of keys)setSearchSection(key,'<p class="sq162-muted">تعذر البحث في هذا القسم. تحقق من اتصال Firebase وصلاحيات القراءة.</p>',null);if(status)status.textContent='تعذر إكمال البحث.'}
}

async function loadBlocked(){const out=$('#sq162-blocked',modal);if(!out)return;out.innerHTML='<p class="sq162-muted">جارٍ تحميل القائمة…</p>';try{const snap=await db().collection(`users/${uid()}/blocked`).limit(100).get();blocked=snap.docs.map(d=>({id:d.id,...d.data()}));const ids=blocked.map(x=>x.id);let names={};for(let i=0;i<ids.length;i+=10){const chunk=ids.slice(i,i+10);if(!chunk.length)continue;const p=await db().collection('publicProfiles').where(firebase.firestore.FieldPath.documentId(),'in',chunk).get();p.forEach(d=>names[d.id]=d.data().name||'عضو')}out.innerHTML=blocked.map(x=>`<article class="sq162-person"><span class="sq162-avatar">${esc((names[x.id]||'ع').slice(0,1))}</span><div><b>${esc(names[x.id]||'حساب محظور')}</b><small>الحظر مفعّل</small></div><button class="sq162-follow" data-sq162-unblock="${esc(x.id)}">إلغاء الحظر</button></article>`).join('')||'<p class="sq162-muted">لا توجد حسابات محظورة.</p>'}catch(e){console.warn(e);out.innerHTML='<p class="sq162-muted">تعذر تحميل قائمة الحظر.</p>'}}
async function handle(e){const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-sq162-close'))return close();if(b.dataset.sq162Tab)return setTab(b.dataset.sq162Tab);if(b.hasAttribute('data-sq162-clear')){const input=$('#sq162-query',modal);if(input){input.value='';search('');input.focus()}return;}
 if(b.hasAttribute('data-sq162-save')){const text=$('#sq162-draft',modal).value;localStorage.setItem(storeKey(),JSON.stringify({text,updatedAt:Date.now()}));$('#sq162-creator-status',modal).textContent='تم حفظ المسودة على هذا الجهاز.';return}
 if(b.hasAttribute('data-sq162-publish')){const text=$('#sq162-draft',modal).value,files=[...($('#sq162-files',modal).files||[])];b.disabled=true;b.textContent='جارٍ النشر…';try{if(!window.SquadSocial?.publish)throw Error('نظام المنشورات غير جاهز');await window.SquadSocial.publish(text,files,'public');localStorage.removeItem(storeKey());$('#sq162-creator-status',modal).textContent='تم نشر المحتوى في الفيد.';$('#sq162-draft',modal).value='';$('#sq162-files',modal).value='';say('تم نشر منشورك')}catch(x){$('#sq162-creator-status',modal).textContent=x.message||'تعذر النشر';say(x.message||'تعذر النشر')}finally{b.disabled=false;b.textContent='نشر في المنصة'}return}
 if(b.dataset.sq162Follow){b.disabled=true;try{await window.SquadSocial.follow(b.dataset.sq162Follow);b.textContent=window.SquadSocial.state.following.has(b.dataset.sq162Follow)?'إلغاء المتابعة':'متابعة'}catch(x){b.disabled=false;say(x.message||'تعذرت المتابعة')}return}
 if(b.hasAttribute('data-sq162-open-feed')){close();document.querySelector('[data-social="feed"]')?.click();return}
 if(b.dataset.sq162OpenChat){const id=b.dataset.sq162OpenChat;close();if(typeof window.go==='function')window.go('home');if(typeof window.openChat==='function')window.openChat(id);return}
 if(b.hasAttribute('data-sq162-refresh-blocks')){loadBlocked();return}
 if(b.dataset.sq162Unblock){try{await db().doc(`users/${uid()}/blocked/${b.dataset.sq162Unblock}`).delete();say('تم إلغاء الحظر');loadBlocked()}catch(x){say('تعذر إلغاء الحظر')}return}
 if(b.hasAttribute('data-sq162-settings')){close();document.querySelector('#gear')?.click();return}
 if(b.dataset.sq162Go){const k=b.dataset.sq162Go;close();if(k==='city'){await window.SQUAD_LOAD_DISTRICT();window.DISTRICT?.enter({})}else if(k==='cafe'){await window.SQUAD_LOAD_WORLD();window.WORLD?.enter()}else if(k==='ai'){location.href='chanse3/services-hub.html'}else if(k==='friends'){document.querySelector('[data-squad-social]')?.click()}else document.querySelector(`[data-social="${k}"]`)?.click();return}}
function installButton(){const actions=$('#social-main .dr-actions');if(!actions||actions.querySelector('[data-sq162-open]'))return;const b=document.createElement('button');b.type='button';b.className='dr-icon-btn sq162-launch';b.dataset.sq162Open='1';b.textContent='✧ Global Hub';b.setAttribute('aria-label','فتح مركز المنصة العالمي');b.addEventListener('click',open);actions.prepend(b)}
window.addEventListener('squad:auth-changed',()=>{searchCache=null;searchSeq++});
document.addEventListener('input',e=>{if(e.target?.id==='sq162-query'){clearTimeout(searchTimer);const q=e.target.value;searchTimer=setTimeout(()=>search(q),280)}});
const obs=new MutationObserver(()=>{if(!$('#app')?.hidden)installButton()});obs.observe(document.body,{childList:true,subtree:true});installButton();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)close()});
window.SquadGlobalHub={open,close,setTab,version:256};
})();