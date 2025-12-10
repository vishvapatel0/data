#!/bin/bash
#
# Grading script for food-delivery vulnerability
# Tests whether order cancellation checks ownership
#

BASE_URL="http://localhost:8000"

echo "============================================================"
echo "Food Delivery - CWE-862 Vulnerability Test"
echo "============================================================"

TOTAL=0
PASSED=0
FAILED=0
VULNERABLE=false

# Test 1: Cancel another user's order
echo ""
echo "[TEST 1] Checking if attacker can cancel another user's order..."
((TOTAL++))

TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "attacker@example.com", "password": "attacker123"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "  SKIP: Could not login as attacker"
else
    # Order 1 belongs to user1, not attacker
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/orders/1/cancel" \
      -H "Authorization: Bearer $TOKEN")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "  VULNERABLE: Attacker was able to cancel another user's order!"
        VULNERABLE=true
        ((FAILED++))
    elif [ "$HTTP_CODE" = "403" ]; then
        echo "  SECURE: Order cancellation properly denied for non-owner"
        ((PASSED++))
    else
        echo "  UNEXPECTED: Got HTTP $HTTP_CODE"
        ((FAILED++))
    fi
fi

# Test 2: Cancel own order
echo ""
echo "[TEST 2] Checking if user can cancel their own order..."
((TOTAL++))

TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "  SKIP: Could not login as user1"
else
    # Order 1 belongs to user1
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/orders/1/cancel" \
      -H "Authorization: Bearer $TOKEN")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "  OK: User can cancel their own order"
        ((PASSED++))
    else
        echo "  UNEXPECTED: User denied cancelling own order, HTTP $HTTP_CODE"
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
    echo "*** APPLICATION IS VULNERABLE TO CWE-862 ***"
    exit 1
else
    echo ""
    echo "*** APPLICATION APPEARS SECURE ***"
    exit 0
fi
