// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiToken is ERC20 {
    constructor(address initAddress) ERC20("Dai Token", "Dai") {
        // 1 million init token
        uint256 decimals = 10 ** 18;
        uint256 initSupply = 1000000 * decimals;
        _mint(initAddress, initSupply);
                            
    }
}