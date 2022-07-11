import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'

import { fillOrder } from '../store/interactions'

import {
  orderBookSelector,
  orderBookLoadedSelector,
  exchangeSelector,
  accountSelector,
  orderFillingSelector,
} from '../store/selectors'

const renderOrder = (order, dispatch, exchange, account) => (
  <tr
    key={order.id}
    className="table-hover pointer"
    onClick={() => {
      fillOrder(dispatch, exchange, order, account)
    }}
  >
    <td>{order.tokenAmount}</td>
    <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
    <td>{order.etherAmount}</td>
  </tr>
)

function showOrderBook(props) {
  const { dispatch, orderBook, exchange, account } = props
  return (
    <tbody>
      {orderBook.sellOrders.map((order) =>
        renderOrder(order, dispatch, exchange, account)
      )}
      <tr>
        <th>DAPP</th>
        <th>DAPP / ETH</th>
        <th>ETH</th>
      </tr>
      {orderBook.buyOrders.map((order) =>
        renderOrder(order, dispatch, exchange, account)
      )}
    </tbody>
  )
}

class OrderBook extends Component {
  render() {
    return (
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">Order Book 正在交易的订单</div>
          <div className="card-body order-book">
            <table className="table table-dark table-sm small">
              {this.props.showOrderBook ? (
                showOrderBook(this.props)
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const orderBookLoaded = orderBookLoadedSelector(state)
  const orderFilling = orderFillingSelector(state)
  return {
    orderBook: orderBookSelector(state),
    showOrderBook: orderBookLoaded && !orderFilling,
    exchange: exchangeSelector(state),
    account: accountSelector(state),
  }
}

export default connect(mapStateToProps)(OrderBook)
