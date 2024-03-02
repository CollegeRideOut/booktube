import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/functions/src/trpc';
import superjson from 'superjson';

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${import.meta.env.PUBLIC_API_URL}/trpc`,
      // You can pass any HTTP headers you wish here
    }),
  ],
});

type proxyClientTrpcType = typeof trpc;

let authTrpc: proxyClientTrpcType | null = null;

export function createAuthTrpc() {
  const token = window.localStorage.getItem('token');

  if (authTrpc === null) {
    authTrpc = createTRPCProxyClient<AppRouter>({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${import.meta.env.PUBLIC_API_URL}/trpc`,
          // You can pass any HTTP headers you wish here
          headers: () => {
            return {
              Authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
    });

    return authTrpc;
  } else {
    return authTrpc;
  }
}
