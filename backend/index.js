'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= CORS ATUALIZADO =================
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://crypto-dashboard-frontend.vercel.app',
      'https://*.vercel.app',
      /\.vercel\.app$/
    ];
    
    if (allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return origin === allowed;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ================= CACHE CORRIGIDO =================
// Agora o cache armazena por moeda
const cache = {
  crypto: {}, // Mudado para objeto: { "usd": {data, time}, "brl": {data, time}, ... }
  coinDetails: {},
};

const CACHE_TIME = process.env.NODE_ENV === 'production' ? 60 * 1000 : 5 * 60 * 1000;

// ================= ROTAS DO BACKEND =================
app.get('/api/crypto', async (req, res) => {
  try {
    const now = Date.now();
    const { vs_currency = 'usd' } = req.query;

    // VERIFICA CACHE ESPECÍFICO PARA A MOEDA
    const cacheKey = vs_currency;
    if (cache.crypto[cacheKey] && now - cache.crypto[cacheKey].time < CACHE_TIME) {
      console.log(`📦 Retornando cache para moeda: ${vs_currency}`);
      return res.json(cache.crypto[cacheKey].data);
    }

    console.log(`🔄 Buscando dados da API para moeda: ${vs_currency}`);
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
        timeout: 15000
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

    // ARMAZENA NO CACHE COM A CHAVE DA MOEDA
    cache.crypto[cacheKey] = { data: coins, time: now };
    console.log(`✅ Dados armazenados em cache para moeda: ${vs_currency}`);
    
    res.json(coins);
  } catch (e) {
    console.error('Error fetching crypto list:', e.message);
    
    // Tenta retornar cache da moeda específica em caso de erro
    const cacheKey = req.query.vs_currency || 'usd';
    if (cache.crypto[cacheKey] && cache.crypto[cacheKey].data) {
      console.log(`⚠️  Erro na API, retornando cache antigo para: ${cacheKey}`);
      return res.json(cache.crypto[cacheKey].data);
    }
    
    res.status(500).json({ 
      error: 'Erro ao buscar criptos',
      message: e.message,
      timestamp: new Date().toISOString()
    });
  }
});

// O resto do código permanece igual...
app.get('/api/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    const { currency = 'usd' } = req.query;

    if (cache.coinDetails[id] && now - cache.coinDetails[id].time < CACHE_TIME) {
      return res.json(cache.coinDetails[id].data);
    }

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
        timeout: 10000
      }
    );

    const coinData = response.data;
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

    cache.coinDetails[id] = { data: formattedData, time: now };
    res.json(formattedData);
    
  } catch (error) {
    console.error(`Error fetching details for ${req.params.id}:`, error.message);
    
    if (cache.coinDetails[req.params.id]) {
      return res.json(cache.coinDetails[req.params.id].data);
    }
    
    res.status(500).json({
      error: 'Erro ao buscar detalhes da moeda',
      message: error.message,
      id: req.params.id,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cache: {
      crypto: Object.keys(cache.crypto).length, // Mostra quantas moedas estão em cache
      coinDetails: Object.keys(cache.coinDetails).length,
      cacheTime: CACHE_TIME
    }
  });
});

app.get('/api/keepalive', (req, res) => {
  res.json({ 
    status: 'ALIVE', 
    timestamp: new Date().toISOString(),
    message: 'Backend is awake!'
  });
});

app.get('/api/clear-cache', (req, res) => {
  cache.crypto = {}; // Agora é um objeto vazio
  cache.coinDetails = {};
  res.json({ message: 'Cache cleared successfully' });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Crypto Dashboard Backend API',
    version: '1.0.0',
    endpoints: {
      cryptoList: '/api/crypto?vs_currency=usd',
      coinDetails: '/api/coin/{id}',
      health: '/api/health',
      keepAlive: '/api/keepalive',
      clearCache: '/api/clear-cache'
    },
    documentation: 'Frontend: https://github.com/RafaelHedlund/crypto-dashboard'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});