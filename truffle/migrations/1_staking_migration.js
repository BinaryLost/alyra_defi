const RewardToken = artifacts.require("RewardToken.sol");
const Staking = artifacts.require("Staking.sol");

const { BN } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer) {


  const initialSupply = 1000000;
  await deployer.deploy(RewardToken, initialSupply);
  const rewardTokenInstance = await(RewardToken.deployed());
  console.log(await rewardTokenInstance.symbol());
  console.log('Address Reward Token', RewardToken.address);



  //const totalSupply = await rewardTokenInstance.totalSupply();
  //console.log('Total supply', new BN(totalSupply));
  //console.log("RewardToken", RewardToken.at(RewardToken.address));
  // Deploiement du contrat de staking
  await deployer.deploy(Staking, 1000, RewardToken.address, RewardToken.address);//Staking, 0x0, 0x0);
  console.log('Address', Staking.address);
  
  
  
  
  
  
  return(0);
  
  
  let _init = new BN(initialSupply/2);
  const _mul = BN("10").pow(BN("3"));
  console.log("_mul", _mul);
  const a = new BN("5");
  console.log("a", a);
  console.log(a.mul(_mul));
 
  await(rewardTokenInstance.transfer(Staking.address, 1000000000000000000));//new BN(""+(initialSupply/2)+"10**18")));
  //let j = await rewardTokenInstance.balanceOf(Staking.address);
  //console.log("balance staking", j)
};
