import React, { useEffect, useState } from 'react';
import './OrgDashboard.css';
import { useNavigate } from 'react-router-dom';
import tprofile from '../../Images/teamProfile.jpg';
import ReactLoading from 'react-loading';
import AnimatedPage from '../../AnimatedPage';
import { useLazyQuery } from '@apollo/client';
import { FIND_USER_AUCTION } from '../../Graphql/Query/Querys';
import { useUserContext } from '../../App';

const OrgDashboard = () => {

  const { setHeader, componentRef, userId } = useUserContext();
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const head = componentRef.current?.id;
    setHeader(head);
  });

  const [findUserAuctions] = useLazyQuery(FIND_USER_AUCTION, {
    onCompleted: data => {
      const res = data.findUserAuctions;
      if (res) {
        console.log(res);
        setAuctionData(res);
        setLoading(false);
      }
    },
    onError: error => {
      console.log(error);
    }});

  useEffect(() => {
    const fetchDashboardData = async () => {
      findUserAuctions({
        variables: {
          'user_id': userId}});
    };

    fetchDashboardData();
  }, [userId]);

  return (
    <>
      {
        loading ? (
          <div className='loading'>
            <ReactLoading type='bars' color='rgb(255, 196, 0)'
              height={100} width={50} />
          </div>
        ) : (
          <AnimatedPage>
            <div className='dashboard-container' id='DashBoard' ref={componentRef}>
              <div className='dashboard-previous-auction'>
                {
                  auctionData.length === 0 ? (
                    <p>No Data Available</p>
                  ) : (
                    auctionData.map(item => (
                      <div className='box' key={item.id} onClick={() => { setHeader('My Auction Detials'); navigate(`/dashboard/AuctionDetails/${item.id}`); }} data-testid='navPage'>
                        <img
                          src={`https://d293laha5n7chi.cloudfront.net/${item.filename}`}
                          alt={`Auction: ${item.auctionname}`}
                          onError={e => {
                            e.target.src = tprofile;
                          }}
                        />
                        <div className='box-content'>
                          <p>{item.auctionname}</p>
                          <h2>{item.auctiondate}</h2>
                        </div>
                      </div>
                    ))
                  )
                }
              </div>
            </div>
          </AnimatedPage>
        )}
    </>
  );
};

export default OrgDashboard;
