import React, { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { BsPlusSquareFill } from 'react-icons/bs';
import { BiSolidEdit } from 'react-icons/bi';
import { useParams, Link } from 'react-router-dom';
import './TeamList.css';
import ReactLoading from 'react-loading';
import { DELETE_TEAM, FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';
import { IoMdArrowDropleft,IoMdArrowDropright } from 'react-icons/io';

const TeamList = () => {

  const { isSuccess, isError } = ToastMessage();
  const { userId, setHeader, componentRef } = useUserContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const head = componentRef.current?.id;
    setHeader(head);
  });

  const { data: findAuctionData, loading: findAuctionLoading, refetch } = useQuery(FIND_AUCTION, {
    variables: {
      id}});

  useEffect(() => {
    if (!findAuctionLoading) {
      console.log('data',findAuctionLoading);

      setData(findAuctionData.findAuction?.team);
      setLoading(false);
    }
  }, [userId, findAuctionData, findAuctionLoading]);

  const [deleteTeam] = useLazyQuery(DELETE_TEAM, {
    onCompleted: data => {
      const res = data.deleteTeam;
      if (res) {
        isSuccess(res);
        refetch();
      }
    },
    onError: error => {
      isError(error.message);
    }});

  const handleDelete = async id => {
    deleteTeam({
      variables: {
        id}});
  };

  return (
    <>
      {loading ? (
        <div className='loading' >
          <ReactLoading type='bars' color='rgb(255, 196, 0)'
            height={100} width={50} />
        </div >
      ) : (
        <>
          <div className='Team-container' id='Team List' ref={componentRef}>
            <div className='Team-add'>
              <Link to={`/dashboard/AddTeam/${id}`}><button onClick={() => setHeader('Add Team')} data-testid='BsPlusSquareFill'>
                <BsPlusSquareFill />
              </button></Link>
            </div>
            <div className='TeamDetails'>
              <table className='team-table'>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Team</th>
                    <th>Short</th>
                    <th>Key</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.teamname}</td>
                        <td>{item.teamshortname}</td>
                        <td>{item.teamshortcutkey}</td>
                        <td>
                          <Link to={`/dashboard/EditTeam/${item.id}`} className='editbutton' onClick={() => setHeader('Edit Team Detials')} data-testid='EditTeam'>
                            <BiSolidEdit />
                          </Link>
                        </td>
                        <td>
                          <div className='editbutton' onClick={() => { handleDelete(item.id); }} data-testid='handleDelete'>
                            <MdDeleteOutline />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='9'>No data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )
      }
    </>
  );
};

export default TeamList;
