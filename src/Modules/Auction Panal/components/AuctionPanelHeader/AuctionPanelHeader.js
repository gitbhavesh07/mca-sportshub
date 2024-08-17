import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import '../../../Home/components/Header/Header.css';
import { FaBars, FaArrowLeft } from 'react-icons/fa';
import projectlogo from '../../../../Images/Logo.png';
import { useUserContext } from '../../../../App';


const AuctionPanelHeader = () => {

    const { setPlayerPanel, auctionId, setUserOption } = useUserContext();
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();
    const onMouseLeave = () => {
        setMenu(false);
    };

    const changeValue = () => {
        setMenu(!menu);
    };
    const handlegoback = () => {
        setUserOption('');
        navigate(`/dashboard/AuctionDetails/${auctionId}`);
        localStorage.removeItem('Auction_id');
        localStorage.removeItem('category');
    };
    return (
        <div className='auctionhead-container'>
            <div className='header'>
                <nav className='navbar'>
                    <div className='back-page'>
                        <button data-TestId='button' onClick={handlegoback}><FaArrowLeft /></button>
                    </div>
                    <img src={projectlogo} className='auction-logo' alt='Project Logo' />
                    <div className='bar-icon' data-TestId='mouse' onMouseLeave={onMouseLeave}> <FaBars data-TestId='button' onClick={changeValue}></FaBars></div>
                    <div className={menu ? 'dropdown-nav open' : 'close'} onMouseLeave={onMouseLeave}>
                        <Link to='/auctionpanel/Auction' className='nav-links-menu'><li data-TestId='button' onClick={() =>{
                            changeValue();
                            setPlayerPanel(true);
                        }}>Auction Panel</li></Link>
                        <Link to='/auctionpanel/auctionteamlist' className='nav-links-menu'><li data-TestId='button' onClick={() => {
                            changeValue();
                            setPlayerPanel(true);
                        }}>Team List</li></Link>
                        <Link to='/auctionpanel/playerlistheader' className='nav-links-menu'><li data-TestId='button' onClick={() => {
                            changeValue();
                            setPlayerPanel(false);
                        }}>Player List</li></Link>
                        <Link to='/auctionpanel/matchhost' className='nav-links-menu'><li data-TestId='button' onClick={() => {
                            changeValue();
                            setPlayerPanel(true);
                        }}>Match Host</li></Link>
                    </div>
                    <ul className='nav-menu'>
                        <li className='nav-item'>
                            <NavLink
                                to='/auctionpanel/Auction'
                                data-TestId='button'
                                onClick={() => {
                                    setPlayerPanel(true);
                                }}
                                className='nav-links'
                            >
                                Auction Panel
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-links' data-TestId='button' to='/auctionpanel/auctionteamlist' onClick={() => {
                                setPlayerPanel(true);
                            }} >
                                Team List
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-links'data-TestId='button' to='/auctionpanel/playerlistheader' onClick={() => {
                                setPlayerPanel(false);
                            }}>
                                Player List
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-links'data-TestId='button' to='/auctionpanel/matchhost' onClick={() => {
                                setPlayerPanel(true);
                            }}>
                                Match Host
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div >
        </div >
    );
};

export default AuctionPanelHeader;

