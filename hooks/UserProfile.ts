'use client';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useUser } from '../context/UserContext';
import { calculatePortfolioValue } from '@/lib/calculations';

export function usePortfolio() {
  const { user } = useUser();

  // Fetch market data (live prices) - refreshes every 1 minutes
  const { data: marketData, error: marketError, isLoading: marketLoading } = useSWR(
    '/api/market-data',
    fetcher,
    { 
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  // Fetch user's assets - refreshes every 1 minutes
  const { data: assetsData, error: assetsError, isLoading: assetsLoading } = useSWR(
    user ? `/api/assets?userId=${user.id}` : null,
    fetcher,
    { 
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  // Fetch user's accounts - refreshes every 10 min
  const { data: accountsData, error: accountsError, isLoading: accountsLoading } = useSWR(
    user ? `/api/accounts?userId=${user.id}` : null,
    fetcher,
    { 
      refreshInterval: 600000,
      revalidateOnFocus: false,
    }
  );

  // Fetch user's addresses - refreshes every 10 minutes
  const { data: addressesData, error: addressesError, isLoading: addressesLoading } = useSWR(
    user ? `/api/addresses?userId=${user.id}` : null,
    fetcher,
    { 
      refreshInterval: 600000,
      revalidateOnFocus: false,
    }
  );

  const isLoading = marketLoading || assetsLoading || accountsLoading || addressesLoading;
  const hasError = marketError || assetsError || accountsError || addressesError;

  // Manual refresh functions
  const refreshAssets = () => {
    if (user) {
      mutate(`/api/assets?userId=${user.id}`);
    }
  };

  const refreshAccounts = () => {
    if (user) {
      mutate(`/api/accounts?userId=${user.id}`);
    }
  };

  const refreshAddresses = () => {
    if (user) {
      mutate(`/api/addresses?userId=${user.id}`);
    }
  };

  const refreshAll = () => {
    mutate('/api/market-data');
    refreshAssets();
    refreshAccounts();
    refreshAddresses();
  };

  // Return partial data even if some APIs fail
  const assets = assetsData?.assets || [];
  const accounts = accountsData?.accounts || [];
  const addresses = addressesData?.addresses || [];
  const market = marketData?.data?.result || null;

  // Calculate portfolio if we have the minimum required data
  let portfolio = null;
  if (user && market && assets.length > 0) {
    try {
      portfolio = calculatePortfolioValue(assets, market);
    } catch (error) {
      console.error('Error calculating portfolio:', error);
    }
  }

  return {
    portfolio,
    assets,
    accounts,
    addresses,
    marketData: market,
    isLoading,
    error: hasError,
    errors: {
      marketError,
      assetsError,
      accountsError,
      addressesError,
    },
    source: marketData?.source,
    refreshAssets,
    refreshAccounts,
    refreshAddresses,
    refreshAll,
  };
}