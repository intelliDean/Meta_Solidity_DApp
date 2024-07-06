// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vesting.sol";
import "./OrganizationToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VestingFactory is Ownable {
    address[] public vestingContracts;
    address[] public tokenContracts;

    struct VestingSchedule {
        string role;
        uint256 amount;
        uint256 releaseTime;
    }

    event VestingInstanceCreated(address indexed tokenAddress, address indexed vestingAddress);

    constructor() Ownable(msg.sender) {}

    function createVestingInstance(
        string[] memory roles,
        uint256[] memory amounts,
        uint256[] memory vestingPeriods,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 totalSupply
    ) external onlyOwner {
        require(roles.length == amounts.length && amounts.length == vestingPeriods.length, "Input arrays must have the same length");

        VestingSchedule[] memory predefinedSchedules = new VestingSchedule[](roles.length);

        for (uint256 i = 0; i < roles.length; i++) {
            predefinedSchedules[i] = VestingSchedule(roles[i], amounts[i], block.timestamp + vestingPeriods[i]);
        }

        // Deploy the ERC20 token
        OrganizationToken newToken = new OrganizationToken(tokenName, tokenSymbol, totalSupply);
        tokenContracts.push(address(newToken));

        // Deploy the Vesting contract
        Vesting newVesting = new Vesting(newToken);
        vestingContracts.push(address(newVesting));

        // Add predefined schedules to the new vesting contract
        for (uint256 i = 0; i < predefinedSchedules.length; i++) {
            newVesting.addVestingSchedule(
                predefinedSchedules[i].role,
                predefinedSchedules[i].amount,
                predefinedSchedules[i].releaseTime
            );
        }

        newVesting.transferOwnership(msg.sender); // Transfer ownership to the organization

        emit VestingInstanceCreated(address(newToken), address(newVesting));
    }

    function getVestingContracts() external view returns (address[] memory) {
        return vestingContracts;
    }

    function getTokenContracts() external view returns (address[] memory) {
        return tokenContracts;
    }
}