import { tokens, EVM_REVERT } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {

  let token
  let exchange
  const feePercent = 10

  beforeEach(async () => {
    // deploy token
    token = await Token.new()
    // Transfer some tokens to user1
    token.transfer(user1, tokens(100), { from: deployer })
    // deploy exchange
    exchange = await Exchange.new(feeAccount, feePercent)
  })

  describe('deployment', () => {
    it('tracks the fee account', async () => {
      const result = await exchange.feeAccount()
      result.should.equal(feeAccount)
    })
    it('tacks the fee percentage', async () => {
      const result = await exchange.feePercent()
      result.toString().should.equal(feePercent.toString())
    })
  })

  describe('depositing tokens', () => {
    let amount
    let result 

    describe('success', async () => {

      beforeEach(async () => {
        amount = tokens(10)
        // approve token
        await token.approve(exchange.address, amount, { from: user1 })
        // deposit token
        result = await exchange.depositToken(token.address, amount, { from: user1 })
      })

      it('tracks the token deposit', async () => {
        // Check exchange token balance
        let balance
        balance = await token.balanceOf(exchange.address)
        balance.toString().should.equal(amount.toString())

        // check token on exchange
        balance = await exchange.tokens(token.address, user1)
        balance.toString().should.equal(amount.toString())
      })
      it('emits a Deposit event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Deposit')

        const event  = log.args
        event.token.should.equal(token.address, 'token address is correct')
        event.user.should.equal(user1, 'user address is correct')
        event.amount.toString().should.equal(amount.toString(), 'amount is correct')
        event.balance.toString().should.equal(amount.toString(), 'balance is correct')
      })

    })

    describe('failure', () => {
      it('fails when no tokens are approved', async () => {
        // Don't approve any tokens before depositing 尝试在没有获取批准的情况存入代币,这将会导致一个错误
        await exchange.depositToken(token.address, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT)
      })
    })
  })
})