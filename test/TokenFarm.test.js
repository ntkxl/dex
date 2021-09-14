const DaiToken = artifacts.require('DaiToken')
const WaffToken = artifacts.require('WaffToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, waffToken, tokenFarm

  before(async () => {
    // Load Contracts
    tokenFarm = await TokenFarm.new()
    waffToken = await WaffToken.new(tokenFarm.address)
    daiToken = await DaiToken.new()
    await tokenFarm.addToken(waffToken.address,daiToken.address)
    // let amount = toBigNum('50')
    // await tokenSwap.initDaiAmount({from: owner, value: amount})
    //tokenFarm = await TokenFarm.new(waffToken.address, daiToken.address)

    // // Transfer all Waff tokens to farm (1 million)
    // await waffToken.transfer(tokenFarm.address, tokens('1'))

    // // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Waff Token deployment', async () => {
    it('has a name', async () => {
      const name = await waffToken.name()
      assert.equal(name, 'Waffle')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Waff Token Farm')
    })

    it('contract has tokens', async () => {
      let balance_waff = await waffToken.balanceOf(tokenFarm.address)
      assert.equal(balance_waff.toString(), tokens('1000000'))
      // let balance_dai = await daiToken.balanceOf(tokenFarm.address)
      // assert.equal(balance_dai.toString(), tokens('100'))
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      let result

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })

      // Check balances after issuance
      result = await waffToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Waff Token wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor })

      // Check results after unstaking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})