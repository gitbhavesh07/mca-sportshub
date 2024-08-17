import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ApDashboard.css';
import logo from '../../Images/Logo.png';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import AnimatedPage from '../../AnimatedPage';
import { FIND_AUCTION } from '../../Graphql/Query/Querys';
import { useLazyQuery } from '@apollo/client';
import ReactLoading from 'react-loading';
import { useUserContext } from '../../App';


const ApDashboard = () => {

  const { setStart, setAuctionId, setAuctionPanel, setUserOption, userOption } = useUserContext();
  const { id } = useParams();
  setAuctionId(id);
  const [initialAuctionData, setInitialAuctionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [findAuction] = useLazyQuery(FIND_AUCTION, {
    onCompleted: data => {
      const res = data.findAuction;
      if (res) {
        setInitialAuctionData([res]);
        setLoading(false);
      }
    },
    onError: error => {
      console.error('Error fetching auction details:', error);
    }});
  useEffect(() => {
    findAuction({
      variables: {
        id}});
  }, [id]);

  const handleStartAuction = () => {
    if (setStart) {
      setStart(false);
      setAuctionPanel(true);
      setAuctionId(localStorage.getItem('Auction_id'));
    }
  };

  const handleChange = selectedOption => {
    localStorage.setItem("category",selectedOption);
    setUserOption(selectedOption);
  };

  if (loading) {
    return (
      <div className='dash-loading'>
        <ReactLoading type="bars" color="rgb(255, 196, 0)"
          height={200} width={50} />
      </div>
    );
  } else {
    return (
      <div className='auctionPanel-container'>
        <AnimatedPage>
          {initialAuctionData.map((item, index) => (
            <div key={index} className='auctionPanel-details'>
              <div className='auctionPanel-header'>
                <h1>{item.auctionname}</h1>
                <h2>PLAYER AUCTION</h2>
              </div>
              <div className='dropdown-container'>
                <button onClick={()=>handleChange('random')} className={userOption === 'random' ? 'random-button' : ''}>Random Players</button>
                <button onClick={()=>handleChange('category')} className={userOption === 'category' ? 'category-button' : ''}>Category Players</button>
              </div>
              <Link to={'/auctionpanel/Auction'} className='start-link'>
                <div className='auctionPanel-button'>
                  <button onClick={handleStartAuction} >
                    <h2>
                      START AUCTION</h2>
                    <h2><BsFillArrowRightCircleFill className='panel-arrow' /></h2>
                  </button>
                </div>
              </Link>
              <div className='auctionPanel-logo'>
                <p>MANAGED BY</p>
                <img src={logo} alt='SPORTSHUB' />
              </div>
            </div>
          ))}
        </AnimatedPage>
      </div>
    );
  }
};

export default ApDashboard;
