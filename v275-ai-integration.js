/* NEXORA v275 — AI Integration readiness and safe UI diagnostics. */
(()=>{'use strict';
const state={version:275,backend:'not-checked',authenticated:false};
function refresh(){try{state.authenticated=!!(window.firebase?.auth?.().currentUser);state.backend=window.firebase?.app&&window.firebase?.auth?'firebase-client-ready':'firebase-client-unavailable'}catch(_){state.backend='firebase-client-unavailable'}return {...state}}
window.SquadAIIntegration={status:refresh,version:275};
document.addEventListener('squad:auth-changed',refresh);window.addEventListener('online',refresh);
})();
