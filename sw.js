/* NEXORA v204: bounded offline recovery. Navigation and release metadata get a
   short network window, then fall back to the last cached page/manifest. */
const C='nexora-v240-cinematic-identity-v238-social-interaction-notifications-v237-luxury-outdoor-estates-v236-property-lifestyle-studio-v235-property-room-design-cloud-v220-cinematic-door-auth-v221-account-controls-v222-account-deletion-v223-home-inbox-v224-friends-v225-post-controls-v227-messenger-search-delivery-v228-call-lifecycle-v229-community-membership-v230-global-search-notifications-v231-avatar-3d-sync-v232-city-runtime-recovery-v233-vehicle-cloud-customization-squad-v235-property-room-design-cloud-v241-auth-completion-v242-email-verification-ux-v246-in-game-store-v247-store-experience-refinement-v248-mga-adaptive-store-v249-product-details-v250-platform-quality-v251-social-experience-v252-profile-friends-refinement-v253-messenger-refinement-v254-stories-notifications-v255-communities-channels-v256-global-search-v257-admin-control-refinement-v258-content-moderation-refinement-v259-community-channel-discovery-v260-profile-verification-5000-v261-profile-social-verification-v262-followers-friends-refinement-v263-avatar-capture-3d-call-identity-v264-avatar-expression-lipsync-refinement-v265-avatar-creator-studio-v267-avatar-complete-pipeline-v268-social-ai-v269-spatial-social-v270-creator-economy-v271-privacy-safety-v272-quality-upgrade-v273-performance-reliability-v275-ai-integration-v276-ai-intelligence-v277-ai-agents-v278-ai-collaboration-v279-project-intelligence-v280-workspace-knowledge-v281-command-center-v282-cross-system-integration-v283-experience-engine-v284-adaptive-workspace-squad-v285-stability-center-squad-v286-global-discovery-v287-unified-ui-redesign-v288-social-evolution-v289-ai-control-tower-v290-3d-universe-evolution-v291-marketplace-evolution';
const F=[
  "v287-unified-ui-redesign.css",
  "v287-unified-ui-redesign.js",
  "v288-social-evolution.css",
  "v288-social-evolution.js",
  "v289-ai-control-tower.css",
  "v289-ai-control-tower.js",
  "v290-3d-universe-evolution.css",
  "v290-3d-universe-evolution.js",
  "v291-marketplace-evolution.css",
  "v291-marketplace-evolution.js",
  "v268-social-ai.js",
  "v268-social-ai.css",
  "v269-spatial-social.js",
  "v269-spatial-social.css",
  "v270-creator-economy.js",
  "v270-creator-economy.css",
  "v271-privacy-safety.js",
  "v271-privacy-safety.css",
  "v272-quality-upgrade.js",
  "v272-quality-upgrade.css",
  "v273-performance-reliability.js",
  "v273-performance-reliability.css",
  "v274-ai-core-evolution.js",
  "v274-ai-core-evolution.css",
  "v275-ai-integration.js",
  "v275-ai-integration.css",
  "v276-ai-intelligence.js",
  "v276-ai-intelligence.css",
  "v277-ai-agents.js",
  "v277-ai-agents.css",
  "v278-ai-collaboration.js",
  "v278-ai-collaboration.css",
  "v279-project-intelligence.js",
  "v279-project-intelligence.css",
  "v280-workspace-knowledge.js",
  "v280-workspace-knowledge.css",
  "v281-command-center.js",
  "v281-command-center.css",
  "v282-cross-system-integration.js",
  "v282-cross-system-integration.css",
  "v283-experience-engine.js",
  "v283-experience-engine.css",
  "v284-adaptive-workspace.js",
  "v284-adaptive-workspace.css",
  "v285-stability-center.js",
  "v285-stability-center.css",
  "v286-global-discovery.js",
  "v286-global-discovery.css",
  "v219-brand-system.css",
  "v220-auth-door.css",
  "v240-cinematic-identity.css",
  "v220-auth-door.js",
  "v223-home-inbox.css",
  "v225-post-controls.css",
  "v227-messenger.css",
  "v223-home-inbox.js",
  "./",
  "chanse1/ads.js",
  "chanse1/app.js",
  "chanse1/auth.css",
  "chanse1/auth.js",
  "chanse1/badge-96.png",
  "chanse1/community.js",
  "chanse1/district-core.js",
  "chanse1/gold.css",
  "chanse1/living-palace-premium.css",
  "chanse1/look.js",
  "chanse1/luxe.js",
  "chanse1/manifest.json",
  "chanse1/push.js",
  "chanse1/squad.css",
  "chanse1/theme.js",
  "chanse1/time.js",
  "chanse1/ui2.js",
  "chanse1/v27.css",
  "chanse2/apple-touch-icon.png",
  "chanse2/assets/design/auth-login-v121.png",
  "chanse2/assets/design/auth-lamp-v118.jpg",
  "chanse2/auth-scene.js",
  "v192-login-lamp-restore.css",
  "v195-premium-navigation.css",
  "v195-premium-navigation.js",
  "v196-premium-navigation.js",
  "v197-home-command.js",
  "v197-home-command.css",
  "v198-messenger-evolution.js",
  "v198-messenger-evolution.css",
  "v199-squad-identity.js",
  "v199-squad-identity.css",
  "v200-stories-channels.js",
  "v200-stories-channels.css",
  "v201-3d-calls.js",
  "v201-3d-calls.css",
  "v263-avatar-capture-studio.js",
  "v263-avatar-capture-studio.css",
  "v265-avatar-creator.js",
  "v265-avatar-creator.css",
  "FIRESTORE-RULES-v229.rules",
  "v202-portal-login.css",
  "v202-portal-login.js",
  "v202-social-feed.css",
  "v202-social-feed.js",
  "v203-design-system.css",
  "v203-design-system.js",
  "v205-visual-expansion.css",
  "v205-visual-expansion.js",
  "v206-lifestyle.css",
  "v206-lifestyle.js",
  "chanse3/ai-hub.html",
  "chanse3/store.html",
  "v248-store-adaptive.css",
  "v248-store-adaptive.js",
  "v249-store-product-details.css",
  "v249-store-product-details.js",
  "v250-platform-quality.css",
  "v251-social-experience.css",
  "v252-profile-friends-refinement.css",
  "v253-messenger-refinement.css",
  "v254-stories-notifications.css",
  "v255-communities-channels.css",
  "chanse4/version.json",
  "chanse2/cafe2.js",
  "chanse2/district.js",
  "chanse2/extras.js",
  "chanse2/living-palace.css",
  "chanse2/premium-refinement-v89.css",
  "chanse2/profile.js",
  "chanse2/stage4-chat-ui.css",
  "chanse2/stage4-extras.js",
  "chanse2/stories.js",
  "chanse2/world.js",
  "chanse3/accounts.js",
  "chanse3/acct.js",
  "chanse3/admin-monitor.css",
  "chanse3/admin-monitor.js",
  "chanse3/auth-v121.css",
  "chanse3/bot.js",
  "chanse3/cafe.js",
  "chanse3/cafe3.js",
  "chanse3/calls.js",
  "chanse3/chatx.js",
  "chanse3/icon-192.png",
  "chanse3/index.html",
  "chanse3/living-palace-engine.js",
  "chanse3/luxe.css",
  "chanse3/performance-v144.css",
  "chanse3/plus.js",
  "chanse3/quality-polish-v120.css",
  "chanse3/services-hub.html",
  "chanse3/settings.js",
  "chanse3/social-expansion.css",
  "chanse3/social-expansion.js",
  "chanse3/social-feed.js",
  "chanse3/stage4-chat-ui.js",
  "chanse4/app-preview.html",
  "chanse4/auth-v119.css",
  "chanse4/channel.js",
  "chanse4/cinema.js",
  "chanse4/english-ui-v152.js",
  "chanse4/firebase-config.js",
  "chanse4/games.js",
  "chanse4/icon.svg",
  "chanse4/platform-redesign-v151.css",
  "chanse4/stage4-extras.css",
  "chanse4/tokens.css",
  "chanse4/ui2.css",
  "chanse4/welcome.js",
  "index.html",
  "sw.js",
  "v149-scroll-repair.css",
  "v160-aurora.css",
  "v160-aurora.js",
  "v162-global-hub.css",
  "v162-global-hub.js",
  "v163-community-evolution.css",
  "v163-community-evolution.js",
  "v164-platform-expansion.css",
  "v164-platform-expansion.js",
  "v165-squad-universe.css",
  "v165-squad-universe.js",
  "v166-global-connect.css",
  "v168-universe-integration.css",
  "v170-personal-vault.css",
  "v171-achievements.css",
  "v172-events-hub.css",
  "v166-global-connect.js",
  "v168-universe-integration.js",
  "v170-personal-vault.js",
  "v171-achievements.js",
  "v172-events-hub.js",
  "v173-shared-events.css",
  "v175-startup-recovery.js",
  "v173-shared-events.js",
  "v178-civilization.css",
  "v178-civilization.js",
  "v179-living-universe.css",
  "v179-living-universe.js",
  "v180-city-life.css",
  "v180-city-life.js",
  "v181-world-systems.css",
  "v181-world-systems.js",
  "v182-cloud-sync.js",
  "v184-universe-suite.js",
  "v185-universe-cloud-sync.js",
  "v186-control-center.js",
  "v187-call-network.js",
  "v184-universe-suite.css",
  "v185-universe-stability.css",
  "v186-control-center.css",
  "version.json",
  "visual-refresh-v158.css"
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(C);
  await Promise.allSettled(F.map(async p=>{try{const response=await fetch(p,{cache:'reload'});if(response.ok)await cache.put(p,response)}catch(_){}}));
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('squad-')&&key!==C).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('range'))return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const page=request.mode==='navigate'||url.pathname.endsWith('.html')||url.pathname==='/'||url.pathname.endsWith('/');
  const version=url.pathname.endsWith('/version.json')||url.pathname==='/version.json';
  if(page||version){
    event.respondWith((async()=>{
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),page?4500:2500);
      try{
        const response=await fetch(request,{signal:controller.signal});
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(C).then(cache=>cache.put(request,copy)).catch(()=>{});
        }
        return response;
      }catch(_){
        const cached=await caches.match(request);
        if(cached)return cached;
        if(page){
          const home=await caches.match('index.html')||await caches.match('./');
          if(home)return home;
        }
        return new Response(page?'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NEXORA — Offline</title><body style="font:16px system-ui;background:#080d18;color:#eef;padding:2rem"><h1>You are offline</h1><p>NEXORA could not reach the network and no cached page is available. Check your connection and retry.</p><button onclick="location.reload()">Retry</button></body></html>':'{}',{status:page?503:503,headers:{'Content-Type':page?'text/html; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store'}});
      }finally{clearTimeout(timeout)}
    })());
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(C).then(cache=>cache.put(request,copy)).catch(()=>{});}
    return response;
  })));
});
self.addEventListener('push',event=>{let payload={};try{payload=event.data.json()}catch(_){}const data=payload.data||payload;if(!data.title)return;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{if(clients.some(client=>client.visibilityState==='visible'&&client.focused))return;
  return self.registration.showNotification(data.title,{body:data.body||'',icon:'chanse3/icon-192.png',badge:'chanse1/badge-96.png',tag:data.cid||'squad',renotify:true,vibrate:data.kind==='call'?[300,150,300,150,300]:[120],requireInteraction:data.kind==='call',data:{cid:data.cid}})}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const cid=(event.notification.data||{}).cid;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{const client=clients[0];if(client){if(cid)client.postMessage({cid});return client.focus();}return self.clients.openWindow('./'+(cid?'?c='+encodeURIComponent(cid):''));}));
});
