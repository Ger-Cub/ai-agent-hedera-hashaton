// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract MyContract {
    string public message; // Explicitly define visibility

    constructor(string memory _message) public { // Add "public" visibility
        message = _message;
    }
}
