'use strict';

const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore, FieldValue} = require('firebase-admin/firestore');
const {getAuth} = require('firebase-admin/auth');
const {onDocumentCreated, onDocumentDeleted} = require('firebase-functions/v2/firestore');
const {getStorage} = require('firebase-admin/storage');
const {createHash} = require('node:crypto');

initializeApp();
const db = getFirestore();
const REGION = 'europe-west1';
const COIN_COOLDOWN_MS = 5 * 60 * 1000;
const JOB_COOLDOWN_MS = 30 * 1000;
const MAX_RECENT_CLAIMS = 8;
// Keep in sync with DC.MAP.coins.length in district-core.js (verified by v87 tests).
const MAX_COIN_ID_EXCLUSIVE = 115;
const ECONOMY_ACTION_COOLDOWN_MS = 250;
const MAX_ECONOMY_ACTIONS_PER_MINUTE = 40;



// Username sign-in without exposing the private 10-digit SID to authenticated clients.
// The function resolves the public username server-side, verifies the supplied password
// against Firebase Authentication, then returns a short-lived custom token for that UID.
const WEB_API_KEY = 'AIzaSyCXZPZu6UwkFoDK5uXBc1I_910GCI_e7IE';
const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;
async function consumeAuthLimit(key, max, windowMs = AUTH_RATE_WINDOW_MS) {
  const ref = db.collection('authRateLimits').doc(createHash('sha256').update(key).digest('hex'));
  const now = Date.now();
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const old = snap.exists ? snap.data() : {};
    const start = Number(old.startAt) || now;
    const count = now - start >= windowMs ? 0 : (Number(old.count) || 0);
    if (count >= max) return false;
    tx.set(ref, {startAt: now - start >= windowMs ? now : start, count: count + 1, expiresAt: new Date(now + windowMs * 2)});
    return true;
  });
}

exports.checkAccountIdAvailability = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  const n = String(request.data?.id || '');
  if (!/^[1-9][0-9]{9}$/.test(n)) throw new HttpsError('invalid-argument', 'رقم الحساب غير صالح.');
  const ip = request.rawRequest?.ip || 'unknown';
  if (!await consumeAuthLimit(`id-check:${ip}`, 30, 60 * 1000)) throw new HttpsError('resource-exhausted', 'طلبات كتير. حاول بعد دقيقة.');
  const snap = await db.doc(`ids/${n}`).get();
  return {available: !snap.exists};
});


exports.resolveAccountId = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'سجّل الدخول الأول.');
  const id = String(request.data?.id || '');
  if (!/^[1-9][0-9]{9}$/.test(id)) throw new HttpsError('invalid-argument', 'رقم الحساب غير صالح.');
  const ip = request.rawRequest?.ip || 'unknown';
  if (!await consumeAuthLimit(`resolve-id:${ip}`, 30, 60 * 1000)) throw new HttpsError('resource-exhausted', 'طلبات بحث كتير. حاول بعد دقيقة.');
  const snap = await db.doc(`ids/${id}`).get();
  return {uid: snap.exists && typeof snap.data()?.u === 'string' ? snap.data().u : null};
});

exports.usernameLogin = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  const username = String(request.data?.username || '').trim().toLowerCase().replace(/^@/, '');
  const password = String(request.data?.password || '');
  if (!/^[a-z][a-z0-9_.]{2,19}$/.test(username) || password.length < 1 || password.length > 256) {
    throw new HttpsError('invalid-argument', 'بيانات الدخول غير صحيحة.');
  }
  const ip = request.rawRequest?.ip || 'unknown';
  if (!await consumeAuthLimit(`username-login-ip:${ip}`, 50, 60 * 60 * 1000) || !await consumeAuthLimit(`username-login:${ip}:${username}`, 8)) {
    throw new HttpsError('resource-exhausted', 'محاولات دخول كتير. حاول بعد شوية.');
  }
  try {
    const mapping = await db.doc(`usernames/${username}`).get();
    if (!mapping.exists || typeof mapping.data()?.u !== 'string') throw new Error('no-user');
    const uid = mapping.data().u;
    const user = await getAuth().getUser(uid);
    if (!user.email) throw new Error('no-email');
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({email: user.email, password, returnSecureToken: true})
    });
    if (!response.ok) throw new Error('bad-credentials');
    const verified = await response.json();
    if (verified.localId !== uid) throw new Error('uid-mismatch');
    const token = await getAuth().createCustomToken(uid);
    return {token};
  } catch (e) {
    // Do not reveal whether the username exists or the password was wrong.
    throw new HttpsError('unauthenticated', 'اسم المستخدم أو كلمة السر غير صحيحة.');
  }
});


exports.accountIdLogin = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  const id = String(request.data?.id || '');
  const password = String(request.data?.password || '');
  if (!/^[1-9][0-9]{9}$/.test(id) || password.length < 1 || password.length > 256) {
    throw new HttpsError('invalid-argument', 'بيانات الدخول غير صحيحة.');
  }
  const ip = request.rawRequest?.ip || 'unknown';
  if (!await consumeAuthLimit(`account-id-login:${ip}`, 30)) throw new HttpsError('resource-exhausted', 'محاولات دخول كتير. حاول بعد شوية.');
  try {
    const mapping = await db.doc(`ids/${id}`).get();
    if (!mapping.exists || typeof mapping.data()?.u !== 'string') throw new Error('no-user');
    const uid = mapping.data().u;
    const user = await getAuth().getUser(uid);
    if (!user.email) throw new Error('no-email');
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({email: user.email, password, returnSecureToken: true})
    });
    if (!response.ok) throw new Error('bad-credentials');
    const verified = await response.json();
    if (verified.localId !== uid) throw new Error('uid-mismatch');
    return {token: await getAuth().createCustomToken(uid)};
  } catch (e) {
    throw new HttpsError('unauthenticated', 'رقم الحساب أو كلمة السر غير صحيحة.');
  }
});


exports.claimUsername = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'سجّل الدخول الأول.');
  const username = String(request.data?.username || '').trim().toLowerCase().replace(/^@/, '');
  if (!/^[a-z][a-z0-9_.]{2,19}$/.test(username) || ['admin','administrator','squad','thesquad','support','official','root','system','moderator','help'].includes(username)) {
    throw new HttpsError('invalid-argument', 'اسم المستخدم غير صالح.');
  }
  const uid = request.auth.uid;
  if (!await consumeAuthLimit(`username-change:${uid}`, 5, 60 * 60 * 1000)) throw new HttpsError('resource-exhausted', 'تغيير اسم المستخدم متاح بعد فترة.');
  await db.runTransaction(async (tx) => {
    const nextRef = db.doc(`usernames/${username}`);
    const userRef = db.doc(`users/${uid}`);
    const profileRef = db.doc(`publicProfiles/${uid}`);
    const [nextSnap, userSnap, profileSnap] = await Promise.all([tx.get(nextRef), tx.get(userRef), tx.get(profileRef)]);
    if (nextSnap.exists && nextSnap.data()?.u !== uid) throw new HttpsError('already-exists', 'اسم المستخدم محجوز.');
    if (!userSnap.exists || !profileSnap.exists) throw new HttpsError('failed-precondition', 'ملف الحساب غير مكتمل.');
    const oldName = String(profileSnap.data()?.un || userSnap.data()?.un || '');
    let oldRef = null, oldSnap = null;
    if (oldName && oldName !== username) { oldRef = db.doc(`usernames/${oldName}`); oldSnap = await tx.get(oldRef); }
    if (oldSnap?.exists && oldSnap.data()?.u === uid) tx.delete(oldRef);
    tx.set(nextRef, {u: uid});
    tx.set(userRef, {un: username}, {merge: true});
    tx.set(profileRef, {un: username}, {merge: true});
  });
  return {ok: true, username};
});

