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

