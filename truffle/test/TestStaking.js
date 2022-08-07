const { BN, expectRevert, expectEvent , time} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Staking = artifacts.require('Staking');
const RewardToken = artifacts.require('RewardToken');
const StakingToken = artifacts.require('ERC20');

contract("Staking", function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];

    let stakingInstance, rewardContract, stakingToken;

    describe.skip("Stake tokens", async function() {

        beforeEach(async function () {
            // staking token can be whatever ERC we choose. Here LINK on rinkeby 
            stakingToken = await StakingToken.at('0x01BE23585060835E02B77ef475b0Cc51aA1e0709'); 

            // create reward token
            const initialSupply = 10**9;
            rewardContract = await RewardToken.new(initialSupply, { from: owner });
          
            // now create staking contract
            stakingInstance =  await Staking.new(10, stakingToken.address, rewardContract.address, { from: owner });

            // transfer initial supply of reward token to our new contract
            await rewardContract.transfer(stakingInstance.address , new BN(initialSupply).mul(new BN("1000000000000000000")));

            // give allowance for staking contract to tranfer 50 LINK from owner account
            const allowance = new BN('50000000000000000000'); 
            await stakingToken.approve(stakingInstance.address, allowance, {from : owner});
           
        })

        it('refuse to stake 0 tokens', async function () {
            await expectRevert.unspecified(stakingInstance.stake(0, {from: owner})); // errors exist since 0.8.4 but cannot be catched specifically 
        });
        
        it('my staked value (dollars) should be 0 as no token is staked', async function () {
            const stakedValue = await stakingInstance.getStakedValue({ from: owner });
            expect(stakedValue).to.be.bignumber.equal(new BN(0));
        });

        it ("stake LINK tokens", async function () {
            const ev =await stakingInstance.stake(1, {from:owner});
             expectEvent(ev, "Staked", {
                user: owner,
                amount : new BN(1)
             });
         });

        it ("total staked value should increase the amount I stake", async function () {
           const totalStakedValue0 = await stakingInstance.totalSupplied.call({ from: owner });
           const _amount = 12345;
           await stakingInstance.stake(_amount, {from:owner});
           const totalStakedValue1 = await stakingInstance.totalSupplied.call({ from: owner });
           expect(totalStakedValue1).to.be.bignumber.equal(new BN(_amount));
        });

        it ("withdraw a part of my deposit",  async function () {
            const _amount = 1000;
            await stakingInstance.stake(_amount, {from:owner});
            await stakingInstance.withdraw(400, {from:owner});
            let stakedValue = await stakingInstance.getStaked({ from: owner });
            expect(stakedValue).to.be.bignumber.equal(new BN(600));
        });

        it ("withdraw all my deposit & verify my ERC20 balance",  async function () {
            const _amount = 11243352244779;
            const initialBalance = await stakingToken.balanceOf(owner);
            await stakingInstance.stake(_amount, {from:owner});
            let stakedAmount = await stakingInstance.getStaked({ from: owner });
            const ev = await stakingInstance.withdraw(stakedAmount, {from:owner});
            const finalBalance = await stakingToken.balanceOf(owner);
            expect(initialBalance).to.be.bignumber.equal(finalBalance);
        });
    })
  
    
    describe("Rewards", async function() {

        beforeEach(async function () {

            // staking token can be whatever ERC we choose. Here LINK on rinkeby 
            stakingToken = await StakingToken.at('0x01BE23585060835E02B77ef475b0Cc51aA1e0709'); 

            // create reward token
            const initialSupply = 10**9;
            rewardContract = await RewardToken.new(initialSupply, { from: owner });
          
            // now create staking contract
            stakingInstance =  await Staking.new(10, stakingToken.address, rewardContract.address, { from: owner });

            // transfer initial supply of reward token to our new contract
            await rewardContract.transfer(stakingInstance.address , new BN(initialSupply).mul(new BN("1000000000000000000")));

            // give allowance for staking contract to tranfer 50 LINK from owner account
            const allowance = new BN('20000000000000000000'); 
            await stakingToken.approve(stakingInstance.address, allowance, {from : owner});
           
        })

        it('initial earning is 0', async function () {
            //await stakingInstance.stake(1, {from:owner});
            const earned = await stakingInstance.earned({ from: owner });
            expect(earned).to.be.bignumber.equal(new BN(0));

        });
        
        it('stake & earn rewards', async function () {
            await stakingInstance.stake(1, {from:owner});     
            await time.advanceBlock();
            await time.increase(80);
            const earned = await stakingInstance.earned({ from: owner });
            expect(earned).to.be.bignumber.equal(new BN("800000000000000000000")); // 80 seconds * 10/sec * 1e18
        });

        it('claim rewards', async function () {
            const initialBalance = await rewardContract.balanceOf(owner);
            await stakingInstance.stake(1, {from:owner});     
            await time.advanceBlock();
            await time.increase(80);
            await stakingInstance.claimReward({from:owner});
            const finalBalance = await rewardContract.balanceOf(owner);
            expect(finalBalance).to.be.bignumber.equal(initialBalance.add(new BN("800000000000000000000")));

        });
    })
})