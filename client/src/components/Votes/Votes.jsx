import {useEffect, useState} from "react";
import './Votes.css'
import useEth from "../../contexts/EthContext/useEth";
import StyledButton from "../Buttons/StyledButton";

function Votes({voterAddresses, currentStep, setNotification}) {
    const {state: {contract, accounts}} = useEth();
    const [inputAddVoteValue, setInputAddVoteValue] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [votedProposalId, setVotedProposalId] = useState(-1);

    const handleInputVoteChange = e => {
        setInputAddVoteValue(e.target.value);
    };

    const getVoter = async (e) => {
        const value = await contract.methods.getVoter(accounts[0]).call({from: accounts[0]});
        setHasVoted(value.hasVoted);
        setVotedProposalId(value.votedProposalId);
    }

    const addVote = async () => {
        try {
            const transac = await contract.methods.setVote(parseInt(inputAddVoteValue) - 1).send({from: accounts[0]});
            const eventChange = await transac.events.Voted.returnValues.proposalId;
            setNotification(`Votre vote pour la proposition ${parseInt(eventChange) + 1} a bien été pris en compte`);
            setHasVoted(true);
        } catch (error) {
            console.error(error.message);
        }
    };
    getVoter();
    return (
        <>
            {
                parseInt(currentStep) === 3 &&
                voterAddresses.includes(accounts[0]) &&

                <div className="component-section">
                    {!hasVoted &&
                        <>
                            <h2>Il est l'heure de voter</h2>
                            <br/>
                            <p>Entrez le numéro de la proposition et validez pour enregistrer le vote</p>
                            <div className="section-block">
                                <input
                                    type="text"
                                    placeholder="Numéro de la proposition: exemple: 1 "
                                    onChange={handleInputVoteChange}
                                    value={inputAddVoteValue}
                                />
                                <StyledButton click={addVote} text="Votez pour votre proposition"/>
                            </div>
                        </>}
                    {hasVoted &&
                        <>
                            <h2>Votre vote est pris en compte</h2>
                            <h3 id="vote-reminder">Vous avez voté pour la proposition {parseInt(votedProposalId)+1}</h3>
                            <br/>
                            <p>Les votes seront comptabilisées lorsque l'administrateur fera le nécessaire</p>
                        </>
                    }
                </div>
            }
        </>

    )
}

export default Votes;
