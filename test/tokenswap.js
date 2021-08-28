const { assert } = require('chai');
const { ethers } = require("ethers");

const TokenSwap = artifacts.require("TokenSwap");
const WaffToken = artifacts.require("WaffToken");

function toBigNum(amount) {
    return web3.utils.toWei(amount, 'ether');
}

contract('TokenSwap', ([deployer, investor]) => {

    let tokenSwap, waffToken

    before(async () => {
        tokenSwap = await TokenSwap.new()
        waffToken = await WaffToken.new(tokenSwap.address)
        await tokenSwap.addToken(waffToken.address)
    })
    
    describe('TokenSwap deployment', async()  => {
        it('contract name', async() => {
            const name = await tokenSwap.name()
            assert.equal(name, 'TokenSwap Decentralize Exchange')
        })
    
    })

    describe('WaffToken deployment', async()  => {
        it('token got name', async() => {
            const name = await waffToken.name()
            assert.equal(name, 'Waffle')
        })
        it('swapcontract has waff token', async() => {
            // console.log(tokenSwap.address);
            const balance = await waffToken.balanceOf(tokenSwap.address)
            // 1 million init supply
            // console.log(conventReadableAmount('1000000'));
            // console.log(balance);
            assert.equal(balance, toBigNum('1000000'))
        })
    })

    describe('buyWaffle()', async() => {
        let result
        // buy waff before each case
        before(async () => {
            let amount = toBigNum('1')
            result = await tokenSwap.buyWaffle(100, {from: investor, value: amount})
        })

        it('allow user to buy waff token', async() => {
            //check balance after buy waff
            let investorBalance = await waffToken.balanceOf(investor)
            assert.equal(investorBalance, toBigNum('100'))

            //check supply in swapcontract after someone buy
            let swapBalance = await waffToken.balanceOf(tokenSwap.address)
            assert.equal(swapBalance, toBigNum('999900'))
            
            //check eth balance in swapcontract
            swapBalance = await web3.eth.getBalance(tokenSwap.address)
            assert.equal(swapBalance, toBigNum('1'))

            // console.log(result.logs[0].args);
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.waff, waffToken.address)
            assert.equal(event.amount, toBigNum('100'))
            assert.equal(event.rate, '100')

        })
    })
})