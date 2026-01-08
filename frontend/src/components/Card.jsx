import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";

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

export default Card;