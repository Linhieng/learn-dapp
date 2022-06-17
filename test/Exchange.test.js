import { tokens, EVM_REVERT, ETHER_ADDRESS, ether } from './helpers'

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

  describe('fallback', () => {
    it('reverts when Ether is send' ,async () => {
      // 直接向交易所发钱, 测试交易所是否会拒绝并退钱. (应该是这样吧)
      await exchange.sendTransaction({ value: ether(1), from: user1 }).should.be.rejectedWith(EVM_REVERT)
    })
  })

  describe('depositing Ether', async () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      result = await exchange.depositEther({ from: user1, value: amount })
    })

    it('tracks the Ether deposit', async () => {
      // 进行交易, user1 存储, 存到了 exchange 中. balance 是 user1 在交易所的余额
      const balance = await exchange.tokens(ETHER_ADDRESS, user1)
      balance.toString().should.equal(amount.toString())
    })
    it('emits a Deposit event', async () => {
      const log = result.logs[0]
      log.event.should.eq('Deposit')

      const event  = log.args
      event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
      event.user.should.equal(user1, 'user address is correct')
      event.amount.toString().should.equal(amount.toString(), 'amount is correct')
      event.balance.toString().should.equal(amount.toString(), 'balance is correct')
    })
  })

  describe('withdraws Ether func', async () => {
    let result
    let amount

    beforeEach(async () => {
      // Deposit Ether first
      amount = ether(1)
      result = await exchange.depositEther({ from: user1, value: amount })
    })

    describe('success', async () => {
      beforeEach(async () => {
        // Withdraw Ether
        result = await exchange.withdrawEther(amount, { from: user1 })
      })

      it('withdraws Ether funds', async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1)
        balance.toString().should.equal('0')
      })
      it('emits a "Withdraw" event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Withdraw')

        const event = log.args
        event.token.should.equal(ETHER_ADDRESS)
        event.user.should.equal(user1)
        event.amount.toString().should.equal(amount.toString())
        event.balance.toString().should.equal('0')
      })
    })

    describe('failure', async () => {
      it('rejects withdraws for insufficient balance', async () => {
        // 测试转账 100 ether, 因为我们没有存入 100 ether, 所以此时交易所应该拒绝这笔交易
        await exchange.withdrawEther(ether(100), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT)
      })
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
      it('rejects Ether deposit', async () => {
        // 这里的地址是 ETHER, sol 中的 require(_token != ETHER) 将会断言为假
        await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT)
      })
      it('fails when no tokens are approved', async () => {
        // Don't approve any tokens before depositing 尝试在没有获取批准的情况存入代币,这将会导致一个错误
        await exchange.depositToken(token.address, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT)
      })
    })
  })

  describe('withdrawing tokens', async () => {
    let result
    let amount

    describe('success', async () => {
      beforeEach(async () => {
        // deposit token  to exchange from user1
        amount = tokens(10)
        await token.approve(exchange.address, amount, { from: user1 }) // approve token first
        result = await exchange.depositToken(token.address, amount, { from: user1 }) // deposit token secondly

        // withdraw token
        result = await exchange.withdrawToken(token.address, amount, { from: user1 })
      })

      it('withdraw Token func', async () => {
        const balance = await exchange.tokens(token.address, user1) // from user1
        balance.toString().should.be.equal('0')
      })
      it('emits a "Withdraw" event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Withdraw')

        const event = log.args
        event.token.should.equal(token.address)
        event.user.should.equal(user1)
        event.amount.toString().should.be.equal(amount.toString())
        event.balance.toString().should.be.equal('0')
      })
    })

    describe('failure', async () => {
      it('reject Ether withdraws', async () => { // test require(_token != ETHER);
        await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT)
      })
      it('reject for insufficient balances', async () => { // test require(tokens[_token][msg.sender] >= _amount);
        // Attempt to withdraw tokens without depositing any first
        await exchange.withdrawToken(token.address, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT)
      })
    })

  })

  describe('checking user balance', async () => {
    beforeEach(async () => {
      await exchange.depositEther({ from: user1, value: ether(1) })
    })

    it('returns user balance', async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
      result.toString().should.equal(ether(1).toString())
    })

  })
})