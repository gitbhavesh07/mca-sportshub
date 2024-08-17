import React from 'react';
import { NavLink } from 'react-router-dom';
import './PlayerListHeader.css';
const PlayerListHeader = () => {
  return (
    <>
            <div className='playerlist-header'>
                <div><NavLink to='/auctionpanel/AllPlayer' className='playerlistcontent'>All Players</NavLink></div>
                <div><NavLink to='/auctionpanel/AvailablePlayer' className='playerlistcontent'>Available Players</NavLink></div>
                <div> <NavLink to='/auctionpanel/SoldPlayer' className='playerlistcontent'>
                    Sold Players
                </NavLink></div>
                <div><NavLink to='/auctionpanel/UnsoldPlayer'  className='playerlistcontent'>Unsold Players</NavLink></div>
            </div>
    </>
  );
};

export default PlayerListHeader;

