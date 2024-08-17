import React, { useState, useEffect } from 'react';
import '../TodayAuctions/TodayAuctions.css';
import tprofile from '../../../../Images/teamProfile.jpg';
import CountdownTimer from '../UpcomingAuctions/CountdownTimer';
import {AiFillCalendar} from 'react-icons/ai';
import { useQuery } from '@apollo/client';
import { UPCOMING_AUCTIONS } from '../../../../Graphql/Query/Querys';
import { format } from 'date-fns';

const UpcomingAuctions = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = React.useRef(null);
  const [datas, setData] = useState([]);
  const [timer,setTimer] = useState(false);
  const [timerIndex,setTimerindex]=useState(null);
  useQuery(UPCOMING_AUCTIONS,{
    onCompleted:data=>{
      setData(data.upcomingAuctions);
    }});

 useEffect(() => {
   resetTimeout();
   timeoutRef.current = setTimeout(
    () =>
     setIndex(prevIndex =>
      prevIndex === datas.length - 1 ? 0 : prevIndex + 1
     ),
    10000
   );
  }, [index,datas.length]);
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  const handleClick = index => {
       if(timer){
        setTimer(false);
       }
       else{
        setTimer(true);
      setTimerindex(index);
       }
      };

 const viewpoints = {
  small: '(max-width: 425px)',
  medium: '(min-width: 426px)'};

let upcomingDatas=[];
 if(datas.length<=3 && datas.length>0){
  upcomingDatas = datas.slice(0, datas.length);
    if (window.matchMedia(viewpoints.small).matches) {
      upcomingDatas = [datas[index % datas.length]];
   }
 }else if(datas.length>3){
  upcomingDatas = [datas[index % datas.length]];
  if (window.matchMedia(viewpoints.medium).matches) {
    upcomingDatas.push(
   datas[(index + 1) % datas.length],
   datas[(index + 2) % datas.length]);
  }
 }


  const dots = window.matchMedia(viewpoints.medium).matches? 3: 1;
  return (
<div id='upcomingAuctions' className='upcoming-player-auction'>
   <h2 className='player-head'>UPCOMING PLAYER AUCTION</h2>
   <div className='upcoming-player-underline'> </div>
    <div className='upcoming-auction-slider'>
     <div className='upcoming-card-container' >
     {datas.length > 0 ? (
      upcomingDatas.map((data, mapIndex) => (

       <div className="upcoming-card" key={mapIndex}>
        <div className='upcoming-auction-profile'>
         <img
          src={`https://d293laha5n7chi.cloudfront.net/${data?.filename}`}
          alt={data?.auctionname}
          onError={e => {
           e.target.src = tprofile;
          }}
         />
        </div>
        <div className='upcoming-auction-name'>
         <h3>{data?.auctionname}</h3>
        </div>
        <div className='upcoming-auction-button'>
         <button onClick={() => handleClick(mapIndex)}>
          <h6><div className='calender-icon'><AiFillCalendar ></AiFillCalendar></div><div>{format(new Date(data?.auctiondate), 'dd-MM-yyyy')}</div></h6>
         </button>
        </div>
         {(mapIndex===timerIndex) && timer &&
        <div>
        <CountdownTimer endDate={new Date(data.auctiondate)} />
        </div>}
       </div>
      ))) : (
      <div className='noauction'>
       No auction available
      </div>
     )}
     </div>
     <div className='slider-dots'>
      {datas.map((_, idx) => (
       (idx % dots === 0) &&
       <div
        key={idx}
        className={`slider-dot ${index >= idx && index < idx + dots ? 'isactive' : ''}`}
        onClick={() => {
         setIndex(idx);
        }}
       ></div>
      ))}
     </div>
    </div>
   </div>
   );
  };
  export default UpcomingAuctions;

