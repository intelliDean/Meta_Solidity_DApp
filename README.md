# VESTING CONTRACT DAPP

This Solidity program is a full stack "Vesting contract" application that implements the factory contract model to allow individuals to create vesting contracts. It has a frontend fully integrated with smart contracts.

## Description

This program consists of a set of smart contracts written in Solidity, a programming language used for developing smart contracts on the Ethereum blockchain. The main contract is a factory contract that deploys new instances of a child vesting contract. Individuals can use these contracts to create vesting plans on behalf of their company’s staff or stakeholders. The contract implements a time lock system, which prevents users from withdrawing vested tokens before the allocated unlock time.

## CONTRACT ADDRESSES (SEPOLIA)
FACTORY CONTRACT: 0x279Bc00CB4197C7693D1121EEE26DF1B93b154E8;

### Executing program
#### STEP 1
- CREATE A VESTING ORGANIZATION.

Deploy the factory contract to create a new instance of the vesting contract and the associated ERC20 token contract.

#### STEP 2
- CREATE VESTING PLANS FOR USERS.

Add predefined vesting schedules for various roles within the organization.

#### STEP 3
- USERS CAN WITHDRAW VESTED TOKENS AFTER THEIR TIMELOCK PERIOD.

Once the timelock period is over, users can withdraw their vested tokens.

## CONTRACT DETAILS
- VestingFactory Contract
This contract is responsible for creating new vesting instances.

- OrganizationToken Contract
This contract is an ERC20 token contract that mints the total supply to the contract creator.

- Vesting Contract
This contract handles the vesting logic, allowing users to register for vesting schedules and withdraw tokens after the vesting period.

## Authors

EKARIKA NSEMEKE


## License

This project is licensed under the MIT License - see the LICENSE.md file for details