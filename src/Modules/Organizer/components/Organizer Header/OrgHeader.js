import React, { useState } from 'react';
import './OrgHeader.css';
import projectlogo from '../../../../Images/Logo.png';
import { TfiMenuAlt } from 'react-icons/tfi';
import { RiDashboard3Line } from 'react-icons/ri';
import { TbCalendarPlus } from 'react-icons/tb';
import { CgListTree } from 'react-icons/cg';
import { BiLogOut } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { sessionExpired } from '../../../../RefreshTokenAccess';

const OrgHeader = ({ children }) => {

  const [active1, setActive1] = useState('active1');
  const [active2, setActive2] = useState('');
  const [active3, setActive3] = useState('');
  const [isOpen, setIsopen] = useState(false);
  const orgLinkMenu = isOpen ? 'org-links-menu' : 'org-links-menu-close';
  const orgLink = isOpen ? 'org-link' : 'org-link-close';

  const toggele = () => {
    setIsopen(!isOpen);
  };

  const handleLogout = () => {
    sessionExpired();
  };

  return (
    <div className='org-container'>
      <div className={isOpen ? 'sidebar' : 'sidebar-close'}>
        <div className='org-logo'>
          <div className={isOpen ? 'bars' : 'bars-close'} title='Bars' aria-label='Open Menu'>
            {isOpen ? <FaArrowLeft onClick={toggele} data-testid="barOpen"/> : <TfiMenuAlt onClick={toggele} data-testid="barClose"/>}
          </div>
          <img src={projectlogo} className={isOpen ? 'org-project-logo' : 'org-project-logo-close'} alt='Project Logo' />
        </div>
        <Link to='/dashboard/' className={`${orgLinkMenu} ${active1}`} src={projectlogo} onClick={() => { setActive1('active1'); setActive2(''); setActive3(''); }}>
          <div className='org-icon' ><RiDashboard3Line /></div>
          <div className={orgLink}>DashBoard</div>
        </Link>
        <Link to='/dashboard/CreateAuctions' className={`${orgLinkMenu} ${active2}`} onClick={() => { setActive1(''); setActive2('active2'); setActive3(''); }}>
          <div className='org-icon'><TbCalendarPlus /></div>
          <div className={orgLink}>Create Auctions</div>
        </Link>
        <Link to='/dashboard/MyAuctions' className={`${orgLinkMenu} ${active3}`} onClick={() => { setActive1(''); setActive2(''); setActive3('active3'); }}>
          <div className='org-icon'><CgListTree /></div>
          <div className={orgLink}>My Auctions</div>
        </Link>
        <Link to='/login' className={`${orgLinkMenu}`} onClick={() => { setActive1(''); setActive2(''); setActive3('active3'); handleLogout(); }}>
          <div className='org-icon'><BiLogOut /></div>
          <div className={orgLink}>Log out</div>
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default OrgHeader;
