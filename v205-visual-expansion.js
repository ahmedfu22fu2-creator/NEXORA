/* NEXORA v205 — visual expansion runtime. Presentation-only, no data writes/network calls. */
(()=>{'use strict';
 if(window.SquadVisual205)return;
 const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(_){return true}};
 const decorate=()=>{
  document.documentElement.dataset.squadVisual='v205';
  document.querySelectorAll('#dr-screen .dr-panel,#dr-screen .dr-post,#dr-screen .sq165-card,#dr-screen .sq165-tile,#dr-screen .sq171-award,#dr-screen .sq172-event').forEach((el)=>{
   if(!el.hasAttribute('data-sq205-ready')){el.setAttribute('data-sq205-ready','1');if(!reduced())el.classList.add('sq205-motion')}
  });
 };
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 if('MutationObserver'in window&&document.body)new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.SquadVisual205=Object.freeze({version:'v205',refresh:decorate});
})();
