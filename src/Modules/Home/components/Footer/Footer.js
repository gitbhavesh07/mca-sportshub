import React from 'react';
import '../Footer/Footer.css';
import { BsFacebook, BsYoutube, BsInstagram } from 'react-icons/bs';

const Footer = () => {
  return (
    <div className='footer-container'>
      <div className='facebook'><BsFacebook></BsFacebook></div>
      <div className='icon-underline'></div>
      <div className='youtube'><BsYoutube></BsYoutube></div>
      <div className='icon-underline'></div>
      <div className='instagram'><BsInstagram></BsInstagram></div>
    </div>
  );
};

export default Footer;