// Unread counts are server-authoritative. Clients may clear only their own counter;
// this trigger increments recipients after a message is actually created.
exports.onChatMessageCreated = onDocumentCreated({document: 'chats/{chatId}/messages/{messageId}', region: REGION, maxInstances: 20}, async (event) => {
  const message = event.data?.data();
  if (!message || typeof message.u !== 'string') return;
  const chatRef = db.doc(`chats/${event.params.chatId}`);
  const markerRef = chatRef.collection('_processedMessages').doc(event.params.messageId);
  await db.runTransaction(async (tx) => {
    const [markerSnap, chatSnap] = await Promise.all([tx.get(markerRef), tx.get(chatRef)]);
    if (markerSnap.exists || !chatSnap.exists) return;
    const chat = chatSnap.data() || {};
    if (!Array.isArray(chat.members) || !chat.members.includes(message.u)) return;
    const unread = {...(chat.un || {})};
    for (const uid of chat.members) {
      if (uid !== message.u) unread[uid] = Math.min(9999, Math.max(0, Number(unread[uid]) || 0) + 1);
    }
    tx.create(markerRef, {createdAt: FieldValue.serverTimestamp(), expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)});
    tx.update(chatRef, {un: unread});
  });
});


exports.onChatMessageDeleted = onDocumentDeleted({document: 'chats/{chatId}/messages/{messageId}', region: REGION, maxInstances: 10}, async (event) => {
  const message = event.data?.data() || {};
  const bucket = getStorage().bucket();
  const paths = [message.imPath, message.auPath].filter(p => typeof p === 'string' && p.startsWith(`chat-media/${event.params.chatId}/`));
  await Promise.all(paths.map(p => bucket.file(p).delete({ignoreNotFound: true}).catch(() => {})));
});

