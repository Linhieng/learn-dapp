import React, { Component } from 'react'
import { connect } from 'react-redux'
import { accountSelector } from '../store/selectors'

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a href="/#" className="navbar-brand">
          DApp Token Exchange（token 交易所）
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://etherscan.io/address/${this.props.account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              点击访问 Etherscan 上的账户{this.props.account}
            </a>{' '}
          </li>
        </ul>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
  }
}

// export default App
export default connect(mapStateToProps)(Navbar)
