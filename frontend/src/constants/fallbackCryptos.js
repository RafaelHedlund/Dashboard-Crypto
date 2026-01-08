export const FALLBACK_CRYPTOS = [
  {
    id: 'bitcoin', name: 'Bitcoin', symbol: 'btc',
    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 45000, market_cap: 880000000000, price_change_percentage_24h: 2.5,
    sparkline_in_7d: { price: Array(168).fill(45000).map((v, i) => v + Math.sin(i/10)*1000) }
  },
  {
    id: 'ethereum', name: 'Ethereum', symbol: 'eth',
    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2400, market_cap: 288000000000, price_change_percentage_24h: 1.8,
    sparkline_in_7d: { price: Array(168).fill(2400).map((v, i) => v + Math.sin(i/10)*100) }
  },
  {
    id: 'tether', name: 'Tether', symbol: 'usdt',
    image: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png',
    current_price: 1.00, market_cap: 83000000000, price_change_percentage_24h: 0.01,
    sparkline_in_7d: { price: Array(168).fill(1.00) }
  },
  {
    id: 'binancecoin', name: 'BNB', symbol: 'bnb',
    image: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 310, market_cap: 48000000000, price_change_percentage_24h: 0.5,
    sparkline_in_7d: { price: Array(168).fill(310).map((v, i) => v + Math.sin(i/10)*10) }
  },
  {
    id: 'solana', name: 'Solana', symbol: 'sol',
    image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 100, market_cap: 42000000000, price_change_percentage_24h: 5.2,
    sparkline_in_7d: { price: Array(168).fill(100).map((v, i) => v + Math.sin(i/10)*5) }
  },
  {
    id: 'ripple', name: 'XRP', symbol: 'xrp',
    image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp.png',
    current_price: 0.62, market_cap: 33000000000, price_change_percentage_24h: 1.2,
    sparkline_in_7d: { price: Array(168).fill(0.62).map((v, i) => v + Math.sin(i/10)*0.1) }
  },
  {
    id: 'usd-coin', name: 'USD Coin', symbol: 'usdc',
    image: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png',
    current_price: 1.00, market_cap: 25000000000, price_change_percentage_24h: 0.02,
    sparkline_in_7d: { price: Array(168).fill(1.00) }
  },
  {
    id: 'cardano', name: 'Cardano', symbol: 'ada',
    image: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.48, market_cap: 17000000000, price_change_percentage_24h: 0.8,
    sparkline_in_7d: { price: Array(168).fill(0.48).map((v, i) => v + Math.sin(i/10)*0.05) }
  },
  {
    id: 'dogecoin', name: 'Dogecoin', symbol: 'doge',
    image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.08, market_cap: 11000000000, price_change_percentage_24h: 2.1,
    sparkline_in_7d: { price: Array(168).fill(0.08).map((v, i) => v + Math.sin(i/10)*0.01) }
  },
  {
    id: 'tron', name: 'TRON', symbol: 'trx',
    image: 'https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png',
    current_price: 0.11, market_cap: 9700000000, price_change_percentage_24h: 0.3,
    sparkline_in_7d: { price: Array(168).fill(0.11).map((v, i) => v + Math.sin(i/10)*0.02) }
  },
  {
    id: 'chainlink', name: 'Chainlink', symbol: 'link',
    image: 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 14.50, market_cap: 8500000000, price_change_percentage_24h: 1.5,
    sparkline_in_7d: { price: Array(168).fill(14.50).map((v, i) => v + Math.sin(i/10)*1) }
  },
  {
    id: 'polkadot', name: 'Polkadot', symbol: 'dot',
    image: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 6.80, market_cap: 8700000000, price_change_percentage_24h: 0.9,
    sparkline_in_7d: { price: Array(168).fill(6.80).map((v, i) => v + Math.sin(i/10)*0.5) }
  },
  {
    id: 'matic-network', name: 'Polygon', symbol: 'matic',
    image: 'https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    current_price: 0.85, market_cap: 7900000000, price_change_percentage_24h: 1.3,
    sparkline_in_7d: { price: Array(168).fill(0.85).map((v, i) => v + Math.sin(i/10)*0.1) }
  },
  {
    id: 'shiba-inu', name: 'Shiba Inu', symbol: 'shib',
    image: 'https://coin-images.coingecko.com/coins/images/11939/large/shiba.png',
    current_price: 0.000008, market_cap: 4700000000, price_change_percentage_24h: 0.7,
    sparkline_in_7d: { price: Array(168).fill(0.000008).map((v, i) => v + Math.sin(i/10)*0.000001) }
  },
  {
    id: 'litecoin', name: 'Litecoin', symbol: 'ltc',
    image: 'https://coin-images.coingecko.com/coins/images/2/large/litecoin.png',
    current_price: 71, market_cap: 5200000000, price_change_percentage_24h: 0.4,
    sparkline_in_7d: { price: Array(168).fill(71).map((v, i) => v + Math.sin(i/10)*2) }
  },
  {
    id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'bch',
    image: 'https://coin-images.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
    current_price: 240, market_cap: 4700000000, price_change_percentage_24h: 1.1,
    sparkline_in_7d: { price: Array(168).fill(240).map((v, i) => v + Math.sin(i/10)*5) }
  },
  {
    id: 'avalanche-2', name: 'Avalanche', symbol: 'avax',
    image: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 36, market_cap: 13000000000, price_change_percentage_24h: 2.3,
    sparkline_in_7d: { price: Array(168).fill(36).map((v, i) => v + Math.sin(i/10)*2) }
  },
  {
    id: 'dai', name: 'Dai', symbol: 'dai',
    image: 'https://coin-images.coingecko.com/coins/images/9956/large/Badge_Dai.png',
    current_price: 1.00, market_cap: 5300000000, price_change_percentage_24h: 0.01,
    sparkline_in_7d: { price: Array(168).fill(1.00) }
  },
  {
    id: 'leo-token', name: 'UNUS SED LEO', symbol: 'leo',
    image: 'https://coin-images.coingecko.com/coins/images/8418/large/leo-token.png',
    current_price: 4.10, market_cap: 3800000000, price_change_percentage_24h: 0.2,
    sparkline_in_7d: { price: Array(168).fill(4.10).map((v, i) => v + Math.sin(i/10)*0.2) }
  },
  {
    id: 'uniswap', name: 'Uniswap', symbol: 'uni',
    image: 'https://coin-images.coingecko.com/coins/images/12504/large/uniswap.png',
    current_price: 6.20, market_cap: 4700000000, price_change_percentage_24h: 0.8,
    sparkline_in_7d: { price: Array(168).fill(6.20).map((v, i) => v + Math.sin(i/10)*0.3) }
  }
];

export const API_BASE_URL = 'https://dashboard-crypto-1.onrender.com';