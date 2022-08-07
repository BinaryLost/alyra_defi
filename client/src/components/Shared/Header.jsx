import "./Header.css";
import Button from "./Button";
import useEth from "../../contexts/EthContext/useEth";


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
