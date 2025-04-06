import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { server } from './server.ts';

// Create client
const client = new Client(
  {
    name: 'design-system-client',
    version: '1.0',
  },
  {
    capabilities: {},
  }
);

// Create transport
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

// Connect server and client
async function main() {
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);

  // Get component Props information
  const getComponentPropsResult = await client.callTool({
    name: 'getComponentProps',
    arguments: {
      name: 'Button',
    },
  });

  const getTokensResult = await client.callTool({
    name: 'getTokens',
  });

  console.log('getComponentProps result:', getComponentPropsResult);
  console.log('getTokens result:', getTokensResult);

  Deno.exit(0);
}

main().catch((error) => {
  console.error('An error occurred:', error);
  Deno.exit(1);
});
