'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS liberado para todas as origens (ideal para teste)
app.use(cors({ origin: '*' }));
app.use(express.json());

// ================= CACHE GLOBAL =================
const cache = {
    crypto: {},    // Formato: { 'usd': { data: [...], time: timestamp } }
    coinDetails: {} // Formato: { 'ethereum': { data: {...}, time: timestamp } }
};
const CACHE_DURATION = 120 * 1000; // 2 minutos

// ================= DADOS DE FALLBACK PARA MOEDAS POPULARES =================
const FALLBACK_COINS = {
    'bitcoin': {
        id: 'bitcoin', name: 'Bitcoin', symbol: 'btc',
        image: { large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png' },
        market_cap_rank: 1,
        market_data: {
            current_price: { usd: 45000, brl: 225000, eur: 41000 },
            market_cap: { usd: 880000000000, brl: 4400000000000, eur: 800000000000 },
            total_volume: { usd: 30000000000, brl: 150000000000, eur: 27000000000 },
            price_change_percentage_24h: 2.5,
            price_change_percentage_24h_in_currency: { usd: 2.5, brl: 2.5, eur: 2.5 },
            price_change_percentage_7d_in_currency: { usd: 5.2, brl: 5.2, eur: 5.2 },
            circulating_supply: 19500000,
            total_supply: 21000000,
            max_supply: 21000000
        }
    },
    'ethereum': {
        id: 'ethereum', name: 'Ethereum', symbol: 'eth',
        image: { large: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png' },
        market_cap_rank: 2,
        market_data: {
            current_price: { usd: 2400, brl: 12000, eur: 2200 },
            market_cap: { usd: 288000000000, brl: 1440000000000, eur: 260000000000 },
            total_volume: { usd: 15000000000, brl: 75000000000, eur: 13500000000 },
            price_change_percentage_24h: 1.8,
            price_change_percentage_24h_in_currency: { usd: 1.8, brl: 1.8, eur: 1.8 },
            price_change_percentage_7d_in_currency: { usd: 3.5, brl: 3.5, eur: 3.5 },
            circulating_supply: 120000000,
            total_supply: null,
            max_supply: null
        }
    }
    // Adicione outras moedas populares aqui seguindo o mesmo formato
};

// ================= ENDPOINT: LISTA DE CRIPTOMOEDAS =================
app.get('/api/crypto', async (req, res) => {
    const vsCurrency = req.query.vs_currency || 'usd';
    const cacheKey = vsCurrency;
    const now = Date.now();

    // 1. Tentar retornar do cache primeiro
    if (cache.crypto[cacheKey] && (now - cache.crypto[cacheKey].time) < CACHE_DURATION) {
        console.log(`[API] Cache usado para /crypto (${vsCurrency})`);
        return res.json(cache.crypto[cacheKey].data);
    }

    console.log(`[API] Buscando da CoinGecko para: ${vsCurrency}`);
    
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: vsCurrency,
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: true,
                price_change_percentage: '24h'
            },
            timeout: 10000 // Timeout de 10 segundos
        });

        const formattedData = response.data.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            sparkline_in_7d: coin.sparkline_in_7d
        }));

        // Salvar no cache
        cache.crypto[cacheKey] = { data: formattedData, time: now };
        console.log(`[API] Dados salvos em cache (${vsCurrency}): ${formattedData.length} moedas`);
        res.json(formattedData);

    } catch (error) {
        console.error(`[API] Erro ao buscar lista (${vsCurrency}):`, error.message);
        
        // 2. Se API falhar, usar cache antigo (mesmo expirado)
        if (cache.crypto[cacheKey] && cache.crypto[cacheKey].data) {
            console.log(`[API] Retornando cache expirado para ${vsCurrency}`);
            return res.json(cache.crypto[cacheKey].data);
        }

        // 3. Se não houver cache, usar fallback básico
        console.log('[API] Usando fallback básico');
        const fallback = Object.values(FALLBACK_COINS).map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image.large,
            current_price: coin.market_data.current_price[vsCurrency] || coin.market_data.current_price.usd,
            market_cap: coin.market_data.market_cap[vsCurrency] || coin.market_data.market_cap.usd,
            price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
            sparkline_in_7d: { price: Array(168).fill(coin.market_data.current_price[vsCurrency] || coin.market_data.current_price.usd) }
        }));
        
        cache.crypto[cacheKey] = { data: fallback, time: now };
        res.json(fallback);
    }
});

