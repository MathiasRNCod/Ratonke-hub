---
name: ronin-wallet-connection
description: Receta para integrar Ronin Wallet con ethers.js v6 en Ratonke Hub
---

# Skill: Conexión de Ronin Wallet con Ethers.js v6

Este Skill define cómo se debe implementar la conexión a la billetera Ronin en la landing page del proyecto Ratonke Hub.

## 1. Dependencia (Ethers.js v6)
El archivo `index.html` debe importar la librería ethers.js mediante la CDN oficial antes del cierre del body:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js"></script>
```

## 2. Elementos de Interfaz requeridos en index.html
El navbar o header debe tener un botón con ID `btnConnectWallet` para accionar la conexión.
```html
<button id="btnConnectWallet" class="btn btn-ghost">
    <span class="wallet-icon">🐀</span>
    <span class="wallet-label">Conectar Ronin</span>
</button>
```

## 3. Estado de la Aplicación en app.js
En `app.js` se deben declarar variables para rastrear el estado global de la conexión:
```javascript
let userAddress = null;
let userBalance = null;
let isHolder = false;
```

## 4. Lógica de Conexión en app.js
Se debe utilizar `window.ronin` como provider. La lógica debe seguir este flujo asíncrono:

```javascript
async function connectRoninWallet() {
    if (!window.ronin) {
        alert("Por favor instala la extensión de Ronin Wallet.");
        return;
    }
    try {
        const provider = new ethers.BrowserProvider(window.ronin.provider);
        const accounts = await provider.send("eth_requestAccounts", []);
        userAddress = accounts[0];
        
        // Obtener Balance de RON
        const balanceWei = await provider.getBalance(userAddress);
        userBalance = ethers.formatEther(balanceWei);
        
        // Consultar tenencia de NFT OG Rats
        // Contrato: 0x953e34637cc596b8195eb7fb83305402d3b9d000
        const contractAddress = "0x953e34637cc596b8195eb7fb83305402d3b9d000";
        const abi = ["function balanceOf(address owner) view returns (uint256)"];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const nftCount = await contract.balanceOf(userAddress);
        isHolder = Number(nftCount) > 0;
        
        updateWalletUI();
    } catch (error) {
        console.error("Error al conectar wallet:", error);
    }
}
```

## 5. Actualización de Interfaz (updateWalletUI)
Al conectarse la wallet:
1. El botón `btnConnectWallet` debe mostrar la dirección acortada (ej: `0x1a...4b`).
2. Se debe habilitar un estilo visual de conectado (ej: cambiar el texto de "Conectar Ronin" a la dirección).
3. Si `isHolder` es `true`, mostrar un badge de "Holder" o cambiar sutilmente el color del borde del botón a dorado/lima.
