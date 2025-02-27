// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VErrors {

    error UNAUTHORIZED_ADDRESS(address);
    error RELEASE_TIME_MUST_BE_IN_FUTURE(uint256);
    error AMOUNT_MUST_BE_ABOVE_ZERO(uint256);
    error INVALID_ROLE_OR_SCHEDULE(string);
    error STAKEHOLDER_ALREADY_REGISTERED();
    error TOKEN_TRANSFER_FAILED();
    error ADDRESS_NOT_WHITELISTED(address);
    error TOKEN_NOT_VESTED();
    error TOKEN_WITHDRAWN();
    error INSUFFICIENT_TOKEN_BALANCE(uint256);
    error SCHEDULED_ALREADY();
    error APPROVAL_FAILED();
    error INCONSISTENT_DATA();

}