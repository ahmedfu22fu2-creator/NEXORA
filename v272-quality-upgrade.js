/* NEXORA v272 — quality, accessibility and local data controls. */
(()=>{'use strict';
const KEY='squad.quality.v272',q=(s,root=document)=>root.querySelector(s);
let dialog=null,returnFocus=null;
const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function diagnostics(){
 const checks=[
  ['التخزين المحلي',(()=>{try{const k='sq272-probe';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(_){return false}})()],
  ['دعم Service Worker','serviceWorker'in navigator],
  ['دعم WebGL',(()=>{try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))}catch(_){return false}})()],
  ['دعم الاتصال الآمن',location.protocol==='https:'||location.hostname==='localhost'],
  ['تقليل الحركة',matchMedia('(prefers-reduced-motion: reduce)').matches]
 ];
 return checks;
}
function exportData(){
 const keys=['squad.privacySafety.v271','squad.creatorEconomy.v270','squad.spatialSocial.v269','squad.socialAI.v268'];
 const data={product:'NEXORA',exportVersion:1,createdAt:new Date().toISOString(),scope:'local-browser-data-only',items:{}};
 for(const key of keys){try{const value=localStorage.getItem(key);if(value!==null)data.items[key]=JSON.parse(value)}catch(_){data.items[key]={warning:'unreadable'}}}
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='the-squad-local-data-export.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function render(){const list=q('[data-v272-diagnostics]',dialog);list.innerHTML=diagnostics().map(([name,ok])=>`<li><span>${safe(name)}</span><b class="${ok?'ok':'warn'}">${ok?'متاح':'غير متاح'}</b></li>`).join('');}
function close(){if(!dialog)return;dialog.hidden=true;if(returnFocus?.isConnected)returnFocus.focus()}
function open(){if(!dialog){dialog=document.createElement('section');dialog.className='sq272-backdrop';dialog.hidden=true;dialog.innerHTML=`<div class="sq272-dialog" role="dialog" aria-modal="true" aria-labelledby="sq272-title" tabindex="-1"><header><div><small>NEXORA · QUALITY CENTER · v272</small><h2 id="sq272-title">مركز الجودة والتحكم</h2><p>فحوصات محلية وأدوات واضحة لإدارة بيانات هذا المتصفح.</p></div><button type="button" data-close aria-label="إغلاق">×</button></header><main><section><h3>حالة إمكانيات جهازك</h3><ul data-v272-diagnostics aria-live="polite"></ul><p class="sq272-note">هذه فحوصات توافق أساسية وليست اختبارًا لاتصال Firebase أو صحة حسابك.</p></section><section><h3>نسخة من بياناتك المحلية</h3><p>صدّر الإعدادات المحلية المتاحة من إصدارات SQUAD الأخيرة إلى ملف JSON على جهازك.</p><button type="button" data-export>تصدير البيانات المحلية</button></section><section><h3>إدارة البيانات المحلية</h3><p>يمكنك حذف إعدادات الخصوصية المحلية لهذا المتصفح. لن يحذف ذلك حسابك أو بيانات Firebase أو الملفات المنشورة.</p><button type="button" class="danger" data-reset>حذف إعدادات الخصوصية المحلية</button><p data-status role="status" aria-live="polite"></p></section></main><footer>v272 · لا يتم إرسال بيانات الفحص أو التصدير إلى خادم.</footer></div>`;dialog.addEventListener('click',onClick);dialog.addEventListener('keydown',onKey);document.body.append(dialog)}returnFocus=document.activeElement;dialog.hidden=false;render();q('[data-close]',dialog).focus()}
function onClick(e){if(e.target===dialog||e.target.closest('[data-close]'))return close();if(e.target.closest('[data-export]'))exportData();if(e.target.closest('[data-reset]')){if(!confirm('حذف إعدادات الخصوصية المحلية من هذا المتصفح؟'))return;try{localStorage.removeItem('squad.privacySafety.v271');for(const k of Object.keys(localStorage))if(k.startsWith('squad.privacySafety.alias.'))localStorage.removeItem(k);q('[data-status]',dialog).textContent='تم حذف إعدادات الخصوصية المحلية من هذا المتصفح.'}catch(_){q('[data-status]',dialog).textContent='تعذر الحذف؛ تحقق من إعدادات التخزين في المتصفح.'}}}
function onKey(e){if(e.key==='Escape'){e.preventDefault();close();return}if(e.key!=='Tab')return;const els=[...dialog.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null);if(!els.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
function launch(){const host=q('#social-main .dr-actions');if(!host||host.querySelector('[data-v272-open]'))return;const b=document.createElement('button');b.type='button';b.className='dr-icon-btn sq272-launch';b.dataset.v272Open='1';b.textContent='⚙ مركز الجودة';b.addEventListener('click',open);host.append(b)}
if(document.body){new MutationObserver(launch).observe(document.body,{childList:true,subtree:true});launch()}
window.SquadQualityCenter={open,close,diagnostics,exportData,version:272};
})();