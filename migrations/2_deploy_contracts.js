const TokenSwap = artifacts.require("TokenSwap");
const WaffToken = artifacts.require("WaffToken");

module.exports = async function(deployer) {
  await deployer.deploy(TokenSwap);
  const tokenSwap = await TokenSwap.deployed();

  await deployer.deploy(WaffToken, tokenSwap.address);
  // const waffToken = await WaffToken.deployed();
  // const decimal = 18;
  // await waffToken.transfer(tokenSwap.address, 1000000 * decimal);
};
