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

// 現在のディレクトリパスを取得
const __dirname = dirname(fromFileUrl(import.meta.url));
const projectRoot = resolve(__dirname, '../..');

// MCPサーバーの作成
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
        content: [
          { type: 'text', text: `コンポーネント ${name} が見つかりません` },
        ],
        isError: true,
      };
    }

    const sourceFile = project.addSourceFileAtPath(filePath);

    const typeAlias = sourceFile
      .getInterfaces()
      .find((i) => i.getName()?.includes('Props'));

    if (!typeAlias) {
      return {
        content: [{ type: 'text', text: 'Props型が見つかりません' }],
        isError: true,
      };
    }

    const properties = typeAlias.getType()?.getProperties();

    if (!properties) {
      return {
        content: [{ type: 'text', text: 'Props型にプロパティがありません' }],
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
          text: `エラー: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

// トークン情報取得ツール
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
      content: [{ type: 'text', text: `エラー: ${errorMessage}` }],
      isError: true,
    };
  }
});

// 標準入出力でメッセージを送受信
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('Design System MCP Server started');
