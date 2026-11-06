/* NEXORA v287 — safe progressive UI polish and accessibility helpers. */
(()=>{'use strict';
 const start=()=>{
  document.documentElement.classList.add('sq287-ui-ready');
  const shell=document.getElementById('social-shell');
  if(!shell)return;
  const nav=document.querySelector('.dr-mobile-nav');
  if(nav){nav.querySelectorAll('button[data-social]').forEach((button)=>{if(!button.getAttribute('aria-label')&&button.textContent.trim())button.setAttribute('aria-label',button.textContent.trim())})}
  const update=()=>{
   const active=document.querySelector('.dr-mobile-nav button.active');
   if(nav)nav.querySelectorAll('button[data-social]').forEach(b=>{if(b===active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  };
  update();
  const observer=new MutationObserver(update);
  if(nav)observer.observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
  window.SquadUIRedesign={version:287,refresh:update,destroy:()=>observer.disconnect()};
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
