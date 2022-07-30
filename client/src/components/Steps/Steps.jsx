import './Steps.css'
import StyledButton from "../Buttons/StyledButton";
import useEth from "../../contexts/EthContext/useEth";

function Steps({owner, setCurrentStep, currentStep, workflowStatusArray, setNotification}) {

    const {state: {contract, accounts}} = useEth();
    const workflowNextStepMappingMethods = {
        1: 'startProposalsRegistering',
        2: 'endProposalsRegistering',
        3: 'startVotingSession',
        4: 'endVotingSession',
        5: 'tallyVotes'
    }

    const goNextStep = async () => {
        try {
            const nextStep = parseInt(currentStep) + 1;
            const transac = await contract.methods[workflowNextStepMappingMethods[nextStep]]().send({from: accounts[0]});
            await transac.events.WorkflowStatusChange.returnValues.newStatus;
            setNotification(workflowStatusArray[nextStep]);
            setCurrentStep(nextStep);
        } catch (error) {
        }
    }

    return (
        <div className="component-section">
            {parseInt(currentStep) < 4  &&
                <>
                    <h2>Le déroulement du vote</h2>
                    <br/>
                    <h3 className="bold" id="current-step">{workflowStatusArray[currentStep]}</h3>
                    <br/>
                    <p>
                        Le propriétaire du contrat ouvrira la session des propositions après avoir ajouté les électeurs.
                        Une fois la sessions des propositions closes, l'ouverture de la session de vote aura lieu.
                        la proposition ayant récolté le plus de votes sera retenue.
                    </p>

                    {owner === accounts[0] &&
                        <StyledButton click={goNextStep} text="Terminer l'étape actuelle"/>
                    }
                </>}
            {parseInt(currentStep) >= 4 &&
                <>
                    <h3 className="bold" id="current-step">{workflowStatusArray[currentStep]}</h3>
                </>
            }
        </div>
    )
}

export default Steps;
