import { RefreshCw } from "lucide-react";

function FallbackNotice() {
  return (
    <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-yellow-400">
            Modo offline: Dados locais carregados
          </span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs px-2 py-0.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded transition-colors flex items-center gap-1"
        >
          <RefreshCw size={10} />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export default FallbackNotice;