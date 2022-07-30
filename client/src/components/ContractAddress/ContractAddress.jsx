import "./ContractAddress.css"
import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractAddress() {
    const [contractAddress, setContractAddress] = useState(null);
    const {state: {contract, accounts}} = useEth();

    useEffect(() => {
        getContractData();
    }, [contractAddress])

    const getContractData = async () => {
        try {
            setContractAddress(contract._address)
        } catch (error) {
        }
    }
    return (
        <div className="sub-container">
            <div><span className="contract-address-reminder bold">L'adresse du contrat est : </span>
                <a href={"https://ropsten.etherscan.io/address/" + contractAddress}>
                    <span className="contract-address">{contractAddress}</span>
                </a>
            </div>
            <div><span className="contract-address-reminder bold">Vous êtes connecté sur l'adresse : </span>
                <a href={"https://ropsten.etherscan.io/address/" + accounts[0]}>
                    <span className="contract-address">{accounts[0]}</span>
                </a>
            </div>
        </div>
    )
}

export default ContractAddress;
