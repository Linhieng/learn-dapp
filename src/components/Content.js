import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exchangeSelector } from '../store/selectors'
import { loadAllOrders, subscribeToEvents } from '../store/interactions'

import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Balance'
import NewOrder from './NewOrder'

class Content extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    const { dispatch, exchange } = props
    await loadAllOrders(exchange, dispatch)
    // 在 Content 中订阅时间, 如果将这段代码写在 MyTransaction.js 也是可以的.
    await subscribeToEvents(exchange, dispatch)
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>

        <OrderBook />

        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>

        <Trades />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    exchange: exchangeSelector(state),
  }
}

// export default App
export default connect(mapStateToProps)(Content)
