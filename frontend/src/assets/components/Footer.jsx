// frontend/src/assets/components/Footer.jsx
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer({ darkMode }) {
  return (
    <footer
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
      } w-full py-4`}
    >
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs opacity-80">
            © 2024 Rafael Hedlund - Crypto Dashboard. Dados fornecidos pela{" "}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              CoinGecko API
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RafaelHedlund"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
              title="GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/rafaelhedlund/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <a
              href="mailto:rafaelhedlund@example.com"
              className="hover:text-indigo-400 transition-colors"
              title="Email"
            >
              <Mail size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}