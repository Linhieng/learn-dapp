import React, { Component } from 'react'
import './App.css'

import Navbar from './Navbar'
import Content from './Content'

import { contractsLoadedSelector } from '../store/selectors'

import { connect } from 'react-redux'
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange,
} from '../store/interactions'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    console.log('web3 对象', web3)

    // const network_type = await web3.eth.net.getNetworkType()
    // console.log('账户类型', network_type)

    window.ethereum &&
      (await window.ethereum.request({ method: 'eth_requestAccounts' }))
    const account = await loadAccount(web3, dispatch)
    console.log('获取账户', account)

    const networkId = await web3.eth.net.getId()
    console.log('网络id', networkId)
    const token = loadToken(web3, networkId, dispatch)
    console.log('token', token)

    const exchange = loadExchange(web3, networkId, dispatch)
    console.log('exchange', exchange)
    // const totalSupply = await token.methods.totalSupply().call()
    // console.log('totalSupply ', totalSupply)
  }

  render() {
    return (
      <div>
        <Navbar />
        <Content />
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('???', contractsLoadedSelector(state))
  return {
    // TODO: Fill me in ...
  }
}

// export default App
export default connect(mapStateToProps)(App)
