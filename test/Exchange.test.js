import { tokens, EVM_REVERT, ETHER_ADDRESS, ether } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {

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

  describe('making orders', async () => {
    let result

    beforeEach(async () => {
      result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
    })

    it('tracks the newly created order', async () => {
      const orderCount = await exchange.orderCount()
      orderCount.toString().should.equal('1') // 1 是第一个订单的 id

      const order = await exchange.orders('1') // 取出 id 为 1 的订单
      order.id.toString().should.equal('1', 'id is correct')
      order.user.should.equal(user1, 'user is correct')
      order.tokenGet.should.equal(token.address, 'tokenGet is correct')
      order.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
      order.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
      order.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
      order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
    })
    it('emits an "Order" event', async () => {
      const log = result.logs[0]
      log.event.should.eq('Order')

      const event = log.args
      event.id.toString().should.equal('1', 'id is correct')
      event.user.should.equal(user1, 'user is correct')
      event.tokenGet.should.equal(token.address, 'tokenGet is correct')
      event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
      event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
      event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
      event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
    })
  })

  describe('order actions', async () => {
    beforeEach(async () => {
      // user1 deposits ether. user1 存款 1 ether
      await exchange.depositEther({ from: user1, value: ether(1) })

      // deployer give token to user2. deployer 给 user2 发 100 tokens
      await token.transfer(user2, tokens(100), { from: deployer })
      // user2 deposits tokens only. user2 只收 2 tokens (?), 并将对 2 tokens 进行存款
      await token.approve(exchange.address, tokens(2), { from: user2 })
      await exchange.depositToken(token.address, tokens(2), { from: user2 })

      // user 1 makes an order to buy tokens with Ether. user1 创建订单, 即 user1 是 “_user”, 订单中 token=1, ether=1
      await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
    })

    describe('filling orders', async () => {
      let result

      describe('success', async () => {
        beforeEach(async () => {
          console.log('填写订单: filling orders === success === beforeEach === exchange.fillOrder === begin')
          // user2 fills order. user2 填写订单, 即 user2 是 “msg.sender”. 他将会接收到 1 token 和 1 ether
          result = await exchange.fillOrder('1', { from: user2 })
          console.log('填写订单: filling orders === success === beforeEach === exchange.fillOrder === end')
        })

        it('executes the trade & charges fees', async () => {
          let balance
          balance = await exchange.balanceOf(token.address, user1) // 获取 user1 的 token 余额
          balance.toString().should.equal(tokens(1).toString(), 'user1 received tokens')
          balance = await exchange.balanceOf(ETHER_ADDRESS, user2)  // 获取 user2 的 ether 余额
          balance.toString().should.equal(ether(1).toString(), 'user2 received Ether')
          balance = await exchange.balanceOf(ETHER_ADDRESS, user1)  // 获取 user1 的 ether 余额
          balance.toString().should.equal('0', 'user1 Ether deducted')
          balance = await exchange.balanceOf(token.address, user2)  // 获取 user2 的 token 余额(扣除了小费)
          balance.toString().should.equal(tokens(0.9).toString(), 'user2 tokens deducted with fee applied')

          const feeAccount = await exchange.feeAccount()
          balance = await exchange.balanceOf(token.address, feeAccount)
          balance.toString().should.equal(tokens(0.1).toString(), 'feeAccount received fee')
        })
        it('updates filled orders', async () => {
          const orderFilled = await exchange.orderFilled(1)
          orderFilled.should.equal(true)
        })
        it('emits a "Trade" event', async () => {
          const log = result.logs[0]
          log.event.should.eq('Trade')

          const event = log.args
          event.id.toString().should.equal('1', 'id is correct')
          event.user.should.equal(user1, 'user is correct')
          event.tokenGet.should.equal(token.address, 'tokenGet is correct')
          event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
          event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
          event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
          event.userFill.should.equal(user2, 'userFill is correct')
          event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })

      describe('failure', async () => {
        it('rejects invalid order ids', async () => {
          const invalidOrderId = 99999
          await exchange.fillOrder(invalidOrderId, { from: user2 }).should.be.rejectedWith(EVM_REVERT)
        })
        it('rejects already-filled orders', async () => {
          // Fill the order
          await exchange.fillOrder('1', { from: user2 }).should.be.fulfilled
          // Try to fill it again
          await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
        })
        it('rejects cancelled orders', async () => {
          // Cancel the order
          await exchange.cancelOrder('1', { from: user1 }).should.be.fulfilled
          // Try to fill the order
          await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
        })
      })
    })

    describe('cancelling orders', async () => {
      let result

      describe('success', async () => {
        beforeEach(async () => {
          result = await exchange.cancelOrder(1, { from: user1 })
        })

        it('updates cancelled orders', async () => {
          const orderCancelled = await exchange.orderCancelled(1)
          orderCancelled.should.equal(true)
        })
        it('emits a "Cancel" event', async () => {
          const log = result.logs[0]
          log.event.should.eq('Cancel')

          const event = log.args
          event.id.toString().should.equal('1', 'id is correct')
          event.user.should.equal(user1, 'user is correct')
          event.tokenGet.should.equal(token.address, 'tokenGet is correct')
          event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
          event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
          event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
          event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })

      describe('failure', async () => {
        it('rejects invalid order ids', async () => {
          const invalidOrderId = 99999
          await exchange.cancelOrder(invalidOrderId, { from: user1 })
            .should.be.rejectedWith(EVM_REVERT)
        })
        it('rejects unauthorized cancellations', async () => {
          // Try to cancel the order from another user
          await exchange.cancelOrder('1', { from: user2 })
            .should.be.rejectedWith(EVM_REVERT)
        })
      })
    })
  })



})