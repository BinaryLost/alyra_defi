// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor(uint _initialSupply) ERC20("Reward Token", "RT") {
        _mint(msg.sender, _initialSupply * 1e18);
    }
}