# MX

## n8n MCP Integration

This project is configured to use the n8n MCP (Model Context Protocol) server, which allows Claude Code to interact with n8n workflows.

### Setup

1. **Start Claude Code** in this directory - the `.mcp.json` configuration will be automatically detected.

2. **Verify the MCP server** is connected by running `/mcp` in Claude Code.

### Available Capabilities

With n8n MCP configured, Claude Code can:
- Browse n8n node documentation
- Understand node properties and operations
- Help build and debug workflows
- Access workflow automation features

### Configuration

The MCP configuration is stored in `.mcp.json` and uses supergateway to connect to the n8n MCP server via streamable HTTP.

### Resources

- [n8n-mcp GitHub](https://github.com/czlonkowski/n8n-mcp)
- [n8n Documentation](https://docs.n8n.io/)
- [MCP Protocol](https://modelcontextprotocol.io/)
