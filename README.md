# MCP Server for Design System

This project includes an MCP (Model Context Protocol) server that provides information about component props and design tokens.

### MCP Server Features

The MCP server offers two main tools:
- `getComponentProps`: Retrieves information about component properties
- `getTokens`: Retrieves design token information from token files

### Debugging the MCP Server

To debug the MCP server:

1. Run the in-memory debug script:

```
$ deno task debug-mcp
```

This script:
- Creates an in-memory client-server connection
- Makes sample calls to retrieve component props and tokens
- Displays the results in the console

You can modify the debug script to test different components or specific token requests.

## Design Token Generation

Design tokens are stored as JSON files in the `src/design-system/tokens` directory:
- `color.json`: Color palette and theme colors
- `typography.json`: Font families, sizes, weights
- `spacing.json`: Spacing scale
- `radius.json`: Border radius values

### Token Generation Process

Tokens are processed using Style Dictionary with the following workflow:

1. Define token values in JSON files in the `tokens` directory
2. Style Dictionary processes these tokens according to the configuration in `src/design-system/style-dictionary/config.json`
3. Output formats include:
   - CSS variables (tokens.css)
   - JavaScript module (tokens.js)
   - TypeScript declarations (tokens.d.ts)

To generate tokens:

```
$ deno task build-tokens
```

The generated files are placed in the `src/design-system/style-dictionary/dist` directory and can be imported into your components.
