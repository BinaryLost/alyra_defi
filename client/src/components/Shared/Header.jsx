import "./Header.css";
import Button from "./Button";
import {useEffect, useState} from "react";
import {useEth} from "../../contexts/EthContext";


function Header() {

    const {state: {contract, accounts}} = useEth();

    return (
        <header>
            <Button clickable={false} id="connexion" text="En attente de connexion ..." />
        </header>
    );
}

export default Header;
