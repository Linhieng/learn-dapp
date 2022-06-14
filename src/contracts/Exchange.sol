pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// Deposit & Withdraw Funds 存款 取款
// Manage Order -  Make or Cancel 账单的发起和取消
// Handle Trades - Charge fees 处理交易 收小费

// TODO:
// [X] Set the fee account
// [ ] Deposit Ether
// [ ] Withdraw Ether
// [ ] Deposit tokens
// [ ] Withdraw tokens
// [ ] Check balances
// [ ] Make order
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge fees

contract Exchange {
  using SafeMath for uint;

  // Variables
  address public feeAccount; // the account that receives exchange fee
  uint256 public feePercent; // the fee percentage
  mapping(address => mapping(address => uint256)) public tokens; // 代币 => (实际用户地址 => 用户持有的代币数量)

  // Event
  event Deposit(address token, address user, uint256 amount, uint256 balance);

  constructor (address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }
  
  //  (which token, how much)
  function depositToken(address _token, uint _amount) public {
    // Send tokens to this contract
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    // Manage deposit - update balance
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount); 
    // Emit event
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
  
}