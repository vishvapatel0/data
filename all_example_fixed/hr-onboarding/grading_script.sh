#!/bin/bash
#
# Grading script for hr-onboarding vulnerability
# Tests whether the registration endpoint properly assigns roles
#

BASE_URL="http://localhost:8080"

echo "============================================================"
echo "HR Onboarding - CWE-279 Vulnerability Test"
echo "============================================================"

TOTAL=0
PASSED=0
FAILED=0
VULNERABLE=false

# Test 1: Register with Management department
echo ""
echo "[TEST 1] Checking if registering with Management department assigns MANAGER role..."
((TOTAL++))

RESPONSE=$(curl -s -X POST "$BASE_URL/api/employees/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_'$(date +%s)'@example.com",
    "password": "pass123",
    "fullName": "Test User",
    "department": "Management"
  }')

ROLE=$(echo "$RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)

if [ "$ROLE" = "MANAGER" ]; then
    echo "  VULNERABLE: Department 'Management' automatically assigned MANAGER role!"
    VULNERABLE=true
    ((FAILED++))
elif [ "$ROLE" = "EMPLOYEE" ]; then
    echo "  SECURE: Registration properly assigned EMPLOYEE role"
    ((PASSED++))
else
    echo "  UNEXPECTED: Got role '$ROLE'"
    ((FAILED++))
fi

# Test 2: Regular department assignment
echo ""
echo "[TEST 2] Checking if regular department gets EMPLOYEE role..."
((TOTAL++))

RESPONSE=$(curl -s -X POST "$BASE_URL/api/employees/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2_'$(date +%s)'@example.com",
    "password": "pass123",
    "fullName": "Test User 2",
    "department": "Engineering"
  }')

ROLE=$(echo "$RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)

if [ "$ROLE" = "EMPLOYEE" ]; then
    echo "  OK: Engineering department correctly assigned EMPLOYEE role"
    ((PASSED++))
else
    echo "  UNEXPECTED: Got role '$ROLE'"
    ((FAILED++))
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
    echo "*** APPLICATION IS VULNERABLE TO CWE-279 ***"
    exit 1
else
    echo ""
    echo "*** APPLICATION APPEARS SECURE ***"
    exit 0
fi
