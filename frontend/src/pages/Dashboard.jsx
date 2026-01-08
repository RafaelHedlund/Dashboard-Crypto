import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "chart.js/auto";
import Header from "../components/Header";
import CurrencySelector from "../components/CurrencySelector";
import Card from "../components/Card";
import Dots from "../components/Dots";
import FallbackNotice from "../components/FallbackNotice";
import Footer from "../components/Footer";
import { FALLBACK_CRYPTOS } from "../constants/fallbackCryptos";
import api from "../utils/api";

function Dashboard() {
  const [cryptos, setCryptos] = useState(FALLBACK_CRYPTOS);
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("brl");
  const [darkMode, setDarkMode] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [tableIndex, setTableIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(true);
  const navigate = useNavigate();

  const perPageTable = 12;
  const perPageCards = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/crypto", {
          params: { vs_currency: currency },
          timeout: 8000
        });
        
        if (res.data && Array.isArray(res.data) && res.data.length > 2) {
          setCryptos(res.data);
          setUsingFallback(false);
          console.log(`✅ Dados reais carregados: ${res.data.length} moedas`);
        } else {
          throw new Error("Poucas moedas retornadas");
        }
      } catch (err) {
        console.log("⚠️  Usando dados locais (fallback)");
        const conversionRates = { usd: 1, brl: 5, eur: 0.92 };
        const rate = conversionRates[currency] || 1;
        
        const fallbackConverted = FALLBACK_CRYPTOS.map(coin => ({
          ...coin,
          current_price: coin.current_price * rate,
          market_cap: coin.market_cap * rate,
          sparkline_in_7d: {
            price: coin.sparkline_in_7d.price.map(p => p * rate)
          }
        }));
        
        setCryptos(fallbackConverted);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currency]);

  useEffect(() => {
    if (!autoScroll || search || loading) return;
    const interval = setInterval(() => {
      setCardIndex((prev) =>
        prev + perPageCards >= cryptos.length ? 0 : prev + perPageCards
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [cryptos, autoScroll, search, loading]);

  useEffect(() => {
    if (!autoScroll || search || loading) return;
    const interval = setInterval(() => {
      setTableIndex((prev) =>
        prev + perPageTable >= cryptos.length ? 0 : prev + perPageTable
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [cryptos, autoScroll, search, loading]);

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

  if (loading) {
    return (
      <div className={`${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-300 text-gray-900"
      } h-screen font-sans flex flex-col items-center justify-center`}>
        <Header darkMode={darkMode} showBack={false} />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-sm">Buscando dados atualizados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      darkMode ? "bg-gray-950 text-white" : "bg-gray-300 text-gray-900"
    } min-h-screen font-sans flex flex-col`}>
      <Header darkMode={darkMode} showBack={false} />

      <div className="flex-1 pt-16 pb-4 px-3 sm:px-4 w-full flex flex-col">
        {/* Controles */}
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

        {/* Aviso discreto de fallback */}
        {usingFallback && <FallbackNotice />}

        {/* Layout principal */}
        <div className="flex flex-col xl:flex-row gap-3 w-full flex-1 min-h-0">
          {/* Coluna esquerda */}
          <div className="xl:w-3/5 flex flex-col h-full">
            <div className={`flex-1 ${
              darkMode ? 'bg-gray-800/40' : 'bg-white'
            } border rounded-lg p-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-lg h-full flex flex-col`}>
              
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

          {/* Coluna direita */}
          <div className="xl:w-2/5 flex flex-col h-full">
            <div className={`h-full flex flex-col gap-3 ${
              darkMode ? 'bg-gray-800/40' : 'bg-white'
            } border rounded-lg p-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-lg`}>
              
              {/* Top 5 */}
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

              {/* Bottom 5 */}
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

export default Dashboard;