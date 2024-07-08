// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Vesting.sol";
import "./OrganizationToken.sol";
import "./VErrors.sol";
import "./IVesting.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VestingFactory is  VErrors, Ownable {

    address[] public vestingContracts;
    address[] public tokenContracts;

    struct Schedule {
        string role;
        uint256 amount;
        uint256 releaseTime;
    }


    event VestingInstanceCreated(address indexed tokenAddress,address indexed vestingAddress, address owner);

    constructor() Ownable(msg.sender) {}

    function createVestingInstance(
        string[] memory roles,
        uint256[] memory amounts,
        uint256[] memory vestingPeriods,
        string memory tokenName,
        string memory tokenSymbol
    ) external onlyOwner {
        uint256 _roleLength = roles.length;
        if (
            _roleLength != amounts.length &&
            amounts.length == vestingPeriods.length
        ) revert VErrors.INCONSISTENT_DATA();

        Schedule[] memory _schedules = new Schedule[](_roleLength);

        // Deploy the ERC20 token
        OrganizationToken newToken = new OrganizationToken(
            tokenName,
            tokenSymbol,
            msg.sender
        );
        tokenContracts.push(address(newToken));

        // Deploy the Vesting contract
        Vesting newVesting = new Vesting(msg.sender, newToken);
        vestingContracts.push(address(newVesting));

        //mint 1000000 token to the vesting contract
        newToken.mint(address(newVesting), 1000000);

        uint256 freezeTime = block.timestamp;

        for (uint256 i = 0; i < roles.length; i++) {
            //create a vesting schedule
            _schedules[i] = Schedule(
                roles[i],
                amounts[i],
                freezeTime + vestingPeriods[i]
            );

            //add the vesting schedule
            newVesting.addVestingSchedule(
                _schedules[i].role,
                _schedules[i].amount,
                _schedules[i].releaseTime
            );
        }

        emit VestingInstanceCreated(
            address(newToken),
            address(newVesting),
            msg.sender
        );
    }

    function whitelistAddress(uint256 _index, string memory _role, address _stakeholderAddress) external  {
        address _vestingContract = vestingContracts[_index];
        IVesting(_vestingContract).whitelistAddress(_role, _stakeholderAddress);
    }

    function stakeholderClaimBenefit(uint256 _index, address _stakeholder) external {
        address _vestingContract = vestingContracts[_index];
        IVesting(_vestingContract).stakeholderClaimBenefit(_stakeholder);
    }

    function balanceOf(uint256 _index, address _stakeholder) external view returns (uint256) {
        address _vestingContract = vestingContracts[_index];
        return IVesting(_vestingContract).balanceOf(_stakeholder);
    }
}
