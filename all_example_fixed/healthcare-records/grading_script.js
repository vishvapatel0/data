#!/usr/bin/env node
/**
 * Grading script for Healthcare Records IDOR demonstration.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await makeRequest('GET', '/health');
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

async function login(email, password) {
  const result = await makeRequest('POST', '/auth/login', { email, password });
  return result.status === 200 ? result.data.access_token : null;
}

async function runGrading() {
  console.log('='.repeat(60));
  console.log('Healthcare Records IDOR Grading Script');
  console.log('='.repeat(60));
  
  console.log('\n[*] Waiting for server...');
  if (!await waitForServer()) {
    console.log('[FAIL] Server not responding');
    return false;
  }
  console.log('[OK] Server is ready');
  
  console.log('\n[*] Testing authentication...');
  const attackerToken = await login('attacker@example.com', 'attacker123');
  if (!attackerToken) {
    console.log('[FAIL] Could not login as attacker');
    return false;
  }
  console.log('[OK] Attacker logged in');
  
  const results = {
    record_access: false,
    record_update: false,
    record_delete: false,
  };
  
  console.log('\n[*] Testing IDOR - Record Access...');
  let result = await makeRequest('GET', '/records/1', null, attackerToken);
  if (result.status === 200) {
    console.log(`[EXPLOITABLE] Attacker can access patient record (diagnosis: ${result.data.diagnosis})`);
    results.record_access = true;
  } else if (result.status === 403) {
    console.log('[PROTECTED] Record access properly denied');
  }
  
  console.log('\n[*] Testing IDOR - Record Update...');
  result = await makeRequest('PUT', '/records/1', { notes: 'Tampered' }, attackerToken);
  if (result.status === 200) {
    console.log('[EXPLOITABLE] Attacker can modify patient record!');
    results.record_update = true;
  } else if (result.status === 403) {
    console.log('[PROTECTED] Record update properly denied');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('GRADING RESULTS');
  console.log('='.repeat(60));
  
  const exploitableCount = Object.values(results).filter(v => v).length;
  
  if (exploitableCount === 0) {
    console.log('[SECURE] Application is NOT exploitable');
    return true;
  } else {
    console.log(`[VULNERABLE] Application has ${exploitableCount} exploitable endpoint(s)`);
    for (const [name, isExploitable] of Object.entries(results)) {
      console.log(`  - ${name}: ${isExploitable ? 'EXPLOITABLE' : 'PROTECTED'}`);
    }
    return false;
  }
}

runGrading()
  .then(secure => process.exit(secure ? 0 : 1))
  .catch(err => {
    console.error('[ERROR]', err.message);
    process.exit(2);
  });
