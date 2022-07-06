/**
 * action 中的函数，代表行为。
 * 这些函数需要通过 dispatch 来调用
 * 在此项目中, action.js 中的函数暴露给 interactions.js 使用
 * 这里的 action 和 reducers.js 有关系
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
