import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exchangeSelector } from '../store/selectors'
import { loadAllOrders } from '../store/interactions'

import Trades from './Trades'

class Content extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    await loadAllOrders(this.props.exchange, dispatch)
  }

  render() {
    return (
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

        <Trades />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    exchange: exchangeSelector(state),
    // TODO: Fill me in ...
  }
}

// export default App
export default connect(mapStateToProps)(Content)
