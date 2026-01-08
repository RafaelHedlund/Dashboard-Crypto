# 🚀 Crypto Dashboard – Full Stack Project

<p align="center">
  <strong>
    Dashboard de criptomoedas em tempo real, desenvolvido com React, Vite e Tailwind CSS.<br/>
    Arquitetado com foco em código limpo, desempenho e experiência do usuário.
  </strong>
</p>

---

<h2 align="center">🛠️ Tecnologias</h2>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
</p>

---

## 📖 Visão Geral

Dashboard moderno e responsivo para monitoramento de criptomoedas em tempo real.  
Desenvolvido com **arquitetura profissional**, separação clara de responsabilidades e foco em **manutenibilidade**, sendo ideal para **portfólio** e demonstração de boas práticas.

---

## ✨ Principais Funcionalidades

- 📊 **Dados em Tempo Real** — preços atualizados de criptomoedas  
- 🎨 **Tema Dual** — modo escuro/claro com toggle suave  
- 📱 **Totalmente Responsivo** — experiência otimizada em qualquer dispositivo  
- ⚡ **Sistema de Fallback** — funciona mesmo quando a API está indisponível  
- 📈 **Gráficos Interativos** — visualização de tendências com Chart.js  
- 🔍 **Busca Avançada** — filtro por nome ou símbolo  
- 🌐 **Multi-moedas** — suporte a USD, BRL e EUR  
- 🔄 **Auto-rotação** — paginação automática opcional  

---

## 🏗️ Arquitetura do Projeto

```txt
src/
├── components/               # Componentes reutilizáveis
│   ├── Header.jsx            # Cabeçalho com navegação
│   ├── Card.jsx              # Card de criptomoeda
│   ├── CurrencySelector.jsx  # Seletor de moeda
│   ├── Dots.jsx              # Indicador de paginação
│   ├── FallbackNotice.jsx    # Aviso de modo offline
│   └── Footer.jsx            # Rodapé
├── pages/
│   └── Dashboard.jsx         # Página principal
├── constants/
│   └── fallbackCryptos.js    # Dados locais de fallback
├── utils/
│   └── api.js                # Cliente HTTP configurado
└── assets/

🚀 Começando Rápido
Pré-requisitos:
- Node.js 16+
- npm ou yarn

Instalação:

git clone https://github.com/RafaelHedlund/crypto-dashboard.git
cd crypto-dashboard/frontend
npm install
# ou
yarn install


Executar em desenvolvimento:
npm run dev
# ou
yarn dev

Acesse:
👉 http://localhost:5173


🎮 Como Usar
Controles do Dashboard

Busca — filtra por nome ou símbolo

Moeda — USD, BRL ou EUR

Visualização — Cards ou Tabela

Tema — Claro / Escuro

Auto-scroll — rotação automática dos dados

🛡️ Arquitetura Resiliente

Fonte Primária: API em tempo real

Fallback Inteligente: dados locais quando a API falha

Degradação Graciosa: experiência contínua sem quebra da UI

💡 Recursos Inteligentes

Clique em qualquer card ou linha para ver detalhes da moeda

Paginação eficiente para grandes volumes de dados

Performance otimizada com renderização inteligente