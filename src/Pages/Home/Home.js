import { Link } from 'react-router-dom';
import fb_icon from '../../Components/svg/fb_icon.svg'
import ig_icon from '../../Components/svg/inst_icon.svg'
import tw_icon from '../../Components/svg/twt_icon.svg'
import yt_icon from '../../Components/svg/yt_icon.svg'
import ra_icon from '../../Components/svg/arrow.svg'
import benchy from '../../Components//img/benchy.png'

import './Home.css';

const Home = () => {
    return (
        <div className="homepage-container">
            <div className="homepage-text">
                <h1 className="homepage-header">
                    Bring Your Creativity To Life With Us
                </h1>
                <div className="homepage-paragraph">
                    Discover endless possibilities with 3D printing. With the newest technology and an array of material, your imagination is your only limit. With precision and ease, you can create unique objects and designs suiting your tastes.
                </div>
                <Link to="/store" className="homepage-storebtn">~
                    Our Products
                    <img src={ra_icon} className="ra-icon" />
                </Link>
            </div>
            <div className='homepage-images'>
                <img className="homepage-image" src={benchy} alt="homepage" />
                <ul className='homepage-links'>
                    <li><a className='homepage-link' href='https://facebook.com'><img src={fb_icon}></img></a></li>
                    <li><a className='homepage-link' href='https://instagram.com'><img src={ig_icon}></img></a></li>
                    <li><a className='homepage-link' href='https://twitter.com'><img src={tw_icon}></img></a></li>
                    <li><a className='homepage-link' href='https://youtube.com'><img src={yt_icon}></img></a></li>
                </ul>
            </div>
        </div>
    );
}

export default Home;