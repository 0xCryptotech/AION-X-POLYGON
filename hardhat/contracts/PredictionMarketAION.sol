// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PredictionMarketAION {
    address public owner;
    uint public marketCount;
    IERC20 public aionToken;
    address public stakingContract;
    uint public constant PLATFORM_FEE_BPS = 200; // 2% in basis points

    enum Mode { AI_VS_AI, AI_VS_HUMAN, HUMAN_VS_HUMAN }
    enum Status { OPEN, CLOSED, RESOLVED }

    struct Market {
        string title;
        Mode mode;
        string[] outcomes;
        uint closeTime;
        address oracle;
        Status status;
        uint totalStaked;
        uint winningOutcome;
    }

    struct Bet {
        address bettor;
        uint outcome;
        uint amount;
        bool claimed;
    }

    mapping(uint => Market) public markets;
    mapping(uint => Bet[]) public bets;
    mapping(uint => mapping(uint => uint)) public outcomePool;
    mapping(address => uint) public claimable;

    event MarketCreated(uint indexed marketId, string title, Mode mode, uint closeTime, address oracle);
    event BetPlaced(uint indexed marketId, address indexed user, uint outcome, uint amount);
    event MarketClosed(uint indexed marketId);
    event MarketResolved(uint indexed marketId, uint winningOutcome);
    event ClaimWithdrawn(address indexed user, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }
    modifier onlyOracle(uint marketId) {
        require(msg.sender == markets[marketId].oracle || msg.sender == owner, "not oracle");
        _;
    }
    modifier marketOpen(uint marketId) {
        require(markets[marketId].status == Status.OPEN, "market not open");
        require(block.timestamp < markets[marketId].closeTime, "market closed by time");
        _;
    }

    constructor(address _aionToken) {
        owner = msg.sender;
        marketCount = 0;
        aionToken = IERC20(_aionToken);
    }
    
    function setStakingContract(address _staking) external onlyOwner {
        stakingContract = _staking;
    }

    function createMarket(
        string calldata title,
        string[] calldata outcomes,
        uint closeTime,
        address oracle,
        Mode mode
    ) external onlyOwner returns (uint) {
        require(outcomes.length >= 2, ">=2 outcomes");
        require(closeTime > block.timestamp, "closeTime > now");
        uint id = ++marketCount;
        Market storage m = markets[id];
        m.title = title;
        m.outcomes = outcomes;
        m.closeTime = closeTime;
        m.oracle = oracle;
        m.status = Status.OPEN;
        m.mode = mode;
        m.totalStaked = 0;
        emit MarketCreated(id, title, mode, closeTime, oracle);
        return id;
    }

    function placeBet(uint marketId, uint outcome, uint amount) external marketOpen(marketId) {
        require(amount > 0, "zero bet");
        Market storage m = markets[marketId];
        require(outcome < m.outcomes.length, "invalid outcome");
        
        require(aionToken.transferFrom(msg.sender, address(this), amount), "transfer failed");
        
        bets[marketId].push(Bet({bettor: msg.sender, outcome: outcome, amount: amount, claimed:false}));
        outcomePool[marketId][outcome] += amount;
        m.totalStaked += amount;
        emit BetPlaced(marketId, msg.sender, outcome, amount);
    }

    function closeMarket(uint marketId) external {
        Market storage m = markets[marketId];
        require(m.status == Status.OPEN, "not open");
        require(block.timestamp >= m.closeTime || msg.sender == owner, "only after closeTime or owner");
        m.status = Status.CLOSED;
        emit MarketClosed(marketId);
    }

    function resolveMarket(uint marketId, uint winningOutcome) external onlyOracle(marketId) {
        Market storage m = markets[marketId];
        require(m.status == Status.CLOSED || block.timestamp >= m.closeTime, "must be closed");
        require(!_isResolved(marketId), "already resolved");
        require(winningOutcome < m.outcomes.length, "invalid outcome");
        m.winningOutcome = winningOutcome;
        m.status = Status.RESOLVED;

        uint winnerPool = outcomePool[marketId][winningOutcome];
        if (winnerPool == 0) {
            emit MarketResolved(marketId, winningOutcome);
            return;
        }
        
        // Calculate platform fee (2% of total staked)
        uint platformFee = (m.totalStaked * PLATFORM_FEE_BPS) / 10000;
        uint remainingPool = m.totalStaked - platformFee;
        
        // Send fee to staking contract
        if (stakingContract != address(0) && platformFee > 0) {
            require(aionToken.transfer(stakingContract, platformFee), "fee transfer failed");
        }

        Bet[] storage arr = bets[marketId];
        for (uint i = 0; i < arr.length; i++) {
            Bet storage b = arr[i];
            if (b.outcome == winningOutcome) {
                uint share = (b.amount * remainingPool) / winnerPool;
                claimable[b.bettor] += share;
            }
        }
        emit MarketResolved(marketId, winningOutcome);
    }

    function withdrawClaim() external {
        uint amount = claimable[msg.sender];
        require(amount > 0, "no claimable");
        claimable[msg.sender] = 0;
        require(aionToken.transfer(msg.sender, amount), "transfer failed");
        emit ClaimWithdrawn(msg.sender, amount);
    }

    function ownerWithdraw(uint amount) external onlyOwner {
        require(aionToken.transfer(owner, amount), "transfer failed");
    }

    function _isResolved(uint marketId) internal view returns (bool) {
        return markets[marketId].status == Status.RESOLVED;
    }

    function getMarketBetsCount(uint marketId) external view returns (uint) {
        return bets[marketId].length;
    }
    function getOutcomePool(uint marketId, uint outcome) external view returns (uint) {
        return outcomePool[marketId][outcome];
    }
}
