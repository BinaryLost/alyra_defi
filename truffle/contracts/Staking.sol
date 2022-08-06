// SPDX-License-Identifier: MIT
// Inspired by https://solidity-by-example.org/defi/staking-rewards/
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error TransferFailed();
error NeedsMoreThanZero();

contract Staking is ReentrancyGuard {
    /** 
     * @notice Token de recompense du protocole.
     */
    IERC20 public rewardsToken;

    /**
     * @notice ERC20 a staker pour obtenir des recompenses
     */
    IERC20 public stakingToken;

    /** 
     * @notice Nombre de token de recompense crees par seconde
       @dev recompenses seulement lorsque total != 0
     */
    uint256 private REWARD_RATE;

    /** 
     * @notice timestamp de derniere maj des rewards par token
     */
    uint256 private lastUpdateTime;
    /**
     * @notice reward par token staked. Valeur uniquement croissante dans le temps. 
     */
    uint256 private rewardPerTokenStored;

    /**
     * @notice dette de recompenses de l'utilisateur. 
     *  egale a la valeur des rewards par token au moment ou l'utilisateur modifie son nombre de token staked.
     */
    mapping(address => uint256) private userRewardPerTokenPaid;
    /**
     * @notice recompenses de l'utilisateur memorisees avant modification des caracteristiques de son stake
     */
    mapping(address => uint256) private rewards;

    /**
     * @notice nombre total de token staked
     */
    uint256 public totalSupplied;

    /**
     * @notice nombre total de stakers
     */
    uint256 public totalStakers;

    /** 
     * chainlink pricefeed used for stake token $ valuation
     */
    AggregatorV3Interface private priceFeed;

    /**
     * @notice adresse => balance actuelle de staking
     */
    mapping(address => uint256) private stakingBalances;

    event Staked(address indexed user, uint256 indexed amount);
    event WithdrewStake(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    /** 
     * @param _rewardRate nombre de tokens par seconde de recompense 
     * @param _stakingToken addresse de l'ERC20 a staker
     * @param _rewardsToken adresse de l'ERC20 de recompense
     */
    constructor( uint _rewardRate, address _stakingToken, address _rewardsToken ) {
        REWARD_RATE = _rewardRate*1e18;
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        priceFeed = AggregatorV3Interface(0xd8bD0a1cB028a31AA859A21A3758685a95dE4623);
    }

    /**
     * @notice Valeur actuelle du reward pour un token staked
     */
    function rewardPerToken() private view returns (uint256) {
        if (totalSupplied == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (((block.timestamp - lastUpdateTime) * REWARD_RATE * 1e18) / totalSupplied);
    }

    /**
     * @notice Rewards a jour pour un user
     */
    function earned(address _account) private view returns (uint256) {
        return
            ((stakingBalances[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) + rewards[_account];
    }

    /**
     * @notice Rewards a jour pour un user
     */
    function earned() public view returns (uint256) {
        return earned(msg.sender);
    }

    /**
     * @notice Deposer les tokens sur le contrat
     * @param amount | nombre de tokens a stake
     */
    function stake(uint256 amount)
        external
        updateReward(msg.sender)
        nonReentrant
        moreThanZero(amount)
    {
        if (stakingBalances[msg.sender]==0)
            totalStakers++;
        totalSupplied += amount;
        stakingBalances[msg.sender] += amount;
        emit Staked(msg.sender, amount);
        bool success = stakingToken.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Retirer les tokens stakes
     * @param amount | nombre de tokens a retirer
     */
    function withdraw(uint256 amount) external updateReward(msg.sender) nonReentrant {
        totalSupplied -= amount;
        stakingBalances[msg.sender] -= amount;
        if (stakingBalances[msg.sender]==0)
            totalStakers--;
        emit WithdrewStake(msg.sender, amount);
        bool success = stakingToken.transfer(msg.sender, amount);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Recuperer l'ensemble des recompenses de staking
     */
    function claimReward() external updateReward(msg.sender) nonReentrant {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);
        bool success = rewardsToken.transfer(msg.sender, reward);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**************/
    /* Modifiers  */
    /**************/
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert NeedsMoreThanZero();
        }
        _;
    }

    /**
     * @notice montant staked pour un user
     */
    function getStaked() external view returns (uint256) {
        return stakingBalances[msg.sender];
    }

    function getStakedValue() external view returns (uint256) {
         (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return stakingBalances[msg.sender]*uint(price) / 1e6 ;
    }
}
