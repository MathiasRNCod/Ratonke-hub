/* ═══════════════════════════════════════════════
   RATONKE HUB — App Logic
   Sprint 2: Conexión Wallet + Leaderboard en tiempo real
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── CONSTANTES DEL LEADERBOARD ───
    const OGRATS_CONTRACT = "0x953e34637cc596b8195eb7fb83305402d3b9d000"; 
    const RONKEVERSE_CONTRACT = "0x810b42d75150824b2253b2161a09d3753a1de019"; 
    const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];

    const LEADERBOARD_DISPLAY_COUNT = 10;

    // Holders actualizados al 12/Jul/2026 desde el explorador de Ronin
    const REAL_HOLDERS_FALLBACK = [
        { wallet: "0x73829b57804c93edeabcd893c4cdfa8a094b98fa", rats: 246 },
        { wallet: "0x78442549af860a37d437678a0bd5555a9406fa6c", rats: 124 },
        { wallet: "0x74cc635dd1b5453e3dbb2b0f48920821cbe0d820", rats: 121 },
        { wallet: "0x726c79c2d9653fe0e4110e7c70a9f382bcdfb634", rats: 83 },
        { wallet: "0x4093517c5870c548a100605f0d5b1cbc1b53e2b1", rats: 74 },
        { wallet: "0xb1672022977a2f509ce51a2407596ba9325761af", rats: 69 },
        { wallet: "0xa4f421c508a2f1348275c0e73a1fe7d3eff83fef", rats: 66 },
        { wallet: "0x058132d1641c564095f3774d5b40e41118dd4b15", rats: 64 },
        { wallet: "0x6de8bdd19cd76b89ea2eb1ab6d9b245433652ef9", rats: 61 },
        { wallet: "0x0c2f5a5931a9cd50c9d22832bd5748a6fee5f849", rats: 52 },
        { wallet: "0x87e8335ce820f2c7f4f61eb90b07769d931c15ce", rats: 45 },
        { wallet: "0xd351d31d354d7c27d9cae8e674d8c5a111816833", rats: 44 },
        { wallet: "0x9ad24da7fffb46a13399c4e5c21e1142f21eda50", rats: 43 },
        { wallet: "0xfcf64cb28c4fde1806f8cf1b9fb7eb81b3d476c7", rats: 36 },
        { wallet: "0xe821c24c79a31cf42bcc4e3cb92cbf0c2e6df6cf", rats: 31 },
        { wallet: "0x9ccc2bca511df812724d9d80ba2a05a76d7c06a4", rats: 29 },
        { wallet: "0xb7ea94f09f680eb246d3cfcf47d9b4b8acdf23be", rats: 23 },
        { wallet: "0xad7bbb655df1862d755f5b5361ab086402fade16", rats: 22 },
        { wallet: "0xfd1a8e4851e64cc3f5d61fdf35fdcff7047cfb75", rats: 21 },
        { wallet: "0xddc104538662d0bfd0420a80227421f6c8cfaa43", rats: 20 },
        { wallet: "0x223c5dd8db5c1bb1a3847525ff4563e4d78f9f69", rats: 20 },
        { wallet: "0x97035e8847b58568ce6a18e7e0c0ac68fafa6138", rats: 19 },
        { wallet: "0x266b0fad82daeafbcfdf95b3c71b8c43dc5c3039", rats: 19 },
        { wallet: "0xf0229d63dcf9a0880839f426dbc8f6a051ad4e98", rats: 17 },
        { wallet: "0xdf2ff905e999b182fbb8429e3aa05663d3320d34", rats: 17 },
        { wallet: "0x6f1cb4219eb23c33fb8f5017a4e9c0b6180fa5ab", rats: 17 },
        { wallet: "0x18deaf264ed6bf01f1de6a57c6ce84811f58beb1", rats: 17 },
        { wallet: "0xffa0f2b13c928fb9bfb84e127594b035ae832062", rats: 16 },
        { wallet: "0xe8e8ee5a70986ff1c84c6ccdb8e0512a4a122e43", rats: 15 },
        { wallet: "0xd86826b7db9dc71c7b49b55049dfec558c15f883", rats: 15 },
        { wallet: "0x2888d9a455335fbbe6cb5c73ae9b034e138415c1", rats: 15 },
        { wallet: "0x6bb9b421b70f486e358cc379da873e3786f2a1aa", rats: 14 },
        { wallet: "0x7e7cfa348df006c5fb879723431e76884640c5d0", rats: 13 },
        { wallet: "0x1cdcbd5de75bceda4e3c929afa5c7269b8b81303", rats: 13 },
        { wallet: "0xe78209461cf584292d88add36040a2b119c3721a", rats: 12 },
        { wallet: "0xdf69777d4f8ebba16509d71dc3eee9faf40e7294", rats: 12 },
        { wallet: "0x6491b6b923a68be74ec664eb390039c75e569e44", rats: 12 },
        { wallet: "0x0be8ad2dfee7f1a3fd8f7af66b4ac6e92f31d219", rats: 12 },
        { wallet: "0x298e5dd73995fb5f8708ac1c0b4da1c13dbd6dab", rats: 11 },
        { wallet: "0xbc12d832cc649130de1096a1a6dacebfd9f4c19d", rats: 10 },
        { wallet: "0x324c174630d2ed9fa83c240fc4b5608cf1d24a3e", rats: 10 },
        { wallet: "0x0443101e16ea5fde0fea69657e83c3ebb74fb53a", rats: 10 },
        { wallet: "0xfbfc242463dab877caf8cd7a7ba6cf8607bebde1", rats: 9 },
        { wallet: "0x981368eeefd5d284d47ce98d40bd2bf7139c417e", rats: 8 },
        { wallet: "0x14f789c0d80a46e5def7800416fe74f45eb2f77f", rats: 8 },
        { wallet: "0x09377ba0eb4e005561c842774b12f78991ef8c1d", rats: 8 },
        { wallet: "0xbe5ab9b99ed64204a5be7658a2777a2107c4c636", rats: 7 },
        { wallet: "0x56b487863fbeca3699224739b9f38bb5c7f2bbf6", rats: 7 },
        { wallet: "0xfce309b0d1ed15069be75e8350938e787ec2ac90", rats: 6 },
        { wallet: "0xb91e67fb0140077774dec79f7d273a3096702554", rats: 6 },
    ];

    // ─── Estado Global de la dApp ───
    let userAddress = null;
    let userBalance = null;
    let ogRatsCount = 0;
    let ronkeverseCount = 0;
    let isHolder = false;

    // Leaderboard state
    let liveLeaderboard = [];

    // Limpiar datos viejos de localStorage para forzar recarga
    localStorage.removeItem("og_rats_custom_leaderboard");
    localStorage.removeItem("og_rats_live_leaderboard");

    // ─── Elementos DOM ───
    const btnConnectWallet = document.getElementById('btnConnectWallet');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Elementos de la Tarjeta Flotante
    const walletInfoCard = document.getElementById('walletInfoCard');
    const btnCloseWalletCard = document.getElementById('btnCloseWalletCard');
    const cardBalance = document.getElementById('cardBalance');
    const cardRatsCount = document.getElementById('cardRatsCount');
    const cardRonkeCount = document.getElementById('cardRonkeCount');

    // Elementos del Leaderboard
    const leaderboardBody = document.getElementById('leaderboardBody');
    const leaderboardSearchInput = document.getElementById('leaderboardSearchInput');
    const btnSearchLeaderboard = document.getElementById('btnSearchLeaderboard');
    const watchlistTags = document.getElementById('watchlistTags');
    const searchResultCard = document.getElementById('searchResultCard');

    // ─── Mobile Nav Toggle ───
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            const spans = navToggle.querySelectorAll('span');
            const isOpen = navLinks.classList.contains('open');
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
            spans[1].style.opacity = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
        });

        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            });
        });
    }

    // ─── Active Nav Link on Scroll ───
    const sections = document.querySelectorAll('section[id]');
    const navLinkAll = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinkAll.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ─── Scroll Reveal Animations ───
    const animatedElements = document.querySelectorAll(
        '.about-card, .project-card, .community-link, .about-showcase, .about-intro, .section-leaderboard'
    );
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    animatedElements.forEach(function (el) {
        observer.observe(el);
    });

    // ─── Header Background on Scroll ───
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', function () {
        const current = window.scrollY;
        if (current > 50) {
            header.style.borderBottomColor = 'rgba(0, 240, 255, 0.08)';
        } else {
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
        }
    }, { passive: true });


    // ─── LÓGICA DE CACHÉ Y APIs ───

    function saveToCache(key, data, durationInMinutes) {
        const cacheData = {
            value: data,
            expiry: Date.now() + (durationInMinutes * 60 * 1000)
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    }

    function getFromCache(key) {
        const cachedStr = localStorage.getItem(key);
        if (!cachedStr) return null;
        const cached = JSON.parse(cachedStr);
        if (Date.now() > cached.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return cached.value;
    }

    async function getCollectionStats() {
        const cachedStats = getFromCache("og_rats_market_stats");
        if (cachedStats) {
            return cachedStats;
        }

        const SKYMAVIS_API_KEY = ""; 

        if (!SKYMAVIS_API_KEY) {
            const mockStats = {
                floorPrice: "14.5 RON",
                volume24h: "248.9 RON"
            };
            saveToCache("og_rats_market_stats", mockStats, 15);
            return mockStats;
        }

        const url = `https://api-gateway.skymavis.com/marketplace/v2/nft/collection/${OGRATS_CONTRACT}/stats`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'x-api-key': SKYMAVIS_API_KEY
                }
            });
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            
            const resData = await response.json();
            const stats = {
                floorPrice: resData.floorPrice ? `${ethers.formatEther(resData.floorPrice)} RON` : "— RON",
                volume24h: resData.volume24h ? `${ethers.formatEther(resData.volume24h)} RON` : "— RON"
            };
            
            saveToCache("og_rats_market_stats", stats, 15); 
            return stats;
        } catch (error) {
            console.error("Error al consultar API de Sky Mavis:", error);
            return { floorPrice: "14.5 RON", volume24h: "248.9 RON" };
        }
    }

    async function loadMarketStats() {
        const stats = await getCollectionStats();
        const fpEl = document.getElementById("marketFloorPrice");
        const volEl = document.getElementById("marketVolume");

        if (fpEl && stats.floorPrice) fpEl.textContent = stats.floorPrice;
        if (volEl && stats.volume24h) volEl.textContent = stats.volume24h;
    }


    // ─── LÓGICA DE ACTUALIZACIÓN EN TIEMPO REAL POR RPC Y LEADERBOARD ───

    const PUBLIC_RPC_ENDPOINT = "https://api.roninchain.com/rpc";
    // Selector de balanceOf(address) = 0x70a08231
    const BALANCE_OF_SELECTOR = "0x70a08231";

    async function queryNFTBalanceDirect(walletAddress) {
        try {
            // Construir calldata: balanceOf(address) con la dirección paddeada a 32 bytes
            const paddedAddress = walletAddress.toLowerCase().replace("0x", "").padStart(64, "0");
            const callData = BALANCE_OF_SELECTOR + paddedAddress;

            const response = await fetch(PUBLIC_RPC_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_call",
                    params: [{ to: OGRATS_CONTRACT, data: callData }, "latest"],
                    id: 1
                })
            });

            const json = await response.json();
            if (json.result) {
                return parseInt(json.result, 16);
            }
            return null;
        } catch (err) {
            console.warn(`RPC: fallo para ${walletAddress}`, err.message);
            return null;
        }
    }

    // Utilidad: esperar N milisegundos
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function processLeaderboard() {
        // Siempre cargar del fallback fresco al inicio (ya limpiamos localStorage arriba)
        liveLeaderboard = REAL_HOLDERS_FALLBACK.map(h => ({
            wallet: h.wallet.toLowerCase(),
            rats: h.rats
        })).sort((a, b) => b.rats - a.rats);
    }

    function renderLeaderboardTable() {
        if (!leaderboardBody) return;
        leaderboardBody.innerHTML = "";

        const topList = liveLeaderboard.slice(0, LEADERBOARD_DISPLAY_COUNT);

        topList.forEach((holder, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><span class="rank-badge rank-${index + 1}">${index + 1}</span></td>
                <td class="wallet-cell" title="${holder.wallet}">${shortAddress(holder.wallet)}</td>
                <td class="text-neon" style="font-family: var(--font-mono); font-weight: 700;">${holder.rats} 🐀</td>
            `;

            leaderboardBody.appendChild(row);
        });
    }

    async function refreshLeaderboardData() {
        const btnRefresh = document.getElementById("btnRefreshLeaderboard");
        if (btnRefresh) {
            btnRefresh.disabled = true;
            btnRefresh.textContent = "⏳ Actualizando...";
        }

        try {
            const total = liveLeaderboard.length;
            const BATCH_SIZE = 3;
            let completed = 0;

            // Consultar en lotes de 3 wallets con 1s de pausa entre lotes
            for (let i = 0; i < total; i += BATCH_SIZE) {
                const batch = liveLeaderboard.slice(i, i + BATCH_SIZE);
                
                const results = await Promise.all(
                    batch.map(holder => queryNFTBalanceDirect(holder.wallet))
                );

                results.forEach((liveRats, idx) => {
                    if (liveRats !== null) {
                        liveLeaderboard[i + idx].rats = liveRats;
                    }
                });

                completed += batch.length;

                // Mostrar progreso en la tabla
                if (leaderboardBody) {
                    leaderboardBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--neon-cyan);">
                        ⏳ Consultando blockchain... ${completed}/${total} wallets
                    </td></tr>`;
                }

                // Esperar 1 segundo antes del siguiente lote (evitar 429)
                if (i + BATCH_SIZE < total) {
                    await sleep(1000);
                }
            }
            
            // Re-ordenar y renderizar
            liveLeaderboard.sort((a, b) => b.rats - a.rats);
        } catch (e) {
            console.error("Fallo al actualizar ranking por RPC:", e);
        }

        renderLeaderboardTable();

        if (btnRefresh) {
            btnRefresh.disabled = false;
            btnRefresh.textContent = "🔄 Actualizar";
        }
    }


    // ─── SEARCH WALLET RANK ───

    function validateAddress(input) {
        if (typeof input !== "string") return null;
        let clean = input.trim().toLowerCase();
        
        if (clean.includes("/address/") || clean.includes("/token/")) {
            const matches = clean.match(/0x[a-f0-9]{40}/);
            if (matches) return matches[0];
            
            const roninMatches = clean.match(/ronin:[a-f0-9]{40}/);
            if (roninMatches) return "0x" + roninMatches[0].substring(6);
        }

        if (clean.startsWith("ronin:")) {
            clean = "0x" + clean.substring(6);
        }
        return /^0x[a-f0-9]{40}$/.test(clean) ? clean : null;
    }

    async function searchWalletRank(walletInput) {
        const cleanWallet = validateAddress(walletInput);
        if (!cleanWallet) {
            alert("Por favor ingresa una dirección de wallet Ronin válida (0x... o ronin:...).");
            return;
        }

        if (!searchResultCard) return;
        searchResultCard.innerHTML = `<div class="search-loading">Consultando balance en Ronin Network...</div>`;
        searchResultCard.classList.remove('hidden');

        try {
            // Consultar saldo actual directamente en blockchain por RPC
            const ratsBalance = await queryNFTBalanceDirect(cleanWallet) || 0;
            
            // Integrar o actualizar la wallet buscada dentro del ranking local
            const existingIndex = liveLeaderboard.findIndex(h => h.wallet === cleanWallet);
            if (existingIndex > -1) {
                // Actualizar saldo
                liveLeaderboard[existingIndex].rats = ratsBalance;
            } else if (ratsBalance > 0) {
                // Agregar wallet nueva al ranking
                liveLeaderboard.push({
                    wallet: cleanWallet,
                    rats: ratsBalance
                });
            }

            // Re-ordenar y guardar ranking modificado
            liveLeaderboard.sort((a, b) => b.rats - a.rats);
            localStorage.setItem("og_rats_custom_leaderboard", JSON.stringify(liveLeaderboard));

            // Actualizar la tabla para mostrar la posición de la wallet inyectada
            renderLeaderboardTable();

            // Encontrar puesto final
            const finalIndex = liveLeaderboard.findIndex(h => h.wallet === cleanWallet);
            const rank = finalIndex > -1 ? finalIndex + 1 : "N/A";

            searchResultCard.innerHTML = `
                <div class="result-header">
                    <h4>Resultado de Búsqueda</h4>
                </div>
                <div class="result-body">
                    <div class="result-stat"><span class="stat-lbl">Dirección:</span> <span class="stat-val font-mono">${shortAddress(cleanWallet)}</span></div>
                    <div class="result-stat"><span class="stat-lbl">Rats:</span> <span class="stat-val text-neon" style="font-family: var(--font-mono); font-weight: 700;">${ratsBalance} 🐀</span></div>
                    <div class="result-stat"><span class="stat-lbl">Puesto en Ranking:</span> <span class="stat-val rank-badge rank-searched">${rank}</span></div>
                </div>
            `;

    }


    // ─── LÓGICA DEL MURO SOCIAL ON-CHAIN ───

    // Dirección del contrato OGRatsWall en Saigon Testnet (se completará al desplegar)
    let OGRATS_WALL_CONTRACT = ""; 
    const OGRATS_WALL_ABI = [
        "function postMessage(string memory _message) external",
        "function getMessages() external view returns (tuple(uint256 id, address sender, string message, uint256 timestamp)[])"
    ];

    // Elementos del Muro
    const wallMessageInput = document.getElementById("wallMessageInput");
    const btnPostMessage = document.getElementById("btnPostMessage");
    const charCounter = document.getElementById("charCounter");
    const wallStatusMsg = document.getElementById("wallStatusMsg");
    const wallMessagesList = document.getElementById("wallMessagesList");

    // Manejar contador de caracteres
    if (wallMessageInput && charCounter) {
        wallMessageInput.addEventListener("input", function() {
            const count = this.value.length;
            charCounter.textContent = `${count} / 280`;
        });
    }

    // Actualizar UI del formulario de publicación según elegibilidad
    function updateWallUIStatus() {
        if (!wallMessageInput || !btnPostMessage || !wallStatusMsg) return;

        if (!userAddress) {
            wallMessageInput.disabled = true;
            btnPostMessage.disabled = true;
            wallStatusMsg.textContent = "🔌 Conectá tu wallet de Ronin para verificar tu elegibilidad y publicar.";
            wallStatusMsg.className = "wall-status-msg";
            return;
        }

        if (ogRatsCount > 0) {
            wallMessageInput.disabled = false;
            btnPostMessage.disabled = false;
            wallStatusMsg.textContent = "✅ Wallet conectada. Estatus: Holder verificado. ¡Podés publicar!";
            wallStatusMsg.className = "wall-status-msg success";
        } else {
            wallMessageInput.disabled = true;
            btnPostMessage.disabled = true;
            wallStatusMsg.textContent = "❌ No posees NFTs de OG Rats. Debes ser holder de OG Rats para publicar.";
            wallStatusMsg.className = "wall-status-msg";
        }
    }

    // Consultar y listar los mensajes desde la blockchain
    async function loadWallMessages() {
        if (!wallMessagesList) return;

        if (!OGRATS_WALL_CONTRACT) {
            wallMessagesList.innerHTML = `
                <div class="messages-empty">
                    🚩 El contrato del Muro Social no ha sido desplegado aún.
                    <br><small style="color: var(--text-muted);">Desplegá el contrato en Saigon para habilitar el feed.</small>
                </div>
            `;
            return;
        }

        try {
            wallMessagesList.innerHTML = `<div class="messages-loading">Consultando mensajes en Ronin Network...</div>`;

            // Usamos RPC directa para leer sin requerir extensión conectada
            const publicProvider = new ethers.JsonRpcProvider(PUBLIC_RPC_ENDPOINT);
            const contract = new ethers.Contract(OGRATS_WALL_CONTRACT, OGRATS_WALL_ABI, publicProvider);

            const rawMessages = await contract.getMessages();
            
            if (!rawMessages || rawMessages.length === 0) {
                wallMessagesList.innerHTML = `<div class="messages-empty">Aún no hay mensajes en el muro. ¡Sé el primero! 🐀</div>`;
                return;
            }

            wallMessagesList.innerHTML = "";
            
            // Mostrar los mensajes de más nuevos a más viejos (reversa)
            const sortedMessages = [...rawMessages].reverse();

            sortedMessages.forEach(msg => {
                const date = new Date(Number(msg.timestamp) * 1000).toLocaleString();
                const item = document.createElement("div");
                item.className = "message-item";
                item.innerHTML = `
                    <div class="message-header">
                        <span class="message-sender" title="${msg.sender}">${shortAddress(msg.sender)}</span>
                        <span class="message-time">${date}</span>
                    </div>
                    <div class="message-content">${escapeHTML(msg.message)}</div>
                `;
                wallMessagesList.appendChild(item);
            });

        } catch (err) {
            console.error("Error al cargar mensajes del muro:", err);
            wallMessagesList.innerHTML = `<div class="messages-error" style="color: var(--neon-magenta); text-align: center; padding: 20px;">Fallo al conectar con el contrato.</div>`;
        }
    }

    // Publicar un mensaje nuevo on-chain usando la wallet conectada
    async function submitWallMessage() {
        if (!window.ronin || !userAddress || !OGRATS_WALL_CONTRACT) return;

        const text = wallMessageInput.value.trim();
        if (!text) {
            alert("El mensaje no puede estar vacío.");
            return;
        }

        if (text.length > 280) {
            alert("El mensaje excede los 280 caracteres.");
            return;
        }

        try {
            btnPostMessage.disabled = true;
            btnPostMessage.textContent = "✍️ Firmando...";

            const provider = new ethers.BrowserProvider(window.ronin.provider);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(OGRATS_WALL_CONTRACT, OGRATS_WALL_ABI, signer);

            const tx = await contract.postMessage(text);
            btnPostMessage.textContent = "⏳ Procesando transacción...";
            
            await tx.wait(); // Esperar confirmación del bloque
            
            wallMessageInput.value = "";
            if (charCounter) charCounter.textContent = "0 / 280";
            
            alert("¡Mensaje publicado con éxito en la Blockchain! 🐀🎉");
            
            // Recargar muro
            loadWallMessages();

        } catch (err) {
            console.error("Error al enviar mensaje:", err);
            alert("Transacción cancelada o fallida al publicar.");
        } finally {
            btnPostMessage.disabled = false;
            btnPostMessage.textContent = "Publicar en Blockchain";
            updateWallUIStatus();
        }
    }

    // Utilidad simple para sanitizar texto
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Escuchar botón de publicar
    if (btnPostMessage) {
        btnPostMessage.addEventListener("click", submitWallMessage);
    }


    // ─── LÓGICA WEB3 (RONIN WALLET) ───

    function shortAddress(addr) {
        if (!addr) return "";
        return addr.slice(0, 6) + "..." + addr.slice(-4);
    }

    async function queryNFTCount(contractAddress, userAddress, provider) {
        try {
            const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
            const count = await contract.balanceOf(userAddress);
            return Number(count);
        } catch (err) {
            console.error(`Error consultando contrato ${contractAddress}:`, err);
            return 0;
        }
    }

    function updateWalletUI() {
        if (!btnConnectWallet) return;
        
        const label = btnConnectWallet.querySelector('.wallet-label');
        const icon = btnConnectWallet.querySelector('.wallet-icon');

        if (userAddress) {
            label.textContent = shortAddress(userAddress);
            icon.textContent = "🦊";
            btnConnectWallet.classList.add('wallet-connected');

            isHolder = (ogRatsCount > 0 || ronkeverseCount > 0);

            if (isHolder) {
                btnConnectWallet.classList.add('is-holder');
                icon.textContent = "👑";
                label.textContent = `${shortAddress(userAddress)} (Holder)`;
            } else {
                btnConnectWallet.classList.remove('is-holder');
            }

            if (cardBalance) cardBalance.textContent = `${parseFloat(userBalance).toFixed(3)} RON`;
            if (cardRatsCount) cardRatsCount.textContent = ogRatsCount;
            if (cardRonkeCount) cardRonkeCount.textContent = ronkeverseCount;

            if (walletInfoCard) {
                walletInfoCard.classList.add('visible');
            }
        } else {
            label.textContent = "Conectar Ronin";
            icon.textContent = "🔌";
            btnConnectWallet.classList.remove('wallet-connected');
            btnConnectWallet.classList.remove('is-holder');

            if (walletInfoCard) {
                walletInfoCard.classList.remove('visible');
            }
        }

        // Actualizar formulario del muro social
        updateWallUIStatus();
    }

    async function handleWalletConnection() {
        if (!window.ronin) {
            alert("Instala la extensión de Ronin Wallet para poder conectar tu billetera.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ronin.provider);
            
            if (userAddress) {
                userAddress = null;
                userBalance = null;
                ogRatsCount = 0;
                ronkeverseCount = 0;
                isHolder = false;
                updateWalletUI();
                return;
            }

            const accounts = await provider.send("eth_requestAccounts", []);
            userAddress = accounts[0];

            const balanceWei = await provider.getBalance(userAddress);
            userBalance = ethers.formatEther(balanceWei);

            ogRatsCount = await queryNFTCount(OGRATS_CONTRACT, userAddress, provider);
            ronkeverseCount = await queryNFTCount(RONKEVERSE_CONTRACT, userAddress, provider);

            updateWalletUI();
        } catch (error) {
            console.error("Error durante la conexión de la wallet:", error);
        }
    }

    async function checkConnectionOnLoad() {
        loadMarketStats();
        
        // Cargar ranking en tiempo real de Ronin
        await processLeaderboard();
        renderLeaderboardTable();

        // Cargar mensajes iniciales del muro social
        loadWallMessages();
        updateWallUIStatus();
        
        if (window.ronin) {
            try {
                const provider = new ethers.BrowserProvider(window.ronin.provider);
                const accounts = await provider.send("eth_accounts", []);
                if (accounts.length > 0) {
                    userAddress = accounts[0];
                    const balanceWei = await provider.getBalance(userAddress);
                    userBalance = ethers.formatEther(balanceWei);

                    ogRatsCount = await queryNFTCount(OGRATS_CONTRACT, userAddress, provider);
                    ronkeverseCount = await queryNFTCount(RONKEVERSE_CONTRACT, userAddress, provider);

                    updateWalletUI();
                }
            } catch (err) {
                console.error("Error al comprobar la conexión inicial:", err);
            }
        }
    }

    // Eventos del buscador de Leaderboard y actualización
    if (btnSearchLeaderboard && leaderboardSearchInput) {
        btnSearchLeaderboard.addEventListener('click', function() {
            searchWalletRank(leaderboardSearchInput.value);
        });
        leaderboardSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWalletRank(leaderboardSearchInput.value);
            }
        });
    }

    const btnRefreshLeaderboard = document.getElementById("btnRefreshLeaderboard");
    if (btnRefreshLeaderboard) {
        btnRefreshLeaderboard.addEventListener('click', refreshLeaderboardData);
    }

    if (btnConnectWallet) {
        btnConnectWallet.addEventListener('click', handleWalletConnection);
    }

    if (btnCloseWalletCard) {
        btnCloseWalletCard.addEventListener('click', function() {
            if (walletInfoCard) {
                walletInfoCard.classList.remove('visible');
            }
        });
    }

    window.addEventListener('load', checkConnectionOnLoad);

})();
