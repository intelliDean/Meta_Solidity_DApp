// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


interface IVesting {

    struct Schedule {
        string role;
        uint256 amount;
        uint256 releaseTime;
    }

    struct Stakeholder {
        address stakeholder;
        string role;
        uint256 amount;
        uint256 releaseTime;
        bool hasWithdrawn;
    }

    event TokensReleased(address indexed stakeholder, uint256 amount, uint256 releasedAt);
    event VestingScheduled(string indexed role, uint256 amount, uint256 releaseTime);
    event AddressWhitelisted(address indexed stakeholder, string indexed role);
    event StakeholderRegistered(address stakeholder, string role, uint256 amount);

    function addVestingSchedule(string memory _role, uint256 _amount, uint256 _releaseTime) external;

    function whitelistAddress(string memory _role, address _stakeholderAddress) external;

    function stakeholderClaimBenefit(address _stakeholder) external;

    function balanceOf(address _stakeholder) external view returns (uint256);

}
