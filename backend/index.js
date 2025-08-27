'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Usa a porta do Render ou 5000 localmente
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------------- API CRYPTO ----------------
app.get('/api/crypto', async (req, res) => {
  try {
    const perPage = parseInt(req.query.per_page) || 20;
    const page = parseInt(req.query.page) || 1;
    const order = req.query.order || 'market_cap_desc';
    const vs_currency = req.query.vs_currency || 'usd';

    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency,
        order,
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: '24h'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar dados das criptos' });
  }
});

// ---------------- API NEWS ----------------
app.get('/api/news', async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY; 

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'cryptocurrency OR bitcoin OR ethereum',
        language: 'en',
        pageSize: 20,
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY
      }
    });

    const news = response.data.articles.map(article => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage
    }));

    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

// Escuta na porta e IP correto para o Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
