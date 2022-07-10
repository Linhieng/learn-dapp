import React, { Component } from 'react'
import { connect } from 'react-redux'

import { orderBookSelector, orderBookLoadedSelector } from '../store/selectors'
import Spinner from './Spinner'

const renderOrder = (order) => (
  <tr key={order.id}>
    <td>{order.tokenAmount}</td>
    <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
    <td>{order.etherAmount}</td>
  </tr>
)

function showOrderBook(orderBook) {
  return (
    <tbody>
      {orderBook.sellOrders.map((order) => renderOrder(order))}
      <tr>
        <th>DAPP</th>
        <th>DAPP / ETH</th>
        <th>ETH</th>
      </tr>
      {orderBook.buyOrders.map((order) => renderOrder(order))}
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
              {this.props.orderBookLoaded ? (
                showOrderBook(this.props.orderBook)
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
  return {
    orderBook: orderBookSelector(state),
    orderBookLoaded: orderBookLoadedSelector(state),
  }
}

export default connect(mapStateToProps)(OrderBook)
