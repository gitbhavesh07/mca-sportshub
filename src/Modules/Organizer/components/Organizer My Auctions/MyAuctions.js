import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsPlusSquareFill } from 'react-icons/bs';
import { BiSolidEdit } from 'react-icons/bi';
import { TiUserDeleteOutline } from 'react-icons/ti';
import './MyAuctions.css';
import ReactLoading from 'react-loading';
import { useQuery,useMutation } from '@apollo/client';
import { FIND_USER_AUCTION } from '../../../../Graphql/Query/Querys';
import { DELETE_AUCTION } from '../../../../Graphql/Mutation/Mutations';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';
import {IoMdArrowDropleft,IoMdArrowDropright} from 'react-icons/io';

const MyAuctions = () => {

  const { isSuccess, isError } = ToastMessage();
  const {setHeader, componentRef ,userId } = useUserContext();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const head = componentRef.current?.id;
    setHeader(head);
});

 const { data: fetchdata, loading: fetchloading, refetch } = useQuery(
    FIND_USER_AUCTION,
    {
      variables: {
        user_id: userId}});

  useEffect(() => {
    if (!fetchloading) {
      setLoading(false);
      setData(fetchdata ? fetchdata.findUserAuctions : []);
    }
  }, [userId, fetchdata, fetchloading]);


  const [deleteAuctionMutation] = useMutation(DELETE_AUCTION, {
    onCompleted: data => {
      isSuccess('Auction Deleted Successfully!');
      refetch();
    },
    onError: error => {
      isError('Error deleting auction');
    }});
  const deleteAuction = id => {
    deleteAuctionMutation({
     variables: {
        id}});
  };
 const startIndex = (currentPage - 1) * 4;
  const endIndex = startIndex + 4;

  const paginatedData =  data.slice(startIndex, endIndex);
  const handleNextPage = () => {
    if (currentPage < Math.ceil( data.length / 4)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className='loading'>
    <ReactLoading type="bars" color="rgb(255, 196, 0)"
      height={100} width={50} />
   </div>;
  }

  return (
    <div className='myauction-container' id='My Auctions' ref={componentRef}>
      <div className='auction-add' >
        <button  onClick={() => navigate('/dashboard/CreateAuctions')}>
          <BsPlusSquareFill data-testid="addauction-nav"/>
        </button>
      </div>
      <div className='auctionDetails'>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Auction Name</th>
              <th>Auction Date</th>
              <th>Team Point</th>
              <th>Minimum Bid</th>
              <th>Bid Increase</th>
              <th>Player</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>{(currentPage-1)*4+index + 1}</td>
                  <td  data-testId='auctiondetail'><Link to={`/dashboard/AuctionDetails/${item.id}`} className='auction-link'data-testid="button" onClick={()=>{setHeader('My Auction Details');}}>{item.auctionname}</Link></td>
                  <td>{item.auctiondate}</td>
                  <td>{item.pointsperteam}</td>
                  <td>{item.minbid}</td>
                  <td>{item.bidincrease}</td>
                  <td>{item.playerperteam}</td>
                  <td>
                    <Link to={`/dashboard/EditAuctions/${item.id}`} className='editbutton'>
                      <BiSolidEdit />
                    </Link>
                  </td>
                  <td>
                      <div  data-testid="delete" className='editbutton' onClick={() => deleteAuction(item.id)}>
                        <TiUserDeleteOutline />
                      </div>
                    </td>
                </tr>
              ))
            ) : (
            <tr>
              <td colSpan='9'>No data available.</td>
            </tr>
            )
          }
          </tbody>
        </table>
        {data.length > 10 && <div className="pagination">
        <button
        data-testId='previouspage'
          className='pagination-button'
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <IoMdArrowDropleft className='pagination-icon'/>
        </button>
        <span className="pagination-info">
          Page {currentPage} of {Math.ceil(data.length / 4)}
        </span>
        <button
          data-testId='nextpage'
          className='pagination-button'
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(data.length / 4)}
        >
          <IoMdArrowDropright className='pagination-icon'/>
        </button>
      </div>}
      </div>
    </div>
  );
};

export default MyAuctions;
