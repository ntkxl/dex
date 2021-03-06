// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WaffToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Waff Token Farm";
    address public owner;
    WaffToken public waffToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    // mapping(address => uint) public balances;
    // event Transfer(address indexed _from,address indexed _to,uint _value);

    // constructor(WaffToken _waffToken, DaiToken _daiToken) public {
    //     waffToken = _waffToken;
    //     daiToken = _daiToken;
    //     owner = msg.sender;
    // }

    constructor() public {
        
    }

    function addToken (WaffToken _waffToken,DaiToken _daiToken) public {
        waffToken = _waffToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // function initDaiAmount() public payable {

    // }
    // function transfer(address _to, uint _value) public returns (bool success) {
    //     require(balances[msg.sender] >= _value);
    //     balances[msg.sender] -= _value;
    //     balances[_to] += _value;
    //     emit Transfer(msg.sender, _to, _value);
    //     return true;
    // }

    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                waffToken.transfer(recipient, balance);
            }
        }
    }
}