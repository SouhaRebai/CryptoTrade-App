require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    defaultNetwork : 'localhost',
    networks : {
      hardhat : {
        url: "http://localhost:7545",
        chainId: 1337
      },
      localhost: {
        url: "http://localhost:8545",
        chainId: 1337,
        accounts:['6ed51edb2d65bf086f6d1d13a9f30fbd075c9bff19ca7018aba53f0a5b5055aa']
      },
      
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      
      },
    },
  },
};
