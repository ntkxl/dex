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

  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()


  await tokenFarm.addToken(waffToken.address,daiToken.address);

  // await deployer.deploy(TokenFarm, waffToken.address, daiToken.address)
  // const tokenFarm = await TokenFarm.deployed()



    // Transfer 100 Mock DAI tokens to investor
    await daiToken.transfer(accounts[1], 100)

    // await daiToken.transfer(accounts[0],1)

    
    // await daiToken.approve(accounts[0], 1)
    // await daiToken.connect(accounts[0]).transferFrom(daiToken.address,accounts[0],1);
    // await daiToken.transferFrom(daiToken.address,accounts[0], 1)
    //await tokenFarm.initDaiAmount({value: 5000000000000000000})
    // await deployer.deploy(TokenReceiver, token.address);
    // await tokenFarm.approve(accounts[0],1);
    // await tokenFarm.transferFrom(tokenFarm.address,accounts[0],1);
    // await tokenFarm.transfer(accounts[0],1)

    // await daiToken.increaseAllowance(accounts[0],1)
    // await daiToken.transferFrom(daiToken.address,accounts[0],1)

    

    // Transfer all tokens to TokenFarm (1 million)
    // await waffToken.transfer(tokenFarm.address, 1000000)



  // const decimal = 18;
  // await waffToken.transfer(tokenSwap.address, 1000000 * decimal);
};