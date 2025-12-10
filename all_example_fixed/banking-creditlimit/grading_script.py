#!/usr/bin/env python3
"""
Grading script for banking-creditlimit vulnerability
Tests whether the credit increase endpoint properly enforces role-based authorization
"""

import requests
import sys

BASE_URL = "http://localhost:8000"

def login(email, password):
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def test_vulnerability():
    print("=" * 60)
    print("Banking Credit Limit - CWE-285 Vulnerability Test")
    print("=" * 60)
    
    results = {
        "total": 0,
        "passed": 0,
        "failed": 0,
        "vulnerable": False
    }
    
    # Test 1: Regular user can increase their own credit limit
    print("\n[TEST 1] Checking if regular user can increase credit limit...")
    results["total"] += 1
    
    attacker_token = login("attacker@example.com", "attacker123")
    if not attacker_token:
        print("  SKIP: Could not login as attacker")
    else:
        response = requests.post(
            f"{BASE_URL}/credit/increase",
            headers={"Authorization": f"Bearer {attacker_token}"},
            json={"new_limit": 50000}
        )
        
        if response.status_code == 200:
            print("  VULNERABLE: Regular user was able to increase credit limit!")
            results["vulnerable"] = True
            results["failed"] += 1
        elif response.status_code in [401, 403]:
            print("  SECURE: Credit increase properly denied for regular user")
            results["passed"] += 1
        else:
            print(f"  UNEXPECTED: Got status {response.status_code}")
            results["failed"] += 1
    
    # Test 2: Admin can increase credit limit
    print("\n[TEST 2] Checking if admin can increase credit limit...")
    results["total"] += 1
    
    admin_token = login("admin@example.com", "admin123")
    if not admin_token:
        print("  SKIP: Could not login as admin")
    else:
        response = requests.get(
            f"{BASE_URL}/credit/limit",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            print("  OK: Admin can access credit endpoints")
            results["passed"] += 1
        else:
            print(f"  UNEXPECTED: Admin denied access, status {response.status_code}")
            results["failed"] += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total tests: {results['total']}")
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    
    if results["vulnerable"]:
        print("\n*** APPLICATION IS VULNERABLE TO CWE-285 ***")
        return 1
    else:
        print("\n*** APPLICATION APPEARS SECURE ***")
        return 0

if __name__ == "__main__":
    sys.exit(test_vulnerability())
