/// <reference lib="deno.ns" />

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { Project } from 'ts-morph';
import {
  dirname,
  fromFileUrl,
  join,
  resolve,
} from 'https://deno.land/std@0.190.0/path/mod.ts';
import { exists } from 'https://deno.land/std@0.190.0/fs/exists.ts';

// Get current directory path
const __dirname = dirname(fromFileUrl(import.meta.url));
const projectRoot = resolve(__dirname, '../..');

// Create MCP server
export const server = new McpServer({
  name: 'DesignSystem',
  version: '1.0.0',
});

server.tool('getComponentProps', { name: z.string() }, async ({ name }) => {
  try {
    const project = new Project();

    const filePath = join(projectRoot, 'design-system/ui', `${name}.tsx`);

    if (!(await exists(filePath))) {
      return {
        content: [{ type: 'text', text: `Component ${name} not found` }],
        isError: true,
      };
    }

    const sourceFile = project.addSourceFileAtPath(filePath);

    const typeAlias = sourceFile
      .getInterfaces()
      .find((i) => i.getName()?.includes('Props'));

    if (!typeAlias) {
      return {
        content: [{ type: 'text', text: 'Props type not found' }],
        isError: true,
      };
    }

    const properties = typeAlias.getType()?.getProperties();

    if (!properties) {
      return {
        content: [{ type: 'text', text: 'No properties found in Props type' }],
        isError: true,
      };
    }

    const property = properties?.map((p) => {
      const name = p.getName();
      const type = p.getTypeAtLocation(sourceFile).getText();
      const description = p
        .getJsDocTags()
        .map((t) => {
          const name = t.getName();
          const text = t
            .getText()
            .map((t) => `${t.text} (kind:${t.kind})`)
            .join(', ');

          return `${name}: ${text}`;
        })
        .join('\n');

      return { name, type, description: description || undefined };
    });

    const result = {
      name,
      props: property,
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

// Tool for retrieving token information
server.tool('getTokens', async () => {
  try {
    const tokensDir = join(projectRoot, 'design-system/tokens');
    const filePaths: string[] = [];

    for await (const entry of Deno.readDir(tokensDir)) {
      if (entry.isFile && entry.name.endsWith('.json')) {
        const filePath = join(tokensDir, entry.name);
        if (await exists(filePath)) {
          filePaths.push(filePath);
        }
      }
    }

    const results = await Promise.all(
      filePaths.map(async (filePath) => {
        const contentText = await Deno.readTextFile(filePath);
        return JSON.parse(contentText);
      })
    );

    return {
      content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Send and receive messages via standard input/output
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('Design System MCP Server started');
