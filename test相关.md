
## 库

测试用的库是 chai

```js
require('chai')
  .use(require('chai-as-promised')) // 使用 promise
  .should()
```

## 相关解释

* describe
类似于分组的功能, 每一个 describe 里面可以再有一个 describe, 用来描述本组测试的信息.
describe('failure') 该组中就是测试一些错误请求, 然后期待我们的合约能够判断出这是错误的.
describe('success') 则相反.

sol 中的 require() 部分, 是断言.
describe('failure') 就是用来测试这些 require 是否断言成功的

* it
测试, 第一个参数是该测试的描述, 第二个参数就是测试代码

* should
should 函数就是用来测试的, 是否通过测试就看 should 后面

* should.be.rejectedWith(EVM_REVERT)
我们模拟了一个错误的请求方式, 然后期待我们的合约能够判断出这是错误的, 并且报错的类型与我们制定的一致(EVM_REVERT)

比如: AssertionError: expected promise to be rejected with an error including 'VM Exception while processing transaction: revert' but got 'invalid address...
这个报错就说明了我们的测试不成功, 我们期待程序检测出的错误是 `VM Exception while processing transaction: revert`,
但是程序给我们检测出的错误却是: invalid address 无效的地址

再如: AssertionError: expected promise to be rejected with an error including 'VM Exception while processing transaction: revert' but it was fulfilled with
报错已经说得很明白了, 我们期待程序发现错误, 结果他却让他直接成功通过了


* contract('Exchange', ([deployer, feeAccount, user1]) => {})
这一个应该是部署合约,

* ✓ Transaction submitted successfully. Hash: 0x...
这一个是成功的交易, 部署合约时会有 4 条交易记录, 每次 `truffle test` 的时候,
我们会发现在开始测试之前, 总会有 4 条交易, 这个就是用来部署合约的津贴吧.

* function metadata 函数元数据
在测试中, 可以看到很多函数都有一个对象参数, 比如
token.transfer(user1, tokens(100), { from: deployer }),
transfer 函数声明格式是这样的 transfer (address _to, uint256 _value)
可以看到, 并没有第三个参数用来接收 { from: deployer }
其实 { from: deployer } 这样的, 就是 function metadata,
并不需要在函数中声明

## 测试代码

```js
import { tokens, EVM_REVERT } from './helpers'

const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()


contract('Token', ([deployer, receiver, exchange]) => {

  const name = 'DAPP Token'
  const symbol = 'DAPP'
  const decimals = '18'
  const totalSupply = tokens(1000000)
  let token

  beforeEach(async () => {
    token = await Token.new()
  })

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name()
      // Check the token name is 'My name'
      result.should.equal(name)
    })
    it('tracks the symbol', async () => {
      const result = await token.symbol()
      result.should.equal(symbol)
    })
    it('tracks the decimals', async () => {
      const result = await token.decimals()
      result.toString().should.equal(decimals)
    })
    it('tracks the total supply', async () => {
      const result = await token.totalSupply()
      result.toString().should.equal(totalSupply.toString())
    })
    it('assigns the total supply to the deployer', async () => {
      const result = await token.balanceOf(deployer)
      result.toString().should.equal(totalSupply.toString())
    })
  })

  describe('sending tokens', () => {
    let result
    let amount

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(100)
        result = await token.transfer(receiver, amount, { from: deployer })
      })

      it('transfers token balances', async () => {
        let balanceOf
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        balanceOf = await token.balanceOf(receiver)
        balanceOf.toString().should.equal(tokens(100).toString())
      })
      it('emit the Transfer event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Transfer')

        const event = log.args
        event.from.toString().should.equal(deployer, 'from is correct')
        event.to.toString().should.equal(receiver, 'to is correct')
        event.value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })

    describe('failure', () => {
      it('rejects insufficient balances', async () => {
        let invalidAmount
        invalidAmount = tokens(100000000) // 100 million - greater than total supply
        await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

        // Attempt transfer tokens, when you have none
        invalidAmount = tokens(10)
        await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
      })
      it('rejects invalid recipients', async () => {
        await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
      })
    })
  })

  describe('approving tokens', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(100)
      result = await token.approve(exchange, amount, { from: deployer })
    })

    describe('success', () => {
      it('allocates an allowance for delegated token spending on exchange', async () => {
        const allowance = await token.allowance(deployer, exchange)
        allowance.toString().should.equal(amount.toString())
      })
      it('emit the Approval event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Approval')

        const event = log.args
        event._owner.toString().should.equal(deployer, 'owner is correct')
        event._spender.should.equal(exchange, 'spender is correct')
        event._value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })

    describe('failure', () => {
      it('rejects invalid spenders', async () => {
        await token.approve(0x0, amount, { from: deployer }).should.be.rejected
      })
    })
  })

  describe('delegated token transfers', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(100)
      await token.approve(exchange, amount, { from: deployer })
    })
    describe('success', () => {
      beforeEach(async () => {
        result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
      })

      it('transfers token balances', async () => {
        let balanceOf
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        balanceOf = await token.balanceOf(receiver)
        balanceOf.toString().should.equal(tokens(100).toString())
      })
      it('resets the allowance', async () => {
        const allowance = await token.allowance(deployer, exchange)
        allowance.toString().should.equal('0')
      })
      it('emit the Transfer event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Transfer')

        const event = log.args
        event.from.toString().should.equal(deployer, 'from is correct')
        event.to.toString().should.equal(receiver, 'to is correct')
        event.value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })

    describe('failure', () => {
      it('rejects insufficient balances', async () => {
        let invalidAmount
        invalidAmount = tokens(100000000) // 100 million - greater than total supply
        await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

        // Attempt transfer tokens, when you have none
        invalidAmount = tokens(10)
        await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
      })
      it('rejects invalid recipients', async () => {
        await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
      })
    })
  })

})
```