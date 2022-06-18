pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// Deposit & Withdraw Funds 存款 取款
// Manage Order -  Make or Cancel 账单的发起和取消
// Handle Trades - Charge fees 处理交易 收小费

// TODO:
// [X] Set the fee account
// [X] Deposit Ether 对应 depositEther
// [X] Withdraw Ether
// [X] Deposit tokens 对应 depositToken
// [X] Withdraw tokens
// [X] Check balances
// [X] Make order
// [X] Cancel order
// [ ] Fill order
// [ ] Charge fees

contract Exchange {
  using SafeMath for uint;

  // Variables
  address public feeAccount; // the account that receives exchange fee
  uint256 public feePercent; // the fee percentage
  address constant ETHER = address(0); // store Ether in tokens mapping with black address
  mapping(address => mapping(address => uint256)) public tokens; // 代币 => (实际用户地址 => 用户持有的代币数量)
  mapping(uint256 => _Order) public orders; // a way store the order
  uint public orderCount;
  mapping(uint256 => bool) public orderCancelled;  // 注意取消订单的逻辑: 是新建一个 “已取消的订单” 映射, 而不是在订单中删除对应的订单

  // Event
  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint256 amount, uint256 balance);
  event Order (
    uint256 id,
    address user,
    address tokenGet,
    uint256 amountGet,
    address tokenGive,
    uint256 amountGive,
    uint256 timestamp
  );
  event Cancel (
    uint256 id,
    address user,
    address tokenGet,
    uint256 amountGet,
    address tokenGive,
    uint256 amountGive,
    uint256 timestamp
  );

  // a way to model the order
  struct _Order {
    uint256 id;  // 订单的唯一 id
    address user; // 发出订单的人
    address tokenGet; // token address
    uint256 amountGet;  // toknen amount
    address tokenGive;  // eg: token give is ether
    uint256 amountGive; // eg: ether amount
    uint256 timestamp; // 订单时间戳
  }

  constructor (address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  // Fallback: reverts if Ether is not sent to this smart contract by mistake 如果有人直接送钱给交易所(不是存款), 则要将钱退回. 不过好像注释掉这一个函数也会自动拒绝直接送钱
  function() external {
    revert();
  }

  function depositEther() payable public {
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  function withdrawEther(uint256 _amount) public  {
    require(tokens[ETHER][msg.sender] >= _amount); // 确保有余额转钱
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
    msg.sender.transfer(_amount);
    emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
  }

  //  (which token, how much)
  function depositToken(address _token, uint _amount) public {
    // Don't allow Enter deposits
    require(_token != ETHER);
    // Send tokens to this contract
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    // Manage deposit - update balance
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
    // Emit event
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function withdrawToken(address _token, uint256 _amount) public {
    require(_token != ETHER);
    require(tokens[_token][msg.sender] >= _amount);
    tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
    require(Token(_token).transfer(msg.sender, _amount));
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function balanceOf(address _token, address _user) public view returns (uint256) {
    return tokens[_token][_user];
  }

  // add the order to storage
  function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
    orderCount = orderCount.add(1);
    orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
  }

  function cancelOrder(uint256 _id) public {
    _Order storage _order = orders[_id];  // storage 存在存储器中, 作为变量
    // must be "my" order
    require(address(_order.user) == msg.sender);
    // must be a valid order: the order must exist
    require(_order.id == _id);
    orderCancelled[_id] = true;
    emit Cancel(_order.id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, _order.timestamp);
  }


}