import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifact, stakingTokenArtifact) => {
      if ((artifact)&&(stakingTokenArtifact)) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        const stakingTokenAbi  = stakingTokenArtifact.abi;

        let address, contract, stakingTokenContract;
        try {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);

          stakingTokenContract = new web3.eth.Contract(stakingTokenAbi, "0x01BE23585060835E02B77ef475b0Cc51aA1e0709");
          
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, stakingTokenArtifact, web3, accounts, networkID, contract, stakingTokenContract }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Staking.json");
        const stakingTokenArtifact = require("../../contracts/IERC20.json");
        init(artifact, stakingTokenArtifact);

      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
