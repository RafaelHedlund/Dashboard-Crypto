// frontend/src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Footer from "./assets/components/Footer";
import { Github, Linkedin } from "lucide-react";

// ---------------- HEADER ----------------
function Header({ darkMode }) {
  return (
    <header
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
      } w-full shadow-lg fixed top-0 left-0 z-50`}
    >
      <nav className="flex items-center justify-between px-6 py-4 max-w-[1920px] mx-auto">
        <div className="text-2xl font-bold tracking-tight font-poppins">
          🚀 Rafael Hedlund –{" "}
          <span className="text-indigo-500">Crypto Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/RafaelHedlund"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/rafaelhedlund/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </nav>
    </header>
  );
}

// ---------------- NEWS--------------
function NewsTicker({ news, darkMode }) {
  return (
    <div 
      className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} w-full py-2 overflow-hidden fixed top-16 z-40`}
      style={{ height: '40px' }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mx-4 px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-100'} text-sm font-medium transition-all`}
          >
            📰 {item.title.length > 80 ? item.title.substring(0, 80) + '...' : item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------------- SELECTOR ----------------
function CurrencySelector({ currency, setCurrency, darkMode }) {
  const currencies = [
    { code: "usd", symbol: "$", flag: "🇺🇸", emoji: "💵", name: "Dólar" },
    { code: "brl", symbol: "R$", flag: "🇧🇷", emoji: "💵", name: "Real" },
    { code: "eur", symbol: "€", flag: "🇪🇺", emoji: "💶", name: "Euro" },
  ];
  return (
    <select
      className={`${
        darkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-300"
      } px-3 py-2 rounded-xl border shadow-sm transition`}
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
    >
      {currencies.map((cur) => (
        <option key={cur.code} value={cur.code}>
          {cur.flag} {cur.emoji} {cur.name}
        </option>
      ))}
    </select>
  );
}

// ---------------- CRYPTO CARD ----------------
function Card({ coin, currency, getCurrencySymbol, darkMode }) {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
      } p-4 border-2 border-transparent hover:border-purple-500 
      hover:shadow-[0_0_15px_#a855f7] transition-all duration-300 rounded-xl h-full flex flex-col`}
    >
      <div className="flex items-center mb-3">
        <img src={coin.image} alt={coin.name} className="w-14 h-14" />
        <div className="ml-3">
          <h2 className="text-lg font-semibold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h2>
          <p className="text-sm opacity-80">
            {getCurrencySymbol(currency)} {coin.current_price.toLocaleString()}
          </p>
          <p
            className={`text-sm font-semibold mt-1 ${
              coin.price_change_percentage_24h >= 0
                ? "text-green-400"
                : "text-red-500"
            }`}
          >
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
      </div>
      <p className="text-xs opacity-70 mb-3">
        Market Cap: {getCurrencySymbol(currency)}{" "}
        {coin.market_cap.toLocaleString()}
      </p>
      <div className="mt-auto w-full h-24">
        <Line
          options={{
            elements: { point: { radius: 0 } },
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
            maintainAspectRatio: false,
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
                tension: 0.3,
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
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setIndex(i * perPage)}
          className={`w-3 h-3 rounded-full transition ${
            index / perPage === i
              ? darkMode
                ? "bg-indigo-400"
                : "bg-indigo-600"
              : darkMode
              ? "bg-gray-600"
              : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------- APP ----------------
function App() {
  const [cryptos, setCryptos] = useState([]);
  const [news, setNews] = useState([]);
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [darkMode, setDarkMode] = useState(true);

  // controle carrossel
  const [cardIndex, setCardIndex] = useState(0);
  const [tableIndex, setTableIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  const perPageTable = 10;
  const perPageCards = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/crypto", {
          params: { per_page: 100, page: 1, vs_currency: currency },
        });
        setCryptos(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news");
        setNews(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    fetchNews();
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

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen font-sans flex flex-col`}
    >


      <div className="flex-1 pt-32 pb-12 px-6 max-w-[1920px] mx-auto w-full">
        {/* CONTROLES */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Buscar criptomoeda..."
              className={`${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              } px-4 py-2 rounded-xl border shadow-sm w-full sm:w-64`}
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
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              className={`${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white"
              } px-4 py-2 rounded-xl shadow-md transition`}
              onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
            >
              {view === "cards" ? "📊 Tabela" : "🗂️ Cards"}
            </button>
            <button
              className={`${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              } px-4 py-2 rounded-xl shadow-md transition`}
              onClick={() => setDarkMode((m) => !m)}
            >
              {darkMode ? "☀️ Claro" : "🌙 Dark"}
            </button>
            <button
              className={`${
                darkMode
                  ? "bg-purple-700 hover:bg-purple-600"
                  : "bg-purple-500 hover:bg-purple-400 text-white"
              } px-4 py-2 rounded-xl shadow-md transition`}
              onClick={() => setAutoScroll((a) => !a)}
            >
              {autoScroll ? "⏸️ Auto" : "▶️ Auto"}
            </button>
          </div>
        </div>

        {/* DASHBOARD 60/40 */}
        <div className="flex flex-col xl:flex-row gap-6 w-full">
          {/* CARDS / TABELA - LADO ESQUERDO */}
          <div className="xl:w-3/5 flex flex-col">
            {view === "cards" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
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
                {filteredCryptos.length > 0 && (
                  <Dots
                    total={filteredCryptos.length}
                    index={cardIndex}
                    setIndex={setCardIndex}
                    perPage={perPageCards}
                    darkMode={darkMode}
                  />
                )}
              </>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl shadow-lg">
                  <table
                    className={`${
                      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                    } w-full table-auto text-sm text-center`}
                  >
                    <thead
                      className={`${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3 text-left">Moeda</th>
                        <th className="px-4 py-3">Preço</th>
                        <th className="px-4 py-3">% 24h</th>
                        <th className="px-4 py-3">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCryptos
                        .slice(tableIndex, tableIndex + perPageTable)
                        .map((coin, idx) => (
                          <tr key={coin.id} className={idx % 2 === 0 ? (darkMode ? "bg-gray-900" : "bg-gray-100") : ""}>
                            <td className="px-4 py-3">{tableIndex + idx + 1}</td>
                            <td className="px-4 py-3 flex items-center gap-2">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6"
                              />
                              <span className="truncate max-w-[120px]">
                                {coin.name} ({coin.symbol.toUpperCase()})
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {getCurrencySymbol(currency)}{" "}
                              {coin.current_price.toLocaleString()}
                            </td>
                            <td
                              className={`px-4 py-3 font-semibold ${
                                coin.price_change_percentage_24h >= 0
                                  ? "text-green-400"
                                  : "text-red-500"
                              }`}
                            >
                              {coin.price_change_percentage_24h?.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3">
                              {getCurrencySymbol(currency)}{" "}
                              {coin.market_cap.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {filteredCryptos.length > 0 && (
                  <Dots
                    total={filteredCryptos.length}
                    index={tableIndex}
                    setIndex={setTableIndex}
                    perPage={perPageTable}
                    darkMode={darkMode}
                  />
                )}
              </>
            )}
          </div>

{/* LADO DIREITO */}
<div className="xl:w-2/5 flex flex-col gap-8 ">
  {/* Os ativos digitais com maior preço unitário */}
  <div className={` p-2 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} h-60 `}>
    <h3 className="text-sm font-semibold mb-1 flex items-center justify-center">
      <span className="mr-1">💎</span> Os ativos digitais com maior preço unitário
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} text-left`}>
          <tr className="h-7">
            <th className="p-2 w-6">#</th>
            <th className="p-2">Moeda</th>
            <th className="p-2 text-right">Preço</th>
          </tr>
        </thead>
        <tbody>
          {top5.map((coin, idx) => (
            <tr key={coin.id} className="h-6">
              <td className="p-2 text-center">{idx + 1}</td>
              <td className="p-1 flex items-center gap-1">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-5"
                />
                <span className="truncate max-w-[60px]">
                  {coin.symbol.toUpperCase()}
                </span>
              </td>
              <td className="p-2 text-right font-medium">
                {getCurrencySymbol(currency)} {coin.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: coin.current_price < 1 ? 6 : 2
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Os ativos digitais com menor preço unitário */}
  <div className={`p-2 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} h-60`}>
    <h3 className="text-sm font-semibold mb-1 flex items-center justify-center">
      <span className="mr-1">💰</span> Os ativos digitais com menor preço unitário
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} text-left`}>
          <tr className="h-7">
            <th className="p-2 w-6">#</th>
            <th className="p-2">Moeda</th>
            <th className="p-1 text-right">Preço</th>
          </tr>
        </thead>
        <tbody>
          {bottom5.map((coin, idx) => (
            <tr key={coin.id} className="h-6">
              <td className="p-2 text-center">{idx + 1}</td>
              <td className="p-1 flex items-center gap-1">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-5"
                />
                <span className="truncate max-w-[60px]">
                  {coin.symbol.toUpperCase()}
                </span>
              </td>
              <td className="p-2 text-right font-medium">
                {getCurrencySymbol(currency)} {coin.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: coin.current_price < 1 ? 6 : 2
                })}
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

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;