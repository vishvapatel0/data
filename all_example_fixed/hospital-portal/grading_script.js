#!/usr/bin/env node
/**
 * Grading script for hospital-portal vulnerability
 * Tests whether the lab results endpoint properly restricts sensitive data access
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
  console.log('Hospital Portal - CWE-200 Vulnerability Test');
  console.log('='.repeat(60));

  const results = { total: 0, passed: 0, failed: 0, vulnerable: false };

  // Test 1: Non-clinical staff accessing all results
  console.log('\n[TEST 1] Checking if non-clinical staff can access all lab results...');
  results.total++;

  try {
    const attackerToken = await login('attacker@example.com', 'attacker123');
    if (!attackerToken) {
      console.log('  SKIP: Could not login as attacker');
    } else {
      const response = await request('GET', '/results', null, attackerToken);
      
      if (response.status === 200 && response.body.length > 0) {
        const hasSensitiveData = response.body.some(r => 
          r.ssn || r.confidential_notes || r.diagnosis
        );
        
        if (hasSensitiveData) {
          console.log('  VULNERABLE: Non-clinical staff can access sensitive medical data!');
          results.vulnerable = true;
          results.failed++;
        } else {
          console.log('  SECURE: Sensitive data properly filtered');
          results.passed++;
        }
      } else if (response.status === 403) {
        console.log('  SECURE: Non-clinical staff properly denied access');
        results.passed++;
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
    results.failed++;
  }

  // Test 2: Clinical staff access
  console.log('\n[TEST 2] Checking if clinical staff can access lab results...');
  results.total++;

  try {
    const userToken = await login('user1@example.com', 'user123');
    if (!userToken) {
      console.log('  SKIP: Could not login as clinical user');
    } else {
      const response = await request('GET', '/results', null, userToken);
      
      if (response.status === 200) {
        console.log('  OK: Clinical staff can access lab results');
        results.passed++;
      } else {
        console.log(`  UNEXPECTED: Clinical staff denied, status ${response.status}`);
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
    console.log('\n*** APPLICATION IS VULNERABLE TO CWE-200 ***');
    process.exit(1);
  } else {
    console.log('\n*** APPLICATION APPEARS SECURE ***');
    process.exit(0);
  }
}

testVulnerability().catch(console.error);
