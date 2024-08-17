import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsPlusSquareFill } from 'react-icons/bs';
import {FaUpload, FaDownload} from 'react-icons/fa'
import { BiSolidEdit, BiDetail } from 'react-icons/bi';
import { MdDeleteOutline } from 'react-icons/md';
import './PlayerList.css';
import { BiSearchAlt2 } from 'react-icons/bi';
import ReactLoading from 'react-loading';
import { DELETE_PLAYER, FIND_AUCTION,GET_PRESIGNED_URL } from '../../../../Graphql/Query/Querys';
import { BulkUploadPlayers } from '../../../../Graphql/Mutation/Mutations';
import { useLazyQuery, useQuery,useMutation } from '@apollo/client';
import pprofile from '../../../../Images/playerprofile.jpg';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import {IoMdArrowDropleft,IoMdArrowDropright} from 'react-icons/io';
import moment from 'moment/moment';



const PlayerList = () => {

  const { isSuccess, isError } = ToastMessage();
  const navigate = useNavigate();
  const { userId, setHeader, componentRef } = useUserContext();
  const { id } = useParams();
  console.log("the id is ",id);
  const [data, setData] = useState([]);
  const [actualData,setActualData]= useState([]);
  const [loading, setLoading] = useState(true);
  const[fileName,setFileName] = useState();
  const [upload, setUpload] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const[file,setFile] = useState();
  const [searchInput, setSearchInput] = useState('');


  useEffect(() => {
    const head = componentRef.current?.id;
    setHeader(head);
  });

  const { data: findAuctionData, loading: findAuctionLoading, refetch } = useQuery(FIND_AUCTION, {
    variables: {
      id}});

  useEffect(() => {
    if (!findAuctionLoading) {
      console.log("loading false");
      setData(findAuctionData.findAuction?.player);
      setActualData(findAuctionData.findAuction?.player);
      console.log("the data is ",findAuctionData.findAuction?.player);
      setLoading(false);
    }
  }, [userId, findAuctionData, findAuctionLoading]);


  const [deletePlayer] = useLazyQuery(DELETE_PLAYER, {
    onCompleted: data => {
      const res = data.deletePlayer;
      if (res) {
        isSuccess(res);
        refetch();
      }
    },
    onError: error => {
      isError(error.message);
      console.log(error.message);

    }});

  const handleDelete = async id => {
    deletePlayer({
      variables: {
        id}});
  };
  async function uploadFileToUrl(url, fileData) {
    try {
      const response = await axios.put(url, fileData, {
        headers: {
          'Content-Type': 'application/octet-stream'}});
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
  const [bulkuploadPlayers] = useMutation(BulkUploadPlayers, {
    onCompleted: data => {
      console.log("++++78+++++",data);
      isSuccess('Bulk Upload Sucessfully')
    },
    onError: error => {
      // onClomplete(true)
      // setLoading(false);
      // if (data.message.includes("duplicate key value")) {
      //   handleWarnNotify('BulkUpload file is already present with the same name');
      // } else if (data.message.includes("Invalid headers")) {
      //   handleWarnNotify('The columns must inlcude firstName, lastName, emailId');
      //   setLoading(false);
      // } else {
      //   handleWarnNotify('Bulk Upload Failed');
      // }
      isError(error.message);
    },
  });

  const [
    getSignerUrlForUpload] = useLazyQuery(GET_PRESIGNED_URL, {
    onCompleted: async data => {
      const res = data.getSignerUrlForUpload;
      if (res) {
        const url = res.split('?')[0];
        const finalUrl = url.split(process.env.REACT_APP_AWS_ENDPOINT_URL)[1];
        const uploadSuccess = await uploadFileToUrl(res, fileName);
        console.log(finalUrl);

        if (uploadSuccess) {
          bulkuploadPlayers({
            variables: {
              'fileUrl': finalUrl,
              'auction_id':id,
              'filename': file
            },
          });
        } else {
         isError('Error uploading your File');
        }
      }
    },
    onError: error => {
      console.log();
      isError(error.message);
    }});

  const handleImageChange = event => {
    console.log(event);
    let file = event.target.files[0];
    console.log(file);
    let isValid = true;
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if(!(allowedTypes.includes(file.type))){
      setError('Invalid file type');
      isValid = false;
    }else if(file.name.length ===0){
      setError('File is required');
      isValid = false;
    }else{
      setError('');
      console.log("++++",file.name.replace(/\s+/g, ''));
      setFile(file.name.replace(/\s+/g, ''))
      setFileName(file);
    }
    return isValid;
  };

  const startUpolad = async () => {
    if(fileName){
      const uuid = uuidv4();
      const uniquefilename = `images/${moment().unix()}-${uuid}`;
      console.log("this is Unique",uniquefilename);
        await getSignerUrlForUpload({
          variables: {
            'filename': uniquefilename}});
      setTimeout(() => {
        setUpload(false);
        navigate(`/dashboard/PlayerUploadHistory/${id}`);
      }, 2000);
    }
  }
   const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  const paginatedData = data.slice(startIndex, endIndex);
  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / 10)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(()=>{
    if(searchInput === '')
    {
      setData(actualData);
    }
  },[searchInput])

  const handleSearch = () => {
    if(searchInput===''){
       isError('Search value required');
       setData(actualData);
    }else{
      if(data.length>0){
        const searchFilter = data.filter((item)=>{
          const playername = item.playername.toLowerCase();
          const serachinput = searchInput.toLowerCase();
          return (playername === serachinput || playername.includes(serachinput));
        });
        if(searchFilter.length === 0)
        {
          isError("No Player Found")
        }
        else{
        setData(searchFilter);
        }
      }else{
        isError("No Players in the Auction")
      }
    }
  };
  return (
    <>
      { loading ? (
              <div className='loading' >
                <ReactLoading type='bars' color='rgb(255, 196, 0)'
                  height={100} width={50} />
              </div >
            ) : (
              <div className='Player-container' id='Player List' ref={componentRef}>
                <div className='Player-ctrls'>
                  <div className='Player-attach-bulk'>
                    <button onClick={()=>setUpload(true)}>Bulk Upload<FaUpload className='icon-color'/></button>
                  </div>
                  <div className='Player-Upload-Histroy'>
                    <button onClick={()=>{navigate(`/dashboard/PlayerUploadHistory/${id}`)}}>Upload History <BiDetail className='icon-color'/></button>
                  </div>
                  <div className='Player-attach'>
                    <button><a href={`https://d293laha5n7chi.cloudfront.net/uploads/bulkuploadsamplefile.xlsx`} >Demo Templete <FaDownload className='icon-color'/></a></button>
                  </div>
                  <div className='addPlayer'>
                    <Link to={`/dashboard/AddPlayer/${id}`}>
                      <button onClick={() => setHeader('Add Player')} data-testid='BsPlusSquareFill'>
                        <BsPlusSquareFill />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className='search-section'>
                  <input
                    type='text'
                    placeholder='Enter PlayerName..'
                    value={searchInput}
                    onChange={e => {
                      setSearchInput(e.target.value);
                    }}
                  />
                  <button onClick={handleSearch}>
                    Search<BiSearchAlt2 className='search-icon' />
                  </button>
                </div>
                <div className='PlayerDetails'>
                  <table className='player-table'>
                    <thead>
                      <tr>
                        <th>P.No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Mobile number</th>
                        <th>Category</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><img
                              src={`https://d293laha5n7chi.cloudfront.net/${item.playerfilename}`}
                              alt={item.playerName}
                              onError={e => {
                                e.target.src = pprofile;
                              }}
                            /></td>
                            <td>{item.playername}</td>
                            <td>{item.mobilenumber}</td>
                            <td>{item.playercategory}</td>
                            <td>
                              <Link to={`/dashboard/EditPlayer/${item.id}/${id}`} className='editbutton' onClick={() => setHeader('Edit Player Detials')} data-testid='EditPlayer'>
                                <BiSolidEdit />
                              </Link>
                            </td>
                            <td>
                              <div className='editbutton' onClick={() => handleDelete(item.id)} data-testid='handleDelete'>
                                <MdDeleteOutline />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='10'>No data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                 {data.length > 10 && <div className="pagination">
        <button
          className="pagination-button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          data-testid='pageLeft'
        >
          <IoMdArrowDropleft className='pagination-icon'/>
        </button>
        <span className="pagination-info">
          Page {currentPage} of {Math.ceil(data.length / 10)}
        </span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(data.length / 10)}
          data-testid='pageRight'
        >
          <IoMdArrowDropright className='pagination-icon'/>
        </button>
      </div>}
                </div>
              </div>
                )
          }
          <Dialog open={upload} fullWidth className='Dialog'>
            <DialogTitle>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Bulk Upload
              </Typography>
            </DialogTitle>
            <DialogContent>
              <div>
                <input
                  id='fileInput'
                  type='file'
                  name='uploadFile'
                  style={{ display: 'none' }}
                  accept='.xlsx'
                  onChange={handleImageChange}
                  data-testid='handleImageChange'
                />
                <button className='Dialog-file-button'><label htmlFor='fileInput'>choose File</label></button>
                {error && <p className='error'>{error}</p>}
                {fileName && <label>{file}</label>}
              </div>
            </DialogContent>
            <DialogActions>
              <button onClick={()=>{startUpolad()}} className={fileName ? 'Dialog-button-visible' : 'Dialog-upload-button'} disabled={!fileName} >
                Upload
              </button> 
              <button onClick={()=>{setUpload(false)}} className='Dialog-cancel-button'>
                  Cancel
              </button>
            </DialogActions>
          </Dialog>
    </>
  );
};

export default PlayerList;
