
官网 https://web3js.readthedocs.io/

## web3 相关

###
导入 contracts 中的智能合约后的 json 文件
```js
import Token from '../abis/Token.json'
```

###
Adding web3.js, 连接,  `Web3.givenProvider` 代表连接 metamask 中的网络
```js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545")
```

###
getNetworkType, 获取网络类型 如果 metamask 有启动, 则获取的是 metamask 的网络类型, 比如 main, Kovan, rinkeby, 如连接的是本地, 这是 private
```js
web3.eth.net.getNetworkType([callback])

const network_type = await web3.eth.net.getNetworkType()
console.log('账户类型', network_type)
```

###
getAccounts, 获取所有账户
```js
web3.eth.getAccounts([callback])

window.ethereum && (await window.ethereum.request({ method: 'eth_requestAccounts' }))
const account = await web3.eth.getAccounts()
```
注意: 默认情况下 new Web3(Web3.givenProvider) 会输出 0 个账户
这是因为 metamask 插件改版了
新版的 metamask 插件默认情况下是开启了隐私模式的
所以想要获取账户时需要手动关闭隐私模式
可以通过判断 `window.ethereum` 的有无来判断 metamask 版本是否是新版本
通过 `await ethereum.enable()` 可以手动关闭隐私模式（允许该网站连接账户）
不过 `await ethereum.enable()` 现在已经被弃用了，未来可能被删除
[官方文档](https://docs.metamask.io/guide/ethereum-provider.html#ethereum-enable-deprecated)
可以使用 `ethereum.request({ method: 'eth_requestAccounts' })` 代替



###
获取网络 id, ganache 中默认的是 1337 我们可以自己设置 ganache 中的网络id
这个网络id 的作用是用于获取到网络数据，网络数据总有一个 address ，这个才是我们想要的
```js
const network_id = await web3.eth.net.getId()
console.log('网络id', network_id)

const network_data = Token.networks[network_id]
console.log('network_data', network_data)

const network_address = network_data.address
console.log('network_address: ', network_address)
// 注意这里其实可能会报错，因为切换网络时，可能会因为找不到 network_id 而报错
```

###
创建一个智能合约, 并在区块链上进行交互
创建一个智能合约需要两个值，一个就是 abi，一个就是网络地址，这两个值都已经在前面获取到了
创建一个智能合约语法如下
```js
new web3.eth.Contract(jsonInterface[, address][, options])

const token = new web3.eth.Contract(Token.abi, network_address)
console.log('token', token)
```

###
创建一个智能合约后，我们可以调用它的方法
```js
const totalSupply = await token.methods.totalSupply().call()
console.log('totalSupply ', totalSupply)
```
注意，如果调用该方法时出错，可能是因为没有编译智能合约，或者因为 ganache 更新了
重新执行一下 `truffle migrate --reset` 就可以了

### getPastEvents
获取历史事件, 每次智能合约执行时, 都会有一个事件产生, 通过这个 api 可以获取所有事件。
这些事件，可以构成我们的历史交易、历史订单
[文档](https://web3js.readthedocs.io/en/v1.7.3/web3-eth-contract.html?highlight=getPastEvents#getpastevents)

```js
myContract.getPastEvents(event[, options][, callback])

await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest', })
```

## methods.myMethod.send
调用智能合约中的方法， [该函数有多种实现方式](https://web3js.readthedocs.io/en/v1.7.3/web3-eth-contract.html?highlight=methods.myMethod.send#methods-mymethod-send)

```js
myContract.methods.myMethod([param1[, param2[, ...]]]).send(options[, callback])

exchange.methods.cancelOrder(order.id).send({from: account})
  .on('transactionHash', hash => {
    dispatch(orderCancelling())
  })
  .on('error', error => {
    console.log(error)
    window.alert('There was an error ! 取消订单失败')
  })
```

## 订阅事件
合约中有定义一些事件, 通过订阅中这是事件，当事件发生变化时，我们可以获取该消息.
```js
myContract.events.MyEvent([options][, callback])

exchange.events.Cancel({}, (error, event) => {
  dispatch(orderCancelled(event.returnValues))
})
```

## 获取 balance

```js
web3.eth.getBalance(address [, defaultBlock] [, callback])

```



## abis

Tokens.js 中的 networks 是智能合约连接的网络

