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
} from './action'

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
    console.log(
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
    console.log(
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
  console.log(cancelledOrders)
  // Add cancelled orders to the redux store
  dispatch(cancelledOrdersLoaded(cancelledOrders))

  // Fetch filled orders with the 'Trade' event stream, 获取历史完成的订单
  const tradeStream = await exchange.getPastEvents('Trade', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  // Format filled orders 只获取我们想要的信息
  const filledOrders = tradeStream.map((event) => event.returnValues)
  console.log(filledOrders)
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
