import React from 'react';
import './Home.css';
import image1 from '../../Images/sp.png';
import TodayAuctions from '../Home/components/TodayAuctions/TodayAuctions';
import UpcomingAuctions from '../Home/components/UpcomingAuctions/UpcomingAuctions';
import Clients from '../Home/components/Clients/Clients';
import Pricing from '../Home/components/Pricing/Pricing';
import Contacts from '../Home/components/Contacts/Contacts';
import Call from '../Home/components/Call/Call';
import About from '../Home/components/About/About';
import Features from '../Home/components/Features/Features';

const Home = () => {
  return (
    <div className='home-container'>
      <div className='content'>
        <img src={image1} alt='image' className='poster-img' />
      </div>
      <TodayAuctions/>
      <UpcomingAuctions/>
      <Features/>
      <Clients/>
      <Call/>
      <Pricing/>
      <About/>
      <Contacts/>
    </div>
  );
};

export default Home;
