/* NEXORA v202 — portal entrance. Keeps the existing Firebase auth form and handlers intact. */
(()=>{'use strict';
 const root=document.getElementById('auth'),enter=document.getElementById('sq202-enter-portal');
 const card=root?.querySelector('.card'),hint=document.getElementById('sq202-portal-hint');
 if(!root||!enter||!card)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 let opened=false;
 const openPortal=()=>{
  if(opened)return;opened=true;enter.disabled=true;root.classList.add('sq202-opening');
  if(hint)hint.textContent='البوابة بتفتح…';
  const reveal=()=>{
   root.classList.add('sq202-card-ready');
   card.hidden=false;
   requestAnimationFrame(()=>card.classList.add('is-visible'));
   root.dataset.loginState='card';
   if(hint)hint.hidden=true;
  };
  window.setTimeout(reveal,reduced?40:900);
 };
 enter.addEventListener('click',openPortal);
 enter.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPortal()}});
 window.SquadPortalLogin202={version:202,open:openPortal};
})();