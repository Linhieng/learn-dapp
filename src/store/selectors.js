import { get } from 'lodash'
import { createSelector } from 'reselect'

// 不直接 state.web3.account 而是用 get 获取, 作用就是防止 web3 为不存在的情况
const account = (state) => get(state, 'web3.account')
// 直接返回 web3.account
export const accountSelector = createSelector(account, (account) => account)

// 同上, 获取 exchange
const exchange = (state) => get(state, 'exchange.contract', false)
export const exchangeSelector = createSelector(exchange, (exchange) => exchange)

// 同上, 获取 token 是否加载完成
const tokenLoaded = (state) => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(
  tokenLoaded,
  (tokenLoaded) => tokenLoaded
)

// 同上, 获取 exchange 是否加载完成
const exchangeLoaded = (state) => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(
  exchangeLoaded,
  (exchangeLoaded) => exchangeLoaded
)

// 当 token 和 exchange 都加载好时, 代表 contracts 加载好了
export const contractsLoadedSelector = createSelector(
  tokenLoaded,
  exchangeLoaded,
  (tokenLoaded, exchangeLoaded) => tokenLoaded && exchangeLoaded
)
