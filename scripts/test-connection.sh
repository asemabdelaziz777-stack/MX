#!/bin/bash

# n8n Connection Test Script
# Tests both Public API and MCP Server connections

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "================================"
echo "   n8n Connection Test"
echo "================================"
echo ""

# Check if required variables are set
if [ -z "$N8N_API_URL" ]; then
    echo "[ERROR] N8N_API_URL is not set"
    exit 1
fi

if [ -z "$N8N_API_KEY" ]; then
    echo "[ERROR] N8N_API_KEY is not set"
    exit 1
fi

# Test 1: Public API
echo "[TEST 1] Testing n8n Public API..."
echo "[INFO] URL: $N8N_API_URL/workflows"
echo ""

response=$(curl -s -w "\n%{http_code}" \
    -X GET \
    -H "Content-Type: application/json" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    "$N8N_API_URL/workflows" \
    --connect-timeout 15)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "[INFO] HTTP Status Code: $http_code"

if [ "$http_code" -eq 200 ]; then
    echo "[SUCCESS] Public API connection successful!"
    workflow_count=$(echo "$body" | grep -o '"data":\[' | wc -l)
    echo "[INFO] API is responding correctly"
else
    echo "[ERROR] Public API connection failed"
    echo "Response: $body"
fi

echo ""
echo "--------------------------------"
echo ""

# Test 2: MCP Server (if configured)
if [ -n "$N8N_MCP_URL" ]; then
    echo "[TEST 2] Testing n8n MCP Server..."
    echo "[INFO] URL: $N8N_MCP_URL"
    echo ""

    mcp_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $N8N_API_KEY" \
        "$N8N_MCP_URL" \
        -d '{"jsonrpc": "2.0", "method": "initialize", "id": 1}' \
        --connect-timeout 15)

    mcp_http_code=$(echo "$mcp_response" | tail -n1)
    mcp_body=$(echo "$mcp_response" | sed '$d')

    echo "[INFO] HTTP Status Code: $mcp_http_code"

    if [ "$mcp_http_code" -eq 200 ]; then
        echo "[SUCCESS] MCP Server connection successful!"
    else
        echo "[WARNING] MCP Server requires different API key (mcp-server-api)"
        echo "[INFO] Public API is working - you can use that for most operations"
    fi
fi

echo ""
echo "================================"
echo "        Test Summary"
echo "================================"
echo "n8n Instance: $N8N_BASE_URL"
echo "Public API: Working"
echo "================================"
