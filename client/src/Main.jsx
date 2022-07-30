import {useState} from "react";
import useEth from "./contexts/EthContext/useEth";
import NoticeNoArtifact from "./components/NoticeNoArtifact";
import NoticeWrongNetwork from "./components/NoticeWrongNetwork";
import Banner from "./components/Intro/Banner";
import Footer from "./components/Footer";
import Voters from "./components/Voters/Voters";
import Steps from "./components/Steps/Steps";
import Notification from "./components/Notification/Notification";
import ContractAddress from "./components/ContractAddress/ContractAddress";
import Proposals from "./components/Proposals/Proposals";
import Votes from "./components/Votes/Votes";
import Tally from "./components/Tally/Tally";
import Winner from "./components/Winner/Winner";

function Main() {
    const [owner, setOwner] = useState("");
    const {state: {contract, accounts}} = useEth();
    const {state} = useEth();
    const [notification, setNotification] = useState('');
    const [voterAddresses, setVoterAddresses] = useState([]);
    const [proposals, setProposals] = useState([]);

    const workflowStatusArray = [
        'Etape d\'enregistrement des électeurs ouverte',
        'Etape des propositions ouverte',
        'Etape des propositions terminée',
        'Etape des votes ouverte',
        'Etape des votes terminée, les votes vont êtres comptabilisés',
        'La session de vote test terminée, voici les résultats'
    ];
    const [currentStep, setCurrentStep] = useState(null);

    const getCurrentStep = async () => {
        try {
            await contract.methods.workflowStatus().call({from: accounts[0]}).then(
                (r) => {
                    setCurrentStep(r);
                }
            );
        } catch (error) {
        }
    }

    const loadOwner = async () => {
        try {
            await contract.methods.owner().call({from: accounts[0]}).then(
                (r) => {
                    setOwner(r);
                }
            );
        } catch (error) {
        }
    }

    getCurrentStep();
    loadOwner();
    const main =
        <>
            <ContractAddress/>
            <Steps owner={owner} workflowStatusArray={workflowStatusArray} currentStep={currentStep}
                   setCurrentStep={setCurrentStep}
                   setNotification={setNotification} />
            {parseInt(currentStep) < 4 &&
                <>
                    <Voters voterAddresses={voterAddresses} setVoterAddresses={setVoterAddresses} owner={owner}
                            workflowStatusArray={workflowStatusArray} currentStep={currentStep}
                            setNotification={setNotification}/>
                    <Proposals proposals={proposals} setProposals={setProposals} currentStep={currentStep}
                               voterAddresses={voterAddresses} setNotification={setNotification}/>
                    <Votes currentStep={currentStep} voterAddresses={voterAddresses} setNotification={setNotification}/>
                </>
            }
            {parseInt(currentStep) === 4 &&
                <Tally owner={owner} setCurrentStep={setCurrentStep} currentStep={currentStep}  setNotification={setNotification} />
            }
            {parseInt(currentStep) === 5 &&
                <Winner owner={owner} />
            }
        </>;

    return (
        <div className="main">
            <Notification notification={notification}/>
            <Banner/>
            {
                !state.artifact ? <NoticeNoArtifact/> :
                    !state.contract ? <NoticeWrongNetwork/> :
                        main
            }
            <Footer/>
        </div>
    );
}

export default Main;
