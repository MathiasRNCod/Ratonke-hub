# Ratonke Hub — Reglas del Agente

## Proyecto
- **Nombre**: Ratonke Hub
- **Qué es**: Centro de operaciones web de la marca Ratonke / comunidad OG Rats en Ronin Network
- **Objetivo**: Consolidar leaderboard, arcade, staking y futuras features en un solo sitio

## Stack
- **Frontend**: HTML5 semántico + CSS vanilla + JavaScript puro (ES6+)
- **Blockchain**: Ronin Network (mainnet chain 2020, testnet Saigon chain 2021)
- **Librería Web3**: ethers.js v6 (cuando se necesite)
- **Deploy**: Vercel (conectado a GitHub)
- **Contratos**: Solidity + Hardhat (cuando se necesite)

## Diseño
- **Identidad**: Marca "Ratonke" — estética underground, ratas, neón sobre oscuro
- **Paleta**: Fondo oscuro (#0a0a0f base), acentos neón (cian, magenta, verde lima)
- **Tipografía**: Fuentes con carácter (Space Grotesk, Permanent Marker, JetBrains Mono para código). NO usar Inter, Roboto u otras genéricas
- **Animaciones**: De alto impacto al cargar y al scrollear. Evitar micro-interacciones excesivas
- **Mobile-first**: Diseñar desde 320px, escalar a 1440px
- **Contraste**: Mínimo 4.5:1 en texto

## Reglas
- NO usar frameworks de CSS (Tailwind, Bootstrap). CSS puro siempre
- NO usar frameworks de JS (React, Vue, Next.js). Vanilla JS siempre
- NO instalar dependencias sin confirmación del usuario
- NO hacer deploys a producción sin confirmación
- Secretos y claves van en `.env`, nunca en el código
- Editar solo lo necesario, no reescribir archivos completos
- Responder siempre en español
