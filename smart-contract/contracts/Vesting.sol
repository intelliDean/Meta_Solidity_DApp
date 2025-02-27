// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IVesting.sol";
import  "./VErrors.sol";

contract Vesting is IVesting, Ownable {
    IERC20 private orgToken;
    string[] private roles;

    mapping(string => Schedule) private vestingSchedules;
    mapping(address => Stakeholder) private stakeholders;
    mapping(address => bool) private isStakeholderWhitelisted;

    constructor(address owner, IERC20 _tokenAddress) Ownable(owner) {
        orgToken = _tokenAddress;
    }

    function addVestingSchedule(
        string memory _role,
        uint256 _amount,
        uint256 _releaseTime
    ) external {
        require(tx.origin == owner(), "Only Owner");
        if (_releaseTime <= block.timestamp)
            revert VErrors.RELEASE_TIME_MUST_BE_IN_FUTURE(_releaseTime);
        if (_amount <= 0) revert VErrors.AMOUNT_MUST_BE_ABOVE_ZERO(_amount);
        if (_scheduleExist(_role)) revert VErrors.SCHEDULED_ALREADY();

        Schedule storage _schedule = vestingSchedules[_role];
        _schedule.role = _role;
        _schedule.amount = _amount;
        _schedule.releaseTime = _releaseTime;

        roles.push(_role);
        emit VestingScheduled(_role, _amount, _releaseTime);
    }

    function whitelistAddress(string memory _role, address _stakeholderAddress)
    external

    {
        require(tx.origin == owner(), "Only Owner");
        if (_stakeholderAddress == address(0))
            revert VErrors.UNAUTHORIZED_ADDRESS(_stakeholderAddress);
        if (!_scheduleExist(_role)) revert VErrors.INVALID_ROLE_OR_SCHEDULE(_role);

        Stakeholder storage _stakeholder = stakeholders[_stakeholderAddress];
        Schedule memory schedule = vestingSchedules[_role];

        _stakeholder.stakeholder = _stakeholderAddress;
        _stakeholder.role = _role;
        _stakeholder.amount = schedule.amount;
        _stakeholder.releaseTime = schedule.releaseTime;

        //stakeholder is whitelisted
        isStakeholderWhitelisted[_stakeholderAddress] = true;

        //the stakeholder is approved to spend on behalf of the contract
        if (!orgToken.approve(_stakeholderAddress, schedule.amount))
            revert VErrors.APPROVAL_FAILED();

        emit AddressWhitelisted(_stakeholderAddress, _role);
    }

    function stakeholderClaimBenefit(address _user) external {// will have to take parameter of stakeholder address instead of msg.sender
        require(tx.origin == _user, "Invalid stakeholder");
        if (!isStakeholderWhitelisted[_user])
            revert VErrors.ADDRESS_NOT_WHITELISTED(_user);

        Stakeholder storage _stakeholder = stakeholders[_user];

        if (block.timestamp < _stakeholder.releaseTime)
            revert VErrors.TOKEN_NOT_VESTED();

        if (_stakeholder.hasWithdrawn) revert VErrors.TOKEN_WITHDRAWN();

        if (_stakeholder.amount <= 0)
            revert VErrors.INSUFFICIENT_TOKEN_BALANCE(_stakeholder.amount);

        uint256 _amount = orgToken.allowance(address(this), _user);
        _stakeholder.hasWithdrawn = true;
        _stakeholder.amount = 0;

        delete stakeholders[_user];

        if (!orgToken.transferFrom(address(this), _user, _amount))
            revert VErrors.TOKEN_TRANSFER_FAILED();

        emit TokensReleased(
            msg.sender,
            _amount,
            block.timestamp
        );
    }

    function balanceOf(address _stakeholder) external view returns (uint256) {
        return orgToken.balanceOf(_stakeholder);
    }

    function getRoles() external view returns (string[] memory) {
        return roles;
    }

    function _scheduleExist(string memory _role) internal view returns (bool) {
        return vestingSchedules[_role].amount > 0;
    }

    function getTimeNow() external view returns (uint256) {
        return block.timestamp;
    }
}
