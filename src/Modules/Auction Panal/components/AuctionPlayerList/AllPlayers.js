import React, { useEffect, useState } from 'react';
import './AllPlayers.css';
import ReactLoading from 'react-loading';
import { useLazyQuery } from '@apollo/client';
import { FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import { useUserContext } from '../../../../App';
import pprofile from '../../../../Images/playerprofile.jpg';


const AllPlayers = ({AvailablePlayer,SoldPlayer,UnSoldPlayer}) => {

  const { auctionId } = useUserContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [findAuction] = useLazyQuery(FIND_AUCTION, {
    onCompleted: AllPlayerData => {
      const res = AllPlayerData.findAuction;
      if (res.player) {
        if(AvailablePlayer){
          const playersWithNullStatus = res.player.filter(player => player.playerstatus === null);
          setData(playersWithNullStatus);
        }else if(SoldPlayer){
          const playersWithSoldStatus = res.player.filter(player => player.playerstatus === 'SOLD');
          setData(playersWithSoldStatus);
        }else if(UnSoldPlayer){
          const playersWithUnSoldStatus = res.player.filter(player => player.playerstatus === 'UNSOLD');
          setData(playersWithUnSoldStatus);
        }else{
          setData(res.player);
        }
        setLoading(false);
      }
    }});

  useEffect(() => {
    findAuction({
      variables: {
        'id': auctionId}});
  }, [auctionId]);
  return (
    <>
      {
        loading ? (
          <div className='loading' >
            <ReactLoading type="bars" color="rgb(255, 196, 0)"
              height={100} width={50} />
          </div >
        ) : (
          <>
            <div className='allplayer-container'>
              {data.length > 0 ? (
                data.map(item => (
                  <div key={item.id} className="player-card">
                    <img
                      src={item.playerfilename?`https://d293laha5n7chi.cloudfront.net/${item.playerfilename}`:pprofile}
                      alt='playerimage'
                      className="player-image"
                    />
                    <div className='allplayers-data'>
                      <h5 className="player-name">{item.playername}</h5>
                       <p className="player-name">{item.playercategory}</p>
                      {item.playerstatus ? (
                        <p style={{ color: item.playerstatus === 'SOLD' ? 'green' : 'red' }}>
                          {item.playerstatus}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <h1>No Players</h1>
                </div>
              )}
            </div>
          </>
        )}
    </>
  );
};

export default AllPlayers;

