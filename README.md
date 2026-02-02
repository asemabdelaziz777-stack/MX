# MX

## n8n MCP Integration

This project is configured to use the n8n MCP (Model Context Protocol) server, which allows Claude Code to interact with n8n workflows.

### Setup

1. **Set environment variables** before starting Claude Code:

```bash
export N8N_API_URL="https://your-n8n-instance.com"
export N8N_API_KEY="your-n8n-api-key"
```

2. **Start Claude Code** in this directory - the `.mcp.json` configuration will be automatically detected.

3. **Verify the MCP server** is connected by running `/mcp` in Claude Code.

### Getting Your n8n API Key

1. Log into your n8n instance
2. Go to **Settings** > **API**
3. Create a new API key
4. Copy the key and use it as `N8N_API_KEY`

### Available Capabilities

With n8n MCP configured, Claude Code can:
- Browse n8n node documentation
- Understand node properties and operations
- Help build and debug workflows
- Access workflow automation features

### Configuration

The MCP configuration is stored in `.mcp.json`:

```json
{
  "mcpServers": {
    "n8n": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "N8N_API_URL": "${N8N_API_URL}",
        "N8N_API_KEY": "${N8N_API_KEY}"
      }
    }
  }
}
```

### Resources

- [n8n-mcp GitHub](https://github.com/czlonkowski/n8n-mcp)
- [n8n Documentation](https://docs.n8n.io/)
- [MCP Protocol](https://modelcontextprotocol.io/)
