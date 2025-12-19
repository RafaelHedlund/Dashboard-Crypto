import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Footer from "./assets/components/Footer";
import { Github, Linkedin, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CoinDetails from "./assets/components/CoinDetails";

// ---------------- HEADER ----------------
function Header({ darkMode, showBack, onBack }) {
  return (
    <header
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
      } w-full fixed top-0 left-0 z-50 h-12`}
    >
      <nav className="flex items-center justify-between px-4 py-3 max-w-[1920px] mx-auto">
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
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/RafaelHedlund"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/rafaelhedlund/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            <Linkedin size={16} />
          </a>
        </div>
      </nav>
    </header>
  );
}

// ---------------- SELECTOR ----------------
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
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-300"
      } px-3 py-1.5 rounded-lg border shadow-sm transition text-xs`}
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

// ---------------- CRYPTO CARD ----------------
function Card({ coin, currency, getCurrencySymbol, darkMode }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/coin/${coin.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      } p-3 border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } hover:border-purple-500 hover:shadow-md transition-all duration-200 rounded-lg h-full flex flex-col cursor-pointer`}
    >
      <div className="flex items-center mb-2">
        <img src={coin.image} alt={coin.name} className="w-8 h-8" />
        <div className="ml-2 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xs font-semibold">
                {coin.symbol.toUpperCase()}
              </h2>
              <p className="text-xs opacity-70 truncate max-w-[80px]">
                {coin.name}
              </p>
            </div>
            <p
              className={`text-xs font-semibold ${
                coin.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-500"
              }`}
            >
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </div>
          <p className="text-xs opacity-80 mt-1">
            {getCurrencySymbol(currency)}{" "}
            {coin.current_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
            })}
          </p>
        </div>
      </div>
      <p className="text-xs opacity-70 mb-1">
        Cap: {getCurrencySymbol(currency)}{" "}
        {(coin.market_cap / 1000000000).toFixed(1)}B
      </p>
      <div className="mt-auto w-full h-14">
        <Line
          options={{
            elements: { point: { radius: 0 } },
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
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
                    ? "rgb(34,197,94)"
                    : "rgb(239,68,68)",
                backgroundColor: "transparent",
                tension: 0.4,
                borderWidth: 1.5,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

// ---------------- DOTS ----------------
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
        className={`p-1 rounded ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700 disabled:opacity-30"
            : "bg-gray-200 hover:bg-gray-300 disabled:opacity-30"
        }`}
      >
        <ChevronLeft size={14} />
      </button>
      
      <div className="flex gap-1">
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
              className={`w-2 h-2 rounded-full transition ${
                currentPage === pageToShow
                  ? darkMode
                    ? "bg-indigo-400"
                    : "bg-indigo-600"
                  : darkMode
                  ? "bg-gray-600"
                  : "bg-gray-400"
              }`}
            />
          );
        })}
      </div>
      
      <button
        onClick={handleNext}
        disabled={index + perPage >= total}
        className={`p-1 rounded ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700 disabled:opacity-30"
            : "bg-gray-200 hover:bg-gray-300 disabled:opacity-30"
        }`}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ---------------- DASHBOARD (Main content) ----------------
function Dashboard() {
  const [cryptos, setCryptos] = useState([]);
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [darkMode, setDarkMode] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [tableIndex, setTableIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const navigate = useNavigate();

  const perPageTable = 8;
  const perPageCards = 6;

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: currency,
            order: "market_cap_desc",
            per_page: 100,
            page: 1,
            sparkline: true,
            price_change_percentage: "24h",
          },
          headers: {
            Accept: "application/json",
          },
        }
      );
      setCryptos(res.data);
    } catch (err) {
      console.error("Erro ao buscar criptos:", err);
    }
  };

  fetchData();
}, [currency]);


  // auto rolagem cards
  useEffect(() => {
    if (!autoScroll || search) return;
    const interval = setInterval(() => {
      setCardIndex((prev) =>
        prev + perPageCards >= cryptos.length ? 0 : prev + perPageCards
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [cryptos, autoScroll, search]);

  // auto rolagem tabela
  useEffect(() => {
    if (!autoScroll || search) return;
    const interval = setInterval(() => {
      setTableIndex((prev) =>
        prev + perPageTable >= cryptos.length ? 0 : prev + perPageTable
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [cryptos, autoScroll, search]);

  const filteredCryptos = cryptos.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const getCurrencySymbol = (cur) =>
    cur === "brl" ? "R$" : cur === "eur" ? "€" : "$";

  // listas top/bottom
  const top5 = [...cryptos]
    .sort((a, b) => b.current_price - a.current_price)
    .slice(0, 5);
  const bottom5 = [...cryptos]
    .sort((a, b) => a.current_price - b.current_price)
    .slice(0, 5);

  const handleRowClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-300 text-gray-900"
      } h-screen font-sans flex flex-col overflow-hidden`}
    >
      <Header 
        darkMode={darkMode} 
        showBack={false}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 pt-16 pb-4 px-5 max-w-[1920px] mx-auto w-full flex flex-col overflow-hidden">
        {/* CONTROLES */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-3 gap-2">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar criptomoeda..."
              className={`${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              } px-3 py-1.5 rounded-lg border shadow-sm w-full sm:w-48 text-xs`}
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
          <div className="flex flex-wrap gap-1 justify-center">
            <button
              className={`text-xs px-3 py-1.5 rounded-lg transition ${
                view === "cards"
                  ? darkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setView("cards")}
            >
              Cards
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded-lg transition ${
                view === "table"
                  ? darkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setView("table")}
            >
              Tabela
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded-lg transition ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setDarkMode((m) => !m)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              className={`text-xs px-3 py-1.5 rounded-lg transition ${
                autoScroll
                  ? darkMode
                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                    : "bg-green-100 text-green-600 border border-green-200"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setAutoScroll((a) => !a)}
            >
              {autoScroll ? "⏸️" : "▶️"}
            </button>
          </div>
        </div>

        {/* DASHBOARD - AMBAS COLUNAS COM MESMA ALTURA */}
        <div className="flex flex-col xl:flex-row gap-3 w-full flex-1 overflow-hidden">
          {/* COLUNA ESQUERDA - CARDS/TABELA */}
          <div className="xl:w-3/5 flex flex-col h-full">
            <div className={`flex-1 flex flex-col ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } border rounded-lg p-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            } overflow-hidden`}>
              {view === "cards" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 min-h-0">
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
                    <div className="mt-2">
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
                <>
                  <div className="flex-1 overflow-auto">
                    <table
                      className={`${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } w-full text-xs`}
                    >
                      <thead
                        className={`sticky top-0 ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <tr>
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left">Moeda</th>
                          <th className="px-3 py-2 text-left">Preço</th>
                          <th className="px-3 py-2 text-left">% 24h</th>
                          <th className="px-3 py-2 text-left">Cap</th>
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
                              } cursor-pointer`}
                            >
                              <td className="px-3 py-2">
                                {tableIndex + idx + 1}
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={coin.image}
                                    alt={coin.name}
                                    className="w-5 h-5"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-medium text-xs">
                                      {coin.symbol.toUpperCase()}
                                    </div>
                                    <div className="text-xs opacity-70 truncate">
                                      {coin.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-medium text-xs">
                                {getCurrencySymbol(currency)}{" "}
                                {coin.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                                })}
                              </td>
                              <td
                                className={`px-3 py-2 font-medium text-xs ${
                                  coin.price_change_percentage_24h >= 0
                                    ? "text-green-400"
                                    : "text-red-500"
                                }`}
                              >
                                {coin.price_change_percentage_24h?.toFixed(2)}%
                              </td>
                              <td className="px-3 py-2 text-xs">
                                {getCurrencySymbol(currency)}{" "}
                                {(coin.market_cap / 1000000000).toFixed(1)}B
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredCryptos.length > perPageTable && (
                    <div className="mt-2">
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

          {/* COLUNA DIREITA - TOP/BOTTOM */}
          <div className="xl:w-2/5 flex flex-col h-full">
            <div className={`flex-1 flex flex-col ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } border rounded-lg p-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            } overflow-hidden`}>
              {/* TOP 5 */}
              <div className="flex-1 flex flex-col mb-3 min-h-0">
                <h3 className="text-xs font-semibold mb-2 flex items-center">
                  <span className="mr-1">💎</span> Top 5 - Maior Preço
                </h3>
                <div className="flex-1 overflow-auto min-h-0">
                  <table className="w-full text-xs">
                    <thead
                      className={`sticky top-0 ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <tr>
                        <th className="p-1 text-left">#</th>
                        <th className="p-1 text-left">Moeda</th>
                        <th className="p-1 text-right">Preço</th>
                        <th className="p-1 text-right">% 24h</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top5.map((coin, idx) => (
                        <tr
                          key={coin.id}
                          onClick={() => handleRowClick(coin.id)}
                          className={`border-t ${
                            darkMode
                              ? "border-gray-700 hover:bg-gray-700/50"
                              : "border-gray-200 hover:bg-gray-50"
                          } cursor-pointer`}
                        >
                          <td className="p-1 text-center">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? "bg-yellow-500 text-white"
                                  : idx === 1
                                  ? "bg-gray-400 text-white"
                                  : idx === 2
                                  ? "bg-amber-700 text-white"
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              {idx + 1}
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="flex items-center gap-1">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-5 h-5"
                              />
                              <div className="font-medium">
                                {coin.symbol.toUpperCase()}
                              </div>
                            </div>
                          </td>
                          <td className="p-1 text-right font-medium">
                            {getCurrencySymbol(currency)}{" "}
                            {coin.current_price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                            })}
                          </td>
                          <td
                            className={`p-1 text-right font-medium ${
                              coin.price_change_percentage_24h >= 0
                                ? "text-green-400"
                                : "text-red-500"
                            }`}
                          >
                            {coin.price_change_percentage_24h?.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOTTOM 5 */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold mb-2 flex items-center">
                  <span className="mr-1">💰</span> Top 5 - Menor Preço
                </h3>
                <div className="flex-1 overflow-auto min-h-0">
                  <table className="w-full text-xs">
                    <thead
                      className={`sticky top-0 ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <tr>
                        <th className="p-1 text-left">#</th>
                        <th className="p-1 text-left">Moeda</th>
                        <th className="p-1 text-right">Preço</th>
                        <th className="p-1 text-right">% 24h</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bottom5.map((coin, idx) => (
                        <tr
                          key={coin.id}
                          onClick={() => handleRowClick(coin.id)}
                          className={`border-t ${
                            darkMode
                              ? "border-gray-700 hover:bg-gray-700/50"
                              : "border-gray-200 hover:bg-gray-50"
                          } cursor-pointer`}
                        >
                          <td className="p-1 text-center">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? "bg-blue-500 text-white"
                                  : idx === 1
                                  ? "bg-gray-400 text-white"
                                  : idx === 2
                                  ? "bg-amber-700 text-white"
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              {idx + 1}
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="flex items-center gap-1">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-5 h-5"
                              />
                              <div className="font-medium">
                                {coin.symbol.toUpperCase()}
                              </div>
                            </div>
                          </td>
                          <td className="p-1 text-right font-medium">
                            {getCurrencySymbol(currency)}{" "}
                            {coin.current_price.toLocaleString(undefined, {
                              minimumFractionDigits: coin.current_price > 1000 ? 0 : 2,
                              maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                            })}
                          </td>
                          <td
                            className={`p-1 text-right font-medium ${
                              coin.price_change_percentage_24h >= 0
                                ? "text-green-400"
                                : "text-red-500"
                            }`}
                          >
                            {coin.price_change_percentage_24h?.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

// ---------------- MAIN APP COMPONENT ----------------
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