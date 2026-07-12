// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockERC721 {
    mapping(address => uint256) private balances;

    function setBalance(address owner, uint256 balance) external {
        balances[owner] = balance;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return balances[owner];
    }
}
