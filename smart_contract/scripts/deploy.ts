import { ethers } from "hardhat";

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const NFT = await ethers.getContractFactory("MintOZ");
  const nft = await NFT.deploy("Mint0z", "MIT");

  console.log(`NFT contract address: ${nft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
