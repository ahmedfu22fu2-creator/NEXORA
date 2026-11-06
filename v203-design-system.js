/* NEXORA v203 — design system runtime: icon set, toast, light effects, reveal. No network, no Firebase, no storage. */
(()=>{
 'use strict';
 if(window.SquadDesign)return;
 const NS='http://www.w3.org/2000/svg';
 const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(_){return false}};
 const lite=()=>document.documentElement.classList.contains('squad-lite');
 // 24x24 stroke icons (stroke is applied by .sq-icon CSS).
 const ICONS={
  home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  message:'<path d="M4 5.5h16v11H9.5L5 20v-3.5H4z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  users:'<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M18 14a6.5 6.5 0 0 1 3.5 5.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
  image:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.7"/><path d="m4 18 5-5 4 4 3-3 4.5 4"/>',
  camera:'<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
  video:'<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="m15.5 11 5-3v8l-5-3"/>',
  phone:'<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  mic:'<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  'mic-off':'<path d="M4 4l16 16"/><path d="M9 9v2.5a3 3 0 0 0 4.7 2.5M15 10.5V6.5a3 3 0 0 0-5.6-1.5"/><path d="M5.5 11.5a6.5 6.5 0 0 0 10 5.5M18.5 11.5c0 .8-.1 1.5-.4 2.2M12 18v3"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  shield:'<path d="M12 3.5 5 6v5.5c0 4.2 2.8 7.4 7 9 4.2-1.6 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  wallet:'<path d="M4 7.5h14.5V19H4z"/><path d="M4 7.5 15.5 4v3.5"/><circle cx="15" cy="13.5" r="1.2"/>',
  store:'<path d="M4 9.5 5.5 4.5h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5.5 12.5V20h13v-7.5"/>',
  car:'<path d="M4 15.5v-3l2-5h12l2 5v3z"/><path d="M4 12.5h16"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
  building:'<rect x="5" y="3.5" width="9" height="17" rx="1"/><path d="M14 9.5h5V20.5h-5M8.5 7.5h2M8.5 11h2M8.5 14.5h2"/>',
  map:'<path d="M12 21s6.5-5.5 6.5-11A6.5 6.5 0 0 0 5.5 10C5.5 15.5 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
  calendar:'<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M8 3.5v4M16 3.5v4M4 10.5h16"/>',
  bookmark:'<path d="M7 4h10v16.5l-5-3.8-5 3.8z"/>',
  share:'<circle cx="6.5" cy="12" r="2.3"/><circle cx="17.5" cy="6" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><path d="m8.5 10.9 7-3.8M8.5 13.1l7 3.8"/>',
  send:'<path d="M20.5 3.5 10 14"/><path d="m20.5 3.5-6.5 17-3.5-6.5L4 10.5z"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  'chevron-right':'<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  'chevron-left':'<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.7 5.2 3.7 8.5s-1.2 6.100-3.700 8.500c-2.500-2.400-3.700-5.200-3.700-8.500S9.500 5.900 12 3.500z"/>',
  sparkles:'<path d="m12 3.5 1.8 5.200 5.200 1.800-5.200 1.800L12 17.500l-1.800-5.200L5 10.500l5.200-1.800z"/><path d="m18.500 15.500.7 1.800 1.800.7-1.800.7-.7 1.800-.7-1.800-1.800-.7 1.800-.7z"/>',
  crown:'<path d="m4 8 4.500 4L12 5.500 15.500 12 20 8l-1.500 10.500h-13z"/>',
  play:'<path d="M8 5.500v13l11-6.500z"/>',
  flag:'<path d="M5.500 21V4.500"/><path d="M5.500 5h11.500l-2 4 2 4H5.500"/>',
  trash:'<path d="M4.500 7h15M9.500 7V4.500h5V7M6.500 7l.8 13h9.400l.8-13"/>',
  edit:'<path d="M4 20h4L19.500 8.500a2.100 2.100 0 0 0-3-3L5 17z"/><path d="m14.500 7.500 3 3"/>',
  more:'<circle cx="5.500" cy="12" r="1.200"/><circle cx="12" cy="12" r="1.200"/><circle cx="18.500" cy="12" r="1.200"/>'
 };
 const names=()=>Object.keys(ICONS);
 const svg=(name,opts={})=>{
  const body=ICONS[name];if(!body)return '';
  const cls='sq-icon'+(opts.large?' sq-icon--lg':'')+(opts.className?' '+opts.className:'');
  const label=opts.label?` role="img" aria-label="${String(opts.label).replace(/[&<>"]/g,'')}"`:' aria-hidden="true"';
  return `<svg class="${cls}" viewBox="0 0 24 24" focusable="false"${label}>${body}</svg>`;
 };
 const hydrate=(root=document)=>{
  const targets=[];
  if(root.nodeType===1&&root.matches?.('[data-sq-icon]:not([data-sq-done])'))targets.push(root);
  root.querySelectorAll?.('[data-sq-icon]:not([data-sq-done])').forEach(el=>targets.push(el));
  targets.forEach(el=>{
   const html=svg(el.getAttribute('data-sq-icon'),{large:el.hasAttribute('data-sq-large'),label:el.getAttribute('data-sq-label')});
   el.setAttribute('data-sq-done','1');
   if(html)el.insertAdjacentHTML('afterbegin',html);
  });
 };
 // Toast (aria-live, auto-dismiss, max 3).
 const toast=(message,opts={})=>{
  let host=document.getElementById('sq-toasts');
  if(!host){host=document.createElement('div');host.id='sq-toasts';host.setAttribute('role','status');host.setAttribute('aria-live','polite');document.body.appendChild(host)}
  const el=document.createElement('div');el.className='sq-toast';el.dataset.kind=opts.kind||'info';el.textContent=String(message||'');
  host.appendChild(el);while(host.children.length>3)host.firstChild.remove();
  setTimeout(()=>el.remove(),opts.duration||3600);return el;
 };
 // Light effects: pointer glow on cards + ripple on buttons. Skipped when reduced-motion or low-end.
 const effects=()=>{
  if(reduced()||lite()||coarse())return;
  document.addEventListener('pointermove',e=>{
   const c=e.target&&e.target.closest&&e.target.closest('.sq-card[data-sq-glow]');if(!c)return;
   const r=c.getBoundingClientRect();c.style.setProperty('--sq-mx',(e.clientX-r.left)+'px');c.style.setProperty('--sq-my',(e.clientY-r.top)+'px');
  },{passive:true});
  document.addEventListener('pointerdown',e=>{
   const b=e.target&&e.target.closest&&e.target.closest('.sq-btn');if(!b||b.disabled)return;
   const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement('span');
   s.className='sq-ripple';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
   b.appendChild(s);setTimeout(()=>s.remove(),700);
  },{passive:true});
 };
 // Scroll reveal.
 const reveal=(root=document)=>{
  const els=[];
  if(root.nodeType===1&&root.matches?.('.sq-reveal:not(.is-in)'))els.push(root);
  root.querySelectorAll?.('.sq-reveal:not(.is-in)').forEach(el=>els.push(el));
  if(!els.length)return;
  if(!('IntersectionObserver' in window)||reduced()){els.forEach(e=>e.classList.add('is-in'));return}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-in');io.unobserve(x.target)}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
 };
 const coarse=()=>{try{return matchMedia('(hover:none) and (pointer:coarse)').matches}catch(_){return false}};
 const init=()=>{
  document.documentElement.classList.add(coarse()?'sq-touch':'sq-pointer');
  hydrate();reveal();effects();
  if('MutationObserver' in window){
   let frame=0;const added=new Set();
   new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)added.add(node);
    if(!added.size||frame)return;
    frame=requestAnimationFrame(()=>{
     frame=0;const batch=[...added];added.clear();
     // Process only newly inserted subtrees; avoid rescanning the whole app on every chat/feed update.
     for(const node of batch)if(node.isConnected){hydrate(node);reveal(node)}
    });
   }).observe(document.body,{childList:true,subtree:true});
  }
 };
 window.SquadDesign=Object.freeze({version:'v203',icons:names,icon:svg,hydrate,toast});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
