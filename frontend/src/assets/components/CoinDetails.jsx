// frontend/src/assets/components/CoinDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, 
  BarChart3, Globe, Coins, Hash, Percent, 
  Target, Activity, Calendar, Clock, 
  Layers, Users, Cpu
} from "lucide-react";
import Footer from "./Footer";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function CoinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/coin/${id}`);
        setCoin(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching coin details:", err);
        setError(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id, currency]);

  const getCurrencySymbol = (cur) => {
    return cur === "brl" ? "R$" : cur === "eur" ? "€" : "$";
  };

  const formatCompactNumber = (num) => {
    if (!num && num !== 0) return "—";
    const absNum = Math.abs(num);
    
    if (absNum >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (absNum >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (absNum >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (absNum >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    
    return num < 0.01 ? num.toFixed(6) : num.toFixed(2);
  };

  if (loading) {
    return (
      <div className={`h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-indigo-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-sm opacity-70">Carregando detalhes da moeda...</p>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className={`h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} flex flex-col items-center justify-center p-4`}>
        <div className="text-center max-w-xs">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h1 className="text-lg font-bold mb-1">Erro ao carregar</h1>
          <p className="text-sm opacity-70 mb-4">{error || "Moeda não encontrada"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white transition-colors w-full"
          >
            Voltar para Dashboard
          </button>
        </div>
      </div>
    );
  }

  const md = coin.market_data;
  const priceChange24h = md.price_change_percentage_24h;
  const isPositive = priceChange24h >= 0;
  const currentPrice = md.current_price[currency] || 0;

  // Dados para o gráfico
  const chartData = {
    labels: Array.from({ length: 20 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Preço',
        data: Array.from({ length: 20 }, (_, i) => {
          const basePrice = currentPrice;
          const volatility = 0.02;
          const trend = priceChange24h / 100;
          let price = basePrice;
          for (let j = 0; j <= i; j++) {
            const change = (Math.random() - 0.5) * 2 * volatility;
            const trendChange = (trend / 20);
            price = price * (1 + change + trendChange);
          }
          return price;
        }),
        borderColor: isPositive ? '#10b981' : '#ef4444',
        backgroundColor: isPositive 
          ? darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)'
          : darkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
        tension: 0.4,
        borderWidth: 2,
        fill: true,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#e5e7eb' : '#111827',
        bodyColor: darkMode ? '#e5e7eb' : '#111827',
        callbacks: {
          label: (context) => `${getCurrencySymbol(currency)} ${context.raw.toFixed(6)}`
        }
      }
    },
    scales: {
      x: { 
        display: false,
        grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
      },
      y: { 
        display: true,
        grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          font: { size: 8 },
          callback: (value) => `${getCurrencySymbol(currency)}${formatCompactNumber(value)}`
        }
      }
    }
  };

  // Abas de navegação
  const tabs = [
    { id: "overview", label: "Visão Geral", icon: <BarChart3 size={14} /> },
    { id: "stats", label: "Estatísticas", icon: <Activity size={14} /> },
    { id: "supply", label: "Supply", icon: <Coins size={14} /> },
    { id: "info", label: "Informações", icon: <Hash size={14} /> },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} font-sans flex flex-col`}>
      {/* Header */}
      <header className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 text-white"
          : "bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 text-gray-900"
      } w-full fixed top-0 left-0 z-50 h-12`}>
        <nav className="flex items-center justify-between px-3 py-2 h-full max-w-[1920px] mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-xs font-medium hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="text-xs font-bold tracking-tight">
              🚀 Rafael Hedlund –{" "}
              <span className="text-indigo-500">Detalhes</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`text-xs px-2 py-1 rounded transition ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal - Ajustado o padding top para pt-16 */}
      <div className="flex-1 pt-20 pb-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col">
        
        {/* Cabeçalho da Moeda - Ajustado margin-bottom para mb-4 */}
        <div className={`${
          darkMode ? 'bg-gray-900/80' : 'bg-white'
        } rounded-xl p-3 mb-4 ${darkMode ? 'border border-gray-800' : 'border border-gray-200'} shadow-sm`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {coin.name}
                  </h1>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} font-medium`}>
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Rank #{coin.market_cap_rank || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getCurrencySymbol(currency)}{" "}
                    {currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: currentPrice < 1 ? 4 : 2,
                      maximumFractionDigits: currentPrice < 1 ? 6 : 2,
                    })}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isPositive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {priceChange24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                className={`text-xs ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                } px-2 py-1 rounded-lg border transition focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="usd">🇺🇸 USD</option>
                <option value="brl">🇧🇷 BRL</option>
                <option value="eur">🇪🇺 EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navegação por Abas - Ajustado margin-bottom para mb-4 */}
        <div className={`mb-4 rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'
        } border`}>
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas - Ajustado o gap para gap-4 */}
        <div className="flex-1">
          
          {/* Aba: Visão Geral */}
          {activeTab === "overview" && (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Coluna Esquerda - Gráfico */}
              <div className="lg:w-2/3">
                <div className={`${
                  darkMode ? 'bg-gray-900/80' : 'bg-white'
                } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm h-full`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 size={12} className="text-indigo-500" />
                      <h3 className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Variação de Preço (20 dias)
                      </h3>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      Dados Simulados
                    </span>
                  </div>
                  {/* Ajustado a altura do gráfico para h-52 md:h-60 */}
                  <div className="h-52 md:h-60">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Estatísticas Rápidas */}
              <div className="lg:w-1/3 flex flex-col gap-4">
                {/* Estatísticas de Mercado */}
                <div className={`${
                  darkMode ? 'bg-gray-900/80' : 'bg-white'
                } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Activity size={12} className="text-indigo-500" />
                    <h3 className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Estatísticas de Mercado
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <StatCard 
                      darkMode={darkMode}
                      icon={<DollarSign size={12} className="text-green-500" />}
                      label="Market Cap"
                      value={`${getCurrencySymbol(currency)}${formatCompactNumber(md.market_cap[currency])}`}
                      change={md.market_cap_change_percentage_24h}
                    />
                    <StatCard 
                      darkMode={darkMode}
                      icon={<BarChart3 size={12} className="text-blue-500" />}
                      label="Volume 24h"
                      value={`${getCurrencySymbol(currency)}${formatCompactNumber(md.total_volume[currency])}`}
                    />
                    <StatCard 
                      darkMode={darkMode}
                      icon={<Globe size={12} className="text-yellow-500" />}
                      label="Dominância"
                      value={`${((md.market_cap[currency] / 1000000000000) * 100).toFixed(2)}%`}
                    />
                    <StatCard 
                      darkMode={darkMode}
                      icon={<Target size={12} className="text-indigo-500" />}
                      label="Volume/Cap"
                      value={`${((md.total_volume[currency] / md.market_cap[currency]) * 100).toFixed(2)}%`}
                    />
                  </div>
                </div>

                {/* Variações de Preço */}
                <div className={`${
                  darkMode ? 'bg-gray-900/80' : 'bg-white'
                } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp size={12} className="text-indigo-500" />
                    <h3 className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Variações
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="1h"
                      change={md.price_change_percentage_1h_in_currency?.[currency]}
                    />
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="24h"
                      change={md.price_change_percentage_24h_in_currency?.[currency]}
                    />
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="7d"
                      change={md.price_change_percentage_7d_in_currency?.[currency]}
                    />
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="30d"
                      change={md.price_change_percentage_30d_in_currency?.[currency]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Estatísticas */}
          {activeTab === "stats" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Estatísticas Detalhadas */}
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Activity size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Estatísticas Avançadas
                  </h3>
                </div>
                <div className="space-y-2">
                  <DetailedStatRow
                    darkMode={darkMode}
                    icon={<DollarSign size={12} className="text-green-500" />}
                    label="Valor de Mercado"
                    value={`${getCurrencySymbol(currency)}${formatCompactNumber(md.market_cap[currency])}`}
                    change={md.market_cap_change_percentage_24h}
                    description="Capitalização total do mercado"
                  />
                  <DetailedStatRow
                    darkMode={darkMode}
                    icon={<BarChart3 size={12} className="text-blue-500" />}
                    label="Volume 24h"
                    value={`${getCurrencySymbol(currency)}${formatCompactNumber(md.total_volume[currency])}`}
                    description="Volume de negociação nas últimas 24h"
                  />
                  <DetailedStatRow
                    darkMode={darkMode}
                    icon={<TrendingUp size={12} className="text-purple-500" />}
                    label="Fully Diluted Valuation"
                    value={`${getCurrencySymbol(currency)}${formatCompactNumber(md.fully_diluted_valuation?.[currency])}`}
                    description="Valorização com supply total diluído"
                  />
                  <DetailedStatRow
                    darkMode={darkMode}
                    icon={<Percent size={12} className="text-pink-500" />}
                    label="Alta/Baixa 24h"
                    value={`${getCurrencySymbol(currency)}${formatCompactNumber(md.high_24h?.[currency] || 0)} / ${getCurrencySymbol(currency)}${formatCompactNumber(md.low_24h?.[currency] || 0)}`}
                    description="Preço máximo e mínimo nas últimas 24h"
                  />
                </div>
              </div>

              {/* Informações de Supply */}
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Coins size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Informações de Supply
                  </h3>
                </div>
                <div className="space-y-3">
                  <SupplyProgress
                    darkMode={darkMode}
                    label="Supply Circulante"
                    value={md.circulating_supply?.toLocaleString() || "—"}
                    percentage={md.max_supply ? (md.circulating_supply / md.max_supply * 100) : null}
                  />
                  <SupplyProgress
                    darkMode={darkMode}
                    label="Supply Total"
                    value={md.total_supply?.toLocaleString() || "—"}
                  />
                  <SupplyProgress
                    darkMode={darkMode}
                    label="Supply Máximo"
                    value={md.max_supply?.toLocaleString() || "—"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Aba: Supply */}
          {activeTab === "supply" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Detalhes de Supply */}
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Coins size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Detalhes de Supply
                  </h3>
                </div>
                <div className="space-y-2">
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Layers size={12} />}
                    label="Circulante"
                    value={md.circulating_supply?.toLocaleString() || "—"}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Users size={12} />}
                    label="Total"
                    value={md.total_supply?.toLocaleString() || "—"}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Cpu size={12} />}
                    label="Máximo"
                    value={md.max_supply?.toLocaleString() || "—"}
                  />
                </div>
              </div>

              {/* Distribuição de Supply */}
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Target size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Distribuição
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Circulante
                      </span>
                      <span className="font-semibold">
                        {md.circulating_supply?.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${md.max_supply ? (md.circulating_supply / md.max_supply * 100) : 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {md.max_supply ? 
                      `${((md.circulating_supply / md.max_supply) * 100).toFixed(2)}% do supply máximo já está em circulação` :
                      'Supply máximo não definido'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Informações */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Informações Gerais */}
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Hash size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Informações da Moeda
                  </h3>
                </div>
                <div className="space-y-2">
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={10} />}
                    label="ID"
                    value={coin.id}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={10} />}
                    label="Símbolo"
                    value={coin.symbol.toUpperCase()}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={10} />}
                    label="Nome"
                    value={coin.name}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={10} />}
                    label="Rank"
                    value={`#${coin.market_cap_rank || "N/A"}`}
                  />
                </div>
              </div>

              {/* Histórico de Preço */}
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-xl p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Calendar size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Histórico de Preço
                  </h3>
                </div>
                <div className="space-y-2">
                  <PriceHistoryCard
                    darkMode={darkMode}
                    period="24 horas"
                    high={`${getCurrencySymbol(currency)}${formatCompactNumber(md.high_24h?.[currency] || 0)}`}
                    low={`${getCurrencySymbol(currency)}${formatCompactNumber(md.low_24h?.[currency] || 0)}`}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock size={9} />
                      <span>Última atualização: {new Date(md.last_updated).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}

// Componente para cartão de estatística
function StatCard({ darkMode, icon, label, value, change }) {
  return (
    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} transition-colors`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {label}
          </span>
        </div>
        <div className="text-right">
          <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {change !== undefined && (
            <span className={`text-[10px] ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change?.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para linha de estatística detalhada
function DetailedStatRow({ darkMode, icon, label, value, change, description }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {label}
          </div>
          {description && (
            <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
              {description}
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
        {change !== undefined && (
          <div className={`text-[10px] ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change?.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para progresso de supply
function SupplyProgress({ darkMode, label, value, percentage }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </span>
        <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </span>
      </div>
      {percentage && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Componente para cartão de período
function TimeFrameCard({ darkMode, period, change }) {
  const isPositive = change >= 0;
  
  return (
    <div className={`p-2 rounded-lg text-center transition-colors ${
      isPositive
        ? 'bg-green-500/10 border border-green-500/20'
        : 'bg-red-500/10 border border-red-500/20'
    }`}>
      <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
        {period}
      </div>
      <div className={`flex items-center justify-center gap-0.5 text-xs font-bold ${
        isPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change >= 0 ? '+' : ''}{change?.toFixed(2)}%
      </div>
    </div>
  );
}

// Componente para cartão de informação
function InfoCard({ darkMode, icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
      <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

// Componente para cartão de histórico de preço
function PriceHistoryCard({ darkMode, period, high, low }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium">{period}</div>
      <div className="flex justify-between">
        <div className="text-center">
          <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alta</div>
          <div className={`text-xs font-bold text-green-400`}>{high}</div>
        </div>
        <div className="text-center">
          <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Baixa</div>
          <div className={`text-xs font-bold text-red-400`}>{low}</div>
        </div>
      </div>
    </div>
  );
}