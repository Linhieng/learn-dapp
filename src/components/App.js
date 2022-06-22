import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545")
    const network_type = await web3.eth.net.getNetworkType()
    const account = await web3.eth.getAccounts()
    console.log(network_type)
    console.log(web3)
    console.log(account)
  }

  render() {
    return (
      <div>

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a href="/#" className="navbar-brand">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" > {/* 这里少了点 prop */}
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item"> <a href="/#" className="nav-link">Link 1</a> </li>
              <li className="nav-item"> <a href="/#" className="nav-link">Link 2</a> </li>
              <li className="nav-item"> <a href="/#" className="nav-link">Link 3</a> </li>
            </ul>
          </div>
        </nav>

        <div className="content">

          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>

          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>

          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>

          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default App
