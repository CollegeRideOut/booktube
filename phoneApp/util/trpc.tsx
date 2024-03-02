import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

import type { AppRouter } from '../../packages/functions/src/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();

export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`,
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}

export function AuthTRPCProvider(props: {
  children: React.ReactNode;
  token: string;
}) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`,

          headers() {
            return {
              authorization: `Bearer ${props.token}`,
            };
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
