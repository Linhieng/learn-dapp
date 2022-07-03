
官网 https://web3js.readthedocs.io/

## web3 相关

Adding web3.js, 连接,  `Web3.givenProvider` 代表连接 metamask 中的网络
```js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545")
```

getNetworkType, 获取网络类型 如果 metamask 有启动, 则获取的是 metamask 的网络类型, 比如 main, Kovan, rinkeby, 如连接的是本地, 这是 private
```js
web3.eth.net.getNetworkType([callback])

const network_type = await web3.eth.net.getNetworkType()
console.log('账户类型', network_type)
```

getAccounts, 获取所有账户
```js
web3.eth.getAccounts([callback])

const account = await web3.eth.getAccounts()
```
在开了 metamask 插件的浏览器中没有输出账号, 在没有使用 metamask 插件的浏览器中可以输出 ganache 中的账号
也就是说 new Web3(Web3.givenProvider) 输出不了账号
而 new Web3("ws://localhost:7545") 可以输出账号

## abis

Tokens.js 中的 networks 是智能合约连接的网络

