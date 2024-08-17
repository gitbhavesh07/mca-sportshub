import React, { useState } from 'react';
import profile from '../../../../Images/profile.png';
import './Header.css';
import { FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../../App';


const Header = () => {
  const { profileName, header, setHeader } = useUserContext();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const onMouseLeave = () => {
    setMenu(false);
  };

  const changeValue = () => {
    setMenu(!menu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <div className='common-container'>
      <div className='common-bar-icon'>
        <FaBars onClick={changeValue} title='Bars'/>
      </div>
      <div
        className={menu ? 'common-dropdown-nav open' : 'close'}
        onMouseLeave={onMouseLeave}
        data-testid="menu"
      >
        <li onClick={() => { changeValue(); }} data-testid='changeValue1'>
          <div className='common-nav-links-menu-profile'>
            <img src={profile} alt='Profile' /> {profileName}
          </div>
        </li>
        <Link to='/dashboard/' className='common-nav-links-menu'>
          <li onClick={() => { changeValue(); setHeader('DashBoard'); }} data-testid='changeValue2'>DashBoard</li>
        </Link>
        <Link to='/dashboard/CreateAuctions/' className='common-nav-links-menu'>
          <li onClick={() => { changeValue(); setHeader('Create Auction'); }} data-testid='changeValue3'>Create Auctions</li>
        </Link>
        <Link to='/dashboard/MyAuctions' className='common-nav-links-menu'>
          <li onClick={() => { changeValue(); setHeader('My Auction'); }} data-testid='changeValue4'>My Auctions
          </li>
        </Link>
        <Link className='nav-links-button-menu'>
          <li onClick={() => { changeValue(); handleLogout(); }} data-testid='logout'>
            <button className='btn'>Log out</button>
          </li>
        </Link>
      </div>
      <div className='common-header'>
        <h3>{header}</h3>
        <div className='common-profile'>
          {profileName} <img src={profile} alt='Profile' />
        </div>
      </div>
    </div>
  );
};

export default Header;
