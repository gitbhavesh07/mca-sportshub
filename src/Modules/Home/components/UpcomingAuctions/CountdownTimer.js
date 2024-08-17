import React, { useState, useEffect } from 'react';
import '../TodayAuctions/TodayAuctions.css';

const CountdownTimer = ({ endDate }) => {
 const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

 function calculateTimeRemaining() {
  const now = new Date();
  const endTime = new Date(endDate);
  const timeDiff = endTime - now;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return {
   days,
   hours,
   minutes,
   seconds};
 }

 useEffect(() => {
  const intervalId = setInterval(() => {
   setTimeRemaining(calculateTimeRemaining());
  }, 1);

  return () => {
   clearInterval(intervalId);
  };
 }, [endDate]);

 return (
  <div data-testId='countdown-timer'
  style={{ textAlign: 'center',color:'red', padding: '10px', borderRadius: '5px',backgroundColor: 'black',
  boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)',opacity:'0.6'}} classname='timer'>
   <h2>{timeRemaining.days} : {timeRemaining.hours} : {timeRemaining.minutes} : {timeRemaining.seconds}</h2>
  </div>
 );
};
export default CountdownTimer;
