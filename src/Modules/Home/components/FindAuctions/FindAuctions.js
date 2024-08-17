import React, { useState } from 'react';
import '../FindAuctions/FindAuctions.css';
import { BiSearchAlt2 } from 'react-icons/bi';
import { AiFillCalendar } from 'react-icons/ai';
import ReactLoading from 'react-loading';
import tprofile from '../../../../Images/teamProfile.jpg';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_AUCTIONS } from '../../../../Graphql/Query/Querys';
import { format } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';
import ToastMessage from '../../../../toast';

const FindAuctions = () => {
  const { isError } = ToastMessage();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const [searchAuctions] = useLazyQuery(SEARCH_AUCTIONS, {
    onCompleted: data => {
      setIsLoading(true);
      const res=data.searchAuctions;
        setSearchResults(res);
        setIsLoading(false);
       if(res.length===0){
        setShowNoResults(true);
      }
    },
    onError: error => {
      setShowNoResults(true);
    }});
  const handleSearch = () => {
    setSearchResults([]);
    if(searchInput===''){
       isError('Search value requiredd');
    }else{
    searchAuctions({
      variables: { auctionname: `%${searchInput}%`}});
  }
  };

  return (
    <div className='findAuction-container'>
      <h2>Find Auctions</h2>
      <div className='search-section'>
        <input
          type='text'
          placeholder='Search auctions...'
          value={searchInput}
          onChange={e => {
            setSearchInput(e.target.value);
            setShowNoResults(false);
          }}
        />
        <button data-testId='search-button'onClick={handleSearch} disabled={isLoading}>
          <div>Search</div><div><BiSearchAlt2 className='search-icon' /></div>
        </button>
      </div>
      {isLoading ? (
        <div className='loading'>
          <ReactLoading type="bars" color="rgb(255, 196, 0)"
            height={100} width={50} />
        </div>
      ) : (
        <div className='search-results'>
          {searchResults.map(auction => (
            <div key={auction?.id} className='findauction-card'>
              <div className='findauction-profile'>
                <img
                  src={`https://d293laha5n7chi.cloudfront.net/${auction?.filename}`}
                  alt={auction?.auctionname}
                  onError={e => {
                    e.target.src = tprofile;
                  }}
                />
              </div>
              <div className='findauction-name'>
                <h3>{auction?.auctionname}</h3>
              </div>
              <div className='findauction-button'>
                <button>
                  <h6><div className='calender-icon'><AiFillCalendar ></AiFillCalendar></div><div>{format(new Date(auction.auctiondate), 'dd-MM-yyyy')}</div></h6>
                </button>
              </div>
            </div>
          ))}
          {showNoResults &&  (
            <div className='nosearch'>No auctions found!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAuctions;
