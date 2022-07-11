/**
 * action 中的函数，代表行为。
 * 这些函数需要通过 dispatch 来调用
 * 在此项目中, action.js 中的函数暴露给 interactions.js 使用
 * 这里的 action 和 reducers.js 有关系
 *
 * action: 行为, 对 store 的操作均通过行为来实现, 也就是都需要调用这里面的 action 函数
 * 调用不是直接调用, 需要使用 dispatch(action function) 来调用
 */

// WEB3
export function web3Loaded(connection) {
  return {
    type: 'WEB3_LOADED',
    connection,
  }
}

export function web3AccountLoaded(account) {
  return {
    type: 'WEB3_ACCOUNT_LOADED',
    account,
  }
}

// TOKEN
export function tokenLoaded(contract) {
  return {
    type: 'TOKEN_LOADED',
    contract,
  }
}

// EXCHANGE
export function exchangeLoaded(contract) {
  return {
    type: 'EXCHANGE_LOADED',
    contract,
  }
}

export function cancelledOrdersLoaded(cancelledOrders) {
  return {
    type: 'CANCELLED_ORDERS_LOADED',
    cancelledOrders,
  }
}

export function filledOrdersLoaded(filledOrders) {
  return {
    type: 'FILLED_ORDERS_LOADED',
    filledOrders,
  }
}

export function allOrdersLoaded(allOrders) {
  return {
    type: 'ALL_ORDERS_LOADED',
    allOrders,
  }
}

export function orderCancelling() {
  return {
    type: 'ORDER_CANCELLING',
  }
}

export function orderCancelled(order) {
  return {
    type: 'ORDER_CANCELLED',
    order,
  }
}
