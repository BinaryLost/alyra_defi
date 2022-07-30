import {useState,useEffect} from "react";
import './Proposals.css'
import StyledButton from "../Buttons/StyledButton";
import useEth from "../../contexts/EthContext/useEth";

function Proposals({proposals,setProposals,setNotification, currentStep,voterAddresses}) {
    const {state: {contract, accounts}} = useEth();
    const [inputAddProposalValue,setInputAddProposalValue] = useState('');

    useEffect(()=> {
        logProposals();
    },[])

    const handleInputAddProposalChange = e => {
        setInputAddProposalValue(e.target.value);
    };

    const addProposal = async () => {
        try{
            const transac = await contract.methods.addProposal(inputAddProposalValue).send({ from: accounts[0] });
            const eventChange = await transac.events.ProposalRegistered.returnValues.proposalId;
            setNotification(`La proposition ${eventChange} a bien été ajoutée à la liste`);
            logProposals();
        }catch(error){
            console.error(error.message);
        }
    };


    const logProposals = async () => {
        let options = {
            fromBlock: '0',
            to: 'latest'
        };
        try{
            const listProposals = await contract.getPastEvents('ProposalRegistered', options).then(
                async (r) => {
                    let toArray = [];
                    for (const k in r) {
                        let id = r[k].returnValues[0];
                        await contract.methods.getOneProposal(id).call({from: accounts[0]}).then((r)=>{
                            toArray.push({id: id, description: r.description});
                        });
                    }
                    setProposals(toArray);
                }
        );
        }catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            {parseInt(currentStep) > 0 && voterAddresses.includes(accounts[0]) &&
                <div className="component-section">
                    <h2>Les propositions</h2>
                        <div id='add-proposal-container'>
                            <div className="list-voters-container">
                                {proposals.map((pro) => (
                                    <div key={pro.id} className="list-proposals">
                                        Proposition {parseInt(pro.id)  + 1} : {pro.description}
                                    </div>
                                ))}
                                <br/>
                            </div>

                            {parseInt(currentStep) === 1 &&
                                <>
                                <h3>Ajouter une proposition</h3>

                                <div  className="section-block">
                                <input
                                type="text"
                                placeholder="Description"
                                onChange={handleInputAddProposalChange}
                                value={inputAddProposalValue}
                                />
                                <StyledButton click={addProposal} text="Ajouter une proposition" />
                                </div>
                                </>
                            }
                        </div>
                </div>
            }
        </>
    )
}

export default Proposals;
