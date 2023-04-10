// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BasicToken.sol";
import "./BasicNFT.sol";

contract TokenAirdrop {
    BasicToken public basicToken;
    BasicNFT public basicNFT;

    mapping(address => bool) private claimedWallet;
    address[] private claimedAddress;
    address private tokenOwner;
    uint256 private airdropAmount;
    uint256 public claimedCount;

    bool public paused;

    event Airdrop(address indexed to, uint256 amount);

    constructor(address _tokenAddress, address _nftAddress, address _tokenOwner) {
        basicToken = BasicToken(_tokenAddress);
        basicNFT = BasicNFT(_nftAddress);
        tokenOwner = _tokenOwner;
        airdropAmount = 100 * 1e18;
    }

    function airdrop() external {
        require(!paused, "The contract is paused.");
        require(basicNFT.balanceOf(msg.sender) != 0 && !claimedWallet[msg.sender] && claimedCount < 1000, "Airdrops are not available.");

        claimedWallet[msg.sender] = true;
        claimedCount += 1;

        basicToken.transferFrom(tokenOwner, msg.sender, airdropAmount);
        claimedAddress.push(msg.sender);
        emit Airdrop(msg.sender, airdropAmount);
    }

    function totalClaimed() external view returns (uint256) {
        return claimedCount * airdropAmount;
    }

    function totalClaimedAddress() external view returns(address[] memory){
        return claimedAddress;
    }

    function pause() external {
        require(msg.sender == tokenOwner, "Only the token owner can pause.");
        paused = true;
    }

    function unpause() external {
        require(msg.sender == tokenOwner, "Only the token owner can unpause.");
        paused = false;
    }
}
