#!/bin/bash

# Grading script for Cloud Storage IDOR demonstration

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "============================================================"
echo "Cloud Storage IDOR Grading Script"
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
ATTACKER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "attacker@example.com", "password": "attacker123"}')

ATTACKER_TOKEN=$(echo "$ATTACKER_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ATTACKER_TOKEN" ]; then
    echo "[FAIL] Could not login as attacker"
    exit 2
fi
echo "[OK] Attacker logged in"

EXPLOITABLE=0

# Test IDOR - File Access
echo -e "\n[*] Testing IDOR - File Metadata Access..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/files/1" \
    -H "Authorization: Bearer $ATTACKER_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" == "200" ]; then
    echo "[EXPLOITABLE] Attacker can access admin's file metadata"
    EXPLOITABLE=$((EXPLOITABLE + 1))
elif [ "$HTTP_CODE" == "403" ]; then
    echo "[PROTECTED] File access properly denied"
else
    echo "[UNKNOWN] HTTP code: $HTTP_CODE"
fi

# Test IDOR - File Download
echo -e "\n[*] Testing IDOR - File Download..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/files/1/download" \
    -H "Authorization: Bearer $ATTACKER_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" == "200" ]; then
    echo "[EXPLOITABLE] Attacker can download admin's file content"
    echo "  Content preview: $(echo "$BODY" | head -c 100)..."
    EXPLOITABLE=$((EXPLOITABLE + 1))
elif [ "$HTTP_CODE" == "403" ]; then
    echo "[PROTECTED] File download properly denied"
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
