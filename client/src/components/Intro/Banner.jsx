import Title from "./Title";
import logo from '../../assets/logo.png'
import bannerImage from '../../assets/banner.png'
import './Banner.css'

function Banner() {
    return (
        <div>
            <div id="banner-container" className="sub-container">
                <div id='voting-banner'>
                    <img src={logo} alt='logo' id='voting-logo' />
                    <Title />
                </div>
            </div>
            <img src={bannerImage} alt='Banner' id='voting-banner-image' />
        </div>
    )
}

export default Banner