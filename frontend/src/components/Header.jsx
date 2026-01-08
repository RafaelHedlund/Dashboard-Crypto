import { ArrowLeft } from "lucide-react";
import { Github, Linkedin } from "lucide-react";

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

export default Header;