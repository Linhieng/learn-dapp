/**
 * 获取数据的操作是在这里面
 * 在这里面获取到数据后
 * 通过 dispatch 调用 action
 * 然后就可以将数据存储进 redux 了
 *
 * interactions: 交互. 这个交互, 指的应该是 action 和 reducers 之间的
 * 这里的内容就是加载我们所需要的数据, 从名称也可以看出——load
 */

import Web3 from 'web3'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {
  web3Loaded,
  web3AccountLoaded,
  tokenLoaded,
  exchangeLoaded,
  cancelledOrdersLoaded,
  filledOrdersLoaded,
  allOrdersLoaded,
  orderCancelling,
  orderCancelled,
  //
  orderFilling,
  orderFilled,
  //
  etherBalanceLoaded,
  tokenBalanceLoaded,
  exchangeEtherBalanceLoaded,
  exchangeTokenBalanceLoaded,
  balancesLoaded,
  balancesLoading,
  buyOrderMaking,
  sellOrderMaking,
  orderMade,
} from './action'
import { ETHER_ADDRESS } from '../helpers'

export const loadWeb3 = (dispatch) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545')
  dispatch(web3Loaded(web3))
  return web3
}

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts()
  const account = accounts[0]
  dispatch(web3AccountLoaded(account))
  return account
}

export const loadToken = async (web3, networkId, dispatch) => {
  try {
    // 这里没有一步写成，是为了方便理解
    const networks = Token.networks
    const networkData = networks[networkId]
    const networkAddress = networkData.address
    const token = new web3.eth.Contract(Token.abi, networkAddress)
    dispatch(tokenLoaded(token))
    return token
  } catch (error) {
    console.error(
      'Contract not deployed to the current network. Please select another network with Metamask'
    )
    return null
  }
}

export const loadExchange = async (web3, networkId, dispatch) => {
  try {
    // exchange 和 token 一致
    const exchange = new web3.eth.Contract(
      Exchange.abi,
      Exchange.networks[networkId].address
    )
    dispatch(exchangeLoaded(exchange))
    return exchange
  } catch (error) {
    console.error(
      'Contract not deployed to the current network. Please select another network with Metamask'
    )
    return null
  }
}

export const loadAllOrders = async (exchange, dispatch) => {
  // Fetch cancelled orders with the 'Cancel' event stream 获取历史取消的 exchange
  const cancelStream = await exchange.getPastEvents('Cancel', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  // Format cancelled orders 只获取我们想要的信息
  const cancelledOrders = cancelStream.map((event) => event.returnValues)
  // Add cancelled orders to the redux store
  dispatch(cancelledOrdersLoaded(cancelledOrders))

  // Fetch filled orders with the 'Trade' event stream, 获取历史完成的订单
  const tradeStream = await exchange.getPastEvents('Trade', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  // Format filled orders 只获取我们想要的信息
  const filledOrders = tradeStream.map((event) => event.returnValues)
  // Add cancelled orders to the redux store
  dispatch(filledOrdersLoaded(filledOrders))

  // Fetch all orders with the 'Order' event stream
  const orderStream = await exchange.getPastEvents('Order', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  const allOrders = orderStream.map((event) => event.returnValues)
  dispatch(allOrdersLoaded(allOrders))
}

// 取消一个订单
export const cancelOrder = (dispatch, exchange, order, account) => {
  exchange.methods
    .cancelOrder(order.id)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(orderCancelling())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('There was an error ! 取消订单失败')
    })
}

// 完成一个订单
export const fillOrder = (dispatch, exchange, order, account) => {
  // 调用智能合约中的方法, 实现完成订单
  exchange.methods
    .fillOrder(order.id)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      // 将“订单正在完成”这个信息存入 store 中
      dispatch(orderFilling())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('fill order wrong ')
    })
}

// 订阅事件, 当事件发生变化时, 我们会受到该消息, 前面的 load
export const subscribeToEvents = async (exchange, dispatch) => {
  exchange.events.Cancel({}, (error, event) => {
    // 对于返回的事件对象中, 我们只需要 returnValues 这部分内容
    dispatch(orderCancelled(event.returnValues))
  })

  // (视频中缺失这部分内容, 但是有实现, 这个是视频中看到的一部分代码, 根据这一部分代码可以猜测出原本的实现逻辑)
  exchange.events.Trade({}, (error, event) => {
    dispatch(orderFilled(event.returnValues))
  })

  exchange.events.Deposit({}, (error, event) => {
    dispatch(balancesLoaded())
  })

  exchange.events.Withdraw({}, (error, event) => {
    dispatch(balancesLoaded())
  })

  exchange.events.Order({}, (error, event) => {
    dispatch(orderMade(event.returnValues))
  })
}

export const loadBalances = async (
  dispatch,
  web3,
  exchange,
  token,
  account
) => {
  // Ether balance in wallet
  const etherBalance = await web3.eth.getBalance(account)
  dispatch(etherBalanceLoaded(etherBalance))

  // Token balance in wallet
  const tokenBalance = await token.methods.balanceOf(account).call()
  dispatch(tokenBalanceLoaded(tokenBalance))

  // Ether balance in exchange
  const exchangeEtherBalance = await exchange.methods
    .balanceOf(ETHER_ADDRESS, account)
    .call()
  dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))

  // Token balance in exchange
  const exchangeTokenBalance = await exchange.methods
    .balanceOf(token.options.address, account)
    .call()
  dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

  // Trigger all balances loaded
  dispatch(balancesLoaded())
}

export const depositEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods
    .depositEther()
    .send({
      from: account,
      value: web3.utils.toWei(amount, 'ether'),
    })
    .on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('DepositEther error!')
    })
}

export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods
    .withdrawEther(web3.utils.toWei(amount, 'ether'))
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('WithdrawEther error!')
    })
}

export const depositToken = (
  dispatch,
  exchange,
  web3,
  token,
  amount,
  account
) => {
  amount = web3.utils.toWei(amount, 'ether')

  // depositToken 需要两步
  token.methods
    .approve(exchange.options.address, amount)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      exchange.methods
        .depositToken(token.options.address, amount)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          dispatch(balancesLoading())
        })
        .on('error', (error) => {
          console.error(error)
          window.alert('depositToken error')
        })
    })
}

export const withdrawToken = (
  dispatch,
  exchange,
  web3,
  token,
  amount,
  account
) => {
  amount = web3.utils.toWei(amount, 'ether')
  exchange.methods
    .withdrawToken(token.options.address, amount)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('withdrawToken error')
    })
}

export const makeBuyOrder = (
  dispatch,
  exchange,
  token,
  web3,
  order,
  account
) => {
  const tokenGet = token.options.address
  const amountGet = web3.utils.toWei(order.amount, 'ether')
  const tokenGive = ETHER_ADDRESS
  const amountGive = web3.utils.toWei(
    (order.amount * order.price).toString(),
    'ether'
  )

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(buyOrderMaking())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('Make buy order error')
    })
}

export const makeSellOrder = (
  dispatch,
  exchange,
  token,
  web3,
  order,
  account
) => {
  const tokenGet = ETHER_ADDRESS
  const amountGet = web3.utils.toWei(
    (order.amount * order.price).toString(),
    'ether'
  )
  const tokenGive = token.options.address
  const amountGive = web3.utils.toWei(order.amount, 'ether')

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(sellOrderMaking())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert('Make sell order error')
    })
}
