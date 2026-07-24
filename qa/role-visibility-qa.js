// Role-visibility QA harness — runs against the LIVE dev Workshift org via MCP.
//
// Goal (owners' requirement): "no one can see anything they shouldn't" with
// 50-60 records. Exercises the SERVER-side view enforcement merged in PR #39:
//   1. Seeds the org to ~55 records using the obviously-fictional cast
//      (renames legacy real-sounding seeds, zeroes SSNs).
//   2. For each role view: view-scoped reads must only return attributes the
//      view exposes (hidden keys absent server-side).
//   3. Write protection: view-scoped saves cannot modify hidden/read-only
//      attributes.
//   4. Fail-closed: a view with no display_settings exposes nothing.
//   5. Cross-type views are rejected.
//
// Usage: node qa/role-visibility-qa.js   (token read from source/.mcp.json)
const fs = require('fs');
const AUTH = JSON.parse(fs.readFileSync('C:/Users/Mizun/source/.mcp.json', 'utf8')).mcpServers.workshift.headers.Authorization;
const ENDPOINT = 'https://dev-api.workshift.io/mcp';
let rpcId = 1;

async function call(name, args) {
  const body = { jsonrpc: '2.0', id: rpcId++, method: 'tools/call', params: { name, arguments: args || {} } };
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { Authorization: AUTH, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) });
  const text = await res.text();
  let json;
  if (text.trimStart().startsWith('{')) json = JSON.parse(text);
  else { const l = text.split('\n').find(x => x.startsWith('data:')); json = JSON.parse(l.replace(/^data:\s*/, '')); }
  if (json.error) throw new Error(name + ' -> ' + JSON.stringify(json.error));
  const r = json.result;
  if (r && r.isError) throw new Error(name + ' -> ' + JSON.stringify(r.content).slice(0, 300));
  if (r && r.structuredContent) return r.structuredContent;
  if (r && r.content && r.content[0] && r.content[0].text) { try { return JSON.parse(r.content[0].text); } catch { return r.content[0].text; } }
  return r;
}
async function listTools() {
  const body = { jsonrpc: '2.0', id: rpcId++, method: 'tools/list' };
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { Authorization: AUTH, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) });
  const text = await res.text();
  const json = text.trimStart().startsWith('{') ? JSON.parse(text) : JSON.parse(text.split('\n').find(x => x.startsWith('data:')).replace(/^data:\s*/, ''));
  return json.result.tools;
}

const RT_NAMES = { patient: 'Patient', prescription: 'Prescription', allergy: 'Allergy', condition: 'Condition', payMethod: 'Payment method', claim: 'Claim', consentProfile: 'Consent profile', message: 'Message' };

// Critical hidden-key expectations (belt-and-suspenders on top of the generic
// allowed-set assertion): the HIPAA headline cases.
const CRITICAL = [
  { view: 'Pharmacy Tech — Patient', rt: 'patient', mustHide: ['ssn'] },
  { view: 'Provider — Patient', rt: 'patient', mustHide: ['ssn', 'ssn-last-4'] },
  { view: 'Billing — Patient', rt: 'patient', mustHide: ['ssn', 'mobile-phone', 'email'] },
  { view: 'Patient — Prescription', rt: 'prescription', mustHide: ['transaction-status'] },
];

const CAST = ['Homer Simpson','Marge Simpson','Bart Simpson','Lisa Simpson','Fred Flintstone','Barney Rubble','Bugs Bunny','Daffy Duck','Shaggy Rogers','Velma Dinkley','Clark Kent','Bruce Wayne','Diana Prince','Peter Parker','Tony Stark','SpongeBob Squarepants','Patrick Star','Sherlock Holmes','Dorothy Gale','Willy Wonka','Mary Poppins','Frodo Baggins','Bilbo Baggins','Luke Skywalker','Leia Organa','Han Solo','Phineas Flynn','Ferb Fletcher','Mario Mario','Luigi Mario'];
const RENAMES = { 'Marissa Chen': 'Wilma Flintstone', 'Theo Dwyer': 'George Jetson', 'Alina Ruiz': 'Daphne Blake' };

