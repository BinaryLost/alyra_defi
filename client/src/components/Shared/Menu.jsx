import {Link, NavLink} from "react-router-dom";
import "./Menu.css";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { ReactComponent as HomeIcon } from "../../assets/home-icon.svg";
import { ReactComponent as StakingIcon } from "../../assets/wallet.svg";


function Menu() {
    return (
        <div id="lateral-menu-container">
            <li>
                <Link to="/home">
                    <Logo id="logo" />
                </Link>
            </li>
            <nav id="lateral-menu" >
                <ul>
                    <li>
                        <NavLink activeClassName="active" to="/home">
                            <HomeIcon id="menu-home" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to="/staking">
                            <StakingIcon  alt='logo' id='menu-staking' />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Menu;
