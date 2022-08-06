const Staking = artifacts.require("Staking.sol");
const RewardToken = artifacts.require("RewardToken.sol");
const { BN } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer) {
  // Create reward token with 10**9 initial supply
  const initialSupply = 10**9;
  await deployer.deploy(RewardToken, initialSupply);
  const token = await(RewardToken.deployed());
  console.log('Reward Token Address', RewardToken.address);
  
  // Create staking contract with a reward rate of 10/sec  / stake RINKEBY LINK token 
  await deployer.deploy(Staking, 10, "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", RewardToken.address);
  const stakingContractInstance = await(Staking.deployed());
  console.log('Staking Contract Address', Staking.address);

  // Now transfer initial supply of reward token to staking contract
  await token.transfer(Staking.address , new BN(initialSupply).mul(new BN("1000000000000000000")));

  //await(rewardTokenInstance.transfer(Staking.address, 1000000000000000000));//new BN(""+(initialSupply/2)+"10**18")));
  //let j = await rewardTokenInstance.balanceOf(Staking.address);
  //console.log("balance staking", j)
};
