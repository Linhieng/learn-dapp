// 这是一个专门为 truffle 建立的脚本, 代码和测试文件中的代码类似

const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000' // 0x 后面 40 个 0

const ether = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}
const tokens = (n) => ether(n)

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

module.exports = async function(callback) {
  try {
    // Fetch accounts from wallet - these are unlocked 先获取一些账户, 这些账户来源于 ganache
    const accounts = await web3.eth.getAccounts()

    // Fetch the deployed token
    const token = await Token.deployed()
    console.log('Token fetched', token.address)

    // Fetch the deployed exchange
    const exchange = await Exchange.deployed()
    console.log('Exchange fetched', exchange.address)

    console.log('///// 交易 //////////////////////////////////////////////')

    // Give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    // let amount = web3.utils.toWei('10000', 'ether') // 10,000 tokens
    let amount = ether(100000) // 10,000 tokens

    await token.transfer(receiver, amount, { from: sender })
    console.log(`交易: sender 转账(tokens) 给 receiver`)
    console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`)

    console.log(
      '//// 批准代币和存储代币 ////////////////////////////////////////////////////'
    )
    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]

    // User1 Deposits Ether 为用户存入一些代币
    amount = ether(10)
    await exchange.depositEther({ from: user1, value: amount })
    console.log('user1 存款 ether')
    console.log(`Deposited ${amount.toString()} Ether from ${user1}`)

    // User2 Approves Tokens
    amount = tokens(100000)
    await token.approve(exchange.address, amount, { from: user2 })
    console.log('user2 批准 10000 tokens')
    console.log(`Approved ${amount.toString()} tokens from ${user2}`)

    // User2 Deposits Tokens
    await exchange.depositToken(token.address, amount, { from: user2 })
    console.log('用户2 存了 10000 tokens')
    console.log(`Deposited ${amount.toString()} tokens from ${user2}`)

    //////////////////////////////////////////////////////////////
    // Seed a Cancelled Order
    //
    console.log(
      '/////// Seed a Cancelled Order //////////////////////////////////////////////////'
    )

    // User1 makes order to get tokens
    let result
    let orderId
    result = await exchange.makeOrder(
      token.address,
      tokens(500),
      ETHER_ADDRESS,
      ether(0.1),
      { from: user1 }
    )
    console.log('user1 制作(发起)了一个账单, 其中 token 100, ether 0.1')
    console.log(`Make order from ${user1}`)

    // console.log(result)
    orderId = result.logs[0].args.id
    await exchange.cancelOrder(orderId, { from: user1 })
    console.log('user1 取消了一个账单(刚刚才制作的)')
    console.log(`Cancelled order from ${user1}`)

    ////////////////////////////////////////////////////////////
    // Seed Filled Orders
    //
    console.log(
      '///////// Seed Filled Orders ///////////////////////////////////////////'
    )

    // User 1 makes order
    result = await exchange.makeOrder(
      token.address,
      tokens(500),
      ETHER_ADDRESS,
      ether(0.1),
      { from: user1 }
    )
    console.log('user1 制作了一个账单, 100tokens, 0.1ether')
    console.log(`Make order from ${user1}`)

    // User 2 fills order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log('user2 填写了账单(收钱)')
    console.log(`Filled order from ${user2}`)

    // Wait 1 second
    console.log('等一秒......')
    await wait(1)

    // User1 makes another order
    result = await exchange.makeOrder(
      token.address,
      tokens(5),
      ETHER_ADDRESS,
      ether(0.1),
      { from: user1 }
    )
    console.log('user1 又制作了一个账单')
    console.log(`Make order from ${user1}`)

    // User 2 fills another order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log('user2 又填写了一个账单')
    console.log(`Filled order from ${user2}`)

    // Wait 1 second
    console.log('等一秒......')
    await wait(1)

    // User 1 makes final order
    result = await exchange.makeOrder(
      token.address,
      tokens(2000),
      ETHER_ADDRESS,
      ether(0.51),
      { from: user1 }
    )
    console.log('user1 制作最后一个账单, 200tokens 0.15ether')
    console.log(`Make order from ${user1}`)

    // User 2 fills final order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log('user2 填写了最后一个账单')
    console.log(`Filled order from ${user2}`)

    // Wait 1 second
    console.log('等一秒......')
    await wait(1)

    /////////////////////////////////////////////////////
    // Seed Open Orders
    //
    console.log(
      '//////////// Seed Open Orders ///////////////////////////////////////'
    )

    // User1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(
        token.address,
        tokens(10 * i),
        ETHER_ADDRESS,
        ether(0.01),
        { from: user1 }
      )
      console.log(`user1 制作第 ${i} 个账单`)
      console.log(`Make order from ${user1}`)
      // Wait 1 second
      console.log('等一秒......')
      await wait(1)
    }

    // User2 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      // 为什么这里要将 token 和 ether 互换呢?
      result = await exchange.makeOrder(
        ETHER_ADDRESS,
        ether(0.01),
        token.address,
        tokens(10 * i),
        { from: user2 }
      )
      console.log(`user2 制作第 ${i} 个账单`)
      console.log(`Make order from ${user2}`)
      // Wait 1 second
      console.log('等一秒......')
      await wait(1)
    }
  } catch (error) {
    console.error(error)
  }

  callback()
}
