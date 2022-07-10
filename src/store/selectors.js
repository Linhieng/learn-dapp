import { get } from 'lodash'
import moment from 'moment'
import { createSelector } from 'reselect'
import { ETHER_ADDRESS, ether, tokens, RED, GREEN } from '../helpers'

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

const filledOrdersLoaded = (state) =>
  get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(
  filledOrdersLoaded,
  (loaded) => loaded
)

// 获取完成的订单
const filledOrders = (state) => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(filledOrders, (orders) => {
  // Sort orders by date ascending for price comparison 日期早的在前面, 方便获取前一天的价格, 计算价格是升是降
  orders = orders.sort((a, b) => a.timestamp - b.timestamp)
  // decorate order 为该订单添加一些信息, 比如给出时间、是卖出还是买入、金额多少...
  orders = decorateFilledOrders(orders)

  console.log(orders)
  // Sort orders by date descending for display 按照时间逆序排队 —— 晚在前
  orders = orders.sort((a, b) => b.timestamp - a.timestamp)
  return orders
})

// 专门为所有已完成的订单添加信息(主要该函数名称是复数的)
const decorateFilledOrders = (orders) => {
  // 第一个订单的前一个订单是一样的, 这样能解决前一个订单不存在的情况, 方便后面处理
  let previousOrder = orders[0]
  return orders.map((order) => {
    // 填写一些基本的信息
    order = decorateOrder(order)
    // 填写一些属于 filled orders 才需要的信息
    order = decorateFilledOrder(order, previousOrder)
    // Update the previous order once it's decorated
    previousOrder = order
    return order
  })
}

// 为单个订单添加基本的信息（通用型）
const decorateOrder = (order) => {
  let etherAmount
  let tokenAmount
  if (order.tokenGive === ETHER_ADDRESS) {
    etherAmount = order.amountGive
    tokenAmount = order.amountGet
  } else {
    etherAmount = order.amountGet
    tokenAmount = order.amountGive
  }

  // Calculate token price to 5 decimal 精确到小数点后 5 位
  const precision = 100000
  let tokenPrice = etherAmount / tokenAmount
  tokenPrice = Math.round(tokenPrice * precision) / precision

  // 将时间戳格式化成时间
  const formattedTimestamp = moment.unix(order.timestamp).format('M/D HH:MM:SS')
  return {
    ...order,
    tokenPrice,
    etherAmount: ether(etherAmount),
    tokenAmount: tokens(tokenAmount),
    formattedTimestamp,
  }
}

// 为单个 filled order 添加信息 —— 价格是升了还是降了
const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    // 订单的价格类名, 升则显示绿色, 降则显示红色
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder),
  }
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
  // 第一个订单默认是绿色
  if (orderId === previousOrder.id) return GREEN

  // Show red price if order price lower than previous order
  if (tokenPrice <= previousOrder.tokenPrice) return RED
  // Show green price if order price higher than previous order
  return GREEN
}
