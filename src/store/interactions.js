/**
 * 获取数据的操作是在这里面
 * 在这里面获取到数据后
 * 通过 dispatch 调用 action
 * 然后就可以将数据存储进 redux 了
 *
 * interactions: 交互. 这个交互, 指的应该是 action 和 reducers 之间的
 */

import Web3 from 'web3'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {
  web3Loaded,
  web3AccountLoaded,
  tokenLoaded,
  exchangeLoaded,
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
    window.alert(
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
    window.alert(
      'Contract not deployed to the current network. Please select another network with Metamask'
    )
    return null
  }
}
