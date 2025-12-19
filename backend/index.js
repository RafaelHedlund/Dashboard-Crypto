'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ================= CACHE =================
const cache = {
  crypto: { data: null, time: 0 },
  coinDetails: {},
};

const CACHE_TIME = 5 * 60 * 1000;

// ================= LISTAGEM =================
app.get('/api/crypto', async (req, res) => {
  try {
    const now = Date.now();
    const { vs_currency = 'usd' } = req.query;

    if (cache.crypto.data && now - cache.crypto.time < CACHE_TIME) {
      return res.json(cache.crypto.data);
    }

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency,
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h'
        },
      }
    );

    const coins = response.data.map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      image: c.image,
      current_price: c.current_price,
      market_cap: c.market_cap,
      price_change_percentage_24h: c.price_change_percentage_24h,
      sparkline_in_7d: c.sparkline_in_7d
    }));

    cache.crypto = { data: coins, time: now };
    res.json(coins);
  } catch (e) {
    console.error('Error fetching crypto list:', e.message);
    res.status(500).json({ error: 'Erro ao buscar criptos' });
  }
});

// ================= DETALHES DA MOEDA (CORRIGIDO) =================
app.get('/api/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = Date.now();

    // Verifica cache
    if (cache.coinDetails[id] && now - cache.coinDetails[id].time < CACHE_TIME) {
      console.log(`Cache hit for ${id}`);
      return res.json(cache.coinDetails[id].data);
    }

    console.log(`Fetching data for ${id} from CoinGecko...`);
    
    // Faz a requisição para a API do CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        },
        timeout: 10000 // timeout de 10 segundos
      }
    );

    const coinData = response.data;

    // Estrutura os dados no formato esperado pelo frontend
    const formattedData = {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol.toUpperCase(),
      image: coinData.image?.large || coinData.image?.small || coinData.image?.thumb || '',
      market_cap_rank: coinData.market_cap_rank,
      market_data: {
        current_price: coinData.market_data?.current_price || { usd: 0, brl: 0, eur: 0 },
        market_cap: coinData.market_data?.market_cap || { usd: 0, brl: 0, eur: 0 },
        total_volume: coinData.market_data?.total_volume || { usd: 0, brl: 0, eur: 0 },
        fully_diluted_valuation: coinData.market_data?.fully_diluted_valuation || { usd: 0, brl: 0, eur: 0 },
        circulating_supply: coinData.market_data?.circulating_supply || 0,
        total_supply: coinData.market_data?.total_supply || 0,
        max_supply: coinData.market_data?.max_supply || 0,
        price_change_percentage_24h: coinData.market_data?.price_change_percentage_24h || 0,
        price_change_percentage_1h_in_currency: coinData.market_data?.price_change_percentage_1h_in_currency || { usd: 0, brl: 0, eur: 0 },
        price_change_percentage_24h_in_currency: coinData.market_data?.price_change_percentage_24h_in_currency || { usd: 0, brl: 0, eur: 0 },
        price_change_percentage_7d_in_currency: coinData.market_data?.price_change_percentage_7d_in_currency || { usd: 0, brl: 0, eur: 0 },
        price_change_percentage_30d_in_currency: coinData.market_data?.price_change_percentage_30d_in_currency || { usd: 0, brl: 0, eur: 0 },
        market_cap_change_percentage_24h: coinData.market_data?.market_cap_change_percentage_24h || 0
      }
    };

    // Salva no cache
    cache.coinDetails[id] = { data: formattedData, time: now };
    
    console.log(`Data for ${id} fetched successfully`);
    res.json(formattedData);
    
  } catch (error) {
    console.error(`Error fetching details for ${req.params.id}:`, error.message);
    
    // Dados de fallback para testes
    const fallbackData = {
      id: req.params.id,
      name: req.params.id.charAt(0).toUpperCase() + req.params.id.slice(1),
      symbol: req.params.id.slice(0, 3).toUpperCase(),
      image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      market_cap_rank: 1,
      market_data: {
        current_price: { usd: 50000, brl: 250000, eur: 45000 },
        market_cap: { usd: 1000000000000, brl: 5000000000000, eur: 900000000000 },
        total_volume: { usd: 30000000000, brl: 150000000000, eur: 27000000000 },
        fully_diluted_valuation: { usd: 1100000000000, brl: 5500000000000, eur: 990000000000 },
        circulating_supply: 19000000,
        total_supply: 21000000,
        max_supply: 21000000,
        price_change_percentage_24h: 2.5,
        price_change_percentage_1h_in_currency: { usd: 0.5, brl: 0.5, eur: 0.5 },
        price_change_percentage_24h_in_currency: { usd: 2.5, brl: 2.5, eur: 2.5 },
        price_change_percentage_7d_in_currency: { usd: 5.5, brl: 5.5, eur: 5.5 },
        price_change_percentage_30d_in_currency: { usd: 15.5, brl: 15.5, eur: 15.5 },
        market_cap_change_percentage_24h: 2.3
      }
    };
    
    // Retorna dados de fallback para desenvolvimento
    res.json(fallbackData);
  }
});

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cache: {
      crypto: cache.crypto.data ? 'Loaded' : 'Empty',
      coinDetails: Object.keys(cache.coinDetails).length
    }
  });
});

// ================= CLEAR CACHE =================
app.get('/api/clear-cache', (req, res) => {
  cache.crypto = { data: null, time: 0 };
  cache.coinDetails = {};
  res.json({ message: 'Cache cleared successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧹 Clear cache: http://localhost:${PORT}/api/clear-cache`);
});