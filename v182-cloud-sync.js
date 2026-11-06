/* NEXORA v182 — private per-account cloud sync for World Systems.
   Uses the already configured Firebase compat SDK; no secrets or passwords are stored here. */
(()=>{'use strict';
 if(window.SquadWorldCloudSync)return;
 const KEY='squad.v182.cloud-sync.v1';
 let app=null,auth=null,db=null,stopAuth=null,stopDoc=null,stopCommunity=null,uid=null,doc=null,timer=0,lastLocal=0,applying=false,started=false,lastPublicHash='';
 const api=()=>window.SquadWorldSystems;
 const status=t=>{try{api()?.setSyncStatus(t)}catch(_){}};
 const stop=()=>{if(stopDoc){stopDoc();stopDoc=null}if(stopCommunity){stopCommunity();stopCommunity=null}if(stopAuth){stopAuth();stopAuth=null}if(timer){clearTimeout(timer);timer=0}uid=null;doc=null;started=false};
 const validState=s=>{
  if(!s||s.schema!==1||typeof s!=='object')return false;
  const allowed=['schema','xp','rep','contribution','memories','proposals','votes','challenges','projects','radio','designs','visits','journal','coins','updatedAt'];
  if(Object.keys(s).some(k=>!allowed.includes(k)))return false;
  for(const k of ['memories','proposals','challenges','projects','designs','visits','journal'])if(!Array.isArray(s[k]))return false;
  if(s.memories.length>80||s.proposals.length>100||s.challenges.length>100||s.projects.length>100||s.designs.length>100||s.visits.length>200||s.journal.length>100)return false;
  return JSON.stringify(s).length<=450000;
 };
 const push=async()=>{
  timer=0;if(!uid||!doc||!api()||!navigator.onLine)return;
  const state=api().getSnapshot();if(!validState(state)){status('تعذر المزامنة: بيانات العالم أكبر من الحد الآمن.');return}
  try{await doc.set({uid,schema:1,state,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});const communityOk=await publishCommunity();status(communityOk?'مزامنة الحساب وساحة المدينة نشطتان · آخر حفظ سحابي تم بنجاح':'مزامنة عالم حسابك نشطة؛ مشاركة المدينة لم تكتمل بعد.');}
  catch(e){console.warn('[Squad v182] cloud sync write failed',e?.code||e);status(e?.code==='permission-denied'?'المزامنة متوقفة: قواعد Firebase تحتاج نشر تحديث v182.':'تعذر الاتصال بالسحابة؛ بياناتك ما زالت محفوظة محليًا.');}
 };
 const queue=()=>{if(applying||!uid)return;lastLocal=Date.now();if(timer)clearTimeout(timer);timer=setTimeout(push,1100)};
 const publicActivity=()=>{
  const s=api()?.getSnapshot();if(!s)return [];
  const out=[];
  for(const x of (s.proposals||[]).slice(0,8))out.push({kind:'اقتراح للمدينة',title:String(x.title||'').slice(0,90),detail:String(x.detail||'').slice(0,180)});
  for(const x of (s.projects||[]).slice(0,8))out.push({kind:'مشروع مجتمعي',title:String(x.title||'').slice(0,90),detail:String(x.detail||'').slice(0,180)});
  for(const x of (s.challenges||[]).slice(0,8))out.push({kind:'تحدي',title:String(x.title||'').slice(0,90),detail:String(x.meta||'').slice(0,120)});
  return out.slice(0,12).filter(x=>x.title);
 };
 const publishCommunity=async()=>{
  if(!uid||!db||!navigator.onLine)return;
  const user=auth?.currentUser;if(!user)return;
  const activity=publicActivity();const payload={uid,displayName:String(user.displayName||'لاعب').replace(/[<>\u0000-\u001f]/g,'').slice(0,40),activity:JSON.stringify(activity)};
  const hash=JSON.stringify(payload);if(hash===lastPublicHash)return;
  try{await db.collection('worldCommunity').doc(uid).set({...payload,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});lastPublicHash=hash;return true;}
  catch(e){console.warn('[Squad v183] community publish failed',e?.code||e);status('حفظ عالمك الشخصي مستمر؛ مشاركة المدينة تحتاج نشر قواعد v183.');return false;}
 };
 const watchCommunity=()=>{
  if(stopCommunity){stopCommunity();stopCommunity=null}
  if(!uid||!db)return;
  stopCommunity=db.collection('worldCommunity').orderBy('updatedAt','desc').limit(30).onSnapshot(snap=>{
   const rows=[];snap.forEach(d=>{const x=d.data()||{};let activity=[];try{activity=JSON.parse(typeof x.activity==='string'?x.activity:'[]')}catch(_){}if(typeof x.uid==='string'&&Array.isArray(activity))rows.push({uid:x.uid,displayName:String(x.displayName||'لاعب').slice(0,40),activity:activity.slice(0,12).filter(a=>a&&typeof a.title==='string').map(a=>({kind:String(a.kind||'مساهمة').slice(0,40),title:a.title.slice(0,90),detail:String(a.detail||'').slice(0,180)}))})});
   api()?.setCommunityFeed(rows);
  },e=>{console.warn('[Squad v183] community listener failed',e?.code||e);status('تعذر تحميل ساحة المجتمع؛ عالمك الشخصي ما زال محفوظًا.');});
 };
 const connect=user=>{
  if(stopDoc){stopDoc();stopDoc=null}if(stopCommunity){stopCommunity();stopCommunity=null}uid=user?.uid||null;doc=null;lastPublicHash='';
  if(!uid){api()?.activateAccount(null);api()?.setCommunityFeed([]);status('سجّل الدخول لمزامنة عالمك بين الأجهزة.');return}
  api()?.activateAccount(uid);
  doc=db.collection('worldState').doc(uid);watchCommunity();status('جارٍ تحميل عالمك من Firebase…');
  stopDoc=doc.onSnapshot(snap=>{
   if(snap.metadata?.hasPendingWrites)return;
   if(!snap.exists){queue();return}
   const data=snap.data()||{},remote=data.state;
   if(data.uid!==uid||data.schema!==1||!validState(remote)){status('تم رفض بيانات سحابية غير صالحة حفاظًا على حسابك.');return}
   const remoteAt=data.updatedAt?.toMillis?.()||0,localAt=Number(api()?.getSnapshot()?.updatedAt)||0;
   if(remoteAt>Math.max(localAt,lastLocal)){
    applying=true;try{api()?.applyRemoteState(remote);status('تم تحميل أحدث نسخة من عالمك من السحابة.')}finally{applying=false}
   }else if(localAt>remoteAt||lastLocal>remoteAt)queue();
  },e=>{console.warn('[Squad v182] cloud sync listener failed',e?.code||e);status(e?.code==='permission-denied'?'قواعد Firebase لا تسمح بالمزامنة بعد؛ انشر قواعد v182.':'المزامنة غير متاحة الآن؛ الحفظ المحلي مستمر.')});
 };
 const boot=()=>{
  if(started||!window.firebase?.apps?.length||!api())return false;
  try{const slot=window.ACCT?.slot;app=slot?firebase.app(slot):firebase.app();auth=app.auth();db=app.firestore();started=true;
   stopAuth=auth.onAuthStateChanged(connect);
   window.addEventListener('squad:world-state-change',queue);
   window.addEventListener('online',()=>uid&&queue());
   window.addEventListener('offline',()=>status('أنت غير متصل؛ سيتم الاحتفاظ بالتغييرات محليًا ثم مزامنتها عند عودة الإنترنت.'));
   return true;
  }catch(e){console.warn('[Squad v182] Firebase setup unavailable',e?.code||e);status('تعذر تهيئة مزامنة Firebase؛ الحفظ المحلي ما زال يعمل.');return false}
 };
 if(!boot()){let tries=0;const retry=()=>{if(boot()||++tries>30)return;setTimeout(retry,500)};retry()}
 window.SquadWorldCloudSync={version:183,getStatus:()=>({connected:!!uid,uid:uid?uid.slice(0,6)+'…':null}),syncNow:push,stop};
})();
