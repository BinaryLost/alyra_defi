import {useRef, useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";
import './Voters.css'
import StyledButton from "../Buttons/StyledButton";

function Voters({voterAddresses, setVoterAddresses, owner,currentStep, setNotification }) {

    const voterEle = useRef(null);

    const { state: { contract, accounts } } = useEth();
    const [inputAddValue,setInputAddValue] = useState('');
    const [voterAddress,setVoterAddress] = useState('');
    const [voterHasVoted,setVoterHasVoted] = useState(false);
    const [voterProposalVotedId,setVoterProposalVotedId] = useState(0);
    const [voterIsRegistered,setVoterIsRegistered] = useState(false);


    useEffect(() => {
        voterEle.current.classList.add("flash");
        const flash = setTimeout(() => {
            voterEle.current.classList.remove("flash");
        }, 300);
        return () => {
            clearTimeout(flash);
        };
    }, [voterAddress,voterHasVoted,voterProposalVotedId,voterIsRegistered]);

    useEffect(() => {
        logAdresses();
    }, []);


    const logAdresses = async () => {
        let options = {
            fromBlock: '0',
            to: 'latest'
        };
        const listAddresses = await contract.getPastEvents('VoterRegistered', options).then(
            (r)=>{
                let toArray = [];
                for (const k in r){
                    toArray[k] = r[k].returnValues[0];
                }
                setVoterAddresses(toArray);
            }
        );
        return listAddresses;
    };

    const handleInputAddVoterChange = e => {
        setInputAddValue(e.target.value);
    };

    const getVoter = async (e) => {
        const voterRequested = e.target.innerText;
        if(!voterAddresses.includes(accounts[0])){
            e.preventDefault();
            setNotification(accounts[0] + ' Vous devez être électeur pour voir les détails du compte ' +  voterRequested);
        }
        const value = await contract.methods.getVoter(voterRequested).call({ from: accounts[0] })
        setVoterAddress(voterRequested);
        setVoterHasVoted(value.hasVoted);
        setVoterIsRegistered(value.isRegistered);
        if(value.hasVoted){
            setVoterProposalVotedId(parseInt(value.votedProposalId)+1);
        }
    };

    const addVoter = async () => {
        try{
            const transac = await contract.methods.addVoter(inputAddValue).send({ from: accounts[0] });
            const eventChange = await transac.events.VoterRegistered.returnValues.voterAddress;
            setNotification(`L'électeur ${eventChange} a bien été ajouté à la liste`);
            logAdresses();
        }catch(error){
            console.error(error.message);
        }
    };

    return (
        <div className="component-section">
            <h2>les électeurs</h2>
            <br/>
            <p>Nous sommes transparents. En tant qu'électeur, à tout moment vous pouvez visualiser le vote d'un autre électeur.</p>
            { voterAddresses.length > 0 &&
                <>
                <br/>
                <h3>Liste des électeurs</h3>
                <p className='bold'>Cliquez sur un électeur pour voir les détails</p>
            </>
            }
            <div className="section-block">
                <div id="voter-container" ref={voterEle}>
                    {voterAddress.length > 0 &&
                        <>
                            Electeur: <strong>{voterAddress}</strong>
                            <br/>
                            Enregistré: <strong>{voterIsRegistered ? "oui" : "non"}</strong>
                            <br/>
                            A voté: <strong>{voterHasVoted ? "oui" : "non"}</strong>
                            <br/>
                            Proposition votée: <strong>{voterProposalVotedId}</strong>
                        </>
                    }
                </div>
            </div>
            {voterAddresses.length === 0 &&
                <>
                <div className="bold">
                    Aucun électeur n'a été enregistré
                </div>
                <br />
                </>
            }
            {voterAddresses.length > 0 &&
                <div className="list-voters-container">
                    {voterAddresses.map((ad) => (
                        <div onClick={getVoter} className="list-voters" key={ad}>{ad}</div>
                    ))}
                    <br/>
                </div>
            }
            { parseInt(currentStep)  === 0 && accounts[0] === owner &&
             <div id='add-votet-container'>
                <h3>Ajouter un électeur</h3>

                <p>Attention, seul le propriétaire peut ajouter un électeur</p>

                <div  className="section-block">
                    <input
                        type="text"
                        placeholder="address, ex: 0xdf......."
                        value={inputAddValue}
                        onChange={handleInputAddVoterChange}
                    />
                    <StyledButton click={addVoter} text="Ajouter un électeur" />
                </div>
             </div>
            }
        </div>
    )
}

export default Voters;
