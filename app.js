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

    const LAUNCH_TIMESTAMP = new Date("2026-06-06T00:00:00-03:00").getTime();
    const LEADERBOARD_DISPLAY_COUNT = 15;

    // Fallback de holders originales (wallet + rats)
    const REAL_HOLDERS_FALLBACK = [
        { wallet: "0x058132d1641c564095f3774d5b40e41118dd4b15", rats: 134 },
        { wallet: "0xb1672022977a2f509ce51a2407596ba9325761af", rats: 100 },
        { wallet: "0xbc12d832cc649130de1096a1a6dacebfd9f4c19d", rats: 99 },
        { wallet: "0x726c79c2d9653fe0e4110e7c70a9f382bcdfb634", rats: 91 },
        { wallet: "0x78442549af860a37d437678a0bd5555a9406fa6c", rats: 88 },
        { wallet: "0x97035e8847b58568ce6a18e7e0c0ac68fafa6138", rats: 68 },
        { wallet: "0x4093517c5870c548a100605f0d5b1cbc1b53e2b1", rats: 59 },
        { wallet: "0xdf2ff905e999b182fbb8429e3aa05663d3320d34", rats: 58 },
        { wallet: "0x87e8335ce820f2c7f4f61eb90b07769d931c15ce", rats: 45 },
        { wallet: "0xa4f421c508a2f1348275c0e73a1fe7d3eff83fef", rats: 40 },
        { wallet: "0x0c2f5a5931a9cd50c9d22832bd5748a6fee5f849", rats: 35 },
        { wallet: "0xd97d53f1e531b3ddd0a730c7bb191d15d41bc1a0", rats: 33 },
        { wallet: "0xe821c24c79a31cf42bcc4e3cb92cbf0c2e6df6cf", rats: 31 },
        { wallet: "0xcc96f1221e7bf4d51df410e0c3baed3536f1a53c", rats: 31 },
        { wallet: "0x9ccc2bca511df812724d9d80ba2a05a76d7c06a4", rats: 28 },
        { wallet: "0x7e7cfa348df006c5fb879723431e76884640c5d0", rats: 25 },
        { wallet: "0x09377ba0eb4e005561c842774b12f78991ef8c1d", rats: 25 },
        { wallet: "0x64fda10b9a653eccc2c17f6ed0c6f2ca41698f32", rats: 24 },
        { wallet: "0x0be8ad2dfee7f1a3fd8f7af66b4ac6e92f31d219", rats: 24 },
        { wallet: "0xad7bbb655df1862d755f5b5361ab086402fade16", rats: 22 },
        { wallet: "0xfd1a8e4851e64cc3f5d61fdf35fdcff7047cfb75", rats: 21 },
        { wallet: "0x9ccff351c83204323bba5b9098d5a023527f1e76", rats: 20 },
        { wallet: "0x9ad24da7fffb46a13399c4e5c21e1142f21eda50", rats: 20 },
        { wallet: "0x6de8bdd19cd76b89ea2eb1ab6d9b245433652ef9", rats: 20 },
        { wallet: "0x223c5dd8db5c1bb1a3847525ff4563e4d78f9f69", rats: 20 },
        { wallet: "0x18deaf264ed6bf01f1de6a57c6ce84811f58beb1", rats: 20 },
        { wallet: "0xd2ef0f7ab27ca3f474285bb38918671058684999", rats: 19 },
        { wallet: "0xffa0f2b13c928fb9bfb84e127594b035ae832062", rats: 16 },
        { wallet: "0xf3ebef48227a8ccb7fa376096a97448fbef41fbe", rats: 15 },
        { wallet: "0xe8e8ee5a70986ff1c84c6ccdb8e0512a4a122e43", rats: 15 },
        { wallet: "0xe8e8ee5a70986ff1c84c6ccdb8e0512a4a122e43", rats: 15 },
        { wallet: "0xe812f82ce6eeac242035cab5ccba3889c56ca776", rats: 15 },
        { wallet: "0xd86826b7db9dc71c7b49b55049dfec558c15f883", rats: 15 },
        { wallet: "0xc56cab75f4bc3bb99513a3dfcda7840ccffda559", rats: 15 },
        { wallet: "0xbe5ab9b99ed64204a5be7658a2777a2107c4c636", rats: 15 },
        { wallet: "0x3d59d5679f04300fd1a9c5406bc02e6724631454", rats: 15 },
        { wallet: "0xec9e915ef7d7b2b366a49b3f3b95da92a1a8fcdc", rats: 14 },
        { wallet: "0x17430f9b237d5d48bf9e5a75291c25ace99236de", rats: 14 },
        { wallet: "0x6491b6b923a68be74ec664eb390039c75e569e44", rats: 13 },
        { wallet: "0x298e5dd73995fb5f8708ac1c0b4da1c13dbd6dab", rats: 13 },
        { wallet: "0xe78209461cf584292d88add36040a2b119c3721a", rats: 12 },
        { wallet: "0xf0229d63dcf9a0880839f426dbc8f6a051ad4e98", rats: 11 },
        { wallet: "0x4339faeac769054857611920358d4b1ab5ee83aa", rats: 11 },
        { wallet: "0x15c37772a4cd89d750e5a9a5ba550539a87f5967", rats: 11 },
        { wallet: "0xfcf64cb28c4fde1806f8cf1b9fb7eb81b3d476c7", rats: 10 },
        { wallet: "0xed17034f524de9ee706dc42d4ce52e121e6dd0ea", rats: 10 },
        { wallet: "0xc81d8b5e724f3bffe87f0a302c83fe56d1ab6949", rats: 10 },
        { wallet: "0x6bb9b421b70f486e358cc379da873e3786f2a1aa", rats: 10 },
        { wallet: "0x5596a3d0fcb90581d424c29e280aeb4c3a31d0c7", rats: 10 },
        { wallet: "0xfbfc242463dab877caf8cd7a7ba6cf8607bebde1", rats: 9 },
        { wallet: "0xe7b2f7ee4e3c69f33f684cfa29a15e74da8cbafe", rats: 9 }
    ];

    // ─── Estado Global de la dApp ───
    let userAddress = null;
    let userBalance = null;
    let ogRatsCount = 0;
    let ronkeverseCount = 0;
    let isHolder = false;

    // Leaderboard state
    let liveLeaderboard = [];
    let watchlist = [];

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


    // ─── LÓGICA DE CÁLCULO DE PUNTOS Y LEADERBOARD ───

    function getElapsedHours() {
        return Math.max(0, (Date.now() - LAUNCH_TIMESTAMP) / (1000 * 60 * 60));
    }

    function calculateDynamicPoints(rats, wallet) {
        const base = rats * 10;
        const elapsed = getElapsedHours();
        
        let multiplier = 1.0;
        if (rats >= 10) multiplier = 1.25;
        else if (rats >= 5) multiplier = 1.1;

        const accumulated = Math.floor(rats * elapsed * multiplier);
        
        // Cargar deducciones locales
        const deductionsStr = localStorage.getItem('og_rats_deductions');
        let deductedAmount = 0;
        if (deductionsStr) {
            const decObj = JSON.parse(deductionsStr);
            const userDecs = decObj[wallet.toLowerCase()];
            if (userDecs && Array.isArray(userDecs)) {
                deductedAmount = userDecs.reduce((sum, r) => sum + (r.amount || 0), 0);
            }
        }

        return Math.max(0, base + accumulated - deductedAmount);
    }

    function processLeaderboard() {
        liveLeaderboard = REAL_HOLDERS_FALLBACK.map(h => {
            const wallet = h.wallet.toLowerCase();
            return {
                wallet,
                rats: h.rats,
                points: calculateDynamicPoints(h.rats, wallet)
            };
        }).sort((a, b) => b.points - a.points);
    }

    function renderLeaderboardTable() {
        if (!leaderboardBody) return;
        leaderboardBody.innerHTML = "";

        const topList = liveLeaderboard.slice(0, LEADERBOARD_DISPLAY_COUNT);

        topList.forEach((holder, index) => {
            const isFav = watchlist.includes(holder.wallet);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><span class="rank-badge rank-${index + 1}">${index + 1}</span></td>
                <td class="wallet-cell" title="${holder.wallet}">${shortAddress(holder.wallet)}</td>
                <td>${holder.rats} 🐀</td>
                <td class="points-cell text-neon">${holder.points.toLocaleString()}</td>
                <td>
                    <button class="btn-fav" data-wallet="${holder.wallet}">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </td>
            `;

            leaderboardBody.appendChild(row);
        });

        // Eventos para botones de favoritos
        document.querySelectorAll('.btn-fav').forEach(btn => {
            btn.addEventListener('click', function() {
                const w = this.getAttribute('data-wallet');
                toggleWatchlist(w);
            });
        });
    }


    // ─── WATCHLIST (FAVORITOS) ───

    function loadWatchlist() {
        const stored = localStorage.getItem('og_rats_watchlist');
        watchlist = stored ? JSON.parse(stored) : [];
        renderWatchlistTags();
    }

    function renderWatchlistTags() {
        if (!watchlistTags) return;
        watchlistTags.innerHTML = "";

        if (watchlist.length === 0) {
            watchlistTags.innerHTML = `<span class="watchlist-empty">No tienes favoritos aún.</span>`;
            return;
        }

        watchlist.forEach(w => {
            const tag = document.createElement('span');
            tag.className = 'watchlist-tag';
            tag.innerHTML = `
                <span class="tag-label" data-wallet="${w}">${shortAddress(w)}</span>
                <span class="tag-remove" data-wallet="${w}">&times;</span>
            `;
            watchlistTags.appendChild(tag);
        });

        // Evento de búsqueda rápida
        document.querySelectorAll('.watchlist-tag .tag-label').forEach(lbl => {
            lbl.addEventListener('click', function() {
                const w = this.getAttribute('data-wallet');
                if (leaderboardSearchInput) {
                    leaderboardSearchInput.value = w;
                    searchWalletRank(w);
                }
            });
        });

        // Evento de remover
        document.querySelectorAll('.watchlist-tag .tag-remove').forEach(rm => {
            rm.addEventListener('click', function(e) {
                e.stopPropagation();
                const w = this.getAttribute('data-wallet');
                toggleWatchlist(w);
            });
        });
    }

    function toggleWatchlist(wallet) {
        const clean = wallet.toLowerCase();
        const index = watchlist.indexOf(clean);

        if (index > -1) {
            watchlist.splice(index, 1);
        } else {
            if (watchlist.length >= 3) {
                alert("Solo puedes guardar un máximo de 3 favoritos.");
                return;
            }
            watchlist.push(clean);
        }

        localStorage.setItem('og_rats_watchlist', JSON.stringify(watchlist));
        renderWatchlistTags();
        renderLeaderboardTable();
    }


    // ─── SEARCH WALLET RANK ───

    function validateAddress(input) {
        if (typeof input !== "string") return null;
        let clean = input.trim().toLowerCase();
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
        searchResultCard.innerHTML = `<div class="search-loading">Consultando balance en Ronin...</div>`;
        searchResultCard.classList.remove('hidden');

        try {
            // Intentar consultar saldo real en red Ronin (si está disponible window.ronin)
            let ratsBalance = 0;
            if (window.ronin) {
                const provider = new ethers.BrowserProvider(window.ronin.provider);
                const contract = new ethers.Contract(OGRATS_CONTRACT, ERC721_ABI, provider);
                const count = await contract.balanceOf(cleanWallet);
                ratsBalance = Number(count);
            } else {
                // Fallback de búsqueda local si no hay provider inyectado
                const found = liveLeaderboard.find(h => h.wallet === cleanWallet);
                ratsBalance = found ? found.rats : 0;
            }

            const points = calculateDynamicPoints(ratsBalance, cleanWallet);
            
            // Estimar puesto
            const existingIndex = liveLeaderboard.findIndex(h => h.wallet === cleanWallet);
            let rank = "N/A";
            if (existingIndex > -1) {
                rank = existingIndex + 1;
            } else if (ratsBalance > 0) {
                const prospectiveIndex = liveLeaderboard.findIndex(e => points > e.points);
                rank = prospectiveIndex === -1 ? liveLeaderboard.length + 1 : prospectiveIndex + 1;
            }

            const isFav = watchlist.includes(cleanWallet);

            searchResultCard.innerHTML = `
                <div class="result-header">
                    <h4>Resultado de Búsqueda</h4>
                    <button class="btn-fav" id="btnFavSearchResult" data-wallet="${cleanWallet}">
                        ${isFav ? '★ Favorito' : '☆ Agregar Favoritos'}
                    </button>
                </div>
                <div class="result-body">
                    <div class="result-stat"><span class="stat-lbl">Dirección:</span> <span class="stat-val font-mono">${shortAddress(cleanWallet)}</span></div>
                    <div class="result-stat"><span class="stat-lbl">Rats:</span> <span class="stat-val">${ratsBalance} 🐀</span></div>
                    <div class="result-stat"><span class="stat-lbl">Puntos:</span> <span class="stat-val text-neon">${points.toLocaleString()}</span></div>
                    <div class="result-stat"><span class="stat-lbl">Puesto Estimado:</span> <span class="stat-val rank-badge rank-searched">${rank}</span></div>
                </div>
            `;

            const btnFavSearch = document.getElementById('btnFavSearchResult');
            if (btnFavSearch) {
                btnFavSearch.addEventListener('click', function() {
                    const w = this.getAttribute('data-wallet');
                    toggleWatchlist(w);
                    searchWalletRank(w); // Recargar estado visual
                });
            }

        } catch (err) {
            console.error("Error en búsqueda:", err);
            searchResultCard.innerHTML = `<div class="search-error">No se pudo consultar el saldo en la red. Intenta de nuevo.</div>`;
        }
    }


    // ─── LÓGICA WEB3 (RONIN WALLET) ───

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
        
        // Cargar Leaderboard y favoritos
        processLeaderboard();
        loadWatchlist();
        renderLeaderboardTable();
        
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

    // Eventos del buscador de Leaderboard
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
