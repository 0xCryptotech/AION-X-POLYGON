// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AIONFaucet {
    IERC20 public aionToken;
    address public owner;
    uint256 public claimAmount = 100 * 10**18; // 100 AION per claim
    uint256 public cooldownTime = 24 hours;
    
    mapping(address => uint256) public lastClaimTime;
    
    event Claimed(address indexed user, uint256 amount);
    
    constructor(address _aionToken) {
        aionToken = IERC20(_aionToken);
        owner = msg.sender;
    }
    
    function claim() external {
        require(block.timestamp >= lastClaimTime[msg.sender] + cooldownTime, "Cooldown active");
        require(aionToken.balanceOf(address(this)) >= claimAmount, "Faucet empty");
        
        lastClaimTime[msg.sender] = block.timestamp;
        require(aionToken.transfer(msg.sender, claimAmount), "Transfer failed");
        
        emit Claimed(msg.sender, claimAmount);
    }
    
    function setClaimAmount(uint256 _amount) external {
        require(msg.sender == owner, "Only owner");
        claimAmount = _amount;
    }
    
    function setCooldown(uint256 _seconds) external {
        require(msg.sender == owner, "Only owner");
        cooldownTime = _seconds;
    }
    
    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        require(aionToken.transfer(owner, amount), "Transfer failed");
    }
}
