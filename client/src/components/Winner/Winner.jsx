import {useState} from "react";
import './Winner.css'
import useEth from "../../contexts/EthContext/useEth";

function Winner({owner}) {
    const {state: {contract}} = useEth();
    const [winningProposalId, setWinningProposalId] = useState();
    const [winningProposalDescription, setWinningProposalDescription] = useState();

    const winner = async (e) => {
        try{
            await contract.methods.winningProposalID().call({from: owner})
                .then(
                    (r) => {
                        setWinningProposalId(r);
                    }
                )
                .then(()=>{
                    contract.methods.getOneProposal(winningProposalId).call({ from: owner }).then(
                        r => setWinningProposalDescription(r.description)
                    )
                })
        }catch (err){
        }
    };

    winner();

    return (
        <div className="section-block">
            <p id="winner-is">
                Winner is : {parseInt(winningProposalId) + 1} : {winningProposalDescription}
            </p>
        </div>
    )
}

export default Winner;
