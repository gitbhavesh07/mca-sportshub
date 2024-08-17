import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './GoBack.css';

const GoBack = () => {
  const navigate = useNavigate();

  return (
    <div className='goback'>
      <button onClick={() => { navigate(-1); }} data-testid='FaArrowLeft'><FaArrowLeft /></button>
    </div>
  );
};

export default GoBack;
