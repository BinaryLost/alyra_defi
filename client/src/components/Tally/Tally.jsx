import './Tally.css'
import useEth from "../../contexts/EthContext/useEth";
import StyledButton from "../Buttons/StyledButton";

function Tally({ owner, setCurrentStep, currentStep, setNotification} ) {
    const {state: {contract, accounts}} = useEth();

    const tallyVote = async (e) => {
        if(accounts[0] !== owner){
            return;
        }
        try {
            const nextStep = parseInt(currentStep) + 1;
            await contract.methods.tallyVotes().send({ from: accounts[0] }).then((r) => {
                setCurrentStep(nextStep);
                setNotification(`Les votes sont comptabilisés, passage à la dernière étape`);
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            {owner === accounts[0] &&
                <div className="section-block">
                    <StyledButton click={tallyVote} text="Lancez la comptabilisation des votes"/>
                </div>
            }
        </>
    )
}

export default Tally;
