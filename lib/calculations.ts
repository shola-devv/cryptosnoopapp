type Asset = {
  name: string;
  quantity: number;
};

type CoinPrice = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange1d: number; // e.g. +2.3 means +2.3%
};

export function calculatePortfolioValue(
  assets: Asset[],
  liveCoins: CoinPrice[]
) {
  // Map for quick price lookup
  const priceMap = new Map(
    liveCoins.map((coin) => [coin.name.toLowerCase(), coin])
  );

  let totalValue = 0;
  let totalChangeValue = 0;

  const breakdown = assets.map((asset) => {
    const coin = priceMap.get(asset.name.toLowerCase());
    const price = coin?.price || 0;
    const changePercent = coin?.priceChange1d || 0;

    // Current value of this asset
    const value = asset.quantity * price;

    // Value change in 24h (based on percentage)
    const valueChange24h = value * (changePercent / 100);

    totalValue += value;
    totalChangeValue += valueChange24h;

    return {
      name: asset.name,
      quantity: asset.quantity,
      price,
      value,
      priceChange1d: changePercent,
      valueChange24h,
    };
  });

  // Calculate total 24h change percentage for portfolio
  const portfolioChangePercent =
    totalValue > 0 ? (totalChangeValue / totalValue) * 100 : 0;

  return {
    totalValue,
    totalChangeValue,
    portfolioChangePercent,
    breakdown,
    assetCount: assets.length,
  };
}