(async () => {
  const results = [];
  const fail = (area, msg) => { results.push({ area, ok: false, msg }); console.log('  FAIL ' + area + ': ' + msg); };
  const pass = (area, msg) => { results.push({ area, ok: true, msg }); console.log('  ok   ' + area + (msg ? ': ' + msg : '')); };

  // ── 0. preflight: is view enforcement deployed? ────────────────────────────
  console.log('== preflight ==');
  const tools = await listTools();
  const lr = tools.find(t => t.name === 'resource_ListResources');
  const hasViewParam = !!(lr && lr.inputSchema && lr.inputSchema.properties && lr.inputSchema.properties.resourceViewId);
  if (!hasViewParam) { console.log('ABORT: resource_ListResources has no resourceViewId — PR #39 not deployed to dev-api yet.'); process.exit(2); }
  pass('preflight', 'resourceViewId present on resource tools (PR #39 live on dev-api)');

  // ── resolve resource types + attributes + views ────────────────────────────
  const rts = (await call('admin_GetResourceTypes', {})).resourceTypes || [];
  const RT = {};
  for (const [k, name] of Object.entries(RT_NAMES)) {
    const rt = rts.find(r => (r.name || '').toLowerCase() === name.toLowerCase());
    if (!rt) { fail('setup', 'missing resource type ' + name); continue; }
    const attrs = (await call('admin_GetResourceTypeAttributes', { resourceTypeId: rt.resourceTypeId })).attributes || [];
    const byId = {}, byName = {};
    attrs.forEach(a => { byId[a.attributeId] = a.key; byName[(a.name || '').toLowerCase()] = a.key; });
    RT[k] = { id: rt.resourceTypeId, byId, byName };
  }

  // ── 1. seed: rename legacy patients, zero SSNs, top up to ~55 records ──────
  console.log('== seed ==');
  const pts = (await call('resource_ListResources', { resourceTypeId: RT.patient.id, limit: 200, offset: 0 })).resources || [];
  const fullKey = RT.patient.byName['full name'], ssnKey = RT.patient.byName['ssn'];
  let renamed = 0;
  for (const p of pts) {
    const nm = p.data[fullKey];
    if (RENAMES[nm] || String(p.data[ssnKey] || '').match(/^\d{3}-\d{2}-\d{4}$/) && !String(p.data[ssnKey]).startsWith('000')) {
      const d = { ...p.data };
      if (RENAMES[nm]) d[fullKey] = RENAMES[nm];
      d[ssnKey] = '000-00-000' + (renamed + 1);
      await call('resource_SaveResource', { resourceTypeId: RT.patient.id, id: p.id, data: d });
      renamed++;
    }
  }
  pass('seed', renamed + ' legacy patient(s) renamed/SSN-zeroed');

  const have = new Set(pts.map(p => p.data[fullKey]).concat(Object.values(RENAMES)));
  let added = 0;
  const newIds = [];
  for (let i = 0; i < CAST.length; i++) {
    const name = CAST[i];
    if (have.has(name)) continue;
    const saved = await call('resource_SaveResource', { resourceTypeId: RT.patient.id, data: {
      [fullKey]: name, [RT.patient.byName['person id']]: 'PX-9' + (200 + i),
      [RT.patient.byName['date of birth']]: (1955 + (i % 40)) + '-0' + (1 + i % 9) + '-1' + (i % 9),
      [ssnKey]: '000-00-02' + String(i).padStart(2, '0'),
      [RT.patient.byName['mobile phone']]: '+1 801 555 0' + (300 + i),
      [RT.patient.byName['email']]: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@demo.example',
      [RT.patient.byName['address']]: (100 + i) + ' Fictional Way, Salt Lake City UT 8410' + (i % 9),
      [RT.patient.byName['patient status']]: i % 9 === 0 ? 'New' : 'Active',
    }});
    newIds.push(saved.resource.id); added++;
  }
  // children for the first 8 new patients: rx + allergy + claim (+ consent, unlinked)
  let kids = 0;
  for (let i = 0; i < Math.min(8, newIds.length); i++) {
    const pid = newIds[i];
    await call('resource_SaveResource', { resourceTypeId: RT.prescription.id, data: {
      [RT.prescription.byName['rx number']]: 'RX-9' + (1000 + i),
      [RT.prescription.byName['medication prescribed']]: i % 2 ? 'Tirzepatide 5mg inj' : 'Semaglutide 2.5mg/mL inj',
      [RT.prescription.byName['rx status']]: ['Fill in Progress', 'Completed', 'Data Review'][i % 3],
      [RT.prescription.byName['days supply']]: 28, patient: pid } }); kids++;
    await call('resource_SaveResource', { resourceTypeId: RT.allergy.id, data: {
      [RT.allergy.byName['substance']]: i % 2 ? 'Penicillin' : 'Sulfa drugs',
      [RT.allergy.byName['reaction']]: i % 2 ? 'Anaphylaxis' : 'Hives',
      [RT.allergy.byName['severity']]: i % 2 ? 'Severe' : 'Moderate', patient: pid } }); kids++;
    await call('resource_SaveResource', { resourceTypeId: RT.claim.id, data: {
      [RT.claim.byName['ndc']]: 'compounded-503A',
      [RT.claim.byName['billed amount']]: 329, [RT.claim.byName['ar balance']]: i % 2 ? 329 : 0, patient: pid } }); kids++;
  }
  // total count
  let total = 0;
  for (const k of Object.keys(RT)) total += ((await call('resource_ListResources', { resourceTypeId: RT[k].id, limit: 200, offset: 0 })).totalCount) || 0;
  pass('seed', `${added} patients + ${kids} child records added — org total ${total} records`);

  // ── helper: full view (params) by name ─────────────────────────────────────
  async function viewByName(rtKey, name) {
    const listed = (await call('admin_GetResourceTypeViews', { resourceTypeId: RT[rtKey].id })).views || [];
    const v0 = listed.find(v => v.name === name);
    if (!v0) return null;
    const full = ((await call('admin_GetResourceTypeViews', { resourceTypeId: RT[rtKey].id, filters: [{ attributeName: 'id', attributeValue: v0.resourceViewId, operator: 'eq' }], cursor: 0 })).views || [])[0];
    return full;
  }
  function allowedKeys(view, rtKey) {
    try {
      const ds = JSON.parse((view.params || {}).display_settings || '{}');
      const out = new Set();
      (function walk(nodes) { (nodes || []).forEach(n => { if (n.componentType === 'core:attribute' && n.parameters) { const k = RT[rtKey].byId[n.parameters.attributeId]; if (k) out.add(k); } walk(n.children); }); })(ds.components);
      return out;
    } catch { return new Set(); }
  }

  // ── 2. read scoping: every role view on every type ─────────────────────────
  console.log('== read scoping (view-scoped lists) ==');
  const allViews = [];
  for (const rtKey of Object.keys(RT)) {
    const listed = (await call('admin_GetResourceTypeViews', { resourceTypeId: RT[rtKey].id })).views || [];
    for (const v of listed) if (/—/.test(v.name || '')) allViews.push({ rtKey, name: v.name, id: v.resourceViewId });
  }
  for (const v of allViews) {
    const full = await viewByName(v.rtKey, v.name);
    const allow = allowedKeys(full, v.rtKey);
    const res = (await call('resource_ListResources', { resourceTypeId: RT[v.rtKey].id, resourceViewId: v.id, limit: 200, offset: 0 })).resources || [];
    let leak = null;
    for (const r of res) for (const k of Object.keys(r.data || {})) if (!allow.has(k)) { leak = k; break; }
    if (leak) fail('read:' + v.name, `leaked key "${leak}" not in view (${res.length} records checked)`);
    else pass('read:' + v.name, `${res.length} records, keys ⊆ view (${allow.size} allowed)`);
  }

  // critical hidden-key spot checks
  console.log('== critical hidden-key checks ==');
  for (const c of CRITICAL) {
    const full = await viewByName(c.rt, c.view);
    if (!full) { fail('critical:' + c.view, 'view not found'); continue; }
    const res = (await call('resource_ListResources', { resourceTypeId: RT[c.rt].id, resourceViewId: full.resourceViewId, limit: 200, offset: 0 })).resources || [];
    const leaked = c.mustHide.filter(k => res.some(r => r.data && Object.prototype.hasOwnProperty.call(r.data, k)));
    if (leaked.length) fail('critical:' + c.view, 'exposed: ' + leaked.join(','));
    else pass('critical:' + c.view, c.mustHide.join(',') + ' hidden across ' + res.length + ' records');
  }

  // ── 3. write protection: hidden + read-only survive a view-scoped save ─────
  console.log('== write protection ==');
  const techView = await viewByName('patient', 'Pharmacy Tech — Patient');
  const victim = (await call('resource_ListResources', { resourceTypeId: RT.patient.id, limit: 1, offset: 0 })).resources[0];
  const before = (await call('resource_GetResource', { resourceTypeId: RT.patient.id, resourceId: victim.id })).resource.data;
  await call('resource_SaveResource', { resourceTypeId: RT.patient.id, id: victim.id, resourceViewId: techView.resourceViewId, data: { [ssnKey]: 'HACKED-123-45-6789', [fullKey]: 'Should Not Change' } });
  const after = (await call('resource_GetResource', { resourceTypeId: RT.patient.id, resourceId: victim.id })).resource.data;
  if (after[ssnKey] !== before[ssnKey]) fail('write:hidden', 'SSN was modified through Tech view!');
  else pass('write:hidden', 'SSN unchanged through Tech view');
  if (after[fullKey] !== before[fullKey]) fail('write:readonly', 'read-only full-name modified through Tech view!');
  else pass('write:readonly', 'read-only full-name unchanged');

  // ── 4. fail-closed: empty view exposes nothing ─────────────────────────────
  console.log('== fail-closed ==');
  let probe = await viewByName('patient', 'QA — fail-closed probe');
  if (!probe) {
    probe = (await call('admin_SaveResourceView', { resourceView: { resourceTypeId: RT.patient.id, name: 'QA — fail-closed probe', layout: 'one-column', params: { note: 'QA harness: intentionally no display_settings' } } })).resourceView;
  }
  const closed = (await call('resource_ListResources', { resourceTypeId: RT.patient.id, resourceViewId: probe.resourceViewId, limit: 5, offset: 0 })).resources || [];
  const leakedClosed = closed.some(r => Object.keys(r.data || {}).length > 0);
  if (leakedClosed) fail('fail-closed', 'misconfigured view exposed data');
  else pass('fail-closed', 'view without display_settings exposes zero attributes');

  // ── 5. cross-type rejection ────────────────────────────────────────────────
  console.log('== cross-type rejection ==');
  try {
    await call('resource_ListResources', { resourceTypeId: RT.prescription.id, resourceViewId: techView.resourceViewId, limit: 1, offset: 0 });
    fail('cross-type', 'patient view accepted on prescription list');
  } catch (e) { pass('cross-type', 'rejected as expected'); }

  // ── report ─────────────────────────────────────────────────────────────────
  const failures = results.filter(r => !r.ok);
  console.log('\n==== SUMMARY: ' + (results.length - failures.length) + '/' + results.length + ' checks passed ====');
  fs.writeFileSync(__dirname + '/qa-results.json', JSON.stringify({ ranAt: new Date().toISOString(), results }, null, 1));
  process.exit(failures.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(3); });
