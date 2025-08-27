// src/components/Header.jsx
import { useState } from "react";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-md fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight">MeuLogo</div>


        {/* Botão menu mobile */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 flex flex-col gap-4 px-6 py-4 border-t border-gray-700">
          <a href="#" className="hover:text-purple-400 transition-colors" onClick={() => setMenuOpen(false)}>Início</a>
          <a href="#" className="hover:text-purple-400 transition-colors" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#" className="hover:text-purple-400 transition-colors" onClick={() => setMenuOpen(false)}>Serviços</a>
          <a href="#" className="hover:text-purple-400 transition-colors" onClick={() => setMenuOpen(false)}>Contato</a>
        </div>
      )}
    </header>
  );
}
