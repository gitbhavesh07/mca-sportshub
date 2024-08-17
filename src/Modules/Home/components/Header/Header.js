import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../Header/Header.css';
import Dropdown from './DropDown';
import { FaBars } from 'react-icons/fa';
import projectlogo from '../../../../Images/Logo.png';


const Header = () => {
    const [dropdown, setDropdown] = useState(false);
    const [menu, setMenu] = useState(false);
    let menuStyle = '';

    const onMouseEnter = () => {
        setDropdown(true);
    };

    const onMouseLeave = () => {
        setDropdown(false);
        setMenu(false);
    };

    const changeValue = () => {
        setMenu(!menu);
    };

    if(menu){
        menuStyle = 'dropdown-nav open';
    }else{
        menuStyle = 'close';
    }

    return (
        <div className='container'>
            <div className='header'>
                <nav className='navbar'>
                    <Link to='/'>
                        <img src={projectlogo} className='logo' alt='Project Logo' />
                    </Link>
                    <div className='bar-icon'> <FaBars onClick={changeValue} title='Bars' aria-label='Open Menu'></FaBars></div>
                    <div className={ menuStyle } onMouseLeave={onMouseLeave} data-testid="menu">
                        <Link to='/' className='nav-links-menu'><li onClick={changeValue}>Home</li></Link>
                        <Link to='/findAuctions' className='nav-links-menu'><li onClick={changeValue}>Find Auction</li></Link>
                        <Link to='/login' className='nav-links-button-menu'><li onClick={changeValue}><button className='btn'>Login</button></li></Link>
                        <Link to='/register' className='nav-links-button-menu'><li onClick={changeValue}><button className='btn'>Register</button></li></Link>
                    </div>
                    <ul className='nav-menu'>
                        <li
                            className='nav-item'
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            <NavLink
                                to='/'
                                className='nav-links'
                            >
                                Home <i className='fas fa-caret-down' />
                            </NavLink>
                            {dropdown && <Dropdown />}
                        </li>
                        <li className='nav-item'>
                            <NavLink
                                to='/findAuctions'
                                className='nav-links'
                            >
                                Find Auctions
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-links' to='/login'>
                                <button className='btn'>Login</button>
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-links' to='/register'>
                                <button className='btn'>Register</button>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
