import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/z7ym6BSTIPD9Yfuzw9Y4fQQ7gcth__cd`,
      accounts: ['e5d7b9b49423712a4791b208f0c285729d34b4b5e31a8f3b3fdc44dde1057a0e']
    },
    rinkeby:{
      url: `https://eth-rinkeby.alchemyapi.io/v2/Ul-ViD5jLVnDwzLM5iBl0Oq2wx5nDhu7`,
      accounts: ['e5d7b9b49423712a4791b208f0c285729d34b4b5e31a8f3b3fdc44dde1057a0e']
    }
  }
};

export default config;
