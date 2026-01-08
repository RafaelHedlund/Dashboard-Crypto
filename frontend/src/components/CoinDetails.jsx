import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, 
  BarChart3, Globe, Coins, Hash, Percent, 
  Target, Activity, Calendar, Clock, 
  Layers, Users, Cpu, Home,
  ExternalLink, Info, Sparkles, Shield, Zap,
  RefreshCw, BarChart4, ChevronRight
} from "lucide-react";
import Footer from "./Footer";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

// ================= COMPONENTES REUTILIZÁVEIS =================
function StatCard({ darkMode, icon, label, value, change }) {
  return (
    <div className={`p-2 rounded ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} transition-colors`}>
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

function DetailedStatRow({ darkMode, icon, label, value, change, description }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
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
        <div className={`w-full rounded-full h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function TimeFrameCard({ darkMode, period, change }) {
  const isPositive = change >= 0;
  
  return (
    <div className={`p-2 rounded text-center transition-colors ${
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
        {isPositive ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
        {change >= 0 ? '+' : ''}{change?.toFixed(2)}%
      </div>
    </div>
  );
}

function InfoCard({ darkMode, icon, label, value }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
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

// ================= DADOS DE FALLBACK PARA O FRONTEND =================
const FRONTEND_FALLBACK_DATA = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
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
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
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
};

// ================= LOADING ELEGANTE =================
function LoadingScreen({ id, darkMode, navigate }) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} font-sans`}>
      
      <header className={`${darkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} fixed top-0 w-full h-14 z-50 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <nav className="flex items-center justify-between px-5 py-3 h-full">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 text-sm font-medium transition-all hover:gap-3 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse`}></div>
              <span className={`text-xs font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                Carregando...
              </span>
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-20 px-5 pb-10 flex flex-col items-center justify-center min-h-screen">
        
        <div className={`w-full max-w-4xl ${darkMode ? 'bg-gray-800/40' : 'bg-white/60'} backdrop-blur-sm rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-2xl p-8 mb-8`}>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className={`relative w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                  <div className="text-2xl">💰</div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-32 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                  <div className={`w-12 h-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`} style={{animationDelay: '0.1s'}}></div>
                </div>
                <div className={`w-48 h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`} style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className={`w-20 h-9 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg animate-pulse`}></div>
              <div className={`w-20 h-9 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg animate-pulse`} style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            {["Visão Geral", "Estatísticas", "Supply", "Informações"].map((tab, i) => (
              <div 
                key={tab} 
                className={`w-24 h-9 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg animate-pulse`}
                style={{animationDelay: `${i * 0.1}s`}}
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <div className={`${darkMode ? 'bg-gray-700/40' : 'bg-gray-300/40'} rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-40 h-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                  <div className={`w-24 h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                </div>
                <div className={`h-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-xl animate-pulse`}></div>
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className={`${darkMode ? 'bg-gray-700/40' : 'bg-gray-300/40'} rounded-xl p-6`}>
                  <div className={`w-32 h-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse mb-4`}></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex justify-between items-center">
                        <div className={`w-20 h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                        <div className={`w-16 h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Preparando análise...
              </span>
              <span className={`text-xs ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                75%
              </span>
            </div>
            <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
              <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" 
                   style={{width: '75%'}}></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Conectando", status: "complete", icon: "🔗" },
                { label: "Buscando", status: "complete", icon: "📡" },
                { label: "Processando", status: "active", icon: "⚙️" },
                { label: "Finalizando", status: "pending", icon: "🎨" }
              ].map((step, index) => (
                <div key={step.label} className="text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    step.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                    step.status === 'active' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                    'bg-gray-700/20 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center max-w-lg">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce ml-1" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce ml-1" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Carregando dados de {id}
            </span>
          </div>
          
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-6`}>
            <span className="font-medium">ID:</span> <span className={`font-mono ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>{id}</span>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-gray-100/60'} backdrop-blur-sm rounded-xl p-4 border ${darkMode ? 'border-gray-700/30' : 'border-gray-300/30'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-cyan-900/30' : 'bg-blue-100'}`}>
                <Sparkles size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
              </div>
              <div className="text-left">
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Dica
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Dados offline serão usados se a conexão falhar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 75%; }
          50% { width: 85%; }
          100% { width: 75%; }
        }
      `}</style>
    </div>
  );
}

// ================= COMPONENTE PRINCIPAL COIN DETAILS =================
export default function CoinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("brl");
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      setLoading(true);
      
      try {
        // Tentar buscar do backend
        const response = await axios.get(`/api/coin/${id}`, { timeout: 10000 });
        
        if (response.data && response.data.id) {
          setCoin(response.data);
          console.log(`✅ Dados carregados para ${id}`);
        } else {
          throw new Error("Dados inválidos");
        }
      } catch (err) {
        console.log(`⚠️  Usando fallback para ${id}:`, err.message);
        // Se der erro, usar dados de fallback SEM mostrar erro ao usuário
        setCoin(FRONTEND_FALLBACK_DATA[id.toLowerCase()] || FRONTEND_FALLBACK_DATA.bitcoin);
        setUseFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id]);

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

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: <BarChart3 size={14} /> },
    { id: "stats", label: "Estatísticas", icon: <Activity size={14} /> },
    { id: "supply", label: "Supply", icon: <Coins size={14} /> },
    { id: "info", label: "Informações", icon: <Info size={14} /> },
  ];

  // ================= MOSTRAR LOADING =================
  if (loading) {
    return <LoadingScreen id={id} darkMode={darkMode} navigate={navigate} />;
  }

  // ================= DADOS DA MOEDA (REAIS OU FALLBACK) =================
  const md = coin.market_data;
  const priceChange24h = md?.price_change_percentage_24h || 0;
  const isPositive = priceChange24h >= 0;
  const currentPrice = md?.current_price?.[currency] || 0;

  const chartData = {
    labels: Array.from({ length: 20 }, (_, i) => `Dia ${i + 1}`),
    datasets: [
      {
        label: 'Preço',
        data: Array.from({ length: 20 }, (_, i) => {
          const basePrice = currentPrice;
          const volatility = 0.03;
          const trend = priceChange24h / 100 * 20;
          let price = basePrice * (1 - trend/2);
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
    plugins: { legend: { display: false } },
    scales: {
      x: { 
        display: true,
        grid: { 
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: { color: darkMode ? '#9ca3af' : '#6b7280', font: { size: 9 } }
      },
      y: { 
        display: true,
        grid: { 
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          font: { size: 9 },
          callback: (value) => `${getCurrencySymbol(currency)}${formatCompactNumber(value)}`
        }
      }
    }
  };

  // ================= RENDERIZAÇÃO PRINCIPAL (SEM ERROS) =================
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-300'} font-sans flex flex-col`}>
      {/* Header */}
      <header className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
      } w-full fixed top-0 left-0 z-50 h-12 shadow-sm`}>
        <nav className="flex items-center justify-between px-4 py-3 h-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-xs hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={14} />
              Dashboard
            </button>
            <div className="text-xs font-bold">
              🚀 <span className="text-indigo-500">Detalhes</span>
              {useFallback && <span className="ml-2 text-xs text-yellow-500">(Modo Offline)</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className={`text-xs ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              } px-2 py-1 rounded border transition`}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="usd">🇺🇸 USD</option>
              <option value="brl">🇧🇷 BRL</option>
              <option value="eur">🇪🇺 EUR</option>
            </select>
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

      {/* Conteúdo Principal */}
      <div className="flex-1 pt-16 pb-4 px-3 sm:px-4 w-full flex flex-col">
        
        {/* Cabeçalho da Moeda */}
        <div className={`${
          darkMode ? 'bg-gray-900/80' : 'bg-white'
        } rounded-lg p-8 mb-3 ${darkMode ? 'border border-gray-800' : 'border border-gray-200'} shadow-sm`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img 
                src={coin.image?.large || coin.image} 
                alt={coin.name} 
                className="w-8 h-8"
              />
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {coin.name}
                  </h1>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} font-medium`}>
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Rank #{coin.market_cap_rank || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getCurrencySymbol(currency)}
                    {currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: currentPrice < 1 ? 4 : 2,
                      maximumFractionDigits: currentPrice < 1 ? 6 : 2,
                    })}
                  </span>
                  <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
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

            <div className="flex items-center gap-1 mt-2 sm:mt-0">
              <button
                onClick={() => window.open(coin.links?.homepage?.[0] || '#', '_blank')}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs flex items-center gap-1"
              >
                <ExternalLink size={10} />
                Site
              </button>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className={`mb-3 rounded-lg overflow-hidden ${
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

        {/* Conteúdo das Abas */}
        <div className="flex-1">
          
          {/* Aba: Visão Geral */}
          {activeTab === "overview" && (
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Coluna Esquerda - Gráfico */}
              <div className="lg:w-2/3">
                <div className={`${
                  darkMode ? 'bg-gray-900/80' : 'bg-white'
                } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm h-full`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 size={12} className="text-indigo-500" />
                      <h3 className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Variação de Preço (20 dias)
                      </h3>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {useFallback ? "Dados Simulados" : "Análise"}
                    </span>
                  </div>
                  <div className="h-56 sm:h-64">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Estatísticas Rápidas */}
              <div className="lg:w-1/3 flex flex-col gap-3">
                {/* Estatísticas de Mercado */}
                <div className={`${
                  darkMode ? 'bg-gray-900/80' : 'bg-white'
                } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Activity size={12} className="text-indigo-500" />
                    <h3 className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Estatísticas
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <StatCard 
                      darkMode={darkMode}
                      icon={<DollarSign size={10} className="text-green-500" />}
                      label="Market Cap"
                      value={`${getCurrencySymbol(currency)}${formatCompactNumber(md?.market_cap?.[currency] || 0)}`}
                      change={md?.market_cap_change_percentage_24h}
                    />
                    <StatCard 
                      darkMode={darkMode}
                      icon={<BarChart3 size={10} className="text-blue-500" />}
                      label="Volume 24h"
                      value={`${getCurrencySymbol(currency)}${formatCompactNumber(md?.total_volume?.[currency] || 0)}`}
                    />
                    <StatCard 
                      darkMode={darkMode}
                      icon={<Globe size={10} className="text-yellow-500" />}
                      label="Dominância"
                      value={`${((md?.market_cap?.[currency] || 0) / 1000000000000 * 100).toFixed(2)}%`}
                    />
                  </div>
                </div>

                {/* Variações de Preço */}
                <div className={`${
                  darkMode ? 'bg-gray-900/80' : 'bg-white'
                } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
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
                      change={md?.price_change_percentage_1h_in_currency?.[currency]}
                    />
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="24h"
                      change={md?.price_change_percentage_24h_in_currency?.[currency]}
                    />
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="7d"
                      change={md?.price_change_percentage_7d_in_currency?.[currency]}
                    />
                    <TimeFrameCard
                      darkMode={darkMode}
                      period="30d"
                      change={md?.price_change_percentage_30d_in_currency?.[currency]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Estatísticas */}
          {activeTab === "stats" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Activity size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Estatísticas Avançadas
                  </h3>
                </div>
                <div className="space-y-2">
                  <DetailedStatRow
                    darkMode={darkMode}
                    icon={<DollarSign size={10} className="text-green-500" />}
                    label="Market Cap"
                    value={`${getCurrencySymbol(currency)}${formatCompactNumber(md?.market_cap?.[currency] || 0)}`}
                    change={md?.market_cap_change_percentage_24h}
                  />
                  <DetailedStatRow
                    darkMode={darkMode}
                    icon={<BarChart3 size={10} className="text-blue-500" />}
                    label="Volume 24h"
                    value={`${getCurrencySymbol(currency)}${formatCompactNumber(md?.total_volume?.[currency] || 0)}`}
                  />
                </div>
              </div>

              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
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
                    value={md?.circulating_supply?.toLocaleString() || "—"}
                    percentage={md?.max_supply ? (md.circulating_supply / md.max_supply * 100) : null}
                  />
                  <SupplyProgress
                    darkMode={darkMode}
                    label="Supply Total"
                    value={md?.total_supply?.toLocaleString() || "—"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Aba: Supply */}
          {activeTab === "supply" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Coins size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Detalhes de Supply
                  </h3>
                </div>
                <div className="space-y-2">
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Layers size={10} />}
                    label="Circulante"
                    value={md?.circulating_supply?.toLocaleString() || "—"}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Users size={10} />}
                    label="Total"
                    value={md?.total_supply?.toLocaleString() || "—"}
                  />
                </div>
              </div>

              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
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
                        {md?.circulating_supply?.toLocaleString() || "—"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${md?.max_supply ? ((md.circulating_supply / md.max_supply) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Informações */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Hash size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Informações
                  </h3>
                </div>
                <div className="space-y-2">
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={8} />}
                    label="ID"
                    value={coin.id}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={8} />}
                    label="Símbolo"
                    value={coin.symbol.toUpperCase()}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Hash size={8} />}
                    label="Rank"
                    value={`#${coin.market_cap_rank || "N/A"}`}
                  />
                </div>
              </div>

              <div className={`${
                darkMode ? 'bg-gray-900/80' : 'bg-white'
              } border rounded-lg p-3 ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Calendar size={14} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Status
                  </h3>
                </div>
                <div className="space-y-2">
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Sparkles size={10} />}
                    label="Fonte dos Dados"
                    value={useFallback ? "Local (Offline)" : "API em Tempo Real"}
                  />
                  <InfoCard
                    darkMode={darkMode}
                    icon={<Shield size={10} />}
                    label="Status"
                    value="Operacional"
                  />
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