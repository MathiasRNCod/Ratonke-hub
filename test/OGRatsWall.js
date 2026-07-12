const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OGRatsWall", function () {
  let ogRatsWall;
  let mockNFT;
  let owner;
  let holder;
  let nonHolder;

  beforeEach(async function () {
    [owner, holder, nonHolder] = await ethers.getSigners();

    // Deploy Mock NFT
    const MockNFT = await ethers.getContractFactory("MockERC721");
    mockNFT = await MockNFT.deploy();
    await mockNFT.waitForDeployment();

    // Deploy OGRatsWall
    const OGRatsWall = await ethers.getContractFactory("OGRatsWall");
    ogRatsWall = await OGRatsWall.deploy(await mockNFT.getAddress());
    await ogRatsWall.waitForDeployment();

    // Set balances
    await mockNFT.setBalance(holder.address, 1);
    await mockNFT.setBalance(nonHolder.address, 0);
  });

  it("should allow a holder to post a message", async function () {
    const msgText = "Hello Rats!";
    await ogRatsWall.connect(holder).postMessage(msgText);

    const messages = await ogRatsWall.getMessages();
    expect(messages.length).to.equal(1);
    expect(messages[0].message).to.equal(msgText);
    expect(messages[0].sender).to.equal(holder.address);
  });

  it("should reject messages from non-holders", async function () {
    await expect(
      ogRatsWall.connect(nonHolder).postMessage("Spam!")
    ).to.be.revertedWith("Must hold an OG Rat NFT to post");
  });

  it("should reject empty messages", async function () {
    await expect(
      ogRatsWall.connect(holder).postMessage("")
    ).to.be.revertedWith("Message cannot be empty");
  });

  it("should reject messages exceeding 280 characters", async function () {
    const longMsg = "a".repeat(281);
    await expect(
      ogRatsWall.connect(holder).postMessage(longMsg)
    ).to.be.revertedWith("Message exceeds 280 characters");
  });
});
