import React, { useState, useEffect, useRef } from 'react';
import '../Clients/Clients.css';
import { GET_ALL_CLIENTS } from '../../../../Graphql/Query/Querys';
import { useQuery } from '@apollo/client';


const Clients = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const { data } = useQuery(GET_ALL_CLIENTS);
  const clients = data?.getAllClients || [];
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex(prevIndex =>
          prevIndex === clients.length - 1 ? 0 : prevIndex + 1
        ),
      3000
    );
  }, [index,clients]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const breakpoints = {
    small: '(max-width: 576px)',
    medium: '(min-width: 577px) and (max-width: 992px)',
    large: '(min-width: 993px)'};

  const displayedDatas = [clients[index % clients.length]];

  if (window.matchMedia(breakpoints.medium).matches) {
    displayedDatas.push(
    clients[(index + 1) % clients.length],
    clients[(index + 2) % clients.length]);
  } else{
    if (window.matchMedia(breakpoints.large).matches) {
    displayedDatas.push(
    clients[(index + 1) % clients.length],
    clients[(index + 2) % clients.length],
    clients[(index + 3) % clients.length],
    clients[(index + 4) % clients.length],
    clients[(index + 5) % clients.length]
    );
  }
}
  const numDots = window.matchMedia(breakpoints.medium).matches
  ? 3
  : window.matchMedia(breakpoints.large).matches
  ? 6
  : 1;
  return (
    <div id='clients' className='client-container'>
      <h2 className='client-head'>CLIENTS</h2>
      <div className='client-underline'> </div>
      <div className='client-details'>
        {displayedDatas.map((data, mapIndex) => (
          <div className='client-image' key={mapIndex}>
            <img src={data?.clientlogo} alt={data?.clientname} />
          </div>
        ))}
      </div>
      <div className='slider-dots'>
        {clients.map((_, idx) => (
          (idx % numDots === 0) &&
            <div
              key={idx}
              className={`slider-dot ${index >= idx && index < idx + numDots? 'isactive':''}`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
        ))}
      </div>
    </div>
  );
};

export default Clients;