// Prices are server-owned. Client-provided prices/rewards are intentionally ignored.
const ESTATES = Object.freeze({
  villa_ridge: 85000,
  villa_pines: 125000,
  mansion_supervillain: 20000000,
  mansion_summit: 420000,
  estate_royal: 780000,
  chalet_overlook: 56000,
  villa_emerald: 185000,
  villa_azure: 220000,
  villa_skyline: 275000,
  mansion_goldcrest: 950000,
  mansion_royalgardens: 1250000,
  villa_palm: 315000
});
const APARTMENTS = Object.freeze({
  apt_classic: 18000,
  apt_skyline: 36000,
  apt_signature: 65000,
  apt_penthouse: 110000
});
const CARS = Object.freeze({
  rolls_royce_phantom: 2000000,
  rolls_royce_ghost: 1500000,
  bentley_mulsanne: 900000,
  bentley_flying_spur: 750000,
  mercedes_maybach_s_class: 800000,
  mercedes_benz_s_class: 550000,
  bmw_7_series: 420000,
  audi_a8_l: 360000,
  lexus_ls: 320000,
  porsche_panamera: 350000,
  rolls_royce_cullinan: 1800000,
  bentley_bentayga: 900000,
  range_rover_sv: 650000,
  range_rover_sv_2026: 720000,
  mercedes_maybach_gls: 750000,
  cadillac_escalade_v: 420000,
  cadillac_escalade_v_2026: 480000,
  lexus_lx: 280000,
  genesis_gv80: 220000,
  bmw_x7: 360000,
  bmw_x6_m_competition_2026: 520000,
  audi_q8: 290000,
  land_rover_defender_130: 260000,
  rolls_royce_spectre: 850000,
  bentley_continental_gt: 780000,
  bmw_8_series: 310000,
  lexus_lc_500: 240000,
  mercedes_benz_cle_coupe: 180000,
  maserati_quattroporte: 260000,
  aston_martin_rapide: 300000,
  alfa_romeo_giulia_quadrifoglio: 190000,
  genesis_g90: 270000,
  cadillac_celestiq: 600000,
  lucid_air: 280000,
  mercedes_benz_eqs: 320000,
  bmw_i7: 360000,
  porsche_taycan: 290000,
  audi_e_tron_gt: 260000,
  tesla_model_s_plaid: 160000,
  cadillac_lyriq: 140000,
  rivian_r1s: 130000,
  genesis_electrified_g80: 180000,
  lotus_eletre: 240000,
  aston_martin_dbx707: 450000,
  lamborghini_urus: 480000,
  ferrari_purosangue: 700000,
  mercedes_amg_g_63: 320000,
  mercedes_amg_g_63_2026: 560000,
  range_rover_sport_sv: 360000,
  cadillac_ct5_v_blackwing: 160000,
  maserati_ghibli: 150000,
  lexus_gx: 150000,
  lincoln_navigator: 180000,
  infiniti_qx80: 170000,
  ferrari_sf90_stradale: 950000,
  ferrari_812_superfast: 850000,
  lamborghini_revuelto: 1200000,
  lamborghini_huracan: 600000,
  mclaren_750s: 850000,
  mclaren_p1: 1500000,
  bugatti_chiron: 3000000,
  bugatti_tourbillon: 4000000,
  koenigsegg_jesko: 3500000,
  pagani_huayra: 2800000,
  porsche_911_gt3_rs: 420000,
  porsche_718_cayman_gt4: 180000,
  chevrolet_corvette_c8_z06: 180000,
  aston_martin_vantage: 280000,
  aston_martin_dbs: 420000,
  nissan_gt_r_nismo: 220000,
  audi_r8_v10: 400000,
  mercedes_amg_gt_black_series: 500000,
  maserati_mc20: 380000,
  ford_gt: 1000000,
  ford_mustang_dark_horse: 85000,
  chevrolet_camaro_zl1: 90000,
  dodge_challenger_hellcat: 95000,
  bmw_m4_competition: 150000,
  bmw_m2: 95000,
  mercedes_amg_c63_s: 135000,
  audi_rs6_avant: 180000,
  toyota_gr_supra: 65000,
  nissan_z: 50000,
  alfa_romeo_4c: 80000,
  honda_civic_type_r: 52000,
  toyota_gr_yaris: 42000,
  volkswagen_golf_r: 48000,
  mercedes_amg_a45_s: 75000,
  audi_rs3: 70000,
  bmw_m3: 110000,
  subaru_wrx_sti: 42000,
  hyundai_elantra_n: 38000,
  lexus_is_500_f_sport: 65000,
  cadillac_ct4_v_blackwing: 90000,
  mazda_mx_5_miata: 32000,
  toyota_gr86: 30000,
  subaru_brz: 30000,
  lotus_emira: 100000,
  lotus_evora: 85000,
  alpine_a110: 75000,
  caterham_seven: 50000,
  ariel_atom: 65000,
  ktm_x_bow: 100000,
  ginetta_g56: 90000,
  toyota_corolla: 26000,
  toyota_camry: 32000,
  honda_civic: 27000,
  honda_accord: 30000,
  nissan_sunny_versa: 19000,
  nissan_altima: 28000,
  hyundai_elantra: 24000,
  hyundai_accent: 18000,
  kia_cerato_forte_k4: 23000,
  mazda_3: 25000,
  toyota_rav4: 32000,
  honda_cr_v: 33000,
  hyundai_tucson: 30000,
  kia_sportage: 30000,
  mazda_cx_5: 31000,
  nissan_qashqai: 28000,
  volkswagen_tiguan: 32000,
  ford_edge: 35000,
  geely_coolray: 22000,
  mg_6: 21000,
  bmw_m_1000_rr: 95000
});
// Backward-compatible aliases for ownership saved by older releases.
const LEGACY_CAR_KEYS = Object.freeze({
  catalog_1: 'rolls_royce_phantom',
  catalog_2: 'rolls_royce_ghost',
  catalog_3: 'bentley_mulsanne',
  catalog_4: 'bentley_flying_spur',
  catalog_5: 'mercedes_maybach_s_class',
  catalog_6: 'mercedes_benz_s_class',
  catalog_7: 'bmw_7_series',
  catalog_8: 'audi_a8_l',
  catalog_9: 'lexus_ls',
  catalog_10: 'porsche_panamera',
  catalog_11: 'rolls_royce_cullinan',
  catalog_12: 'bentley_bentayga',
  catalog_13: 'range_rover_sv_2026',
  catalog_14: 'mercedes_maybach_gls',
  catalog_15: 'cadillac_escalade_v_2026',
  catalog_16: 'lexus_lx',
  catalog_17: 'genesis_gv80',
  catalog_18: 'bmw_x7',
  catalog_19: 'bmw_x6_m_competition_2026',
  catalog_20: 'mercedes_amg_g_63_2026',
  catalog_21: 'audi_q8',
  catalog_22: 'land_rover_defender_130',
  catalog_23: 'rolls_royce_spectre',
  catalog_24: 'bentley_continental_gt',
  catalog_25: 'bmw_8_series',
  catalog_26: 'lexus_lc_500',
  catalog_27: 'mercedes_benz_cle_coupe',
  catalog_28: 'maserati_quattroporte',
  catalog_29: 'aston_martin_rapide',
  catalog_30: 'alfa_romeo_giulia_quadrifoglio',
  catalog_31: 'genesis_g90',
  catalog_32: 'cadillac_celestiq',
  catalog_33: 'lucid_air',
  catalog_34: 'mercedes_benz_eqs',
  catalog_35: 'bmw_i7',
  catalog_36: 'porsche_taycan',
  catalog_37: 'audi_e_tron_gt',
  catalog_38: 'tesla_model_s_plaid',
  catalog_39: 'cadillac_lyriq',
  catalog_40: 'rivian_r1s',
  catalog_41: 'genesis_electrified_g80',
  catalog_42: 'lotus_eletre',
  catalog_43: 'aston_martin_dbx707',
  catalog_44: 'lamborghini_urus',
  catalog_45: 'ferrari_purosangue',
  catalog_46: 'mercedes_amg_g_63',
  catalog_47: 'range_rover_sport_sv',
  catalog_48: 'cadillac_ct5_v_blackwing',
  catalog_49: 'maserati_ghibli',
  catalog_50: 'lexus_gx',
  catalog_51: 'lincoln_navigator',
  catalog_52: 'infiniti_qx80',
  catalog_53: 'ferrari_sf90_stradale',
  catalog_54: 'ferrari_812_superfast',
  catalog_55: 'lamborghini_revuelto',
  catalog_56: 'lamborghini_huracan',
  catalog_57: 'mclaren_750s',
  catalog_58: 'mclaren_p1',
  catalog_59: 'bugatti_chiron',
  catalog_60: 'bugatti_tourbillon',
  catalog_61: 'koenigsegg_jesko',
  catalog_62: 'pagani_huayra',
  catalog_63: 'porsche_911_gt3_rs',
  catalog_64: 'porsche_718_cayman_gt4',
  catalog_65: 'chevrolet_corvette_c8_z06',
  catalog_66: 'aston_martin_vantage',
  catalog_67: 'aston_martin_dbs',
  catalog_68: 'nissan_gt_r_nismo',
  catalog_69: 'audi_r8_v10',
  catalog_70: 'mercedes_amg_gt_black_series',
  catalog_71: 'maserati_mc20',
  catalog_72: 'ford_gt',
  catalog_73: 'ford_mustang_dark_horse',
  catalog_74: 'chevrolet_camaro_zl1',
  catalog_75: 'dodge_challenger_hellcat',
  catalog_76: 'bmw_m4_competition',
  catalog_77: 'bmw_m2',
  catalog_78: 'mercedes_amg_c63_s',
  catalog_79: 'audi_rs6_avant',
  catalog_80: 'toyota_gr_supra',
  catalog_81: 'nissan_z',
  catalog_82: 'alfa_romeo_4c',
  catalog_83: 'honda_civic_type_r',
  catalog_84: 'toyota_gr_yaris',
  catalog_85: 'volkswagen_golf_r',
  catalog_86: 'mercedes_amg_a45_s',
  catalog_87: 'audi_rs3',
  catalog_88: 'bmw_m3',
  catalog_89: 'subaru_wrx_sti',
  catalog_90: 'hyundai_elantra_n',
  catalog_91: 'lexus_is_500_f_sport',
  catalog_92: 'cadillac_ct4_v_blackwing',
  catalog_93: 'mazda_mx_5_miata',
  catalog_94: 'toyota_gr86',
  catalog_95: 'subaru_brz',
  catalog_96: 'lotus_emira',
  catalog_97: 'lotus_evora',
  catalog_98: 'alpine_a110',
  catalog_99: 'caterham_seven',
  catalog_100: 'ariel_atom',
  catalog_101: 'ktm_x_bow',
  catalog_102: 'ginetta_g56',
  catalog_103: 'toyota_corolla',
  catalog_104: 'toyota_camry',
  catalog_105: 'honda_civic',
  catalog_106: 'honda_accord',
  catalog_107: 'nissan_sunny_versa',
  catalog_108: 'nissan_altima',
  catalog_109: 'hyundai_elantra',
  catalog_110: 'hyundai_accent',
  catalog_111: 'kia_cerato_forte_k4',
  catalog_112: 'mazda_3',
  catalog_113: 'toyota_rav4',
  catalog_114: 'honda_cr_v',
  catalog_115: 'hyundai_tucson',
  catalog_116: 'kia_sportage',
  catalog_117: 'mazda_cx_5',
  catalog_118: 'nissan_qashqai',
  catalog_119: 'volkswagen_tiguan',
  catalog_120: 'ford_edge',
  catalog_121: 'geely_coolray',
  catalog_122: 'mg_6',
  catalog_123: 'bmw_m_1000_rr'
});
const migrateCarOwnership = (cars) => {
  const migrated = {...(cars || {})};
  for (const [legacy, stable] of Object.entries(LEGACY_CAR_KEYS)) {
    if (migrated[legacy]) migrated[stable] = true;
    if (migrated[stable]) migrated[legacy] = true;
  }
  return migrated;
};
const JOBS = Object.freeze({cafe:400, shop:600, gym:500, bank:1200, lab:1500, arcade:450, hall:450, showroom:2500, kiosk:350});
const uidOf = (request) => {
  if (!request.auth || !request.auth.uid) throw new HttpsError('unauthenticated', 'سجّل الدخول الأول.');
  return request.auth.uid;
};
const economyRef = (uid) => db.collection('economy').doc(uid);
const freshEconomy = () => ({
  wallet: 0, bank: 0, estates: {}, apartments: {}, cars: {}, staff: {},
  coinClaims: {}, recentCoinClaims: [], recentActions: [], lastActionAt: 0, lastJobAt: 0, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
});
const safeState = (d) => ({
  wallet: Number.isSafeInteger(d.wallet) && d.wallet >= 0 ? d.wallet : 0,
  bank: Number.isSafeInteger(d.bank) && d.bank >= 0 ? d.bank : 0,
  estates: d.estates && typeof d.estates === 'object' ? d.estates : {},
  apartments: d.apartments && typeof d.apartments === 'object' ? d.apartments : {},
  cars: migrateCarOwnership(d.cars && typeof d.cars === 'object' ? d.cars : {}),
  staff: d.staff && typeof d.staff === 'object' ? d.staff : {},
  bankGameInventory: d.bankGameInventory && typeof d.bankGameInventory === 'object' ? d.bankGameInventory : {},
  coinClaims: d.coinClaims && typeof d.coinClaims === 'object' ? d.coinClaims : {}
});

