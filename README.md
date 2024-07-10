# Vesting Factory Contract

Vesting Factory Contract is a simple Solidity dApp with a full frontend and smart contract integrated for a smooth user experience.

## Description

This vesting contract implements a factory contract that enables anyone to create their organization vesting contract, have full control over it, and add their stakeholders as well as whitelist any address, aside from address zero, to benefit from these. The stakeholders can claim their benefit at the end of the vesting period.

The whole vesting contract is powered and controlled by one contract and that's the factory contract. The factory contract has 4 functions.

- createVestingInstance(): This function is responsible for the creation and deployment of any vesting contract creation. It deploys all the individual vesting contracts but independent of each other, with each having a different contract address.

- whitelistAddress(): Allows the owner of the vesting contract created to whitelist an address designated as a stakeholder address, and it does this by using the vesting contract index.

- stakeholderClaimBenefit(): Allows a stakeholder that has been whitelisted to claim their benefit at the end of their vesting period.

- balanceOf(): Allows a stakeholder to check their balance of the benefit.

##Getting Started
- Clone the project
- After cloning the project, type ```cd frontend``` to change the directory into the frontend environment. When inside the frontend directory, type ```npm i``` to install the necessary dependencies.
- After that type ```cd ..``` to go back to the home directory. When in the home directory, type ```cd smart-contract``` to change the directory into smart contract. When in the smart contract directory, type  ```npm i``` to install all dependencies for the smart contract.
- When these are done, type ```cd ..``` then ```cd frontend```
- Type ```npm run build``` to build your next.js code
- Lastly, type ```npm run start``` to start your frontend
- Interact with the smart contract from the frontend

## Factory Contract Address:   (Sepolia Testnet): 
0x1901cc67055A6bE3238d0fc1c2dEc3a62CFEb8d5

## Authors
Michael Dean Oyewole

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
