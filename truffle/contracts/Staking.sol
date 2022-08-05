// SPDX-License-Identifier: MIT
// Inspired by https://solidity-by-example.org/defi/staking-rewards/
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error TransferFailed();
error NeedsMoreThanZero();

contract Staking is ReentrancyGuard {
    /** 
     * @notice Token de recompense du protocole.
     */
    IERC20 public s_rewardsToken;

    /**
     * @notice ERC20 a staker pour obtenir des recompenses
     */
    IERC20 public s_stakingToken;

    /** 
     * @notice Nombre de token de recompense crees par seconde
       @dev recompenses seulement lorsque s_total != 0
     */
    uint256 private REWARD_RATE;

    /** 
     * @notice timestamp de derniere maj des rewards par token
     */
    uint256 private s_lastUpdateTime;
    /**
     * @notice reward par token staked. Valeur uniquement croissante dans le temps. 
     */
    uint256 private s_rewardPerTokenStored;

    /**
     * @notice dette de recompenses de l'utilisateur. 
     *  egale a la valeur des rewards par token au moment ou l'utilisateur modifie son nombre de token staked.
     */
    mapping(address => uint256) private s_userRewardPerTokenPaid;
    /**
     * @notice recompenses de l'utilisateur memorisees avant modification des caracteristiques de son stake
     */
    mapping(address => uint256) private s_rewards;

    /**
     * @dev nombre total de token staked
     */
    uint256 public s_totalSupply;

    /**
     * @notice adresse => balance actuelle de staking
     */
    mapping(address => uint256) private s_balances;

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
        s_stakingToken = IERC20(_stakingToken);
        s_rewardsToken = IERC20(_rewardsToken);
    }

    /**
     * @notice Valeur actuelle du reward pour un token staked
     */
    function rewardPerToken() private view returns (uint256) {
        if (s_totalSupply == 0) {
            return s_rewardPerTokenStored;
        }
        return
            s_rewardPerTokenStored +
            (((block.timestamp - s_lastUpdateTime) * REWARD_RATE * 1e18) / s_totalSupply);
    }

    /**
     * @notice Rewards a jour pour un user
     */
    function earned(address _account) private view returns (uint256) {
        return
            ((s_balances[_account] * (rewardPerToken() - s_userRewardPerTokenPaid[_account])) / 1e18) + s_rewards[_account];
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
        s_totalSupply += amount;
        s_balances[msg.sender] += amount;
        emit Staked(msg.sender, amount);
        bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Retirer les tokens stakes
     * @param amount | nombre de tokens a retirer
     */
    function withdraw(uint256 amount) external updateReward(msg.sender) nonReentrant {
        s_totalSupply -= amount;
        s_balances[msg.sender] -= amount;
        emit WithdrewStake(msg.sender, amount);
        bool success = s_stakingToken.transfer(msg.sender, amount);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Recuperer l'ensemble des recompenses de staking
     */
    function claimReward() external updateReward(msg.sender) nonReentrant {
        uint256 reward = s_rewards[msg.sender];
        s_rewards[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);
        bool success = s_rewardsToken.transfer(msg.sender, reward);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**************/
    /* Modifiers  */
    /**************/
    modifier updateReward(address account) {
        s_rewardPerTokenStored = rewardPerToken();
        s_lastUpdateTime = block.timestamp;
        s_rewards[account] = earned(account);
        s_userRewardPerTokenPaid[account] = s_rewardPerTokenStored;
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
        return s_balances[msg.sender];
    }
}