exports.economyGet = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  const uid = uidOf(request);
  const ref = economyRef(uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) tx.create(ref, freshEconomy());
  });
  const snap = await ref.get();
  return safeState(snap.data() || {});
});

exports.economyAction = onCall({region: REGION, enforceAppCheck: false, maxInstances: 10}, async (request) => {
  const uid = uidOf(request);
  const body = request.data || {};
  const action = typeof body.action === 'string' ? body.action : '';
  const ref = economyRef(uid);
  const now = Date.now();
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const old = snap.exists ? snap.data() : freshEconomy();
    const s = safeState(old);
    let wallet = s.wallet, bank = s.bank;
    const estates = {...s.estates}, apartments = {...s.apartments}, cars = {...s.cars};
    const staff = {...s.staff};
    const inventory = {...(old.bankGameInventory && typeof old.bankGameInventory === 'object' ? old.bankGameInventory : {})};
    const coinClaims = {...(old.coinClaims || {})};
    let recent = Array.isArray(old.recentCoinClaims) ? old.recentCoinClaims.filter(t => Number.isFinite(t) && now - t < 60000) : [];
    let lastJobAt = Number(old.lastJobAt) || 0;
    let lastActionAt = Number(old.lastActionAt) || 0;
    let recentActions = Array.isArray(old.recentActions) ? old.recentActions.filter(t => Number.isFinite(t) && now - t < 60000) : [];
    if (action !== 'bankGameStatus' && lastActionAt && now - lastActionAt < ECONOMY_ACTION_COOLDOWN_MS) throw new HttpsError('resource-exhausted', 'استنى لحظة قبل العملية التالية.');
    if (action !== 'bankGameStatus' && recentActions.length >= MAX_ECONOMY_ACTIONS_PER_MINUTE) throw new HttpsError('resource-exhausted', 'وصلت للحد المؤقت للعمليات. حاول بعد دقيقة.');
    if (action !== 'bankGameStatus') { lastActionAt = now; recentActions.push(now); }
    let message = 'تمت العملية.';
    const spend = (amount) => {
      if (!Number.isSafeInteger(amount) || amount <= 0) throw new HttpsError('invalid-argument', 'قيمة العملية غير صالحة.');
      if (wallet < amount) throw new HttpsError('failed-precondition', 'رصيد المحفظة غير كافٍ.');
      wallet -= amount;
    };
    const creditWallet = (amount) => {
      if (!Number.isSafeInteger(amount) || amount <= 0 || wallet > Number.MAX_SAFE_INTEGER - amount) throw new HttpsError('resource-exhausted', 'رصيد المحفظة وصل للحد الأقصى.');
      wallet += amount;
    };
    switch (action) {
      case 'claimCoin': {
        const id = body.coinId;
        if (!Number.isInteger(id) || id < 0 || id >= MAX_COIN_ID_EXCLUSIVE) throw new HttpsError('invalid-argument', 'العملة غير موجودة في خريطة المدينة.');
        if (Number(coinClaims[id]) && now - Number(coinClaims[id]) < COIN_COOLDOWN_MS) throw new HttpsError('already-exists', 'العملة دي اتجمعت مؤخرًا.');
        if (recent.length >= MAX_RECENT_CLAIMS) throw new HttpsError('resource-exhausted', 'استنى شوية قبل جمع عملات إضافية.');
        const reward = id === 0 ? 5 : 1;
        creditWallet(reward); coinClaims[id] = now; recent.push(now); message = `+${reward} عملة`;
        break;
      }
      case 'job': {
        const job = body.jobId;
        if (!Object.prototype.hasOwnProperty.call(JOBS, job)) throw new HttpsError('invalid-argument', 'الوظيفة غير معروفة.');
        if (now - lastJobAt < JOB_COOLDOWN_MS) throw new HttpsError('resource-exhausted', 'استنى قبل الشيفت التالي.');
        creditWallet(JOBS[job]); lastJobAt = now; message = `+${JOBS[job]} عملة`;
        break;
      }
      case 'bankDeposit': {
        const amount = body.amount === 'all' ? wallet : body.amount;
        if (!Number.isSafeInteger(amount) || amount <= 0 || amount > wallet) throw new HttpsError('failed-precondition', 'قيمة الإيداع غير صالحة.');
        if (bank > Number.MAX_SAFE_INTEGER - amount) throw new HttpsError('resource-exhausted', 'رصيد البنك وصل للحد الأقصى.');
        wallet -= amount; bank += amount; message = 'تم الإيداع'; break;
      }
      case 'bankWithdraw': {
        const amount = body.amount === 'all' ? bank : body.amount;
        if (!Number.isSafeInteger(amount) || amount <= 0 || amount > bank) throw new HttpsError('failed-precondition', 'رصيد البنك غير كافٍ.');
        if (wallet > Number.MAX_SAFE_INTEGER - amount) throw new HttpsError('resource-exhausted', 'رصيد المحفظة وصل للحد الأقصى.');
        bank -= amount; wallet += amount; message = 'تم السحب'; break;
      }
      case 'buyEstate': {
        const id = body.id, price = ESTATES[id];
        if (!price) throw new HttpsError('invalid-argument', 'العقار غير موجود في الكتالوج المعتمد.');
        if (estates[id]) throw new HttpsError('already-exists', 'العقار مملوك بالفعل.');
        spend(price); estates[id] = true; message = 'تم شراء العقار'; break;
      }
      case 'buyApartment': {
        const id = body.id, price = APARTMENTS[id];
        if (!price) throw new HttpsError('invalid-argument', 'الشقة غير موجودة في الكتالوج المعتمد.');
        if (apartments[id]) throw new HttpsError('already-exists', 'الشقة مملوكة بالفعل.');
        spend(price); apartments[id] = true; message = 'تم شراء الشقة'; break;
      }
      case 'buyCar': {
        const id = body.id, price = CARS[id];
        if (!price) throw new HttpsError('invalid-argument', 'السيارة غير موجودة في الكتالوج المعتمد.');
        if (cars[id]) throw new HttpsError('already-exists', 'السيارة مملوكة بالفعل.');
        spend(price); cars[id] = true;
        const legacyId = Object.keys(LEGACY_CAR_KEYS).find(k => LEGACY_CAR_KEYS[k] === id);
        if (legacyId) cars[legacyId] = true;
        message = 'تم شراء السيارة'; break;
      }
      case 'bankGameStatus': {
        const vaultRef = db.collection('worldState').doc('bankVault');
        const vaultSnap = await tx.get(vaultRef);
        const hour = Math.floor(now/3600000);
        const vault = vaultSnap.exists ? vaultSnap.data() : {balance:50000, securityLevel:0, lastRobberyHour:-1, lastRobberyAt:0, hour};
        const balance = Number(vault.hour) === hour ? Math.max(0, Number(vault.balance)||0) : 50000;
        if (!vaultSnap.exists || Number(vault.hour) !== hour) tx.set(vaultRef, {...vault, balance, hour, updatedAt:FieldValue.serverTimestamp()}, {merge:true});
        return {ok:true, message:'حالة البنك', state:safeState({...old, bankGameInventory:inventory}), bankGame:{balance, securityLevel:Number(vault.securityLevel)||0, lastRobberyHour:Number(vault.lastRobberyHour)||-1, lastRobberyAt:Number(vault.lastRobberyAt)||0, hour}};
      }
      case 'buyBankGameWeapon': {
        const catalog = {stun: {price:1800, label:'صاعق طاقة افتراضي'}};
        const item = catalog[body.id];
        if (!item) throw new HttpsError('invalid-argument', 'المعدة غير موجودة.');
        const count = Number(inventory[body.id])||0;
        if (count >= 3) throw new HttpsError('failed-precondition', 'وصلت للحد الأقصى من معدات المهمة.');
        spend(item.price); inventory[body.id] = count + 1; message = 'تم شراء معدة المهمة'; break;
      }
      case 'hireBankAssistant': {
        const count = Number(inventory.assistants)||0;
        if (count >= 3) throw new HttpsError('failed-precondition', 'تقدر تعيّن 3 مساعدين كحد أقصى.');
        spend(2500); inventory.assistants = count + 1; message = 'تم تعيين مساعد للمهمة'; break;
      }
      case 'upgradeBankSecurity': {
        const vaultRef = db.collection('worldState').doc('bankVault');
        const vaultSnap = await tx.get(vaultRef);
        const vault = vaultSnap.exists ? vaultSnap.data() : {balance:50000, securityLevel:0, lastRobberyHour:-1, lastRobberyAt:0};
        const level = Math.max(0, Math.min(5, Number(vault.securityLevel)||0));
        if (level >= 5) throw new HttpsError('failed-precondition', 'تأمين البنك وصل لأقصى مستوى.');
        const price = 5000 * (level + 1); spend(price);
        tx.set(vaultRef, {...vault, balance:Number(vault.balance)||50000, securityLevel:level+1, updatedAt:FieldValue.serverTimestamp()}, {merge:true});
        message = 'تم تطوير تأمين البنك إلى المستوى ' + (level+1); break;
      }
      case 'bankRobbery': {
        const vaultRef = db.collection('worldState').doc('bankVault');
        const vaultSnap = await tx.get(vaultRef);
        const vault = vaultSnap.exists ? vaultSnap.data() : {balance:50000, securityLevel:0, lastRobberyHour:-1, lastRobberyAt:0};
        const hour = Math.floor(now / 3600000);
        if (Number(vault.lastRobberyHour) === hour) throw new HttpsError('resource-exhausted', 'البنك اتسرق بالفعل خلال الساعة دي. ارجع بعد تجدد التوقيت.');
        const weapons = Number(inventory.stun)||0, assistants = Number(inventory.assistants)||0;
        if (weapons < 1) throw new HttpsError('failed-precondition', 'لازم تشتري معدة مهمة واحدة على الأقل.');
        if (assistants < 1) throw new HttpsError('failed-precondition', 'لازم تعيّن مساعد واحد على الأقل.');
        const level = Math.max(0, Math.min(5, Number(vault.securityLevel)||0));
        const seed = createHash('sha256').update(uid + ':' + hour).digest().readUInt32BE(0) / 0xffffffff;
        const successChance = Math.max(0.12, 0.78 + Math.min(assistants,3)*0.06 + Math.min(weapons,3)*0.04 - level*0.13);
        const success = seed < successChance;
        const available = Number(vault.hour) === hour ? Math.max(0, Number(vault.balance)||0) : 50000;
        const reward = success ? Math.min(available, 2500 + assistants*900 + weapons*500) : 0;
        if (success && reward > 0) creditWallet(reward);
        tx.set(vaultRef, {...vault, balance:Math.max(0,available-reward), hour, lastRobberyHour:hour, lastRobberyAt:now, updatedAt:FieldValue.serverTimestamp()}, {merge:true});
        inventory.stun = Math.max(0,weapons - 1);
        inventory.assistants = Math.max(0,assistants - 1);
        message = success ? `نجحت المهمة! حصلت على ${reward} عملة.` : 'فشلت المهمة، وتم استهلاك معدات الفريق.';
        const nextState = {...s, wallet, bank, estates, apartments, cars, staff, coinClaims, bankGameInventory:inventory};
        tx.set(ref, {...nextState, recentActions, lastActionAt, lastJobAt, createdAt:old.createdAt || FieldValue.serverTimestamp(), updatedAt:FieldValue.serverTimestamp()});
        return {ok:true, message, state:safeState(nextState), bankGame:{balance:Math.max(0,available-reward), securityLevel:level, lastRobberyHour:hour, lastRobberyAt:now, hour, success, reward}};
      }
      case 'bankTransfer': {
        const targetUid = typeof body.targetUid === 'string' ? body.targetUid.trim() : '';
        const amount = body.amount;
        if (!targetUid || targetUid === uid || targetUid.length > 128) throw new HttpsError('invalid-argument', 'معرّف المستلم غير صالح.');
        if (!Number.isSafeInteger(amount) || amount <= 0 || amount > bank) throw new HttpsError('failed-precondition', 'رصيد البنك غير كافٍ أو المبلغ غير صالح.');
        const targetRef = economyRef(targetUid), targetSnap = await tx.get(targetRef);
        if (!targetSnap.exists) throw new HttpsError('not-found', 'المستلم لازم يسجّل الدخول للعبة مرة واحدة على الأقل.');
        const target = safeState(targetSnap.data() || {});
        if (target.bank > Number.MAX_SAFE_INTEGER - amount) throw new HttpsError('resource-exhausted', 'رصيد المستلم كبير جدًا.');
        bank -= amount;
        tx.set(targetRef, {...target, bank: target.bank + amount, createdAt: targetSnap.data().createdAt || FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()}, {merge:true});
        message = 'تم تحويل المبلغ بنجاح';
        break;
      }
      case 'transferAsset': {
        const targetUid = typeof body.targetUid === 'string' ? body.targetUid.trim() : '';
        const kind = body.kind, requestedId = typeof body.id === 'string' ? body.id.trim() : '';
        if (!targetUid || targetUid === uid || targetUid.length > 128) throw new HttpsError('invalid-argument', 'معرّف المستلم غير صالح.');
        const field = kind === 'car' ? cars : kind === 'estate' ? estates : kind === 'apartment' ? apartments : null;
        const allowed = kind === 'car' ? CARS : kind === 'estate' ? ESTATES : kind === 'apartment' ? APARTMENTS : null;
        // Resolve legacy catalog_N car IDs to stable IDs before validating ownership.
        const id = kind === 'car' ? (LEGACY_CAR_KEYS[requestedId] || requestedId) : requestedId;
        if (!field || !allowed || !allowed[id] || !(field[id] || (kind === 'car' && requestedId !== id && field[requestedId]))) throw new HttpsError('failed-precondition', 'الأصل غير موجود في ممتلكاتك.');
        const targetRef = economyRef(targetUid), targetSnap = await tx.get(targetRef);
        if (!targetSnap.exists) throw new HttpsError('not-found', 'المستلم لازم يفتح اللعبة مرة واحدة على الأقل.');
        const target = safeState(targetSnap.data() || {}), targetField = {...target[kind === 'car' ? 'cars' : kind === 'estate' ? 'estates' : 'apartments']};
        const legacyId = kind === 'car' ? Object.keys(LEGACY_CAR_KEYS).find(k => LEGACY_CAR_KEYS[k] === id) : null;
        if (targetField[id] || (legacyId && targetField[legacyId])) throw new HttpsError('already-exists', 'المستلم يمتلك الأصل ده بالفعل.');
        delete field[id]; if (legacyId) delete field[legacyId];
        targetField[id] = true; if (legacyId) targetField[legacyId] = true;
        const targetNext = {...target, [kind === 'car' ? 'cars' : kind === 'estate' ? 'estates' : 'apartments']: targetField, createdAt: targetSnap.data().createdAt || FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()};
        tx.set(targetRef, targetNext, {merge:true});
        message = 'تم نقل الملكية بنجاح';
        break;
      }
      case 'hireStaff': {
        const estateId = body.estateId, kind = body.kind;
        if (!ESTATES[estateId] || !estates[estateId]) throw new HttpsError('failed-precondition', 'لازم تمتلك العقار الأول.');
        if (!['guard', 'servant'].includes(kind)) throw new HttpsError('invalid-argument', 'نوع العامل غير صالح.');
        const key = `${estateId}_${kind}`, count = Number(staff[key]) || 0, price = kind === 'guard' ? 2500 : 1800;
        if (count >= 3) throw new HttpsError('failed-precondition', 'وصلت للحد الأقصى للعاملين في العقار.');
        spend(price); staff[key] = count + 1; message = kind === 'guard' ? 'تم تعيين الحارس' : 'تم تعيين الخادم'; break;
      }
      default: throw new HttpsError('invalid-argument', 'نوع العملية غير مدعوم.');
    }
    const next = {
      wallet, bank, estates, apartments, cars, staff, bankGameInventory: inventory, coinClaims, recentCoinClaims: recent,
      recentActions, lastActionAt, lastJobAt, createdAt: old.createdAt || FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
    };
    tx.set(ref, next);
    return {ok: true, message, state: safeState(next)};
  });
});


