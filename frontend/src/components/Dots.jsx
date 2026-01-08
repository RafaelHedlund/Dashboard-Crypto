import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default Dots;