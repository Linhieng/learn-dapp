import { get } from 'lodash'
import { createSelector } from 'reselect'

// 不直接 state.web3.account 而是用 get 获取, 作用就是防止 web3 为不存在的情况
const account = (state) => get(state, 'web3.account')

// 直接返回 web3.account
export const accountSelector = createSelector(account, (account) => account)
