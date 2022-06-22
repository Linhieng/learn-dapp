
官网 https://web3js.readthedocs.io/

## 零碎

Adding web3.js, 连接,  `Web3.givenProvider` 代表连接 metamask 中的网络
```js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545")
```

getNetworkType, 获取网络类型 如果 metamask 有启动, 则获取的是 metamask 的网络类型, 比如 main, Kovan, rinkeby, 如连接的是本地, 这是 private
```js
web3.eth.net.getNetworkType([callback])

const network_type = await web3.eth.net.getNetworkType()
```

getAccounts,