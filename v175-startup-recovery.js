/* NEXORA v175: actionable startup recovery and clearer Firebase diagnostics. */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 let shown=false,lastReason='';
 const recordError=reason=>{window.__squadStartupError=reason instanceof Error?reason:new Error(String(reason||'Unknown startup error'));};
 const text={local:'أنت فاتح index.html مباشرة من الجهاز. افتح المشروع من سيرفر محلي: شغّل npm run dev داخل مجلد المشروع ثم افتح الرابط الذي يظهر في الطرفية. لا تستخدم file://.',offline:'الجهاز غير متصل بالإنترنت. يمكنك رؤية شاشة الدخول، لكن تسجيل الدخول والمزامنة والخدمات السحابية تحتاج اتصالًا.',sdk:'مكتبات Firebase لم تُحمّل. تأكد من الإنترنت، وعدم حجب gstatic.com، ثم أعد المحاولة.',config:'مكتبات Firebase موجودة لكن التطبيق لم يبدأ. راجع إعدادات Web App في chanse4/firebase-config.js.',generic:'تعذر إكمال بدء NEXORA. راجع اتصال الإنترنت وإعداد Firebase، ثم اضغط «إعادة المحاولة».',online:'عاد الاتصال بالإنترنت. اضغط «إعادة المحاولة» لإعادة تحميل التطبيق.'};
 function diagnose(){if(location.protocol==='file:')return text.local;if(navigator.onLine===false)return text.offline;if(!window.firebase)return text.sdk;const c=window.firebaseConfig||window.firebaseConfigWeb||null;if(!c||!c.apiKey||!c.projectId||!c.appId)return text.config;if(!window.firebase.apps||!window.firebase.apps.length)return 'تم تحميل المكتبات، لكن Firebase لم ينجح في التهيئة. اضغط إعادة المحاولة، وإذا استمرت المشكلة راجع سجل الخطأ.';if(window.__squadStartupError)return 'تعذر بدء التطبيق: '+String(window.__squadStartupError.message||window.__squadStartupError);return 'التطبيق لم يكمل التهيئة بعد. شاشة الدخول متاحة، جرّب إعادة المحاولة.'}
 function recover(reason){
  if(shown||window.__squadBootReady)return;
  recordError(reason);
  const splash=byId('splash'),auth=byId('auth'),app=byId('app');if(!splash||!auth)return;
  shown=true;lastReason=String(reason||'startup timeout after 12s');clearTimeout(window.__squadBootFallbackTimer);splash.classList.add('off');if(app)app.hidden=true;auth.hidden=false;
  let note=byId('squadBootFallback');
  if(!note){note=document.createElement('section');note.id='squadBootFallback';note.setAttribute('role','alert');note.setAttribute('aria-live','assertive');note.style.cssText='max-width:560px;margin:12px auto;padding:14px 16px;border:1px solid #b8860b;border-radius:14px;background:#17130b;color:#f3d77a;text-align:center;font:14px/1.8 system-ui';const msg=document.createElement('p');msg.id='squadBootFallbackMessage';msg.style.margin='0 0 10px';const retry=document.createElement('button');retry.type='button';retry.id='squadBootRetry';retry.textContent='إعادة المحاولة';retry.style.cssText='padding:9px 18px;border:1px solid #d9b76d;border-radius:9px;background:#d9b76d;color:#17130b;font-weight:700;cursor:pointer';retry.addEventListener('click',()=>location.reload());note.append(msg,retry);auth.prepend(note)}
  const msg=byId('squadBootFallbackMessage');if(msg)msg.textContent=diagnose();console.warn('[NEXORA startup recovery]',lastReason);
 }
 window.__squadBootShowRecovery=recover;window.__squadBootFallbackTimer=setTimeout(()=>recover('startup timeout after 8s'),8000);
 window.addEventListener('error',event=>{if(window.__squadBootReady||shown)return;const target=event.target,src=target&&target.src||event.filename||'';if((target&&target.tagName==='SCRIPT')||/firebase|app\.js|auth\.js/i.test(src)){recordError(event.error||event.message||'script load/runtime error');recover(event.error||event.message||'script load/runtime error')}},true);
 window.addEventListener('unhandledrejection',event=>{if(window.__squadBootReady||shown)return;const reason=String(event.reason?.message||event.reason||'');if(/firebase|network|auth|initialize|startup/i.test(reason)){recordError(event.reason);recover(event.reason)}});
 window.addEventListener('online',()=>{if(!shown||window.__squadBootReady)return;const msg=byId('squadBootFallbackMessage');if(msg)msg.textContent=text.online});
 window.addEventListener('offline',()=>{if(!shown||window.__squadBootReady)return;const msg=byId('squadBootFallbackMessage');if(msg)msg.textContent=text.offline});
})();
