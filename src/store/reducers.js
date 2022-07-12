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
    case 'ETHER_BALANCE_LOADED':
      return { ...state, balance: action.balance }
    default:
      return state
  }
}

function token(state = {}, action) {
  switch (action.type) {
    case 'TOKEN_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'TOKEN_BALANCE_LOADED':
      return { ...state, balance: action.balance }
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
    case 'ORDER_CANCELLING':
      return { ...state, orderCancelling: true }
    case 'ORDER_CANCELLED':
      return {
        ...state,
        orderCancelling: false,
        cancelledOrders: {
          ...state.cancelledOrders,
          data: [...state.cancelledOrders.data, action.order],
        },
      }

    case 'ORDER_FILLING':
      return { ...state, orderFilling: true }
    case 'ORDER_FILLED':
      return {
        ...state,
        orderFilling: false,
        filledOrders: {
          ...state.filledOrders,
          data: [...state.filledOrders.data, action.order],
        },
      }

    case 'EXCHANGE_ETHER_BALANCE_LOADED':
      return { ...state, etherBalance: action.balance }
    case 'EXCHANGE_TOKEN_BALANCE_LOADED':
      return { ...state, tokenBalance: action.balance }
    case 'BALANCES_LOADING':
      return { ...state, balancesLoading: true }
    case 'BALANCES_LOADED':
      return { ...state, balancesLoading: false }
    case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
      return { ...state, etherDepositAmount: action.amount }
    case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
      return { ...state, etherWithdrawAmount: action.amount }
    case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
      return { ...state, tokenDepositAmount: action.amount }
    case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
      return { ...state, tokenWithdrawAmount: action.amount }
    case 'BUY_ORDER_AMOUNT_CHANGED':
      return {
        ...state,
        buyOrder: { ...state.buyOrder, amount: action.amount },
      }
    case 'BUY_ORDER_PRICE_CHANGED':
      return { ...state, buyOrder: { ...state.buyOrder, price: action.price } }
    case 'BUY_ORDER_MAKING':
      return {
        ...state,
        buyOrder: {
          ...state.buyOrder,
          amount: null,
          price: null,
          making: true,
        },
      }

    case 'ORDER_MADE':
      // Prevent duplicate orders
      const index = state.allOrders.data.findIndex(
        (order) => order.id === action.order.id
      )
      const data =
        index === -1
          ? [...state.allOrders.data, action.order]
          : state.allOrders.data
      return {
        ...state,
        allOrders: {
          ...state.allOrders,
          data,
        },
        buyOrder: {
          ...state.buyOrder,
          making: false,
        },
        sellOrder: {
          ...state.sellOrder,
          making: false,
        },
      }

    case 'SELL_ORDER_AMOUNT_CHANGED':
      return {
        ...state,
        sellOrder: { ...state.sellOrder, amount: action.amount },
      }
    case 'SELL_ORDER_PRICE_CHANGED':
      return {
        ...state,
        sellOrder: { ...state.sellOrder, price: action.price },
      }
    case 'SELL_ORDER_MAKING':
      return {
        ...state,
        sellOrder: {
          ...state.sellOrder,
          amount: null,
          price: null,
          making: true,
        },
      }

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
