// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

contract OGRatsWall {
    IERC721 public immutable ogRatsNFT;

    struct Message {
        uint256 id;
        address sender;
        string message;
        uint256 timestamp;
    }

    Message[] private messages;
    uint256 private nextMessageId;

    event MessagePosted(uint256 indexed id, address indexed sender, string message, uint256 timestamp);

    constructor(address _ogRatsNFTAddress) {
        require(_ogRatsNFTAddress != address(0), "Invalid NFT address");
        ogRatsNFT = IERC721(_ogRatsNFTAddress);
    }

    function postMessage(string calldata _message) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_message).length <= 280, "Message exceeds 280 characters");
        require(ogRatsNFT.balanceOf(msg.sender) > 0, "Must hold an OG Rat NFT to post");

        Message memory newMsg = Message({
            id: nextMessageId,
            sender: msg.sender,
            message: _message,
            timestamp: block.timestamp
        });

        messages.push(newMsg);
        emit MessagePosted(nextMessageId, msg.sender, _message, block.timestamp);
        nextMessageId++;
    }

    function getMessages() external view returns (Message[] memory) {
        return messages;
    }

    function getTotalMessages() external view returns (uint256) {
        return messages.length;
    }
}
