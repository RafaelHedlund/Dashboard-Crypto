// frontend/src/assets/components/Footer.jsx
import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

function Footer({ darkMode }) {
  return (
    <footer
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
      } w-full shadow-inner mt-12`}
    >
      <div className="max-w-[1920px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Texto */}
        <p className="text-sm">
          © 2025 Rafael Hedlund
        </p>

        {/* Contatos */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:rafaelhedlund1104@gmail.com"
            className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
          >
            <Mail size={16} /> rafaelhedlund1104@gmail.com
          </a>
          <a
            href="https://github.com/RafaelHedlund"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/rafaelhedlund/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
