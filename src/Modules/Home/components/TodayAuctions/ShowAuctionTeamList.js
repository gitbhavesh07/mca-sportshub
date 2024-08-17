import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../TodayAuctions/ShowAuctionTeamList.css';
import ReactLoading from 'react-loading';
import tprofile from '../../../../Images/teamProfile.jpg';
import { useLazyQuery } from '@apollo/client';
import { SHOW_TEAM } from '../../../../Graphql/Query/Querys';
import ToastMessage from '../../../../toast';

const ShowAuctionTeamList = () => {
  const { auctionId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {isError} = ToastMessage();
  const [findTeamList] = useLazyQuery(SHOW_TEAM, {
    onCompleted: data => {
      const res = data.showTeam;
      console.log(data);
        setData(res);
        setLoading(false);
    },
  onError:error =>{
    isError(error.message);
    setLoading(false);
  }});
useEffect(() => {
    findTeamList({
      variables: {
        'id': auctionId}});
  }, [auctionId]);
  return (
    <>
      {loading ? (
        <div className='loading'>
          <ReactLoading type='bars' color='rgb(255, 196, 0)'
            height={100} width={50} />
        </div>
      ) : (
        <>
          <div className='showteam-container'>
            {data.length > 0 ? (
              data.map(item => (
                <div key={item.id} className='showteam-card'>
                  <img
                    src={`https://d293laha5n7chi.cloudfront.net/${item.teamfilename}`}
                    alt='showteamimage' className='showteam-image'
                    onError={e => {
                      e.target.src = tprofile;
                    }}
                  />
                  <div className='showteam-data'>
                    <p className='showteamshort-name'>{item.teamshortname}</p>
                    <p className='showteam-name'>{item.availablepoints}</p>
                    <p className='showteam-name'>PLAYERS:{item.playercount!==null?item.playercount:0}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='no-data'>
                <h1>No data found</h1>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default ShowAuctionTeamList;

