# MX

MX Project with n8n Integration.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your n8n credentials in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Test connection:
   ```bash
   npm run test:connection
   ```

## Project Structure

```
MX/
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment file
├── config/
│   └── n8n.config.json   # n8n configuration
├── scripts/
│   ├── test-connection.sh   # Bash test script
│   └── test-connection.js   # Node.js test script
└── src/
    └── n8n-client.js     # n8n API client
```

## Usage

```javascript
const N8nClient = require('./src/n8n-client');

const client = new N8nClient();

// Test connection
const result = await client.testConnection();

// Get workflows
const workflows = await client.getWorkflows();

// Trigger webhook
await client.triggerWebhook('webhook-path', { data: 'value' });
```

## Available Methods

| Method | Description |
|--------|-------------|
| `getWorkflows()` | Get all workflows |
| `getWorkflow(id)` | Get a specific workflow |
| `createWorkflow(data)` | Create a new workflow |
| `activateWorkflow(id)` | Activate a workflow |
| `deactivateWorkflow(id)` | Deactivate a workflow |
| `getExecutions()` | Get all executions |
| `triggerWebhook(path, data)` | Trigger a webhook |
