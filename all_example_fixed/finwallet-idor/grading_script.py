#!/usr/bin/env python3
"""
Grading script for FinWallet IDOR demonstration.
Tests whether the application is exploitable.
"""

import requests
import sys
import time

BASE_URL = "http://localhost:8000"


def wait_for_server(max_attempts=30):
    """Wait for the server to be ready."""
    for i in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
    return False


def login(email: str, password: str) -> str:
    """Login and return access token."""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password},
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None


def test_idor_wallet_access(token: str, wallet_id: int) -> dict:
    """Attempt to access a wallet."""
    response = requests.get(
        f"{BASE_URL}/wallets/{wallet_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    return {"status_code": response.status_code, "data": response.json() if response.status_code == 200 else None}


def test_idor_transactions(token: str, wallet_id: int) -> dict:
    """Attempt to access wallet transactions."""
    response = requests.get(
        f"{BASE_URL}/wallets/{wallet_id}/transactions",
        headers={"Authorization": f"Bearer {token}"},
    )
    return {"status_code": response.status_code, "data": response.json() if response.status_code == 200 else None}


def test_idor_transfer(token: str, source_wallet: int, target_wallet: int, amount: float) -> dict:
    """Attempt to transfer funds from a wallet."""
    response = requests.post(
        f"{BASE_URL}/wallets/{source_wallet}/transfer",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "recipient_wallet_id": target_wallet,
            "amount": amount,
            "description": "Test transfer",
        },
    )
    return {"status_code": response.status_code, "data": response.json() if response.status_code in [200, 201] else None}


def run_grading():
    """Run the grading tests."""
    print("=" * 60)
    print("FinWallet IDOR Grading Script")
    print("=" * 60)
    
    print("\n[*] Waiting for server to be ready...")
    if not wait_for_server():
        print("[FAIL] Server not responding")
        return False
    print("[OK] Server is ready")
    
    print("\n[*] Testing authentication...")
    attacker_token = login("attacker@example.com", "attacker123")
    if not attacker_token:
        print("[FAIL] Could not login as attacker")
        return False
    print("[OK] Attacker logged in successfully")
    
    user1_token = login("user1@example.com", "user123")
    if not user1_token:
        print("[FAIL] Could not login as user1")
        return False
    print("[OK] User1 logged in successfully")
    
    results = {
        "wallet_access": False,
        "transaction_access": False,
        "transfer_exploit": False,
    }
    
    print("\n[*] Testing IDOR - Wallet Access...")
    result = test_idor_wallet_access(attacker_token, 1)
    if result["status_code"] == 200:
        print(f"[EXPLOITABLE] Attacker can access admin wallet (balance: ${result['data']['balance']})")
        results["wallet_access"] = True
    elif result["status_code"] == 403:
        print("[PROTECTED] Wallet access properly denied")
    else:
        print(f"[UNKNOWN] Unexpected status code: {result['status_code']}")
    
    print("\n[*] Testing IDOR - Transaction Access...")
    result = test_idor_transactions(attacker_token, 1)
    if result["status_code"] == 200:
        print(f"[EXPLOITABLE] Attacker can view admin transactions ({len(result['data'])} records)")
        results["transaction_access"] = True
    elif result["status_code"] == 403:
        print("[PROTECTED] Transaction access properly denied")
    else:
        print(f"[UNKNOWN] Unexpected status code: {result['status_code']}")
    
    print("\n[*] Testing IDOR - Unauthorized Transfer...")
    result = test_idor_transfer(attacker_token, 1, 3, 100.0)
    if result["status_code"] in [200, 201]:
        print("[EXPLOITABLE] Attacker can transfer from admin wallet!")
        results["transfer_exploit"] = True
    elif result["status_code"] == 403:
        print("[PROTECTED] Transfer properly denied")
    else:
        print(f"[UNKNOWN] Unexpected status code: {result['status_code']}")
    
    print("\n" + "=" * 60)
    print("GRADING RESULTS")
    print("=" * 60)
    
    exploitable_count = sum(results.values())
    
    if exploitable_count == 0:
        print("[SECURE] Application is NOT exploitable")
        print("All IDOR attack vectors are properly protected")
        return True
    else:
        print(f"[VULNERABLE] Application has {exploitable_count} exploitable endpoint(s)")
        for name, is_exploitable in results.items():
            status = "EXPLOITABLE" if is_exploitable else "PROTECTED"
            print(f"  - {name}: {status}")
        return False


if __name__ == "__main__":
    try:
        is_secure = run_grading()
        sys.exit(0 if is_secure else 1)
    except Exception as e:
        print(f"[ERROR] Grading failed: {e}")
        sys.exit(2)
