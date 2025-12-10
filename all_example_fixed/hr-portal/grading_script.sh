#!/bin/bash

# Grading script for HR Portal IDOR demonstration

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "============================================================"
echo "HR Portal IDOR Grading Script"
echo "============================================================"

# Wait for server
echo -e "\n[*] Waiting for server..."
for i in {1..30}; do
    if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
        echo "[OK] Server is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "[FAIL] Server not responding"
        exit 2
    fi
    sleep 1
done

# Login as attacker
echo -e "\n[*] Testing authentication..."
ATTACKER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "attacker@example.com", "password": "attacker123"}')

ATTACKER_TOKEN=$(echo "$ATTACKER_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ATTACKER_TOKEN" ]; then
    echo "[FAIL] Could not login as attacker"
    exit 2
fi
echo "[OK] Attacker logged in"

EXPLOITABLE=0

# Test IDOR - Employee Access
echo -e "\n[*] Testing IDOR - Employee Access..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/employees/1" \
    -H "Authorization: Bearer $ATTACKER_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" == "200" ]; then
    echo "[EXPLOITABLE] Attacker can access admin employee data"
    EXPLOITABLE=$((EXPLOITABLE + 1))
elif [ "$HTTP_CODE" == "403" ]; then
    echo "[PROTECTED] Employee access properly denied"
else
    echo "[UNKNOWN] HTTP code: $HTTP_CODE"
fi

# Test IDOR - Salary Access
echo -e "\n[*] Testing IDOR - Salary Access..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/employees/1/salary" \
    -H "Authorization: Bearer $ATTACKER_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" == "200" ]; then
    SALARY=$(echo "$BODY" | grep -o '"salary":[0-9]*' | cut -d':' -f2)
    echo "[EXPLOITABLE] Attacker can access admin salary: \$$SALARY"
    EXPLOITABLE=$((EXPLOITABLE + 1))
elif [ "$HTTP_CODE" == "403" ]; then
    echo "[PROTECTED] Salary access properly denied"
else
    echo "[UNKNOWN] HTTP code: $HTTP_CODE"
fi

# Results
echo -e "\n============================================================"
echo "GRADING RESULTS"
echo "============================================================"

if [ $EXPLOITABLE -eq 0 ]; then
    echo "[SECURE] Application is NOT exploitable"
    exit 0
else
    echo "[VULNERABLE] Application has $EXPLOITABLE exploitable endpoint(s)"
    exit 1
fi
