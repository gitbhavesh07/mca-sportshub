import React from 'react';
import '../Pricing/Pricing.css';
import PricingData from '../Pricing/PricingData.json';

const Pricing = () => {
  return (
    <div id='pricing' className='pricing-container'>
      <h2 className='pricing-head'>OUR PRICING</h2>
      <div className='pricing-underline'></div>
      <div className='pricing-details'>
        {PricingData.map((priceData, index) =>
          <div className='pricing-box' key={index}>
            <div className='pricing-box-detials'>
              <h4>upto</h4>
              <h5>{priceData.numOfTeams}</h5>
              <h2>Teams</h2>
            </div>
            <h4 className='pricing-button'>{priceData.pricing}</h4>
          </div>
        )}
      </div>
    </div>
  );
};
export default Pricing;