// v148: audited server-authorized platform wallet ledger. This is accounting/request tracking only;
// it does not initiate real payouts or store payout phone numbers/payment credentials.
const SQUAD_PLATFORM_WALLET_LABEL = '10000000000';
function validMoneyAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 10000000 || Math.round(n * 100) !== n * 100) {
    throw new HttpsError('invalid-argument', 'المبلغ غير صالح.');
  }
  return Math.round(n * 100) / 100;
}
exports.getPlatformWallet = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  const [walletSnap, txSnap, payoutSnap] = await Promise.all([
    db.doc('platformWallet/main').get(),
    db.collection('platformWallet/main/transactions').orderBy('createdAt','desc').limit(50).get(),
    db.collection('platformWallet/main/withdrawalRequests').orderBy('createdAt','desc').limit(30).get()
  ]);
  const wallet = walletSnap.exists ? walletSnap.data() : {};
  return {
    ok: true, walletId: SQUAD_PLATFORM_WALLET_LABEL,
    balance: Number(wallet.balance || 0), totalEarned: Number(wallet.totalEarned || 0),
    totalWithdrawn: Number(wallet.totalWithdrawn || 0),
    transactions: txSnap.docs.map(d => { const x=d.data(); return {id:d.id, type:String(x.type||''), amount:Number(x.amount||0), note:String(x.note||'').slice(0,160), status:String(x.status||''), createdAt:x.createdAt?.toDate?.().toISOString() || null}; }),
    withdrawals: payoutSnap.docs.map(d => { const x=d.data(); return {id:d.id, method:String(x.method||''), amount:Number(x.amount||0), status:String(x.status||'pending'), createdAt:x.createdAt?.toDate?.().toISOString() || null}; })
  };
});
exports.recordPlatformEarning = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  const amount = validMoneyAmount(request.data?.amount);
  const note = String(request.data?.note || 'إضافة رصيد إدارية').trim().slice(0,160);
  const walletRef = db.doc('platformWallet/main');
  const txRef = walletRef.collection('transactions').doc();
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const old = snap.exists ? snap.data() : {};
    tx.set(walletRef, {balance: Number(old.balance||0)+amount, totalEarned: Number(old.totalEarned||0)+amount, updatedAt: FieldValue.serverTimestamp(), walletLabel:SQUAD_PLATFORM_WALLET_LABEL}, {merge:true});
    tx.create(txRef, {type:'earning', amount, note, status:'recorded', createdAt:FieldValue.serverTimestamp(), actorUid:request.auth.uid});
  });
  return {ok:true};
});
exports.requestPlatformWithdrawal = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  const amount = validMoneyAmount(request.data?.amount);
  const method = String(request.data?.method||'').trim();
  if (!['Vodafone Cash','Bank transfer','Other approved provider'].includes(method)) throw new HttpsError('invalid-argument','طريقة السحب غير مدعومة.');
  const walletRef = db.doc('platformWallet/main');
  const reqRef = walletRef.collection('withdrawalRequests').doc();
  const txRef = walletRef.collection('transactions').doc();
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const old = snap.exists ? snap.data() : {};
    const balance = Number(old.balance||0);
    if (amount > balance) throw new HttpsError('failed-precondition','الرصيد غير كافٍ.');
    tx.set(walletRef, {balance:balance-amount, pendingWithdrawals: Number(old.pendingWithdrawals||0)+amount, updatedAt:FieldValue.serverTimestamp()}, {merge:true});
    tx.create(reqRef,{amount,method,status:'pending',createdAt:FieldValue.serverTimestamp(),actorUid:request.auth.uid, providerReference:null});
    tx.create(txRef,{type:'withdrawal_request',amount,note:`طلب سحب عبر ${method}`,status:'pending',createdAt:FieldValue.serverTimestamp(),actorUid:request.auth.uid,requestId:reqRef.id});
  });
  return {ok:true,requestId:reqRef.id};
});
exports.resolvePlatformWithdrawal = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  const requestId = String(request.data?.requestId||'').trim();
  const decision = String(request.data?.decision||'');
  if (!/^[A-Za-z0-9_-]{10,80}$/.test(requestId) || !['approve','reject','mark_paid'].includes(decision)) throw new HttpsError('invalid-argument','بيانات الطلب غير صالحة.');
  const walletRef = db.doc('platformWallet/main');
  const reqRef = walletRef.collection('withdrawalRequests').doc(requestId);
  await db.runTransaction(async (tx) => {
    const [wSnap,rSnap] = await Promise.all([tx.get(walletRef),tx.get(reqRef)]);
    if (!rSnap.exists || !['pending','approved_for_manual_payout'].includes(rSnap.data().status)) throw new HttpsError('failed-precondition','الطلب غير موجود أو تمت معالجته.');
    const w = wSnap.exists ? wSnap.data() : {};
    const r = rSnap.data();
    if (decision === 'reject') {
      if (r.status !== 'pending') throw new HttpsError('failed-precondition','لا يمكن رفض طلب تم اعتماده للتنفيذ اليدوي.');
      tx.set(walletRef,{balance:Number(w.balance||0)+Number(r.amount||0),pendingWithdrawals:Math.max(0,Number(w.pendingWithdrawals||0)-Number(r.amount||0)),updatedAt:FieldValue.serverTimestamp()},{merge:true});
      tx.update(reqRef,{status:'rejected',resolvedAt:FieldValue.serverTimestamp(),resolvedBy:request.auth.uid});
    } else if (decision === 'approve') {
      if (r.status !== 'pending') throw new HttpsError('failed-precondition','الطلب ليس قيد الانتظار.');
      tx.update(reqRef,{status:'approved_for_manual_payout',approvedAt:FieldValue.serverTimestamp(),approvedBy:request.auth.uid});
    } else if (decision === 'mark_paid') {
      if (r.status !== 'approved_for_manual_payout') throw new HttpsError('failed-precondition','اعتمد الطلب أولاً قبل تسجيل التحويل.');
      tx.set(walletRef,{totalWithdrawn:Number(w.totalWithdrawn||0)+Number(r.amount||0),pendingWithdrawals:Math.max(0,Number(w.pendingWithdrawals||0)-Number(r.amount||0)),updatedAt:FieldValue.serverTimestamp()},{merge:true});
      tx.update(reqRef,{status:'paid_manually_recorded',resolvedAt:FieldValue.serverTimestamp(),resolvedBy:request.auth.uid});
    }
  });
  return {ok:true};
});

