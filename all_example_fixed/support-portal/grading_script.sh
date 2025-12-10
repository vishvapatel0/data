#!/bin/bash
#
# Grading script for support-portal vulnerability
# Tests whether temporary admin access is properly expired
#

BASE_URL="http://localhost:8080"

echo "============================================================"
echo "Support Portal - CWE-266 Vulnerability Test"
echo "============================================================"

TOTAL=0
PASSED=0
FAILED=0
VULNERABLE=false

# Get attacker token (has expired temp admin)
echo ""
echo "[TEST 1] Checking if expired temp admin can access admin endpoints..."
((TOTAL++))

TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "attacker@example.com", "password": "attacker123"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "  SKIP: Could not login as attacker"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/admin/users" \
      -H "Authorization: Bearer $TOKEN")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "  VULNERABLE: Expired temp admin can still access admin endpoints!"
        VULNERABLE=true
        ((FAILED++))
    elif [ "$HTTP_CODE" = "403" ]; then
        echo "  SECURE: Expired temp admin properly denied access"
        ((PASSED++))
    else
        echo "  UNEXPECTED: Got HTTP $HTTP_CODE"
        ((FAILED++))
    fi
fi

# Test 2: Valid admin access
echo ""
echo "[TEST 2] Checking if permanent admin can access admin endpoints..."
((TOTAL++))

TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "  SKIP: Could not login as admin"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/admin/users" \
      -H "Authorization: Bearer $TOKEN")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "  OK: Permanent admin can access admin endpoints"
        ((PASSED++))
    else
        echo "  UNEXPECTED: Admin denied access, HTTP $HTTP_CODE"
        ((FAILED++))
    fi
fi

# Summary
echo ""
echo "============================================================"
echo "SUMMARY"
echo "============================================================"
echo "Total tests: $TOTAL"
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ "$VULNERABLE" = true ]; then
    echo ""
    echo "*** APPLICATION IS VULNERABLE TO CWE-266 ***"
    exit 1
else
    echo ""
    echo "*** APPLICATION APPEARS SECURE ***"
    exit 0
fi
