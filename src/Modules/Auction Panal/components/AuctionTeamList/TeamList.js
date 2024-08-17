import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../AuctionPlayerList/AllPlayers.css';
import ReactLoading from 'react-loading';
import { useLazyQuery } from '@apollo/client';
import { FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import { useUserContext } from '../../../../App';

const TeamList = () => {

  const { auctionId } = useUserContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [findAuction] = useLazyQuery(FIND_AUCTION, {
    onCompleted: TeamListdata => {
      const res = TeamListdata.findAuction;
      if (res.team) {
        setData(res.team);
        setLoading(false);
      }
    }});

  useEffect(() => {
    findAuction({
      variables: {
        'id': auctionId}});
  }, [auctionId,data]);

  return (
    <>
      {loading ? (
        <div className='loading'>
          <ReactLoading type="bars" color="rgb(255, 196, 0)"
            height={100} width={50} />
        </div>
      ) : (
        <>
          <div className='allplayer-container'>
            {data.length > 0 ? (
              data.map(item => (
                <Link to={`/auctionpanel/individualteamplayer/${item.id}`} key={item.team_id} className='individualteamplayer-link'>
                  <div className="player-card">
                    <img src={`https://d293laha5n7chi.cloudfront.net/${item.teamfilename}`} alt='playerimage' className="player-image" />
                    <div className='allplayers-data'>
                      <p className="auctionteam-name">{item.teamshortname}</p>
                      <p className="player-name">{item.availablepoints}</p>
                      <p className="player-name">PLAYERS:{item.playercount ? item.playercount : 0}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-data">
                <h1>No data found</h1>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TeamList;

