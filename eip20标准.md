智能合约需要满足 [eip20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) 标准

即 Token.sol 中要实现对应的函数

## 相关解释

（不是很熟悉, 有些可能是解释错的）

### 变量 
* mapping(address => uint256) public balanceOf
balanceOf 映射, 代表的是账户余额, 比如 balanceOf[_from] 就是指 _from 拥有的余额

* mapping(address => mapping(address => uint256)) public allowance
allowance 映射, 代表的是所允许的交易金额, 比如 allowance[_from][msg.sender] 就是指 _from 允许的交易最大金额

### 函数

* function transfer (address _to, uint256 _value) public returns (bool success)
调用该函数用来发起交易, _to 是收钱方, value 是金额

* function approve(address _spender, uint256 _value) public returns (bool success)
该函数用来限制交易金额, spender 是收钱方, value 是金额

* function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
和 transfer 类似, from 是出钱方, to 是收钱方, value 是金额, 这里面确保了 value 的合法性: 
  1. value 小于 from 拥有资金
  2. value 小于 交易 所批准的金额

### 事件

* event Transfer(address indexed from ,address indexed to, uint256 value);
这个事件代表发生了交易, from 是出钱方, to 收钱方, value 是价格

* event Approval(address indexed _owner, address indexed _spender, uint256 _value);
当 approve 函数调用成功时, 必须触发该函数, owner 是出钱方, spender 是收钱方, value 是价格

### 其他

* _transfer 
这个内部函数, 用来实现交易, 主要逻辑就是, from 方资金减少, to 方资金增加, 并且触发 Transfer 时间

* require()
断言, 不满足条件则拒绝, 抛出错误

## Token.sol 示例代码 (已通过测试)

```js
pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
  using SafeMath for uint;

  // Variables  
  string public name = "DAPP Token";
  string public symbol = "DAPP";
  uint256 public decimals = 18;
  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  // Events
  event Transfer(address indexed from ,address indexed to, uint256 value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  constructor() public {
    totalSupply = 1000000 * (10 ** decimals);
    balanceOf[msg.sender] = totalSupply;
  }

  function _transfer (address _from, address _to, uint256 _value) internal returns (bool success) {
    require(_to != address(0x0));
    balanceOf[_from] = balanceOf[_from].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  // send balances
  function transfer (address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);
    _transfer(msg.sender, _to, _value);
    return true;
  }

  // Approve tokens
  function approve(address _spender, uint256 _value) public returns (bool success) {
    require(_spender != address(0x0));
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(_value <= balanceOf[_from]); // 要求小于本身拥有 tokens
    require(_value <= allowance[_from][msg.sender]); // 要求小于交易 所批准的 tokens
    allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
    _transfer(_from, _to, _value);
    return true;
  }
}
```