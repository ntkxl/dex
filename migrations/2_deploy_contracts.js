const TokenSwap = artifacts.require("TokenSwap");
const WaffToken = artifacts.require("WaffToken");
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer,network, accounts) {
  await deployer.deploy(TokenSwap);
  const tokenSwap = await TokenSwap.deployed();

  await deployer.deploy(WaffToken, tokenSwap.address);
  const waffToken = await WaffToken.deployed();

  await tokenSwap.addToken(waffToken.address);

  await deployer.deploy(TokenFarm)
  const tokenFarm = await TokenFarm.deployed()

  await deployer.deploy(DaiToken, tokenFarm.address)
  const daiToken = await DaiToken.deployed()


  await tokenFarm.addToken(waffToken.address,daiToken.address);

  // await deployer.deploy(TokenFarm, waffToken.address, daiToken.address)
  // const tokenFarm = await TokenFarm.deployed()



    // // Transfer 100 Mock DAI tokens to investor
    // await daiToken.transfer(accounts[0], '100000000000000000000')

    // // Transfer all tokens to TokenFarm (1 million)
    // await waffToken.transfer(tokenFarm.address, '500000000000000000000')



  // const decimal = 18;
  // await waffToken.transfer(tokenSwap.address, 1000000 * decimal);
};