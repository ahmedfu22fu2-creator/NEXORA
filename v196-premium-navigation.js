/* NEXORA v195 — six fixed navigation groups and 13 existing destinations.
   This is an additive navigation layer; legacy route handlers and feature modules remain intact. */
(()=>{'use strict';
 const rail=document.getElementById('social-rail');if(!rail||rail.dataset.sq195Ready)return;rail.dataset.sq195Ready='1';
 const $=s=>document.querySelector(s),say=m=>window.toast?window.toast(m):console.info(m);
 const click=s=>{const el=$(s);if(el){el.click();return true}return false};
 const showSocial=key=>{const b=rail.querySelector(`[data-squad-open="${key}"]`);rail.querySelectorAll('.sq195-subnav button').forEach(x=>x.classList.toggle('is-current',x===b));};
 async function open(key){
  if(key!=='home')window.SquadHomeCommand?.close();
  if(key==='home'){showSocial(key);if(window.SquadHomeCommand?.open){window.SquadHomeCommand.open();return true}return click('#social-rail [data-social="feed"]')||click('.dr-mobile-nav [data-social="feed"]')}
  if(key==='messenger'){showSocial(key);return click('.dr-mobile-nav [data-social="messages"]')||click('#social-rail [data-social="messages"]')}
  if(key==='accounts'){showSocial(key);return click('.dr-mobile-nav [data-social="profile"]')||click('#social-rail [data-social="profile"]')}
  if(key==='stories'){showSocial(key);return click('#nav [data-go="up"]')}
  if(key==='calls'){showSocial(key);return click('#nav [data-go="calls"]')}
  if(key==='cinema'){showSocial(key);document.getElementById('app')?.classList.remove('social-mode');if(window.CINEMA?.enter){window.CINEMA.enter();return}return click('#social-aside [data-hub="cinema"]')||say('قسم السينما موجود، لكن واجهة الدخول لم تُحمّل بعد.')}
  if(key==='world'){showSocial(key);document.getElementById('app')?.classList.remove('social-mode');try{await window.SQUAD_LOAD_DISTRICT?.();if(window.DISTRICT?.enter){window.DISTRICT.enter({});return}say('تم تحميل ملفات العالم، لكن محرك المدينة لم يعلن واجهة الدخول.')}catch(e){console.error('[v195] world navigation',e);say('تعذر تحميل العالم. تحقق من الاتصال ثم حاول مرة أخرى.')}return}
  if(key==='civilization'){showSocial(key);if(window.SquadCivilization?.open){window.SquadCivilization.open();return}say('نظام الحضارة غير جاهز في هذه اللحظة.');return}
  if(key==='games'){showSocial(key);document.getElementById('app')?.classList.remove('social-mode');if($('#gm')&&!$('#chat')?.classList.contains('open')){say('افتح محادثة أولًا، ثم اضغط زر الألعاب 🎮 داخل المحادثة.');click('#nav [data-go="home"]');return}if($('#gm')){$('#gm').click();return}say('الألعاب مرتبطة حاليًا بواجهة المحادثة.');return}
  if(key==='ai'||key==='store'){showSocial(key);location.href='chanse3/'+(key==='ai'?'ai-hub.html':'store.html');return}
  if(key==='admin'){showSocial(key);const launch=$('#sqAdminLaunch');if(launch?.classList.contains('show')){launch.click();return}say('مركز الإدارة خاص بحساب المالك المصرّح له فقط.');return}
  if(key==='security'){showSocial(key);document.getElementById('app')?.classList.remove('social-mode');click('#gear');return}
 }
 rail.addEventListener('click',e=>{const b=e.target.closest('[data-squad-open]');if(!b)return;e.preventDefault();open(b.dataset.squadOpen)});
 const updateAccount=()=>{const u=window.firebase?.auth?.().currentUser;const name=(window.U&&U.name)||u?.displayName||u?.email?.split('@')[0]||'حسابي';const label=$('#sq195-user-name'),avatar=$('#sq195-avatar');if(label)label.textContent=name;if(avatar)avatar.textContent=String(name).trim().slice(0,1).toUpperCase()||'S'};
 updateAccount();if(window.firebase?.auth){try{firebase.auth().onAuthStateChanged(updateAccount)}catch(_){}}
 window.SquadPremiumNavigation={open,version:197,groups:6,sections:13};
})();
