/**
 * dispatch 执行 action
 * 此 action 就是这里的函数的 action 参数
 *
 * action 是行为
 * interaction 是获取数据
 * interaction 通过调用 dispatch 去 执行 action
 * 而 reducers 的作用是拦截？在将数据存入 redux 的时候，会经过这里, 在这里进行一些处理, 比如增加一个 loaded 代表已经加载完成
 */

import { combineReducers } from 'redux'

function web3(state = {}, action) {
  switch (action.type) {
    case 'WEB3_LOADED':
      return { ...state, connection: action.connection }
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.account }
    default:
      return state
  }
}

function token(state = {}, action) {
  switch (action.type) {
    case 'TOKEN_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    default:
      return state
  }
}

function exchange(state = {}, action) {
  switch (action.type) {
    case 'EXCHANGE_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'CANCELLED_ORDERS_LOADED':
      return {
        ...state,
        cancelledOrders: { loaded: true, data: action.cancelledOrders },
      }
    case 'FILLED_ORDERS_LOADED':
      return {
        ...state,
        filledOrders: { loaded: true, data: action.filledOrders },
      }
    case 'ALL_ORDERS_LOADED':
      return { ...state, allOrders: { loaded: true, data: action.allOrders } }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  web3,
  token,
  exchange,
})

export default rootReducer
