#!/bin/bash

###############################################################################
# Script de test de deployment
# Verifica que todo esté funcionando correctamente
#
# USO:
#   chmod +x test-deployment.sh
#   ./test-deployment.sh YOUR_IP_OR_DOMAIN
###############################################################################

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variable
HOST="${1:-localhost}"

echo "🧪 Testing deployment on $HOST..."
echo ""

# Test 1: Frontend responde
echo -n "📍 Testing frontend (HTTP)... "
if curl -s -o /dev/null -w "%{http_code}" "http://$HOST" | grep -q "200"; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    exit 1
fi

# Test 2: Assets estáticos
echo -n "📦 Testing static assets... "
if curl -s -o /dev/null -w "%{http_code}" "http://$HOST/main.js" | grep -q "200\|304"; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}⚠ WARNING: Assets may not be loading${NC}"
fi

# Test 3: API Health Check
echo -n "🔧 Testing API health endpoint... "
if curl -s "http://$HOST/health" | grep -q "ok\|healthy\|status"; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "   Backend may not be running"
    exit 1
fi

# Test 4: Backend versión endpoint
echo -n "📋 Testing API version endpoint... "
if curl -s -o /dev/null -w "%{http_code}" "http://$HOST/v1/" | grep -q "200\|404"; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

# Test 5: CORS headers
echo -n "🌐 Testing CORS configuration... "
CORS_HEADER=$(curl -s -I "http://$HOST" | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_HEADER" ]; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}⚠ INFO: CORS headers not detected (may be OK)${NC}"
fi

# Test 6: Response time
echo -n "⏱️  Testing response time... "
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' "http://$HOST")
if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓ OK (${RESPONSE_TIME}s)${NC}"
else
    echo -e "${YELLOW}⚠ SLOW (${RESPONSE_TIME}s)${NC}"
fi

# Test 7: SSL (si aplica)
if [[ "$HOST" != "localhost" && "$HOST" != "127.0.0.1" ]]; then
    echo -n "🔒 Testing HTTPS (if configured)... "
    if curl -s -o /dev/null -w "%{http_code}" "https://$HOST" 2>/dev/null | grep -q "200"; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${YELLOW}⚠ INFO: HTTPS not configured (optional)${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ All critical tests passed!${NC}"
echo ""
echo "📊 Summary:"
echo "  Frontend: ✓"
echo "  Backend API: ✓"
echo "  Response Time: ${RESPONSE_TIME}s"
echo ""
echo "🌐 Access your app at: http://$HOST"
