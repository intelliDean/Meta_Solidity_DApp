# Vesting Factory Contract

Vesting contract is a simple Solidity dApp with full frontend and smart contract integrated together for smooth user experience.

## Description

This vesting contract implements factory contract that enable anyone to create their own organization vesting contract, have full control over it and add their own stakeholders as well as whilelist any address, aside addresss zero, to benefit from these. The stakeholders can in turn claim their benefi at the end of the vesting period.

The whole vesting contract is powered and controlled by one contract and that's the factory contract. The factory contract has 4 functions.

- createVestingInstance(): This funcion is responsible for the creation and deployment of any vesting contract creation. It deploys all the individual vesting contract but independent of each other, with each having a different contrat address.

- whitelistAddress(): Allows the owner of the vesting contract created to whitelist address designated as a stakeholder address, and it does this by using the vesting contract index.

- stakeholderClaimBenefit(): Allows a stakeholder that has been whitelisted to claim their benefit at the end of their vesting period.

- balanceOf(): Allows a stakeholder to check their balance of the benefit.

##Getting Started
- Clone the project
- After cloning the project, type ```cd frontend``` to change directory into the frontend environment. When inside the frontend directory, type ```npm i``` to install necessary dependencies.
- After that type ```cd ..``` to go back to the home directory. When in home directory, type ```cd smart-contract``` to change directory into smart contract. When in smart contract directory, type  ```npm i``` to install all dependencies for the smart contract.
- When these are done, type ```cd ..``` then ```cd frontend```
- Type ```npm run build``` to build your next,js code
- Lastly type ```npm run start``` to start your frontend
- Interest with the smart contract from the frontend

## Factory Contract Address:   (Sepolia Testnet): 0x1901cc67055A6bE3238d0fc1c2dEc3a62CFEb8d5

## Authors
Michael Dean Oyewole

## License
This project is licensed under the MIT License - see the LICENSE.md file for details