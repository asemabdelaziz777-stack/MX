/**
 * n8n Connection Test Script (Node.js)
 * Tests the connection to your n8n MCP server
 */

require('dotenv').config();

const https = require('https');
const http = require('http');
const url = require('url');

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

console.log('================================');
console.log('   n8n Connection Test (Node.js)');
console.log('================================\n');

if (!N8N_API_URL || !N8N_API_KEY) {
    console.error('[ERROR] Missing environment variables');
    console.error('Please ensure N8N_API_URL and N8N_API_KEY are set in .env file');
    process.exit(1);
}

console.log(`[INFO] Testing connection to: ${N8N_API_URL}\n`);

const parsedUrl = url.parse(N8N_API_URL);
const isHttps = parsedUrl.protocol === 'https:';
const httpModule = isHttps ? https : http;

const requestData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'initialize',
    id: 1,
    params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'MX-Client',
            version: '1.0.0'
        }
    }
});

const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (isHttps ? 443 : 80),
    path: parsedUrl.path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'Authorization': `Bearer ${N8N_API_KEY}`
    },
    timeout: 30000
};

const req = httpModule.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`[INFO] HTTP Status Code: ${res.statusCode}\n`);

        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('[SUCCESS] Connection to n8n established successfully!\n');
            try {
                const jsonResponse = JSON.parse(data);
                console.log('Response:');
                console.log(JSON.stringify(jsonResponse, null, 2));
            } catch (e) {
                console.log('Response:', data.substring(0, 500));
            }
        } else {
            console.log('[ERROR] Failed to connect to n8n\n');
            console.log('Response:', data);
        }
        console.log('\n================================');
    });
});

req.on('error', (error) => {
    console.error(`[ERROR] Connection failed: ${error.message}`);
    console.log('\n================================');
    process.exit(1);
});

req.on('timeout', () => {
    console.error('[ERROR] Connection timeout');
    req.destroy();
    process.exit(1);
});

req.write(requestData);
req.end();
