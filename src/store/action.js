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

export function etherBalanceLoaded(balance) {
  return {
    type: 'ETHER_BALANCE_LOADED',
    balance,
  }
}
export function tokenBalanceLoaded(balance) {
  return {
    type: 'TOKEN_BALANCE_LOADED',
    balance,
  }
}
export function exchangeEtherBalanceLoaded(balance) {
  return {
    type: 'EXCHANGE_ETHER_BALANCE_LOADED',
    balance,
  }
}
export function exchangeTokenBalanceLoaded(balance) {
  return {
    type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
    balance,
  }
}
export function balancesLoaded() {
  return {
    type: 'BALANCES_LOADED',
  }
}
export function balancesLoading() {
  return {
    type: 'BALANCES_LOADING',
  }
}

export function etherDepositAmountChanged(amount) {
  return {
    type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
    amount,
  }
}

export function etherWithdrawAmountChanged(amount) {
  return {
    type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
    amount,
  }
}

export function tokenDepositAmountChanged(amount) {
  return {
    type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
    amount,
  }
}

export function tokenWithdrawAmountChanged(amount) {
  return {
    type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
    amount,
  }
}

// Buy order
export function buyOrderAmountChanged(amount) {
  return {
    type: 'BUY_ORDER_AMOUNT_CHANGED',
    amount,
  }
}
export function buyOrderPriceChanged(price) {
  return {
    type: 'BUY_ORDER_PRICE_CHANGED',
    price,
  }
}
export function buyOrderMaking(price) {
  return {
    type: 'BUY_ORDER_MAKING',
    price,
  }
}
export function orderMade(order) {
  return {
    type: 'ORDER_MADE',
    order,
  }
}

// Sell Order
export function sellOrderAmountChanged(amount) {
  return {
    type: 'SELL_ORDER_AMOUNT_CHANGED',
    amount,
  }
}
export function sellOrderPriceChanged(price) {
  return {
    type: 'SELL_ORDER_PRICE_CHANGED',
    price,
  }
}
export function sellOrderMaking(price) {
  return {
    type: 'SELL_ORDER_MAKING',
    price,
  }
}
