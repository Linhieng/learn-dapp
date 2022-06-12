## 相关报错

* sol 文件中指定版本时可能会报错, 可以修改 truffle-config.js 文件中的版本号 compilers-solc-version

* 使用 export 导出时, 需要安装 babel 相关包, 并且要配置 .babelrc 文件

## 相关概念

源代码编译, 编译后的内容才能被区块链识别. 编译后的格式是 json 格式, 在文件夹(abis)中
```bash
truffle compile
```


迁移 部署, 
1_initial_migration 是迁移 Migrations.sol
2_deploy_contracts 是部署 Token.sol
```bash
truffle migrate
```
此命令会消耗 wei


truffle 控制台交互
```bash
$ truffle console
truffle(development)> 
```
进入后可以直接使用相关命令进行, 如 `const name = await token.name()`




## 相关命令

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

```bash
truffle migrate
```
