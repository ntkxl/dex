// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WaffToken is ERC20 {
    constructor(address initAddress) ERC20("Waffle", "WAFF") {
        // 1 million init token
        _mint(initAddress, 1000000000000000000000000);
    }
}