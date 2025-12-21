'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= CORS TEMPORÁRIO (PERMITE TUDO PARA TESTE) =================
// Vamos simplificar temporariamente para testar a conexão
app.use(cors({
  origin: '*',  // PERMITE TODAS AS ORIGENS - DEPOIS TROCAMOS DE VOLTA
  credentials: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// ================= LOGGING PARA DEBUG =================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ================= CACHE CORRIGIDO =================
const cache = {
  crypto: {},
  coinDetails: {},
};

const CACHE_TIME = process.env.NODE_ENV === 'production' ? 60 * 1000 : 5 * 60 * 1000;

// ================= ROTAS DO BACKEND =================
app.get('/api/crypto', async (req, res) => {
  try {
    const now = Date.now();
    const { vs_currency = 'usd' } = req.query;

    const cacheKey = vs_currency;
    if (cache.crypto[cacheKey] && now - cache.crypto[cacheKey].time < CACHE_TIME) {
      console.log(`📦 Cache hit para moeda: ${vs_currency}`);
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

    cache.crypto[cacheKey] = { data: coins, time: now };
    console.log(`✅ Dados armazenados em cache para: ${vs_currency} (${coins.length} moedas)`);
    
    res.json(coins);
  } catch (e) {
    console.error('❌ Erro buscando lista de criptos:', e.message);
    
    const cacheKey = req.query.vs_currency || 'usd';
    if (cache.crypto[cacheKey] && cache.crypto[cacheKey].data) {
      console.log(`⚠️  Retornando cache antigo para: ${cacheKey}`);
      return res.json(cache.crypto[cacheKey].data);
    }
    
    res.status(500).json({ 
      error: 'Erro ao buscar criptos',
      message: e.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = Date.now();

    if (cache.coinDetails[id] && now - cache.coinDetails[id].time < CACHE_TIME) {
      console.log(`📦 Cache hit para moeda: ${id}`);
      return res.json(cache.coinDetails[id].data);
    }

    console.log(`🔄 Buscando detalhes para moeda: ${id}`);
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
    console.log(`✅ Detalhes armazenados em cache para: ${id}`);
    
    res.json(formattedData);
    
  } catch (error) {
    console.error(`❌ Erro buscando detalhes para ${req.params.id}:`, error.message);
    
    if (cache.coinDetails[req.params.id]) {
      console.log(`⚠️  Retornando cache antigo para: ${req.params.id}`);
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
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cache: {
      cryptoCurrencies: Object.keys(cache.crypto),
      coinDetails: Object.keys(cache.coinDetails),
      cacheTime: CACHE_TIME
    }
  });
});

app.get('/api/keepalive', (req, res) => {
  res.json({ 
    status: 'ALIVE', 
    timestamp: new Date().toISOString(),
    message: 'Backend está acordado!',
    uptime: process.uptime()
  });
});

app.get('/api/clear-cache', (req, res) => {
  const cryptoCount = Object.keys(cache.crypto).length;
  const coinDetailsCount = Object.keys(cache.coinDetails).length;
  
  cache.crypto = {};
  cache.coinDetails = {};
  
  res.json({ 
    message: 'Cache limpo com sucesso',
    cleared: {
      cryptoEntries: cryptoCount,
      coinDetails: coinDetailsCount
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Crypto Dashboard Backend API',
    version: '1.0.0',
    status: 'operational',
    documentation: 'https://github.com/RafaelHedlund/crypto-dashboard',
    endpoints: {
      cryptoList: 'GET /api/crypto?vs_currency=usd',
      coinDetails: 'GET /api/coin/:id',
      health: 'GET /api/health',
      keepAlive: 'GET /api/keepalive',
      clearCache: 'GET /api/clear-cache'
    },
    example: {
      frontendURL: 'https://crypto-dashboard.vercel.app',
      apiURL: 'https://dashboard-crypto-1.onrender.com'  // ATUALIZEI PARA SUA URL
    }
  });
});

// ================= ROTA DE FALLBACK =================
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    availableEndpoints: {
      root: '/',
      cryptoList: '/api/crypto',
      coinDetails: '/api/coin/:id',
      health: '/api/health',
      keepAlive: '/api/keepalive',
      clearCache: '/api/clear-cache'
    }
  });
});

// ================= CORREÇÃO CRÍTICA: VINCULAÇÃO DO SERVIDOR =================
// TROQUE A ÚLTIMA LINHA PARA:
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀  Backend iniciado no Render!
  ⚡  Porta: ${PORT}
  🔧  Ambiente: ${process.env.NODE_ENV || 'development'}
  ⏱️  Cache: ${CACHE_TIME}ms
  `);
});