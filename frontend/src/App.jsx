import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Footer from "./assets/components/Footer";
import { Github, Linkedin, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CoinDetails from "./assets/components/CoinDetails";

// ================= CONFIGURAÇÃO DINÂMICA DO BACKEND =================
const getApiBaseUrl = () => {
  // Se estiver em produção, use a variável de ambiente ou a URL do Render
  if (import.meta.env.PROD) {
    // Se a variável de ambiente VITE_API_URL estiver definida, use-a, senão use a URL do Render
    return import.meta.env.VITE_API_URL || 'https://dashboard-crypto-1.onrender.com';
  }
  // Em desenvolvimento, use localhost
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();
axios.defaults.baseURL = API_BASE_URL;
console.log('🌐 API Base URL:', API_BASE_URL);

// ================= COMPONENTES REUTILIZÁVEIS =================

// --------------- HEADER ---------------
function Header({ darkMode, showBack, onBack }) {
  return (
    <header
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
      } w-full fixed top-0 left-0 z-50 h-12 shadow-lg`}
    >
      <nav className="flex items-center justify-between px-6 py-3 w-full">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          )}
          <div className="text-base font-bold tracking-tight">
            🚀 Rafael Hedlund –{" "}
            <span className="text-indigo-500">Crypto Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/RafaelHedlund"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/rafaelhedlund/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </nav>
    </header>
  );
}

// --------------- SELECTOR DE MOEDA ---------------
function CurrencySelector({ currency, setCurrency, darkMode }) {
  const currencies = [
    { code: "usd", symbol: "$", flag: "🇺🇸", name: "USD" },
    { code: "brl", symbol: "R$", flag: "🇧🇷", name: "BRL" },
    { code: "eur", symbol: "€", flag: "🇪🇺", name: "EUR" },
  ];
  return (
    <select
      className={`${
        darkMode
          ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
      } px-3 py-2 rounded-lg border shadow-sm transition-all text-xs font-medium cursor-pointer`}
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
    >
      {currencies.map((cur) => (
        <option key={cur.code} value={cur.code}>
          {cur.flag} {cur.name}
        </option>
      ))}
    </select>
  );
}

// --------------- CARD DE CRIPTOMOEDA ---------------
function Card({ coin, currency, getCurrencySymbol, darkMode }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/coin/${coin.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className={`${
        darkMode 
          ? "bg-gray-800 text-white hover:bg-gray-700" 
          : "bg-white text-gray-900 hover:bg-gray-50"
      } p-3 border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } hover:border-indigo-500 hover:shadow-lg transition-all duration-200 rounded-lg h-full flex flex-col cursor-pointer shadow-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="w-8 h-8" />
          <div>
            <h2 className="text-sm font-bold">
              {coin.symbol.toUpperCase()}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {coin.name}
            </p>
          </div>
        </div>
        <div className={`text-right px-2 py-1 rounded-lg text-xs ${
          coin.price_change_percentage_24h >= 0
            ? darkMode 
              ? "bg-green-900/30 text-green-400" 
              : "bg-green-50 text-green-600"
            : darkMode 
              ? "bg-red-900/30 text-red-400" 
              : "bg-red-50 text-red-600"
        }`}>
          <span className="font-bold">
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-lg font-bold mb-0.5">
          {getCurrencySymbol(currency)}
          {coin.current_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
          })}
        </p>
        <p className="text-xs text-gray-500">
          Cap: {getCurrencySymbol(currency)}
          {(coin.market_cap / 1000000000).toFixed(1)}B
        </p>
      </div>
      
      <div className="mt-auto w-full h-16">
        <Line
          options={{
            elements: { point: { radius: 0 } },
            plugins: { 
              legend: { display: false },
              tooltip: { enabled: false }
            },
            scales: { 
              x: { display: false, grid: { display: false } }, 
              y: { display: false, grid: { display: false } } 
            },
            maintainAspectRatio: false,
            responsive: true,
          }}
          data={{
            labels: coin.sparkline_in_7d.price.map((_, i) => i),
            datasets: [
              {
                data: coin.sparkline_in_7d.price,
                borderColor:
                  coin.price_change_percentage_24h >= 0
                    ? "#10b981"
                    : "#ef4444",
                backgroundColor: coin.price_change_percentage_24h >= 0
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                tension: 0.4,
                borderWidth: 1.5,
                fill: true
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

// --------------- COMPONENTE DE PONTOS (DOTS) ---------------
function Dots({ total, index, setIndex, perPage, darkMode }) {
  const pages = Math.ceil(total / perPage);
  const currentPage = Math.floor(index / perPage);
  
  const handlePrev = () => {
    setIndex(Math.max(0, index - perPage));
  };
  
  const handleNext = () => {
    setIndex(Math.min(total - perPage, index + perPage));
  };
  
  return (
    <div className="flex items-center justify-between mt-2">
      <button
        onClick={handlePrev}
        disabled={index === 0}
        className={`p-1.5 rounded-lg transition-all ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30"
        }`}
      >
        <ChevronLeft size={14} />
      </button>
      
      <div className="flex gap-1.5">
        {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
          let pageToShow = i;
          if (pages > 5) {
            const start = Math.max(0, currentPage - 2);
            const end = Math.min(pages, start + 5);
            pageToShow = start + i;
            if (pageToShow >= end) return null;
          }
          
          return (
            <button
              key={pageToShow}
              onClick={() => setIndex(pageToShow * perPage)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                currentPage === pageToShow
                  ? darkMode
                    ? "bg-indigo-500"
                    : "bg-indigo-600"
                  : darkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            />
          );
        })}
      </div>
      
      <button
        onClick={handleNext}
        disabled={index + perPage >= total}
        className={`p-1.5 rounded-lg transition-all ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30"
        }`}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ================= COMPONENTE PRINCIPAL DASHBOARD =================
function Dashboard() {
  // ================= ESTADOS E VARIÁVEIS =================
  const [cryptos, setCryptos] = useState([]);
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [darkMode, setDarkMode] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [tableIndex, setTableIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ================= CONSTANTES =================
  const perPageTable = 12;
  const perPageCards = 12;

  // ================= EFFECTS =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/crypto", {
          params: {
            vs_currency: currency,
          },
        });
        
        if (res.data && Array.isArray(res.data)) {
          setCryptos(res.data);
        } else {
          throw new Error("Formato de dados inválido do backend");
        }
      } catch (err) {
        console.error("Erro ao buscar criptos do backend:", err);
        setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
        setCryptos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currency]);

  // Auto rolagem cards
  useEffect(() => {
    if (!autoScroll || search || loading) return;
    const interval = setInterval(() => {
      setCardIndex((prev) =>
        prev + perPageCards >= cryptos.length ? 0 : prev + perPageCards
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [cryptos, autoScroll, search, loading]);

  // Auto rolagem tabela
  useEffect(() => {
    if (!autoScroll || search || loading) return;
    const interval = setInterval(() => {
      setTableIndex((prev) =>
        prev + perPageTable >= cryptos.length ? 0 : prev + perPageTable
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [cryptos, autoScroll, search, loading]);

  // ================= FUNÇÕES AUXILIARES =================
  const filteredCryptos = cryptos.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const getCurrencySymbol = (cur) =>
    cur === "brl" ? "R$" : cur === "eur" ? "€" : "$";

  const top5 = [...cryptos]
    .sort((a, b) => b.current_price - a.current_price)
    .slice(0, 5);
  const bottom5 = [...cryptos]
    .sort((a, b) => a.current_price - b.current_price)
    .slice(0, 5);

  const handleRowClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };

  // ================= RENDERIZAÇÃO DO LOADING =================
  if (loading) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-950 text-white" : "bg-gray-300 text-gray-900"
        } h-screen font-sans flex flex-col items-center justify-center`}
      >
        <Header darkMode={darkMode} showBack={false} />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-sm">Conectando ao backend...</p>
        </div>
      </div>
    );
  }

  // ================= RENDERIZAÇÃO PRINCIPAL =================
  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-300 text-gray-900"
      } min-h-screen font-sans flex flex-col`}
    >
      <Header 
        darkMode={darkMode} 
        showBack={false}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 pt-16 pb-4 px-3 sm:px-4 w-full flex flex-col">
        {/* ================= SEÇÃO DE CONTROLES ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-3 gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Bitcoin, Ethereum, Solana..."
              className={`${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
              } px-3 py-2 rounded-lg border shadow-sm w-full sm:w-56 text-sm`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCardIndex(0);
                setTableIndex(0);
              }}
            />
            <CurrencySelector
              currency={currency}
              setCurrency={setCurrency}
              darkMode={darkMode}
            />
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            <button
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                view === "cards"
                  ? darkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setView("cards")}
            >
              Cards
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                view === "table"
                  ? darkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setView("table")}
            >
              Tabela
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setDarkMode((m) => !m)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                autoScroll
                  ? darkMode
                    ? "bg-green-900/30 text-green-400 border border-green-800"
                    : "bg-green-100 text-green-600 border border-green-200"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setAutoScroll((a) => !a)}
            >
              {autoScroll ? "⏸️ Pausar" : "▶️ Auto"}
            </button>
          </div>
        </div>

        {/* ================= SEÇÃO DE ERRO ================= */}
        {error && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-xs text-red-400">{error}</p>
            <p className="text-xs text-red-300 mt-0.5">
              Backend URL: {API_BASE_URL}
            </p>
          </div>
        )}

        {/* ================= LAYOUT PRINCIPAL (DUAS COLUNAS) ================= */}
        <div className="flex flex-col xl:flex-row gap-3 w-full flex-1 min-h-0">
          {/* ================= COLUNA ESQUERDA - CARDS/TABELA ================= */}
          <div className="xl:w-3/5 flex flex-col h-full">
            <div className={`flex-1 ${
              darkMode ? 'bg-gray-800/40' : 'bg-white'
            } border rounded-lg p-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-lg h-full flex flex-col`}>
              
              {/* ================= VISUALIZAÇÃO CARDS ================= */}
              {view === "cards" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
                    {filteredCryptos
                      .slice(cardIndex, cardIndex + perPageCards)
                      .map((coin) => (
                        <Card
                          key={coin.id}
                          coin={coin}
                          currency={currency}
                          getCurrencySymbol={getCurrencySymbol}
                          darkMode={darkMode}
                        />
                      ))}
                  </div>
                  {filteredCryptos.length > perPageCards && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <Dots
                        total={filteredCryptos.length}
                        index={cardIndex}
                        setIndex={setCardIndex}
                        perPage={perPageCards}
                        darkMode={darkMode}
                      />
                    </div>
                  )}
                </>
              ) : (
                /* ================= VISUALIZAÇÃO TABELA ================= */
                <>
                  <div className="flex-1 overflow-auto">
                    <table
                      className={`${
                        darkMode ? "bg-gray-800/50" : "bg-white"
                      } w-full text-xs rounded-lg overflow-hidden`}
                    >
                      <thead
                        className={`${
                          darkMode ? "bg-gray-700/80" : "bg-gray-100"
                        } sticky top-0`}
                      >
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">#</th>
                          <th className="px-3 py-2 text-left font-semibold">Moeda</th>
                          <th className="px-3 py-2 text-left font-semibold">Preço</th>
                          <th className="px-3 py-2 text-left font-semibold">% 24h</th>
                          <th className="px-3 py-2 text-left font-semibold">Market Cap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCryptos
                          .slice(tableIndex, tableIndex + perPageTable)
                          .map((coin, idx) => (
                            <tr
                              key={coin.id}
                              onClick={() => handleRowClick(coin.id)}
                              className={`border-t ${
                                darkMode
                                  ? "border-gray-700 hover:bg-gray-700/50"
                                  : "border-gray-200 hover:bg-gray-50"
                              } cursor-pointer transition-colors`}
                            >
                              <td className="px-3 py-2 font-medium">
                                {tableIndex + idx + 1}
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={coin.image}
                                    alt={coin.name}
                                    className="w-6 h-6"
                                  />
                                  <div>
                                    <div className="font-bold">
                                      {coin.symbol.toUpperCase()}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {coin.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-bold">
                                {getCurrencySymbol(currency)}
                                {coin.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                                })}
                              </td>
                              <td className="px-3 py-2">
                                <div className={`px-2 py-0.5 rounded-lg inline-flex items-center font-bold ${
                                  coin.price_change_percentage_24h >= 0
                                    ? darkMode 
                                      ? "bg-green-900/30 text-green-400" 
                                      : "bg-green-50 text-green-600"
                                    : darkMode 
                                      ? "bg-red-900/30 text-red-400" 
                                      : "bg-red-50 text-red-600"
                                }`}>
                                  {coin.price_change_percentage_24h?.toFixed(2)}%
                                </div>
                              </td>
                              <td className="px-3 py-2 font-medium">
                                {getCurrencySymbol(currency)}
                                {(coin.market_cap / 1000000000).toFixed(1)}B
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredCryptos.length > perPageTable && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <Dots
                        total={filteredCryptos.length}
                        index={tableIndex}
                        setIndex={setTableIndex}
                        perPage={perPageTable}
                        darkMode={darkMode}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ================= COLUNA DIREITA - TOP/BOTTOM ================= */}
          <div className="xl:w-2/5 flex flex-col h-full">
            <div className={`h-full flex flex-col gap-3 ${
              darkMode ? 'bg-gray-800/40' : 'bg-white'
            } border rounded-lg p-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-lg`}>
              
              {/* ================= TOP 5 - MAIOR PREÇO ================= */}
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-2 flex items-center">
                  <span className="mr-1.5">💎</span> Top 5 - Maior Preço
                </h3>
                <div className="space-y-1.5">
                  {top5.map((coin, idx) => (
                    <div
                      key={coin.id}
                      onClick={() => handleRowClick(coin.id)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] ${
                        darkMode
                          ? "bg-gray-800/50 hover:bg-gray-700/50 border-gray-700"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                            idx === 0
                              ? "bg-yellow-500"
                              : idx === 1
                              ? "bg-gray-400"
                              : idx === 2
                              ? "bg-amber-700"
                              : "bg-gray-600"
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-5 h-5"
                            />
                            <div>
                              <div className="font-bold text-xs">
                                {coin.symbol.toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {coin.name.substring(0, 12)}
                                {coin.name.length > 12 ? "..." : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">
                            {getCurrencySymbol(currency)}
                            {coin.current_price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                            })}
                          </div>
                          <div className={`text-xs font-medium ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}>
                            {coin.price_change_percentage_24h?.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= BOTTOM 5 - MENOR PREÇO ================= */}
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-2 flex items-center">
                  <span className="mr-1.5">💰</span> Top 5 - Menor Preço
                </h3>
                <div className="space-y-1.5">
                  {bottom5.map((coin, idx) => (
                    <div
                      key={coin.id}
                      onClick={() => handleRowClick(coin.id)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] ${
                        darkMode
                          ? "bg-gray-800/50 hover:bg-gray-700/50 border-gray-700"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                            idx === 0
                              ? "bg-blue-500"
                              : idx === 1
                              ? "bg-gray-400"
                              : idx === 2
                              ? "bg-amber-700"
                              : "bg-gray-600"
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-5 h-5"
                            />
                            <div>
                              <div className="font-bold text-xs">
                                {coin.symbol.toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {coin.name.substring(0, 12)}
                                {coin.name.length > 12 ? "..." : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">
                            {getCurrencySymbol(currency)}
                            {coin.current_price.toLocaleString(undefined, {
                              minimumFractionDigits: coin.current_price > 1000 ? 0 : 2,
                              maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                            })}
                          </div>
                          <div className={`text-xs font-medium ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}>
                            {coin.price_change_percentage_24h?.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}

// ================= COMPONENTE PRINCIPAL APP =================
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coin/:id" element={<CoinDetails />} />
      </Routes>
    </Router>
  );
}

export default App;