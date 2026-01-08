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

export default CurrencySelector;