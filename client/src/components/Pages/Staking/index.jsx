import Title from "../../Shared/Title";
import { useState, useEffect, useRef } from 'react';
import useEth from '../../../contexts/EthContext/useEth';
import BN from 'bn.js';

function Staking() {

    const {
        state: { accounts, contract, rewardTokenContract },
    } = useEth();

    const [result, setResult] = useState({
        staked: 0,
        earned: Number(0),
    });

    const decimals = new BN('1000000000000000000');

    async function stake(e) {
        e.preventDefault();

        const nb = document.getElementById('tokensToStake').value;
        if (!nb) return;

        // allowance needs to be > tokensToStakeis enough
        let currentAllowance = await rewardTokenContract.methods
            .allowance(accounts[0], contract._address)
            .call({ from: accounts[0] });

        let neededAllowance = decimals.mul(new BN(''+nb)) ;

        if (new BN(currentAllowance).lt(neededAllowance)) {
            await rewardTokenContract.methods
                .approve( contract._address, neededAllowance)
                .send({ from: accounts[0] });
        }

        await contract.methods.stake(neededAllowance).send({ from: accounts[0] });
    }

    async function withdraw(e) {
        e.preventDefault();
        console.log(e);
        const nb = document.getElementById('tokensToWithdraw').value;
        if (!nb) return;

        let amountToWithdraw = decimals.mul(new BN(''+nb)) ;
        await contract.methods.withdraw(amountToWithdraw).send({ from: accounts[0] });
    }

    async function claim(e) {
        console.log('CLAIMING...');
        e.preventDefault();
        try {
            await contract.methods.claimReward().send({ from: accounts[0] });
        } catch (error) {
            console.log('ERROR CATCHED : ', error);
        }
    }

    function useInterval(callback, delay) {
        const intervalRef = useRef(null);
        const savedCallback = useRef(callback);
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            const tick = () => savedCallback.current();
            if (typeof delay === 'number') {
                intervalRef.current = window.setInterval(tick, delay);
                return () => window.clearInterval(intervalRef.current);
            }
        }, [delay]);
        return intervalRef;
    }

    async function f() {
        if (contract) {

            const staked = await contract.methods
                .getStaked().call({ from: accounts[0] });
            const stakedForDisplay = (new BN(staked).div(decimals)).toString();

            let earned = await contract.methods
                .earned().call({ from: accounts[0] });
            const earnedForDisplay = (new BN(earned).div(decimals)).toString();

            setResult({
                staked: stakedForDisplay,
                earned: earnedForDisplay,
            });
        }
    }

    // mise a jour de l'affichage toutes les 2 secondes
    useInterval(f, 2000);

    return (
        <div id="Staking" >
            <div className="container">
                <Title text="Staking" />
                <div className="main-page">
                    <h3>
                        Staked Amount {result.staked} earned {result.earned}
                    </h3>
                    <br />
                    <input id="tokensToStake" type="number" />
                    <button onClick={(e) => stake(e)}>Stake</button>
                    <br />
                    <button onClick={(e) => claim(e)}>Claim</button>
                    <br />
                    <input id="tokensToWithdraw" type="number" />
                    <button onClick={(e) => withdraw(e)}>Withdraw</button>
                </div>
            </div>
        </div>
    );
}

export default Staking