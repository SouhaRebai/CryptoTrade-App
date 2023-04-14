const hre = require("hardhat");

const main = async() => {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  //will generate instances of the smart contract called 
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  //deploy one specific instance -- no parameters needed
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log('Transactions contract deployed to: ',transactions.address  );
}

const runMain = async() => {
  try {
    await main();
    process.exit(0); //process went successfully
  } catch (error) {
    console.error(error);
    process.exit(1);//process failed
  }
}
runMain();
