test 中的是测试
scripts 中的就是实际的脚本

在执行 scripts 前, 需要先将合约部署到 ganache
当 ganache 中重置了账户时, 也需要重新将合约部署到 ganache

```bash
truffle migrate --reset
```

执行 scripts 中的脚本:
```bash
truffle exec scripts/seed-exchange.js
```

执行 scripts 中的脚本还有一个作用, 那就是在 react 中调用 web3 时, 可以有相关测试数据看到, 而不是所有数据都是 null

## 编译智能合约

编译, 编译后的内容才能被区块链识别. 编译后的格式是 json 格式
```bash
$ truffle compile

Compiling your contracts...
===========================
> Compiling .\src\contracts\Migrations.sol
> Compiling .\src\contracts\Token.sol
> Artifacts written to D:\truffle\src\abis
> Compiled successfully using:
   - solc: 0.5.0+commit.1d4f565a.Emscripten.clang
```
编译后的路径是根据 `truffle-config.js` 中的配置决定的
```js
module.exports = {
  contracts_directory: './src/contracts/', /* 要编译的智能合约所在位置 */
  contracts_build_directory: './src/abis/', /* 编译后的地址 */
}
```

## migrate
migrations 文件夹不太懂，它和迁移、部署智能合约有关

1_initial_migration 是迁移 Migrations.sol
2_deploy_contracts 是部署 Token.sol, Exchange
```bash
truffle migrate --reset
```
此命令会消耗 gas，即 ganache 中的 eth 会减少


## truffle 控制台交互
```bash
$ truffle console
truffle(development)>
```
进入后可以直接使用相关命令进行, 如 `const name = await token.name()`

### truffle migrate

`truffle migrate --reset` 会执行 migrations 文件夹下的内容, 并且按照序号执行
```bash
$ truffle migrate
Compiling your contracts...
===========================
> Compiling .\src\contracts\Exchange.sol
> Compiling .\src\contracts\Migrations.sol
> Compiling .\src\contracts\Migrations.sol
> Compiling .\src\contracts\Token.sol
> Compiling .\src\contracts\Token.sol
> Artifacts written to D:\truffle\src\abis
> Compiled successfully using:
   - solc: 0.5.0+commit.1d4f565a.Emscripten.clang


Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
✓ Transaction submitted successfully. Hash: 0xa068c9e27b01e05d3ef84babf626d80dcf60ca38470c1682dd73239f45b42aae
   > transaction hash:    0xa068c9e27b01e05d3ef84babf626d80dcf60ca38470c1682dd73239f45b42aae
   > Blocks: 0            Seconds: 0
   > contract address:    0xC9eb1EEc15aA36e36D97D34E87790b2710F27bcC
   > block number:        1
   > block timestamp:     1655649189
   > account:             0x85d935Fc07B874af8D338e5201FD2fC56DCaB122
   > balance:             99.99586798
   > gas used:            206601 (0x32709)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00413202 ETH

   ✓ Saving migration to chain.
✓ Transaction submitted successfully. Hash: 0xc5f28de53b038d74f144096a230e80cd02cda55f3c5cc070ce6137ff6feb603b
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00413202 ETH


2_deploy_contracts.js
=====================

   Deploying 'Token'
   -----------------
✓ Transaction submitted successfully. Hash: 0xcec928ef0fa35fcfed5f1c3eb29451b4dfc1759fd7cded87a50fd730033b2f85
   > transaction hash:    0xcec928ef0fa35fcfed5f1c3eb29451b4dfc1759fd7cded87a50fd730033b2f85
   > Blocks: 0            Seconds: 0
   > contract address:    0x1992ffc8AcDEAF88452524ba5063A9edfaFdC80b
   > block number:        3
   > block timestamp:     1655649190
   > account:             0x85d935Fc07B874af8D338e5201FD2fC56DCaB122
   > balance:             99.978675
   > gas used:            817294 (0xc788e)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01634588 ETH


   Deploying 'Exchange'
   --------------------
✓ Transaction submitted successfully. Hash: 0x5c90e032504f4a031f3541953a1b805fe06b73c46e622d935352db8ddad59816
   > transaction hash:    0x5c90e032504f4a031f3541953a1b805fe06b73c46e622d935352db8ddad59816
   > Blocks: 0            Seconds: 0
   > contract address:    0x31ea20E38B61e7A6491C2B0562388a53E33775ae
   > block number:        4
   > block timestamp:     1655649191
   > account:             0x85d935Fc07B874af8D338e5201FD2fC56DCaB122
   > balance:             99.93880762
   > gas used:            1993369 (0x1e6a99)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03986738 ETH

   ✓ Saving migration to chain.
✓ Transaction submitted successfully. Hash: 0x7ad9590b11846626147209ea0e0c90a42f0f3815cf5d11b266089de8f33036cb
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.05621326 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.06034528 ETH
```
