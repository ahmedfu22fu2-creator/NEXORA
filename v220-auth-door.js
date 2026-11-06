/* NEXORA v220 — 7-second door intro, skip/reduced-motion/low-power fallback. */
(()=>{'use strict';
 const root=document.getElementById('auth');if(!root||window.SquadDoor220)return;
 const card=root.querySelector('.card'),lid=document.getElementById('lid'),pw=document.getElementById('pw');
 if(!card)return;
 const intro=document.createElement('section');intro.id='sq220-intro';intro.setAttribute('aria-label','بوابة الدخول إلى NEXORA');intro.setAttribute('aria-live','off');
 intro.innerHTML=`<button class="sq220-mute" id="sq220-sound" type="button" aria-pressed="false">♪ <span>الصوت مغلق</span></button><button class="sq220-skip" id="sq220-skip" type="button">تخطّي</button><div class="sq220-fog" aria-hidden="true"></div><div class="sq220-title" aria-hidden="true">NEXORA</div><div class="sq220-subtitle" aria-hidden="true">YOUR WORLD · YOUR PEOPLE</div><div class="sq220-door-wrap" aria-hidden="true"><div class="sq220-door-frame"><div class="sq220-door"><i class="sq220-panel sq220-panel-a"></i><i class="sq220-panel sq220-panel-b"></i><i class="sq220-handle"></i><i class="sq220-keyhole"></i></div><i class="sq220-light"></i></div><i class="sq220-floor"></i></div>`;
 root.insertBefore(intro,root.firstChild);
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const weak=(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)||/Android 5|iPhone OS 12|iPad; CPU OS 12/i.test(navigator.userAgent);
 let timer=0,openTimer=0,started=false,muted=true,audioCtx=null;
 const soundBtn=intro.querySelector('#sq220-sound');
 function playTone(){if(muted)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioCtx=audioCtx||new AC();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.setValueAtTime(110,audioCtx.currentTime);osc.frequency.exponentialRampToValueAtTime(62,audioCtx.currentTime+.65);gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.018,audioCtx.currentTime+.12);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.72);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.75);}catch(_){}}
 function finishIntro(){clearTimeout(timer);clearTimeout(openTimer);intro.classList.add('sq220-done');intro.hidden=true;card.hidden=false;requestAnimationFrame(()=>card.classList.add('is-visible'));try{localStorage.setItem('sq220-door-seen','1')}catch(_){}if(lid)lid.focus({preventScroll:true});}
 function reveal(){clearTimeout(timer);clearTimeout(openTimer);intro.classList.add('sq220-opening');timer=setTimeout(finishIntro,weak||reduced?80:(intro.classList.contains('sq220-fast')?120:720));}
 function start(){if(started||root.hidden)return;started=true;card.classList.remove('is-visible');card.hidden=true;intro.hidden=false;intro.classList.remove('sq220-done','sq220-opening','sq220-fast');let seen=false;try{seen=localStorage.getItem('sq220-door-seen')==='1'}catch(_){}if(seen){intro.classList.add('sq220-fast');openTimer=setTimeout(()=>intro.classList.add('sq220-opening'),1050);timer=setTimeout(finishIntro,1500);}else if(reduced||weak){intro.classList.add('sq220-fast','sq220-static');timer=setTimeout(reveal,reduced?80:1000);}else{openTimer=setTimeout(()=>intro.classList.add('sq220-opening'),5500);timer=setTimeout(finishIntro,7000);}}
 intro.querySelector('#sq220-skip').addEventListener('click',reveal);
 soundBtn.addEventListener('click',()=>{muted=!muted;soundBtn.setAttribute('aria-pressed',String(!muted));soundBtn.querySelector('span').textContent=muted?'الصوت مغلق':'الصوت مفتوح';if(!muted)playTone();});
 intro.addEventListener('pointerdown',()=>{if(!muted)playTone();},{once:true});
 const authObserver=new MutationObserver(()=>{if(root.hidden){clearTimeout(timer);clearTimeout(openTimer);intro.hidden=true;return;}start();});
 authObserver.observe(root,{attributes:true,attributeFilter:['hidden']});
 if(!root.hidden)start();
 // Personal-number field: show visual separators while preserving numeric-only auth payload.
 if(lid){lid.setAttribute('inputmode','numeric');lid.setAttribute('autocomplete','username');lid.setAttribute('aria-describedby','sq220-id-progress');lid.addEventListener('input',()=>{if(!/^[\d\s]*$/.test(lid.value))return;const before=lid.value.slice(0,lid.selectionStart??lid.value.length),countBefore=before.replace(/\D/g,'').length,digits=lid.value.replace(/\D/g,'').slice(0,10),p=digits.match(/.{1,3}/g)||[];lid.value=p.join(' ');const pos=countBefore+Math.floor(Math.max(0,countBefore-1)/3);try{lid.setSelectionRange(pos,pos)}catch(_){}const count=document.getElementById('sq220-id-count');if(count)count.textContent=digits.length+'/10';});}
 if(pw)pw.setAttribute('autocomplete','current-password');
 // Remember-me uses Firebase's supported persistence modes; checked by default.
 const remember=document.createElement('label');remember.className='sq220-remember';remember.innerHTML='<input id="sq220-remember" type="checkbox" checked><span>ابقَ مسجلاً على هذا الجهاز</span>';
 const reset=document.getElementById('resetPassword');if(reset&&reset.parentNode)reset.parentNode.insertBefore(remember,reset);
 if(lid&&lid.parentNode){const counter=document.createElement('div');counter.className='sq220-id-count';counter.id='sq220-id-progress';counter.innerHTML='<span>الرقم الشخصي — 10 أرقام</span><b id="sq220-id-count">0/10</b>';lid.parentNode.appendChild(counter);}

 window.SquadDoor220={version:220,start,reveal,lowPower:weak};
})();
