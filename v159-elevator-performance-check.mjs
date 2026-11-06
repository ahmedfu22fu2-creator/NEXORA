import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const corePath = 'site/chanse1/district-core.js';
const districtPath = 'site/chanse2/district.js';
const coreSource = fs.readFileSync(corePath, 'utf8');
const districtSource = fs.readFileSync(districtPath, 'utf8');
const rules = fs.readFileSync('site/chanse1/firestore.rules', 'utf8');
const sw = fs.readFileSync('site/sw.js', 'utf8');
const version = JSON.parse(fs.readFileSync('site/version.json', 'utf8'));

for (const file of [corePath, districtPath]) {
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(check.status, 0, `${file} must parse: ${check.stderr}`);
}

const sandbox = { module: { exports: {} }, exports: {} };
vm.runInNewContext(coreSource, sandbox, { filename: corePath });
const DC = sandbox.module.exports;
const liftBuildings = DC.MAP.buildings.filter(building => building.lift);
assert.ok(liftBuildings.length >= 5, 'the city must retain multiple building elevators');
assert.equal(typeof DC.requestLift, 'function', 'core must expose a bounded elevator request API');

let testedFloors = 0;
let simulatedTravel = 0;
let now = 1_000_000;
DC.tick(now);
const automaticWitness = liftBuildings[0];
for (const building of liftBuildings.slice(1)) {
  const lift = building.lift;
  const startFloor = Math.max(0, Math.min(building.n - 1, Math.round(lift.y / building.fh)));
  assert.equal(DC.requestLift(lift, startFloor, now), true, `${building.id} lift can be called to its current floor`);
  DC.tick(now + lift.command.duration + 1);
  assert.equal(lift.command.phase, 'parked', `${building.id} lift must park after arriving`);
  assert.equal(lift.at, startFloor, `${building.id} lift must report its arrival floor`);
  assert.equal(lift.doors[startFloor].open, true, `${building.id} arrival doors must open`);
  assert.ok(lift.doors.filter(door => Math.abs(door.fy - startFloor * building.fh) > .001).every(door => !door.open), `${building.id} must keep every other floor door closed`);

  const targetFloor = building.n > 1 ? (startFloor === building.n - 1 ? 0 : building.n - 1) : 0;
  const startAt = now + 200;
  assert.equal(DC.requestLift(lift, targetFloor, startAt), true, `${building.id} accepts a destination floor`);
  const halfway = startAt + lift.command.duration / 2;
  DC.tick(halfway);
  assert.equal(lift.command.phase, 'moving', `${building.id} lift remains moving mid-trip`);
  assert.ok(lift.y >= Math.min(lift.command.fromY, lift.command.toY) - .01 && lift.y <= Math.max(lift.command.fromY, lift.command.toY) + .01,
    `${building.id} lift interpolation stays between floors`);
  DC.tick(startAt + lift.command.duration + 1);
  assert.equal(lift.command.phase, 'parked', `${building.id} lift finishes its trip`);
  assert.equal(lift.at, targetFloor, `${building.id} lift reaches the requested floor`);
  assert.ok(Math.abs(lift.y - targetFloor * building.fh) < .001, `${building.id} lift stops at the exact floor height`);
  assert.equal(lift.doors[targetFloor].open, true, `${building.id} destination doors open`);
  assert.equal(DC.requestLift(lift, building.n, startAt + lift.command.duration + 2), false, `${building.id} rejects an out-of-range floor`);
  testedFloors += building.n;
  simulatedTravel += lift.command.duration;
  now += 20_000;
}

assert.equal(automaticWitness.lift.controlled, false, 'an unrequested elevator must retain the original automatic mode');
assert.equal(automaticWitness.lift.command, null, 'automatic elevators must not receive a local command');
const automaticY = automaticWitness.lift.y;
DC.tick(now + 6_000);
assert.equal(automaticWitness.lift.controlled, false, 'automatic mode must remain active after time advances');
assert.ok(Number.isFinite(automaticWitness.lift.y) && automaticWitness.lift.y >= 0, 'automatic cabin motion remains valid');

// A short movement stress pass guards against NaN/Infinity and unbounded player coordinates.
const player = DC.newP(DC.MAP.spawn.x, DC.MAP.spawn.z);
for (let frame = 0; frame < 1800; frame++) {
  DC.step(player, { f: frame % 240 < 120 ? 1 : -1, s: frame % 180 < 90 ? .35 : -.35, run: frame % 3 === 0 }, 1 / 60);
  assert.ok(Number.isFinite(player.x) && Number.isFinite(player.y) && Number.isFinite(player.z), 'movement simulation must remain finite');
  assert.ok(Math.abs(player.x) <= DC.BOUND && Math.abs(player.z) <= DC.BOUND, 'movement simulation must remain inside world bounds');
}

assert.match(districtSource, /function findNearLift\(\)/, 'district must detect a nearby building lift');
assert.match(districtSource, /function openLiftPanel\(/, 'district must open the lift control panel');
assert.match(districtSource, /function chooseLiftFloor\(/, 'district must accept user floor selection');
assert.match(districtSource, /function liftDoorsReady\(/, 'floor selection must wait until the destination lift doors are visibly open');
assert.match(districtSource, /door\.o>\.92/, 'the cabin must not accept boarding before the doors finish opening');
assert.match(districtSource, /function updateLiftRide\(/, 'player must be attached to the cabin during travel');
assert.match(districtSource, /if\(LIFT_RIDE\)\{Object\.assign\(P,LIFT_RIDE\.origin\);LIFT_RIDE=null\}/, 'leaving the district during a lift ride must restore a safe player position and clear ride state');
assert.match(districtSource, /data-lift-floor/, 'floor buttons must be wired through delegated events');
assert.match(districtSource, /navigator\.connection&&navigator\.connection\.saveData/, 'save-data devices must use the conservative graphics profile');
assert.match(districtSource, /frameBudgetN%3===0/, 'expensive world animation remains throttled on constrained devices');
assert.match(districtSource, /setPixelRatio\(next\)/, 'adaptive render resolution remains enabled');
assert.match(districtSource, /LIFT_RIDE\?LIFT_RIDE\.origin:P/, 'presence updates must not publish the rider at a false intermediate height');
assert.match(rules, /keys\(\)\.hasOnly\(\['n','x','y','z','r','c','k','e','t','car'\]\)/,
  'the existing bounded presence schema remains unchanged');
assert.doesNotMatch(rules, /'lift'/, 'no new Firestore field or paid backend dependency is introduced');
assert.ok(version.build >= 241, 'release manifest retains v176 baseline');
assert.match(sw, /squad-v235-property-room-design-cloud/, 'service worker cache must match v186');

for (const [siteFile, sourceFile] of [
  ['site/chanse1/district-core.js', 'source/The-Squad-v137/chanse1/district-core.js'],
  ['site/chanse2/district.js', 'source/The-Squad-v137/chanse2/district.js']
]) {
  assert.equal(fs.readFileSync(siteFile, 'utf8'), fs.readFileSync(sourceFile, 'utf8'), `${sourceFile} mirror must match deployed source`);
}

console.log(`V159 ELEVATOR + PERFORMANCE CHECKS PASSED — ${liftBuildings.length} lifts, ${testedFloors} building floors inspected, ${Math.round(simulatedTravel)} ms of controlled travel simulated, 1,800 movement frames, no Firestore schema changes.`);
