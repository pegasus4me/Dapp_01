// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "RT") {
        _mint(msg.sender, 100000000000000000000000000000);
    }

    function mintRewards(address to, uint256 amount) external payable {
        _mint(to, amount);
    }
}