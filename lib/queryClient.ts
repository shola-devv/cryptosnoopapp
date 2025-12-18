'use client';
import { QueryClient } from '@tanstack/react-query';
// import persister from sync‑storage persister package
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // make cacheTime long so data stays available after reload
      cacheTime: 1000 * 60 * 60 * 24,
      staleTime: 0,  // adjust as needed
      refetchOnWindowFocus: false,
    },
  },
});

if (typeof window !== 'undefined') {
  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: 1000 * 60 * 60 * 24, // optional: 24h max age
  });
}
