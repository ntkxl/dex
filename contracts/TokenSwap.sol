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

    constructor() public {
    }

    function addToken (WaffToken _waffToken) public {
        waffToken = _waffToken;
    }

    function buyWaffle(uint rate) public payable {
        // calculate token
        uint tokenAmount = msg.value * rate;

        // require swapcontract has enough waff
        require(waffToken.balanceOf(address(this)) >= tokenAmount);

        // transfer waff to buyer
        waffToken.transfer(msg.sender, tokenAmount);

        emit WaffPurchased(msg.sender, address(waffToken), tokenAmount, rate);
    }
}