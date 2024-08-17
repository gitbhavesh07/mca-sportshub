import React from 'react';
import '../Call/Call.css';
import { IoCall } from 'react-icons/io5';

const Call = () => {
  return (
    <div className='call-container'>
      <div className='call-msg'>
        <h2>CALL TO AUCTION</h2>
        <h4>If any query of this app please call us</h4>
      </div>
      <div className='call-button'>
        <button><span><IoCall></IoCall></span><span>CALL</span> </button>
      </div>
    </div>
  );
};

export default Call;
