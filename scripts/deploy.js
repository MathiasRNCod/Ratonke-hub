const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // 1. Desplegar Mock NFT (para Saigon Testnet)
  const MockNFT = await ethers.getContractFactory("MockERC721");
  const mockNFT = await MockNFT.deploy();
  await mockNFT.waitForDeployment();
  const mockNFTAddress = await mockNFT.getAddress();
  console.log("MockERC721 desplegado en:", mockNFTAddress);

  // Darle saldo de 1 a la cuenta desplegadora para poder probar de inmediato
  await mockNFT.setBalance(deployer.address, 1);
  console.log("Balance de Mock NFT seteado a 1 para:", deployer.address);

  // 2. Desplegar OGRatsWall apuntando al Mock NFT
  const OGRatsWall = await ethers.getContractFactory("OGRatsWall");
  const ogRatsWall = await OGRatsWall.deploy(mockNFTAddress);
  await ogRatsWall.waitForDeployment();
  const wallAddress = await ogRatsWall.getAddress();
  console.log("OGRatsWall desplegado en:", wallAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
