/* ═══════════════════════════════════════════════
   RATONKE HUB — App Logic
   Sprint 1: Conexión de Ronin Wallet + Tarjeta Flotante
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Estado Web3 Global ───
    let userAddress = null;
    let userBalance = null;
    let ogRatsCount = 0;
    let ronkeverseCount = 0;
    let isHolder = false;

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
        '.about-card, .project-card, .community-link, .about-showcase, .about-intro'
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


    // ─── LÓGICA WEB3 (RONIN WALLET) ───

    const OGRATS_CONTRACT = "0x953e34637cc596b8195eb7fb83305402d3b9d000"; 
    const RONKEVERSE_CONTRACT = "0x810b42d75150824b2253b2161a09d3753a1de019"; 
    const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];

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

            // Determinar si es holder de cualquiera de las dos colecciones
            isHolder = (ogRatsCount > 0 || ronkeverseCount > 0);

            if (isHolder) {
                btnConnectWallet.classList.add('is-holder');
                icon.textContent = "👑";
                label.textContent = `${shortAddress(userAddress)} (Holder)`;
            } else {
                btnConnectWallet.classList.remove('is-holder');
            }

            // Actualizar y mostrar Tarjeta Flotante
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
                // Desconectar
                userAddress = null;
                userBalance = null;
                ogRatsCount = 0;
                ronkeverseCount = 0;
                isHolder = false;
                updateWalletUI();
                return;
            }

            // Solicitar conexión
            const accounts = await provider.send("eth_requestAccounts", []);
            userAddress = accounts[0];

            // Cargar balance de RON
            const balanceWei = await provider.getBalance(userAddress);
            userBalance = ethers.formatEther(balanceWei);

            // Cargar colecciones
            ogRatsCount = await queryNFTCount(OGRATS_CONTRACT, userAddress, provider);
            ronkeverseCount = await queryNFTCount(RONKEVERSE_CONTRACT, userAddress, provider);

            updateWalletUI();
        } catch (error) {
            console.error("Error durante la conexión de la wallet:", error);
        }
    }

    async function checkConnectionOnLoad() {
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