// v146: Admin-only, read-only overview. The private account ID mapping is checked
// server-side; no client-provided ID or UI flag can grant administrative access.
const SQUAD_ADMIN_SID = '1000000000';
async function requireSquadAdmin(request) {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'سجّل الدخول أولاً.');
  const mapping = await db.doc(`ids/${SQUAD_ADMIN_SID}`).get();
  if (!mapping.exists || mapping.data()?.u !== uid) {
    throw new HttpsError('permission-denied', 'الحساب غير مصرح له.');
  }
  return uid;
}
async function safeCollectionCount(name) {
  try {
    const snap = await db.collection(name).count().get();
    return Number(snap.data().count) || 0;
  } catch (e) {
    console.warn('Admin dashboard count unavailable:', name, e?.code || e?.message || 'unknown');
    return null;
  }
}
exports.checkAdminAccess = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  return {allowed: true};
});
exports.getAdminDashboard = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  const names = ['users','publicProfiles','chats','reports','channels','posts','calls','rooms','stories','communities','games'];
  const pairs = await Promise.all(names.map(async name => [name, await safeCollectionCount(name)]));
  const counts = Object.fromEntries(pairs);
  let onlineUsers = null;
  try {
    const cutoff = new Date(Date.now() - 5 * 60 * 1000);
    const onlineSnap = await db.collection('presence').where('t', '>=', cutoff).count().get();
    onlineUsers = Number(onlineSnap.data().count) || 0;
  } catch (e) {
    console.warn('Admin dashboard presence count unavailable:', e?.code || e?.message || 'unknown');
  }
  let activePlayers = null;
  try {
    const playersSnap = await db.collectionGroup('players').where('t', '>=', new Date(Date.now() - 5 * 60 * 1000)).count().get();
    activePlayers = Number(playersSnap.data().count) || 0;
  } catch (e) {
    console.warn('Admin dashboard player count unavailable:', e?.code || e?.message || 'unknown');
  }
  let latestReports = [];
  try {
    const reports = await db.collection('reports').orderBy('t', 'desc').limit(8).get();
    latestReports = reports.docs.map(doc => {
      const data = doc.data() || {};
      const t = data.t?.toDate ? data.t.toDate() : null;
      return {reason: String(data.why || data.tg || 'بلاغ').slice(0, 90), createdAt: t ? t.toLocaleString('ar-EG') : '—'};
    });
  } catch (e) {
    console.warn('Admin dashboard reports unavailable:', e?.code || e?.message || 'unknown');
  }
  return {
    ok: true,
    counts,
    onlineUsers,
    activePlayers,
    latestReports,
    services: {
      'Firebase Authentication': true,
      'Cloud Firestore': Object.values(counts).some(v => v !== null),
      'Cloud Functions': true,
      'Firebase Storage': null
    },
    generatedAt: Date.now()
  };
});


