import { groupBy, reject, get, maxBy, minBy } from 'lodash'
import moment from 'moment'
import { createSelector } from 'reselect'
import {
  formatBalance,
  ETHER_ADDRESS,
  ether,
  tokens,
  RED,
  GREEN,
} from '../helpers'

// 不直接 state.web3.account 而是用 get 获取, 作用就是防止 web3 为不存在的情况
const account = (state) => get(state, 'web3.account')
// 直接返回 web3.account
export const accountSelector = createSelector(account, (account) => account)

// 同上, 获取 exchange
const web3 = (state) => get(state, 'web3.connection', false)
export const web3Selector = createSelector(web3, (web3) => web3)

// 同上, 获取 exchange
const token = (state) => get(state, 'token.contract', false)
export const tokenSelector = createSelector(token, (token) => token)

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

// 用于判断完成的订单是否加载完毕
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
  // Sort orders by date descending for display 按照时间逆序排队 —— 晚在前
  orders = orders.sort((a, b) => b.timestamp - a.timestamp)
  return orders
})

// cancelled orders
const cancelledOrdersLoaded = (state) =>
  get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(
  cancelledOrdersLoaded,
  (cancelledOrdersLoaded) => cancelledOrdersLoaded
)
const cancelledOrders = (state) =>
  get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(
  cancelledOrders,
  (cancelledOrders) => cancelledOrders
)

// all orders
const allOrdersLoaded = (state) =>
  get(state, 'exchange.allOrders.loaded', false)
export const allOrdersLoadedSelector = createSelector(
  allOrdersLoaded,
  (allOrdersLoaded) => allOrdersLoaded
)
const allOrders = (state) => get(state, 'exchange.allOrders.data', [])
export const allOrdersSelector = createSelector(
  allOrders,
  (allOrders) => allOrders
)

// all filled cancel 订单都加载完毕时，代表 order book (订单簿) 也加载完毕了
const orderBookLoaded = (state) =>
  cancelledOrdersLoaded(state) &&
  filledOrdersLoaded(state) &&
  allOrdersLoaded(state)
export const orderBookLoadedSelector = createSelector(
  orderBookLoaded,
  (orderBookLoaded) => orderBookLoaded
)
// 也可以简写成这样：
// export const orderBookLoadedSelector = createSelector(
//   cancelledOrdersLoaded,
//   filledOrdersLoaded,
//   allOrdersLoaded,
//   (c, f, a) => c && f && a
// )

// 获取正在交易中的订单
const openOrders = (state) => {
  // 获取 全部订单、已完成订单、已取消订单。
  const all = allOrders(state)
  const filled = filledOrders(state)
  const cancelled = cancelledOrders(state)

  // 在全部订单中取出已完成订单和已取消订单，剩下的就是 open 订单. reject: 取出返回 false 的元素
  const openOrders = reject(all, (order) => {
    const orderFilled = filled.some((o) => o.id === order.id)
    const orderCancelled = cancelled.some((o) => o.id === order.id)
    // 返回 true 则代表该订单是 filled 或者 cancel 的, 这种订单我们不要
    return orderFilled || orderCancelled
  })

  return openOrders
}
// 获取展示在 order Book 的订单 (order book: 交易未完成的订单)
export const orderBookSelector = createSelector(openOrders, (orders) => {
  // Decorate orders
  orders = decorateOrderBookOrders(orders)
  orders = groupByOrderBookORders(orders)

  return orders
})

// 我的已完成订单
export const myFilledOrderLoadedSelector = createSelector(
  filledOrdersLoaded,
  (loaded) => loaded
)
export const myFilledOrderSelector = createSelector(
  account,
  filledOrders,
  (account, filledOrders) => {
    // Filter our orders 取出属于 “我的”
    filledOrders = filledOrders.filter(
      (o) => o.user === account || o.userFill === account
    )
    // Sort orders by date descending
    filledOrders = filledOrders.sort((a, b) => b.timestamp - a.timestamp)
    // Decorate orders - add display attributes
    filledOrders = decorateMyFilledOrders(filledOrders, filledOrders)
    return filledOrders
  }
)

// 我的订单簿
export const myOpenOrdersLoadedSelector = createSelector(
  orderBookLoaded,
  (loaded) => loaded
)
export const myOpenOrdersSelector = createSelector(
  account,
  openOrders,
  (account, orders) => {
    // Filter orders created by current account 取出属于 “我的”
    orders = orders.filter((o) => o.user === account)
    // Decorate orders - add display attributes
    orders = decorateMyOpenOrders(orders, account)
    // Sort orders by date descending
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)
    return orders
  }
)

export const priceChartLoadedSelector = createSelector(
  filledOrdersLoaded,
  (loaded) => loaded
)
export const priceChartSelector = createSelector(filledOrders, (orders) => {
  // Sort orders by date ascending to compare history
  orders = orders.sort((a, b) => a.timestamp - b.timestamp)
  // Decorate orders - add display attributes
  orders = orders.map((o) => decorateOrder(o))

  // Get last 2 order for final price & price change
  let secondLastOrder, lastOrder
  ;[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
  // get last order price
  const lastPrice = get(lastOrder, 'tokenPrice', 0)
  // get second last order price
  const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)
  const lastPriceChange = lastPrice >= secondLastPrice ? '+' : '-'
  const series = [{ data: buildGraphData(orders) }]

  return {
    lastPrice,
    lastPriceChange,
    series,
  }
})

