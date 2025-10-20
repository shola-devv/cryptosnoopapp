type Asset = {
  name: string;
  quantity: number;
};

type CoinPrice = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange1d: number;
};

export function calculatePortfolioValue(
  assets: Asset[],
  liveCoins: CoinPrice[]
) {
  // Create a map for quick price lookup
  const priceMap = new Map(
    liveCoins.map((coin) => [coin.name.toLowerCase(), coin.price])
  );

  let totalValue = 0;
  const breakdown = assets.map((asset) => {
    const price = priceMap.get(asset.name.toLowerCase()) || 0;
    const value = asset.quantity * price;
    totalValue += value;

    return {
      name: asset.name,
      quantity: asset.quantity,
      price,
      value,
    };
  });

  return {
    totalValue,
    breakdown,
    assetCount: assets.length,
  };
}