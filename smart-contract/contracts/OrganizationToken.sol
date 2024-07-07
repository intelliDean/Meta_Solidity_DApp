// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrganizationToken is ERC20, Ownable {

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC20(name, symbol) Ownable(owner) {}

    function mint(address to, uint amount) external {
        require(tx.origin == owner(), "Only Owner");
        _mint(to, amount);
    }

    function transferFrom(address from, address to, uint256 value) public override  returns (bool) {
        _transfer(from, to, value);
        return true;
    }
}
