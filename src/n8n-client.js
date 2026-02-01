/**
 * n8n API Client
 * A simple client for interacting with n8n's Public API
 */

require('dotenv').config();

class N8nClient {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || process.env.N8N_API_URL || 'https://n8n.srv1313889.hstgr.cloud/api/v1';
        this.apiKey = options.apiKey || process.env.N8N_API_KEY;

        if (!this.apiKey) {
            throw new Error('N8N_API_KEY is required');
        }
    }

    /**
     * Make an API request to n8n
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': this.apiKey,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`n8n API Error (${response.status}): ${error}`);
        }

        return response.json();
    }

    // ==================== Workflows ====================

    /**
     * Get all workflows
     */
    async getWorkflows() {
        return this.request('/workflows');
    }

    /**
     * Get a specific workflow by ID
     */
    async getWorkflow(workflowId) {
        return this.request(`/workflows/${workflowId}`);
    }

    /**
     * Create a new workflow
     */
    async createWorkflow(workflowData) {
        return this.request('/workflows', {
            method: 'POST',
            body: JSON.stringify(workflowData),
        });
    }

    /**
     * Update a workflow
     */
    async updateWorkflow(workflowId, workflowData) {
        return this.request(`/workflows/${workflowId}`, {
            method: 'PATCH',
            body: JSON.stringify(workflowData),
        });
    }

    /**
     * Delete a workflow
     */
    async deleteWorkflow(workflowId) {
        return this.request(`/workflows/${workflowId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Activate a workflow
     */
    async activateWorkflow(workflowId) {
        return this.request(`/workflows/${workflowId}/activate`, {
            method: 'POST',
        });
    }

    /**
     * Deactivate a workflow
     */
    async deactivateWorkflow(workflowId) {
        return this.request(`/workflows/${workflowId}/deactivate`, {
            method: 'POST',
        });
    }

    // ==================== Executions ====================

    /**
     * Get all executions
     */
    async getExecutions(options = {}) {
        const params = new URLSearchParams();
        if (options.workflowId) params.append('workflowId', options.workflowId);
        if (options.status) params.append('status', options.status);
        if (options.limit) params.append('limit', options.limit);

        const query = params.toString();
        return this.request(`/executions${query ? '?' + query : ''}`);
    }

    /**
     * Get a specific execution
     */
    async getExecution(executionId) {
        return this.request(`/executions/${executionId}`);
    }

    /**
     * Delete an execution
     */
    async deleteExecution(executionId) {
        return this.request(`/executions/${executionId}`, {
            method: 'DELETE',
        });
    }

    // ==================== Credentials ====================

    /**
     * Get all credentials (metadata only)
     */
    async getCredentials() {
        return this.request('/credentials');
    }

    // ==================== Utility Methods ====================

    /**
     * Test the connection to n8n
     */
    async testConnection() {
        try {
            const result = await this.getWorkflows();
            return {
                success: true,
                message: 'Connection successful',
                workflowCount: result.data ? result.data.length : 0,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    /**
     * Execute a workflow via webhook (if webhook trigger is set up)
     */
    async triggerWebhook(webhookPath, data = {}, options = {}) {
        const baseUrl = this.baseUrl.replace('/api/v1', '');
        const url = `${baseUrl}/webhook/${webhookPath}`;

        const response = await fetch(url, {
            method: options.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response.json();
    }
}

module.exports = N8nClient;

// If run directly, test the connection
if (require.main === module) {
    (async () => {
        console.log('Testing n8n connection...\n');

        try {
            const client = new N8nClient();
            const result = await client.testConnection();

            if (result.success) {
                console.log('[SUCCESS] Connected to n8n!');
                console.log(`[INFO] Found ${result.workflowCount} workflows`);

                // List workflows
                const workflows = await client.getWorkflows();
                if (workflows.data && workflows.data.length > 0) {
                    console.log('\nWorkflows:');
                    workflows.data.forEach((wf, i) => {
                        console.log(`  ${i + 1}. ${wf.name} (ID: ${wf.id}) - ${wf.active ? 'Active' : 'Inactive'}`);
                    });
                } else {
                    console.log('\nNo workflows found. Create your first workflow in n8n!');
                }
            } else {
                console.log('[ERROR] Connection failed:', result.message);
            }
        } catch (error) {
            console.error('[ERROR]', error.message);
        }
    })();
}
