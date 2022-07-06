import React, { Component } from 'react'
import './App.css'
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a href="/#" className="navbar-brand">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
          >
            {' '}
            {/* 这里少了点 prop */}
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                {' '}
                <a href="/#" className="nav-link">
                  Link 1
                </a>{' '}
              </li>
              <li className="nav-item">
                {' '}
                <a href="/#" className="nav-link">
                  Link 2
                </a>{' '}
              </li>
              <li className="nav-item">
                {' '}
                <a href="/#" className="nav-link">
                  Link 3
                </a>{' '}
              </li>
            </ul>
          </div>
        </nav>

        <div className="content">
          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">
                  Card link
                </a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">
                  Card link
                </a>
              </div>
            </div>
          </div>

          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">
                  Card link
                </a>
              </div>
            </div>
          </div>

          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">
                  Card link
                </a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">
                  Card link
                </a>
              </div>
            </div>
          </div>

          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">
                  Card link
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    // TODO: Fill me in ...
  }
}

// export default App
export default connect(mapStateToProps)(App)
