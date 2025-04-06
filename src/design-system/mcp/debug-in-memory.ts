import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { server } from './server.ts';

// クライアントを作成
const client = new Client(
  {
    name: 'design-system-client',
    version: '1.0',
  },
  {
    capabilities: {},
  }
);

// トランスポートを作成
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

// サーバーとクライアントを接続
async function main() {
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);

  // コンポーネントのProps情報を取得
  const getComponentPropsResult = await client.callTool({
    name: 'getComponentProps',
    arguments: {
      name: 'Button',
    },
  });

  const getTokensResult = await client.callTool({
    name: 'getTokens',
  });

  console.log('getComponentPropsの結果:', getComponentPropsResult);
  console.log('getTokensの結果:', getTokensResult);

  Deno.exit(0);
}

main().catch((error) => {
  console.error('エラーが発生しました:', error);
  Deno.exit(1);
});