// v154: owner-only account lookup and privacy-minimized activity summaries.
// Search accepts an exact account SID or username; it never enumerates users.
async function adminLookupUid(request, rawQuery) {
  const uid = await requireSquadAdmin(request);
  const query = String(rawQuery || '').trim().replace(/^@/, '').toLowerCase();
  if (!query || query.length > 32) throw new HttpsError('invalid-argument', 'Enter an account ID or username.');
  if (!await consumeAuthLimit(`admin-account-search:${uid}`, 20, 60 * 1000)) {
    throw new HttpsError('resource-exhausted', 'Too many account lookups. Try again in a minute.');
  }
  let targetUid = null, sid = null;
  if (/^[1-9][0-9]{9}$/.test(query)) {
    sid = query;
    const mapping = await db.doc(`ids/${sid}`).get();
    if (mapping.exists && typeof mapping.data()?.u === 'string') targetUid = mapping.data().u;
  } else if (/^[a-z][a-z0-9_.]{2,19}$/.test(query)) {
    const mapping = await db.doc(`usernames/${query}`).get();
    if (mapping.exists && typeof mapping.data()?.u === 'string') targetUid = mapping.data().u;
  } else {
    throw new HttpsError('invalid-argument', 'Use a 10-digit account ID or a valid username.');
  }
  if (!targetUid) return {found: false};
  return {found: true, uid: targetUid, sid};
}
function adminDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
exports.searchAdminAccounts = onCall({region: REGION, maxInstances: 5}, async (request) => {
  const found = await adminLookupUid(request, request.data?.query);
  if (!found.found) return {ok: true, found: false};
  let authUser;
  try { authUser = await getAuth().getUser(found.uid); }
  catch (e) { if (e.code === 'auth/user-not-found') return {ok: true, found: false}; throw e; }
  const [profileSnap, privateSnap, presenceSnap] = await Promise.all([
    db.doc(`publicProfiles/${found.uid}`).get(),
    db.doc(`users/${found.uid}`).get(),
    db.doc(`presence/${found.uid}`).get()
  ]);
  const profile = profileSnap.exists ? profileSnap.data() || {} : {};
  const privateData = privateSnap.exists ? privateSnap.data() || {} : {};
  const presence = presenceSnap.exists ? presenceSnap.data() || {} : {};
  const sid = found.sid || (typeof privateData.sid === 'string' ? privateData.sid : null);
  return {
    ok: true, found: true,
    account: {
      uid: found.uid,
      sid: sid && /^\d{10}$/.test(sid) ? sid : null,
      name: String(profile.name || privateData.name || 'Unknown account').slice(0, 80),
      username: String(profile.un || privateData.un || '').slice(0, 24),
      city: String(profile.city || '').slice(0, 60),
      disabled: !!authUser.disabled,
      emailVerified: !!authUser.emailVerified,
      createdAt: adminDate(authUser.metadata?.creationTime),
      lastSignInAt: adminDate(authUser.metadata?.lastSignInTime),
      lastPresenceAt: adminDate(presence.t),
      profileAvailable: profileSnap.exists
    }
  };
});
exports.getAdminAccountActivity = onCall({region: REGION, maxInstances: 5}, async (request) => {
  const adminUid = await requireSquadAdmin(request);
  if (!await consumeAuthLimit(`admin-account-activity:${adminUid}`, 30, 60 * 1000)) throw new HttpsError('resource-exhausted', 'Too many activity lookups. Try again shortly.');
  const uid = String(request.data?.uid || '');
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(uid)) throw new HttpsError('invalid-argument', 'Invalid account reference.');
  const authUser = await getAuth().getUser(uid).catch((e) => {
    if (e.code === 'auth/user-not-found') throw new HttpsError('not-found', 'Account not found.');
    throw e;
  });
  const countQuery = async (query) => {
    try { const snap = await query.count().get(); return Number(snap.data().count) || 0; }
    catch (e) { console.warn('Admin account activity count unavailable:', e?.code || e?.message || 'unknown'); return null; }
  };
  const [posts, chats, reportsFiled, reportsTargeted, presenceSnap, privateSnap] = await Promise.all([
    countQuery(db.collection('posts').where('authorUid', '==', uid)),
    countQuery(db.collection('chats').where('members', 'array-contains', uid)),
    countQuery(db.collection('reports').where('u', '==', uid)),
    countQuery(db.collection('reports').where('postOwnerUid', '==', uid)),
    db.doc(`presence/${uid}`).get(),
    db.doc(`users/${uid}`).get()
  ]);
  const privateData = privateSnap.exists ? privateSnap.data() || {} : {};
  return {
    ok: true,
    activity: {
      posts, conversations: chats, reportsFiled, reportsAboutAccount: reportsTargeted,
      createdAt: adminDate(authUser.metadata?.creationTime),
      lastSignInAt: adminDate(authUser.metadata?.lastSignInTime),
      lastPresenceAt: adminDate(presenceSnap.exists ? presenceSnap.data()?.t : null),
      accountDisabled: !!authUser.disabled,
      accountCreatedRecord: adminDate(privateData.created)
    }
  };
});
exports.getAdminReports = onCall({region: REGION, maxInstances: 5}, async (request) => {
  await requireSquadAdmin(request);
  const limit = Math.min(50, Math.max(1, Number(request.data?.limit) || 30));
  const [legacySnap, socialSnap] = await Promise.all([
    db.collection('reports').orderBy('t', 'desc').limit(limit).get().catch(() => null),
    db.collection('reports').orderBy('createdAt', 'desc').limit(limit).get().catch(() => null)
  ]);
  const byId = new Map();
  for (const snap of [legacySnap, socialSnap]) {
    if (!snap) continue;
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      const createdAt = adminDate(d.t || d.createdAt);
      byId.set(doc.id, {
        id: doc.id,
        category: d.postId ? 'Social post' : d.cid ? 'Game / platform' : 'Platform report',
        reason: String(d.why || d.reason || d.details || d.tg || 'No reason provided').slice(0, 240),
        status: String(d.status || 'Open').slice(0, 32),
        createdAt,
        targetType: d.postId ? 'Post' : d.tg ? 'Reported account / item' : 'Unspecified'
      });
    }
  }
  const reports = [...byId.values()].sort((a,b) => (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0)).slice(0, limit);
  return {ok: true, reports};
});
