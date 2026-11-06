/* v249 — Product detail experience for NEXORA. Uses only the existing store catalog and purchase action. */
(()=>{'use strict';
 if(window.SquadStoreV249)return;
 const catalog=document.querySelector('#catalog');
 if(!catalog)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
 const typeNames={car:'مركبة من SQUAD MOTOR',estate:'عقار خاص من NEXORA',apartment:'وحدة سكنية من CITY RESIDENCE'};
 const dialog=document.createElement('dialog');
 dialog.className='sq249-dialog';
 dialog.setAttribute('aria-labelledby','sq249Title');
 dialog.innerHTML='<form method="dialog" class="sq249-panel"><button class="sq249-close" type="submit" aria-label="إغلاق التفاصيل">×</button><div class="sq249-visual" aria-hidden="true"><span class="sq249-orbit"></span><span class="sq249-icon"></span></div><div class="sq249-info"><span class="sq249-kicker">NEXORA · ITEM PROFILE</span><span class="sq249-type"></span><h2 id="sq249Title"></h2><p class="sq249-description"></p><div class="sq249-price"></div><div class="sq249-ownership" role="status"></div><div class="sq249-actions"><button class="sq249-buy" type="button">اقتناء العنصر</button><button class="sq249-secondary" type="submit">العودة للمتجر</button></div><p class="sq249-footnote">تتم مراجعة أي عملية اقتناء من خلال خادم اقتصاد NEXORA.</p></div></form>';
 document.body.append(dialog);
 const q=(s,r=dialog)=>r.querySelector(s);
 let currentCard=null,previousFocus=null;
 function decorate(){
  catalog.querySelectorAll('.item[data-item-id]').forEach(card=>{
   const body=card.querySelector('.body');
   if(!body||body.querySelector('.sq249-details-trigger'))return;
   const button=document.createElement('button');
   button.type='button';button.className='sq249-details-trigger';
   button.textContent='عرض التفاصيل';
   button.setAttribute('aria-label',`عرض تفاصيل ${card.querySelector('h3')?.textContent?.trim()||'العنصر'}`);
   const buy=body.querySelector('.buy');
   if(buy)body.insertBefore(button,buy);else body.append(button);
  });
 }
 function openDetails(card,trigger){
  if(!card)return;
  currentCard=card;previousFocus=trigger||document.activeElement;
  const title=card.querySelector('h3')?.textContent?.trim()||'عنصر من المتجر';
  const type=card.dataset.itemType||'';
  q('.sq249-icon').textContent=card.querySelector('.art')?.textContent?.trim()||'✦';
  q('.sq249-type').textContent=typeNames[type]||'عنصر من NEXORA';
  q('#sq249Title').textContent=title;
  q('.sq249-description').textContent=card.querySelector('.desc')?.textContent?.trim()||'عنصر متاح داخل عالم NEXORA.';
  q('.sq249-price').textContent=card.querySelector('.price')?.textContent?.trim()||'السعر غير متاح';
  const buy=card.querySelector('.buy');
  const owned=buy?.disabled&&/مملوك/.test(buy.textContent||'');
  q('.sq249-ownership').textContent=owned?'هذا العنصر موجود بالفعل في ممتلكات حسابك.':'يمكنك اقتناء هذا العنصر بعملة اللعبة بعد تسجيل الدخول.';
  const action=q('.sq249-buy');
  action.disabled=!buy||buy.disabled;
  action.textContent=owned?'مملوك بالفعل':buy?.disabled?'الشراء غير متاح الآن':'اقتناء العنصر';
  if(!dialog.open){
   if(typeof dialog.showModal==='function')dialog.showModal();
   else dialog.setAttribute('open','');
  }
  q('.sq249-close').focus();
 }
 catalog.addEventListener('click',event=>{
  const trigger=event.target.closest('.sq249-details-trigger');
  if(!trigger)return;
  event.preventDefault();event.stopPropagation();
  openDetails(trigger.closest('.item'),trigger);
 });
 q('.sq249-buy').addEventListener('click',()=>{
  const buy=currentCard?.querySelector('.buy');
  if(!buy||buy.disabled)return;
  if(dialog.open)dialog.close();else dialog.removeAttribute('open');
  buy.click();
 });
 dialog.addEventListener('click',event=>{
  if(event.target===dialog){if(dialog.open)dialog.close();else dialog.removeAttribute('open');}
 });
 dialog.addEventListener('close',()=>{currentCard=null;if(previousFocus?.isConnected)previousFocus.focus();});
 dialog.addEventListener('cancel',()=>{currentCard=null;});
 const observer=new MutationObserver(decorate);
 observer.observe(catalog,{childList:true,subtree:true});
 decorate();
 window.SquadStoreV249=Object.freeze({version:249,open:(id)=>{const card=[...catalog.querySelectorAll('.item')].find(x=>x.dataset.itemId===id);if(card)openDetails(card,card.querySelector('.sq249-details-trigger'));}});
})();