// ================= ENDPOINT: DETALHES DA MOEDA (CRÍTICO) =================
app.get('/api/coin/:id', async (req, res) => {
    const coinId = req.params.id;
    const now = Date.now();

    // 1. Verificar cache válido primeiro
    if (cache.coinDetails[coinId] && (now - cache.coinDetails[coinId].time) < CACHE_DURATION) {
        console.log(`[API] Cache usado para /coin/${coinId}`);
        return res.json(cache.coinDetails[coinId].data);
    }

    console.log(`[API] Buscando detalhes da CoinGecko para: ${coinId}`);
    
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
            params: { localization: false, tickers: false, market_data: true, community_data: false, developer_data: false, sparkline: false },
            timeout: 8000
        });

        const coinData = response.data;
        const formattedData = {
            id: coinData.id,
            name: coinData.name,
            symbol: coinData.symbol.toUpperCase(),
            image: coinData.image.large,
            market_cap_rank: coinData.market_cap_rank,
            market_data: {
                current_price: coinData.market_data.current_price,
                market_cap: coinData.market_data.market_cap,
                total_volume: coinData.market_data.total_volume,
                price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
                price_change_percentage_24h_in_currency: coinData.market_data.price_change_percentage_24h_in_currency,
                price_change_percentage_7d_in_currency: coinData.market_data.price_change_percentage_7d_in_currency,
                circulating_supply: coinData.market_data.circulating_supply,
                total_supply: coinData.market_data.total_supply,
                max_supply: coinData.market_data.max_supply
            }
        };

        cache.coinDetails[coinId] = { data: formattedData, time: now };
        console.log(`[API] Detalhes salvos em cache para: ${coinId}`);
        res.json(formattedData);

    } catch (error) {
        console.error(`[API] Erro ao buscar detalhes de ${coinId}:`, error.message);
        
        // 2. Se API falhar, tentar cache antigo
        if (cache.coinDetails[coinId]) {
            console.log(`[API] Retornando cache expirado para ${coinId}`);
            return res.json(cache.coinDetails[coinId].data);
        }

        // 3. Se não houver cache, usar fallback da moeda ou fallback genérico
        const fallbackCoin = FALLBACK_COINS[coinId] || FALLBACK_COINS['bitcoin'];
        const fallbackData = {
            id: fallbackCoin.id,
            name: fallbackCoin.name,
            symbol: fallbackCoin.symbol.toUpperCase(),
            image: fallbackCoin.image.large,
            market_cap_rank: fallbackCoin.market_cap_rank,
            market_data: fallbackCoin.market_data
        };

        cache.coinDetails[coinId] = { data: fallbackData, time: now };
        console.log(`[API] Usando fallback para: ${coinId}`);
        
        // IMPORTANTE: Sempre retorna status 200, mesmo com fallback
        res.status(200).json(fallbackData);
    }
});

// ================= ENDPOINTS AUXILIARES =================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        cacheStats: {
            cryptoCurrencies: Object.keys(cache.crypto),
            coinDetails: Object.keys(cache.coinDetails)
        }
    });
});

app.get('/api/clear-cache', (req, res) => {
    cache.crypto = {};
    cache.coinDetails = {};
    res.json({ message: 'Cache limpo', timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Crypto Dashboard Backend API',
        status: 'operational',
        endpoints: {
            cryptoList: 'GET /api/crypto?vs_currency=usd',
            coinDetails: 'GET /api/coin/:id',
            health: 'GET /api/health',
            clearCache: 'GET /api/clear-cache'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend rodando na porta ${PORT} | Cache: ${CACHE_DURATION/1000}s`);
});