const orderCancelling = (state) => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(
  orderCancelling,
  (status) => status
)

const balancesLoading = (state) => get(state, 'exchange.balancesLoading', true)
export const balancesLoadingSelector = createSelector(
  balancesLoading,
  (status) => status
)
const etherBalance = (state) => get(state, 'web3.balance', true)
export const etherBalanceSelector = createSelector(etherBalance, (status) =>
  formatBalance(status)
)
const tokenBalance = (state) => get(state, 'token.balance', 0)
export const tokenBalanceSelector = createSelector(tokenBalance, (balance) =>
  formatBalance(balance)
)
const exchangeEtherBalance = (state) => get(state, 'exchange.etherBalance', 0)
export const exchangeEtherBalanceSelector = createSelector(
  exchangeEtherBalance,
  (balance) => formatBalance(balance)
)
const exchangeTokenBalance = (state) => get(state, 'exchange.tokenBalance', 0)
export const exchangeTokenBalanceSelector = createSelector(
  exchangeTokenBalance,
  (balance) => formatBalance(balance)
)

const etherDepositAmount = (state) =>
  get(state, 'exchange.etherDepositAmount', null)
export const etherDepositAmountSelector = createSelector(
  etherDepositAmount,
  (amount) => amount
)
const etherWithdrawAmount = (state) =>
  get(state, 'exchange.etherWithdrawAmount', null)
export const etherWithdrawAmountSelector = createSelector(
  etherWithdrawAmount,
  (amount) => amount
)
const tokenDepositAmount = (state) =>
  get(state, 'exchange.tokenDepositAmount', null)
export const tokenDepositAmountSelector = createSelector(
  tokenDepositAmount,
  (amount) => amount
)
const tokenWithdrawAmount = (state) =>
  get(state, 'exchange.tokenWithdrawAmount', null)
export const tokenWithdrawAmountSelector = createSelector(
  tokenWithdrawAmount,
  (amount) => amount
)

const buyOrder = (state) => get(state, 'exchange.buyOrder', {})
export const buyOrderSelector = createSelector(buyOrder, (order) => order)

const sellOrder = (state) => get(state, 'exchange.sellOrder', {})
export const sellOrderSelector = createSelector(sellOrder, (order) => order)

/* *****************工具函数***************** */
/* *****************工具函数***************** */
/* *****************工具函数***************** */
/* *****************工具函数***************** */
/* *****************工具函数***************** */
/* *****************工具函数***************** */

const buildGraphData = (orders) => {
  // Group the orders by hour for the graph
  orders = groupBy(orders, (o) =>
    moment
      .unix(o.timestamp)
      .startOf('hour')
      .format()
  )
  // Get each hour where data exists
  const hours = Object.keys(orders)
  // Build the graph series
  const graphData = hours.map((hour) => {
    // Fetch all the orders from current hour
    const group = orders[hour]
    // Calculate price values - open, high, low, close
    const open = group[0]
    const high = maxBy(group, 'tokenPrice')
    const low = minBy(group, 'tokenPrice')
    const close = group[group.length - 1]

    return {
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
    }
  })

  return graphData
}

const decorateMyOpenOrder = (order, account) => {
  const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  const orderTypeClass = orderType === 'buy' ? GREEN : RED
  return {
    ...order,
    orderType,
    orderTypeClass,
  }
}

const decorateMyOpenOrders = (orders, account) =>
  orders.map((order) => {
    order = decorateOrder(order)
    order = decorateMyOpenOrder(order, account)
    return order
  })

const decorateMyFilledOrder = (order, account) => {
  let orderType
  //
  if (order.user === account) {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  } else {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
  }

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
    orderSign: orderType === 'buy' ? '+' : '-',
  }
}

const decorateMyFilledOrders = (orders, account) =>
  orders.map((order) => {
    order = decorateOrder(order)
    order = decorateMyFilledOrder(order, account)
    return order
  })

// 对 order book 订单按照类型 buy 和 sell 进行分类
const groupByOrderBookORders = (orders) => {
  // Group orders by 'orderType' 对 order book 进行分组啊, 分为买入订单和卖出订单
  orders = groupBy(orders, 'orderType')
  // Fetch buy orders. 获取 buy 类型的订单, 在 order.buy 中
  let buyOrders = get(orders, 'buy', [])
  let sellOrders = get(orders, 'sell', [])
  // Sort buy orders by token price. 按照价格降序排序
  buyOrders = buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
  sellOrders = sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
  return {
    ...orders,
    buyOrders,
    sellOrders,
  }
}
// 注意有是该函数名是复数
const decorateOrderBookOrders = (orders) =>
  orders.map((order) => {
    // 增加基本的信息
    order = decorateOrder(order)
    // decorate order book order 添加属于 order book 订单的信息
    order = decorateOrderBookOrder(order)
    return order
  })
// 添加属于 order book 的信息
const decorateOrderBookOrder = (order) => {
  // 判断该订单是买入还是卖出
  const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  // 如果订单是买入, 则显示为绿色, 卖出则显示为红色
  const orderTypeClass = orderType === 'buy' ? GREEN : RED
  // 好像没用到...
  const orderFillClass = orderType === 'bug' ? 'sell' : 'buy'
  return {
    ...order,
    orderType,
    orderTypeClass,
    orderFillClass,
  }
}

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
