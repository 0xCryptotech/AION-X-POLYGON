// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AIONStaking {
    IERC20 public aionToken;
    address public owner;
    address public predictionMarket; // Can deposit fees
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 shares; // User's share of total pool
        bool active;
    }
    
    mapping(address => StakeInfo[]) public userStakes;
    
    uint256 public totalStaked;
    uint256 public totalShares;
    uint256 public revenuePool; // Accumulated from platform fees
    uint256 public lastDistributionTime;
    
    uint256 public constant MIN_STAKE = 100 * 10**18; // 100 AION minimum
    uint256 public constant LOCK_PERIOD = 7 days; // Flexible lock period
    
    event Staked(address indexed user, uint256 amount, uint256 shares);
    event Unstaked(address indexed user, uint256 stakeIndex, uint256 amount, uint256 reward);
    event RevenueDeposited(uint256 amount);
    
    constructor(address _aionToken) {
        aionToken = IERC20(_aionToken);
        owner = msg.sender;
        lastDistributionTime = block.timestamp;
    }
    
    function setPredictionMarket(address _market) external {
        require(msg.sender == owner, "Only owner");
        predictionMarket = _market;
    }
    
    // Stake AION - get shares proportional to pool
    function stake(uint256 amount) external {
        require(amount >= MIN_STAKE, "Below minimum");
        require(aionToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Calculate shares
        uint256 shares;
        if (totalShares == 0) {
            shares = amount; // First staker gets 1:1
        } else {
            shares = (amount * totalShares) / totalStaked;
        }
        
        userStakes[msg.sender].push(StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            shares: shares,
            active: true
        }));
        
        totalStaked += amount;
        totalShares += shares;
        
        emit Staked(msg.sender, amount, shares);
    }
    
    // Unstake after lock period - get proportional share of pool + revenue
    function unstake(uint256 stakeIndex) external {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid index");
        StakeInfo storage stakeInfo = userStakes[msg.sender][stakeIndex];
        require(stakeInfo.active, "Not active");
        require(block.timestamp >= stakeInfo.startTime + LOCK_PERIOD, "Still locked");
        
        // Calculate user's share of total pool (stake + accumulated revenue)
        uint256 totalPool = totalStaked + revenuePool;
        uint256 userShare = (stakeInfo.shares * totalPool) / totalShares;
        
        stakeInfo.active = false;
        totalStaked -= stakeInfo.amount;
        totalShares -= stakeInfo.shares;
        
        uint256 reward = userShare > stakeInfo.amount ? userShare - stakeInfo.amount : 0;
        if (reward > 0) {
            revenuePool -= reward;
        }
        
        require(aionToken.transfer(msg.sender, userShare), "Transfer failed");
        emit Unstaked(msg.sender, stakeIndex, stakeInfo.amount, reward);
    }
    
    // Platform deposits battle fees here
    function depositRevenue() external {
        require(msg.sender == predictionMarket || msg.sender == owner, "Not authorized");
        uint256 contractBalance = aionToken.balanceOf(address(this));
        uint256 expectedBalance = totalStaked + revenuePool;
        require(contractBalance > expectedBalance, "No new revenue");
        uint256 amount = contractBalance - expectedBalance;
        
        revenuePool += amount;
        lastDistributionTime = block.timestamp;
        
        emit RevenueDeposited(amount);
    }
    
    // View functions
    function getUserStakes(address user) external view returns (StakeInfo[] memory) {
        return userStakes[user];
    }
    
    function calculateUserValue(address user, uint256 stakeIndex) external view returns (uint256) {
        if (stakeIndex >= userStakes[user].length) return 0;
        StakeInfo memory stakeInfo = userStakes[user][stakeIndex];
        if (!stakeInfo.active) return 0;
        
        uint256 totalPool = totalStaked + revenuePool;
        return (stakeInfo.shares * totalPool) / totalShares;
    }
    
    // Calculate current APY based on last 30 days revenue
    function getCurrentAPY() external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        // Estimate: if current revenue rate continues for a year
        uint256 timeSinceLastDist = block.timestamp - lastDistributionTime;
        if (timeSinceLastDist == 0) return 0;
        
        uint256 annualizedRevenue = (revenuePool * 365 days) / timeSinceLastDist;
        return (annualizedRevenue * 10000) / totalStaked; // Basis points
    }
}
