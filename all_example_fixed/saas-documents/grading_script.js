#!/usr/bin/env node
/**
 * Grading script for saas-documents vulnerability
 * Tests whether tenant isolation is properly implemented
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function login(email, password) {
  const response = await request('POST', '/auth/login', { email, password });
  return response.status === 200 ? response.body.access_token : null;
}

async function testVulnerability() {
  console.log('='.repeat(60));
  console.log('SaaS Documents - CWE-863 Vulnerability Test');
  console.log('='.repeat(60));

  const results = { total: 0, passed: 0, failed: 0, vulnerable: false };

  // Test 1: Cross-tenant document access
  console.log('\n[TEST 1] Checking if tenant-002 user can access tenant-001 document...');
  results.total++;

  try {
    const attackerToken = await login('attacker@example.com', 'attacker123');
    if (!attackerToken) {
      console.log('  SKIP: Could not login as attacker');
    } else {
      // Document 1 belongs to tenant-001
      const response = await request('GET', '/documents/1', null, attackerToken);
      
      if (response.status === 200 && response.body.tenantId === 'tenant-001') {
        console.log('  VULNERABLE: Cross-tenant document access allowed!');
        console.log(`    Attacker (tenant-002) accessed document from tenant-001`);
        results.vulnerable = true;
        results.failed++;
      } else if (response.status === 403) {
        console.log('  SECURE: Cross-tenant access properly denied');
        results.passed++;
      } else {
        console.log(`  UNEXPECTED: Got status ${response.status}`);
        results.failed++;
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
    results.failed++;
  }

  // Test 2: Same-tenant document access
  console.log('\n[TEST 2] Checking if tenant-001 user can access own tenant document...');
  results.total++;

  try {
    const userToken = await login('user1@example.com', 'user123');
    if (!userToken) {
      console.log('  SKIP: Could not login as user1');
    } else {
      const response = await request('GET', '/documents/1', null, userToken);
      
      if (response.status === 200) {
        console.log('  OK: Same-tenant document access works');
        results.passed++;
      } else {
        console.log(`  UNEXPECTED: Same-tenant access denied, status ${response.status}`);
        results.failed++;
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
    results.failed++;
  }

  // Test 3: Cross-tenant document deletion
  console.log('\n[TEST 3] Checking if tenant-002 user can delete tenant-001 document...');
  results.total++;

  try {
    const attackerToken = await login('attacker@example.com', 'attacker123');
    if (!attackerToken) {
      console.log('  SKIP: Could not login as attacker');
    } else {
      const response = await request('DELETE', '/documents/2', null, attackerToken);
      
      if (response.status === 200) {
        console.log('  VULNERABLE: Cross-tenant document deletion allowed!');
        results.vulnerable = true;
        results.failed++;
      } else if (response.status === 403) {
        console.log('  SECURE: Cross-tenant deletion properly denied');
        results.passed++;
      } else {
        console.log(`  UNEXPECTED: Got status ${response.status}`);
        results.failed++;
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
    results.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);

  if (results.vulnerable) {
    console.log('\n*** APPLICATION IS VULNERABLE TO CWE-863 ***');
    process.exit(1);
  } else {
    console.log('\n*** APPLICATION APPEARS SECURE ***');
    process.exit(0);
  }
}

testVulnerability().catch(console.error);
