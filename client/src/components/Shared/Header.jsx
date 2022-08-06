import "./Header.css";
import Button from "./Button";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect} from "react";


function Header() {
    const {state: {artifact, accounts}} = useEth();

    return (
        <header>
            <Button clickable={false} id="connexion" text={!artifact ? "En attente de connexion ..." : accounts }
            />
        </header>
    );
}

export default Header;
