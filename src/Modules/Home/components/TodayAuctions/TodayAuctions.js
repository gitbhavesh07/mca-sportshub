import React, { useState, useEffect } from 'react';
import '../TodayAuctions/TodayAuctions.css';
import { BiSolidTime } from 'react-icons/bi';
import tprofile from '../../../../Images/teamProfile.jpg';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {TODAY_AUCTIONS} from '../../../../Graphql/Query/Querys';
import { format } from 'date-fns';

const TodayAuctions = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = React.useRef(null);
  const [datas, setData] = useState([]);
  const navigate=useNavigate();


 useQuery(TODAY_AUCTIONS,{
    onCompleted:data=>{
      setData(data.todayAuctions);
      console.log(data);
    }});
  useEffect(() => {
    timeoutRef.current = setTimeout(
      () =>
        setIndex(prevIndex =>
          prevIndex === datas.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const handleClick = id => {
    navigate(`/showauctionteamlist/${id}`);
  };

  const breakpoints = {
    small: '(max-width: 425px)',
    medium: '(min-width: 426px)'};
  let displayedDatas = [];

  if (datas.length <= 3 && datas.length > 0) {
      displayedDatas = datas.slice(0, datas.length);
      if(window.matchMedia(breakpoints.small).matches) {
      displayedDatas = [datas[index % datas.length]];
     }
  }else if (datas.length > 3) {
    displayedDatas = [datas[index % datas.length]];

    if (window.matchMedia(breakpoints.medium).matches) {
      displayedDatas.push(
        datas[(index + 1) % datas.length],
        datas[(index + 2) % datas.length]);
      }
  }
  const numDots = window.matchMedia(breakpoints.medium).matches? 3 : 1;
  return (
    <div id='todayAuctions' className='today-player-auction'>
      <h2 className='player-head'>TODAY PLAYER AUCTION</h2>
      <div className='today-player-underline'> </div>
      <div className='today-auction-slider'>
        <div className='auction-card-container' >
          {datas.length > 0 ? (
            displayedDatas.map((data, mapIndex) => (
              <div className='auction-card' key={mapIndex}>
                <div className='today-auction-profile'>
                  <img
                    src={`https://d293laha5n7chi.cloudfront.net/${data?.filename}`}
                    alt={data?.auctionname}
                    onError={e => {
                      e.target.src = tprofile;
                    }}
                  />
                </div>
                <div className='today-auction-name'>
                  <h3>{data?.auctionname}</h3>
                </div>
                <div className='today-auction-button'>
                  <button onClick={()=>handleClick(data?.id)}>
                  <h6><div className='calender-icon'><BiSolidTime /></div><div>{format(new Date(data?.auctiondate), 'dd-MM-yyyy')}</div></h6>
                   </button>
                </div>
              </div>
            ))) : (
            <div className='noauction'>
              No auction available
            </div>
          )}
        </div>
        <div className='slider-dots'>
          {datas.map((_, idx) => (
            (idx % numDots === 0) &&
            <div
            data-testid="div-tag"
              key={idx}
              name={'dot'}
              className={`slider-dot ${index >= idx && index < idx + numDots ? 'isactive' : ''}`}
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

export default TodayAuctions;
