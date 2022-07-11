export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000' // 0x 后面 40个 0

export const GREEN = 'success' // bootstrap 中绿色的类名
export const RED = 'danger' // bootstrap 中红色的类名

export const DECIMALS = 10 ** 18

// Shortcut to avoid passing around web3 connection 自己计算, 就不用导入 web3 了 杀鸡焉用牛刀
export const ether = (wei) => {
  if (wei) return wei / DECIMALS // 18 decimal places
}

// Tokens and ether have same decimal resolution
export const tokens = ether

export const formatBalance = (balance) => {
  const precision = 100 // 2decimal places
  balance = ether(balance)
  balance = Math.round(balance * precision) / precision // Use 2 decimal places

  return balance
}
