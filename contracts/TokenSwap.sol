// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WaffToken.sol";

contract TokenSwap {
    string public name = "TokenSwap Decentralize Exchange";
    WaffToken public waffToken;

    event WaffPurchased(
        address account,
        address waff,
        uint amount,
        uint rate
    );

    event WaffSold(
        address account,
        address waff,
        uint amount,
        uint rate
    );

    constructor() public {
    }

    function addToken (WaffToken _waffToken) public {
        waffToken = _waffToken;
    }

    function buyWaffle(uint rate) public payable {
        // calculate waff amount
        uint waffAmount = msg.value * rate;

        // require swapcontract has enough waff
        require(waffToken.balanceOf(address(this)) >= waffAmount);

        // transfer waff to buyer
        waffToken.transfer(msg.sender, waffAmount);

        emit WaffPurchased(msg.sender, address(waffToken), waffAmount, rate);
    }

    function sellWaffle(uint rate, uint waffAmount) public payable{
        // seller can't sell waff more than they have
        // require(waffToken.balanceOf(msg.sender) >= waffAmount);

        // calculate eth amount
        uint ethAmount = waffAmount / rate;

        // require swapcontract has enough eth
        require(address(this).balance >= ethAmount); 

        // transfer waff from seller
        waffToken.transferFrom(msg.sender, address(this), waffAmount);
        payable(msg.sender).transfer(ethAmount);

        emit WaffSold(msg.sender, address(waffToken), waffAmount, rate);
    }
}