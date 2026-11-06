/* NEXORA v201 — 3D Calls Evolution.
   Enhances the existing cafe2 screen-share control and adds a live participant
   roster. Keeps the current WebRTC/Firestore call engine and document schema. */
(()=>{'use strict';
 const callRoot=document.getElementById('call');
 const controls=callRoot?.querySelector('.cbar');
 const top=callRoot?.querySelector('.ctop');
 if(!callRoot||!controls||!top||typeof CALL==='undefined')return;

 // Reuse the existing screen-share button from cafe2.js; create it only as fallback.
 const shareButton=document.getElementById('cshr')||document.createElement('button');
 if(!shareButton.id){shareButton.type='button';shareButton.id='cshr';shareButton.className='ic';shareButton.textContent='🖥';controls.insertBefore(shareButton,document.getElementById('cend'))}
 shareButton.title='مشاركة الشاشة';shareButton.setAttribute('aria-label','مشاركة الشاشة');
 const avatarButton=document.createElement('button');
 avatarButton.type='button';avatarButton.id='sq267-avatar-toggle';avatarButton.className='ic';avatarButton.title='استخدام شخصيتك ثلاثية الأبعاد';avatarButton.setAttribute('aria-label','تشغيل أو إيقاف الشخصية ثلاثية الأبعاد');avatarButton.textContent='🧑‍🚀';controls.insertBefore(avatarButton,document.getElementById('cend'));
 let avatarActive=false,avatarBusy=false;
 const peopleButton=document.createElement('button');
 peopleButton.type='button';peopleButton.id='sq201-people-toggle';peopleButton.className='ic';
 peopleButton.title='المشاركون';peopleButton.setAttribute('aria-label','عرض المشاركين');peopleButton.textContent='👥';
 controls.insertBefore(peopleButton,document.getElementById('cend'));

 const state=document.createElement('small');state.id='sq201-call-state';state.setAttribute('aria-live','polite');top.append(state);
 const panel=document.createElement('aside');panel.id='sq201-people';panel.hidden=true;
 panel.setAttribute('aria-label','قائمة المشاركين');
 panel.innerHTML='<b>المشاركون</b><div id="sq201-people-list"></div><small id="sq201-network"></small>';
 callRoot.append(panel);

 let shareStream=null,shareTrack=null,shareBusy=false;
 let localPreview=null,previousPreviewStream=null,createdPreview=false;
 const toastSafe=message=>{if(typeof toast==='function')toast(message)};
 const currentCall=()=>typeof CALL!=='undefined'&&CALL;

 function renderPeople(){
  const call=currentCall();if(!call)return;
  const list=document.getElementById('sq201-people-list');if(!list)return;
  const entries=Object.values(call.P||{}).sort((a,b)=>String(a.u).localeCompare(String(b.u)));
  list.replaceChildren();
  entries.forEach(person=>{
   const row=document.createElement('div');row.className='sq201-person';
   const dot=document.createElement('i');dot.className='sq201-dot';
   const name=document.createElement('span');name.textContent=(person.nm||'مشارك')+(person.u===me?.uid?' (أنت)':'');
   row.append(dot,name);list.append(row);
  });
  const net=window.SquadCallNetwork?.diagnostics?.();
  const network=document.getElementById('sq201-network');
  if(network)network.textContent=net?.relayAvailable?'الاتصال: وسيط TURN متاح':net?.rtc?'الاتصال: WebRTC يعمل · TURN غير مؤكد':'الاتصال: جارٍ التحقق';
  const count=entries.length;
  state.textContent=(shareTrack?'مشاركة الشاشة نشطة · ':'')+`${count} ${count===1?'مشارك':'مشاركين'}`;
 }

 function restorePreview(){
  if(!localPreview)return;
  if(createdPreview)localPreview.remove();
  else localPreview.srcObject=previousPreviewStream;
  localPreview=null;previousPreviewStream=null;createdPreview=false;
 }

 function stopShare(){
  const call=currentCall();
  if(!shareTrack){shareStream=null;restorePreview();return}
  const oldTrack=shareTrack;
  const restore=call?.cam?.getVideoTracks?.().find(t=>t.readyState==='live')||null;
  if(call){
   if(call.out?.getTracks?.().includes(oldTrack))call.out.removeTrack(oldTrack);
   Object.values(call.pcs||{}).forEach(pc=>{
    const sender=pc.getSenders().find(s=>s.track===oldTrack||s.track?.kind==='video');
    if(sender){try{const result=sender.replaceTrack(restore);result?.catch?.(()=>{})}catch(_){}}
   });
  }
  oldTrack.onended=null;try{oldTrack.stop()}catch(_){}
  shareTrack=null;shareStream=null;shareBusy=false;restorePreview();
  const camera=document.getElementById('ccam');if(camera)camera.disabled=false;
  shareButton.classList.remove('on');shareButton.textContent='🖥';shareButton.title='مشاركة الشاشة';
  renderPeople();
 }

 async function startShare(){
  const call=currentCall();if(!call||shareBusy||shareTrack)return;
  if(!navigator.mediaDevices?.getDisplayMedia){toastSafe('مشاركة الشاشة غير مدعومة في هذا المتصفح');return}
  shareBusy=true;shareButton.disabled=true;
  let stream=null;
  try{
   stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:15,max:30}},audio:false});
   const track=stream.getVideoTracks()[0];if(!track)throw new Error('no-display-track');
   if(!currentCall()){track.stop();return}
   shareStream=stream;shareTrack=track;track.onended=stopShare;
   call.out.addTrack(track);
   const jobs=[];
   Object.entries(call.pcs).forEach(([id,pc])=>{
    const sender=pc.getSenders().find(s=>s.track?.kind==='video');
    if(sender)jobs.push(sender.replaceTrack(track));
    else{pc.addTrack(track,call.out);if(typeof offer==='function')jobs.push(offer(id).catch(()=>{}))}
   });
   await Promise.allSettled(jobs);
   const cameraPreview=document.getElementById('lv');
   if(cameraPreview){localPreview=cameraPreview;previousPreviewStream=cameraPreview.srcObject;cameraPreview.srcObject=stream}
   else{
    localPreview=document.createElement('video');localPreview.id='lv';localPreview.muted=true;localPreview.autoplay=true;localPreview.playsInline=true;localPreview.srcObject=stream;
    document.getElementById('cvv')?.prepend(localPreview);createdPreview=true;
   }
   localPreview.play?.().catch(()=>{});
   const cameraButton=document.getElementById('ccam');if(cameraButton)cameraButton.disabled=true;
   shareButton.classList.add('on');shareButton.textContent='■';shareButton.title='إيقاف مشاركة الشاشة';
   renderPeople();
  }catch(error){
   if(shareTrack)stopShare();
   else if(stream)stream.getTracks().forEach(t=>t.stop());
   if(error?.name!=='NotAllowedError'&&error?.name!=='AbortError')toastSafe('تعذرت مشاركة الشاشة؛ تحقق من صلاحيات المتصفح');
  }finally{shareBusy=false;shareButton.disabled=false}
 }

 shareButton.onclick=()=>shareTrack?stopShare():startShare();
 async function toggleAvatar(){if(avatarBusy)return;avatarBusy=true;avatarButton.disabled=true;try{if(avatarActive){window.SquadAvatarCreator?.stopCallAvatar?.(currentCall());avatarActive=false;avatarButton.classList.remove('on');avatarButton.textContent='🧑‍🚀';toastSafe('تم إيقاف الشخصية ثلاثية الأبعاد.')}else{if(!window.SquadAvatarCreator?.startCallAvatar)throw Error('avatar-module-unavailable');await window.SquadAvatarCreator.startCallAvatar(currentCall());avatarActive=true;avatarButton.classList.add('on');avatarButton.textContent='⏹';toastSafe('شخصيتك ثلاثية الأبعاد ظاهرة للمشاركين.')}}catch(error){toastSafe(error?.message==='no-saved-avatar'?'افتح استوديو الشخصيات واستورد نموذج GLB أولًا.':'تعذر تشغيل الشخصية ثلاثية الأبعاد.')}finally{avatarBusy=false;avatarButton.disabled=false}}
 avatarButton.addEventListener('click',toggleAvatar);
 peopleButton.addEventListener('click',()=>{panel.hidden=!panel.hidden;peopleButton.classList.toggle('on',!panel.hidden);if(!panel.hidden)renderPeople()});
 const originalLeave=leave;
 leave=function(...args){stopShare();if(avatarActive)window.SquadAvatarCreator?.stopCallAvatar?.(currentCall());avatarActive=false;avatarButton.classList.remove('on');panel.hidden=true;peopleButton.classList.remove('on');return originalLeave.apply(this,args)};

 const observer=new MutationObserver(()=>{
  if(callRoot.hidden){stopShare();if(avatarActive)window.SquadAvatarCreator?.stopCallAvatar?.(currentCall());avatarActive=false;avatarButton.classList.remove('on');panel.hidden=true;peopleButton.classList.remove('on')}
 });
 observer.observe(callRoot,{attributes:true,attributeFilter:['hidden']});
 const ticker=window.setInterval(()=>{if(currentCall())renderPeople();else if(callRoot.hidden)state.textContent=''},1000);
 window.addEventListener('pagehide',()=>{stopShare();observer.disconnect();clearInterval(ticker)},{once:true});
 window.SquadCallV201={version:'v201-3d-calls',get sharing(){return !!shareTrack},stopShare,refreshParticipants:renderPeople};
})();
