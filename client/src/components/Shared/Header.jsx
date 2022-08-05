import "./Header.css";
import Button from "./Button";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect} from "react";


function Header() {
    const {state} = useEth();

    return (
        <header>
            <Button clickable={false} id="connexion" text={!state.artifact ? "En attente de connexion ..." : state.accounts }
            />
        </header>
    );
}

export default Header;
