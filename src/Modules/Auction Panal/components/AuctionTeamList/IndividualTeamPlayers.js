import React, { useEffect, useState } from 'react';
import '../AuctionPlayerList/AllPlayers.css';
import { useParams, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FIND_TEAM } from '../../../../Graphql/Query/Querys';
import { useLazyQuery } from '@apollo/client';
import pprofile from '../../../../Images/playerprofile.jpg';

const IndividualTeamPlayers = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const [findTeam] = useLazyQuery(FIND_TEAM, {
    onCompleted: IndividualTeamPlayerData => {
      const res = IndividualTeamPlayerData.findTeam;
      if (res.player) {
        setData(res.player);
        setLoading(false);
      }
    }});

  useEffect(() => {
    findTeam({
      variables: {
      id}});
  }, [id]);

  const goback = () => {
    navigate(-1);
  };

  return (
    <>
      {loading ? (
        <div className='loading'>
          <ReactLoading type="bars" color="rgb(255, 196, 0)"
            height={100} width={50} />
        </div>
      ) : (
        <>
          <div className='individualteamplayer-button'>
            <button className="btn btn-success" onClick={goback}>Go Back</button>
          </div>
          <div className='allplayer-container'>
            {data.length> 0 ? (
              data.map(item => (
                <div key={item.id} className="player-card">
                  <img  src={item.playerfilename?`https://d293laha5n7chi.cloudfront.net/${item.playerfilename}`:pprofile}
 alt='playerimage' className="player-image" />
                  <div className='allplayers-data'>
                    <h5 className="player-name">{item.playername}</h5>
                    <p className="player-name">{item.playercategory}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <h1>No Players for this team </h1>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default IndividualTeamPlayers;

