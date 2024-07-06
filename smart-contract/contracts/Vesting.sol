// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is Ownable {
    struct VestingSchedule {
        uint256 amount;
        uint256 releaseTime;
    }

    struct Stakeholder {
        uint256 amount;
        uint256 releaseTime;
        bool withdrawn;
    }

    IERC20 public token;
    mapping(string => VestingSchedule) public vestingSchedules;
    mapping(address => Stakeholder) public stakeholders;
    mapping(address => string) public stakeholderRoles;
    mapping(string => mapping(address => bool)) public roleWhitelistedAddresses;
    mapping(address => uint256) public userBalances;
    uint256 public contractBalance;
    string[] public roles;

    event TokensReleased(address indexed beneficiary, uint256 amount);

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    function addVestingSchedule(string memory role, uint256 amount, uint256 releaseTime) external onlyOwner {
        require(releaseTime > block.timestamp, "Release time should be in the future");
        require(amount > 0, "Amount should be greater than 0");
        vestingSchedules[role] = VestingSchedule(amount, releaseTime);
        roles.push(role);
    }

    function whitelistAddress(string memory role, address stakeholder) external onlyOwner {
        require(vestingSchedules[role].amount > 0, "Invalid role or vesting schedule does not exist");
        roleWhitelistedAddresses[role][stakeholder] = true;
    }

    function registerStakeholder(string memory role) external {
        VestingSchedule memory schedule = vestingSchedules[role];
        require(schedule.amount > 0, "Invalid role or vesting schedule does not exist");
        require(stakeholders[msg.sender].amount == 0, "Stakeholder already registered");

        // Transfer tokens from user to contract
        require(token.transferFrom(msg.sender, address(this), schedule.amount), "Token transfer failed");

        stakeholders[msg.sender] = Stakeholder(schedule.amount, schedule.releaseTime, false);
        stakeholderRoles[msg.sender] = role;

        // Update balances
        userBalances[msg.sender] += schedule.amount;
        contractBalance += schedule.amount;
    }

    function releaseTokens() external {
        require(roleWhitelistedAddresses[stakeholderRoles[msg.sender]][msg.sender], "Address not whitelisted");
        Stakeholder storage stakeholder = stakeholders[msg.sender];
        require(block.timestamp >= stakeholder.releaseTime, "Tokens are not yet vested");
        require(!stakeholder.withdrawn, "Tokens already withdrawn");
        require(stakeholder.amount > 0, "No tokens to release");

        stakeholder.withdrawn = true;
        uint256 amount = stakeholder.amount;

        // Transfer tokens from contract to user
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        // Update balances
        userBalances[msg.sender] -= amount;
        contractBalance -= amount;

        emit TokensReleased(msg.sender, amount);
    }

    function withdrawRemainingTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "The contract is empty");
        token.transfer(owner(), balance);

        // Update contract balance
        contractBalance = 0;
    }

    function getRoles() external view returns (string[] memory) {
        return roles;
    }
}