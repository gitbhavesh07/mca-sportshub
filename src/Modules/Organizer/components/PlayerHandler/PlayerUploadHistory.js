import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../../App';
import { MdDownload } from 'react-icons/md';
import { BiSolidXCircle, BiLoader } from 'react-icons/bi';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from 'react-icons/io';
import ReactLoading from 'react-loading';
import './PlayerUploadHistory.css';
import { useLazyQuery, useQuery } from '@apollo/client';
import { UPLOAD_HISTORY, UPLOAD_STATUS } from '../../../../Graphql/Query/Querys';
import { useParams } from 'react-router-dom';
import ProgressBar from "@ramonak/react-progress-bar";
import { socket } from '../../../../contexts/WebSocketContext';


const PlayerUploadHistory = () => {
  const { userId, setHeader, componentRef } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [uploadHistoryData, setUploadHistoryData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('0');

  const routePath = useParams();
  const id = routePath.id;

  useEffect(() => {
    const head = componentRef.current?.id;
    setHeader(head);
  });
  const { data: uploadData, loading: uploadDataLoading, refetch:hisrefetch } = useQuery(UPLOAD_HISTORY, {
    variables: {
      auctionId: id
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!uploadDataLoading) {
      setUploadHistoryData(uploadData?.uploadHistory);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [uploadData,uploadStatus, uploadDataLoading]);

  useEffect(() => {
    hisrefetch();
    console.log('refetching')
  });

 
  useEffect(() => {
            socket.on('progress_bar', (data) => {
              const statusAsNumber = parseInt(data.status,10);
              const value=Math.round((statusAsNumber / data.totalRecords) * 100);
              if(data.id)
              setUploadStatus(value);
  });
}, [socket]);

  const getStatusTextClass = (uploadStatus) => {
    switch (uploadStatus) {
      case 'Sucess':
        return 'success-text';
      case 'Failed':
        return 'failed-text';
      case 'Error':
        return 'error-text';
      default:
        return '';
    }
  };

  const getUploadStatusIcon = (uploadStatus) => {
    switch (uploadStatus) {
      case 'Sucess':
        return <RiCheckboxCircleFill className="success-icon" />;
      case 'Failed':
        return <BiSolidXCircle className="failed-icon" />;
      case 'Error':
        return <RiCheckboxCircleFill className="error-icon" />;
      default:
        return null;
    }
  };
 
  const formatCreatedAt = (createdAt) => {
    const parts = createdAt.split('T');
    const datePart = parts[0];
    const timePart = parts[1].split('.')[0];

    return `${datePart} ${timePart}`;
  };
  return (

    <>
      {loading ? (
        <div data-TestId='loading'className='loading' >
          <ReactLoading type='bars' color='rgb(255, 196, 0)'
            height={100} width={50} />
        </div >
      ) : (
        <div className='Player-container' id='Player Upload History' ref={componentRef}>
          <div className='Player-container'>
            <div className='PlayerUploadHistory'>
              <table>
                <thead>
                  <tr>
                    <th>
                      FILE NAME</th>
                    <th>
                      UPLOAD LOG
                    </th>
                    <th>
                      UPLOAD STATUS
                    </th>
                    <th>ERROR LOG</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadHistoryData.length > 0 ? (
                    uploadHistoryData.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <div className='filename-cell'>{data.fileName}</div>
                        </td>
                        <td>{formatCreatedAt(data.createdAt)}</td>
                        <td className='filestatus'>
                          {data.status === 'Sucess' || data.status === 'Failed' ? (
                            <span className='filestatus-icon'>
                              
                              {data.status === 'Sucess'&&data.noOfSuccessRecords!==data.totalRecords&& data.noOfSuccessRecords!==0?(
                                getUploadStatusIcon('Error')
                              ):data.status === 'Sucess'&& data.noOfSuccessRecords===0?(
                                getUploadStatusIcon('Failed')
                              ):
                              (
                                getUploadStatusIcon(data.status)
                              )}
                            </span>
                          ) : (null)}
                          {data.status == 'Sucess' ? (
                            data.noOfSuccessRecords===data.totalRecords?(
                            <span className={`status-text ${getStatusTextClass(data.status)}`}>
                              {`${data.noOfSuccessRecords}/${data.totalRecords} Uploaded`}
                            </span>):data.noOfSuccessRecords===0?(<span className={`status-text ${getStatusTextClass('Failed')}`}>
                            {`${data.noOfSuccessRecords}/${data.totalRecords} Uploaded`}
                            </span>):(
                              <span className={`status-text ${getStatusTextClass('Error')}`}>
                              {`${data.noOfSuccessRecords}/${data.totalRecords} Uploaded`}
                            </span>
                            )
                            ) : data.status === 'Failed' ? (
                            <span className={`status-text ${getStatusTextClass(data.status)}`}>
                              Failed!
                            </span>
                          ) : (
                            <span className='loadbar'>
                              <div className="progress-bar">
                                <ProgressBar completed={uploadStatus}  bgColor="#ffc400" labelColor="black" width="150px" height="15px" labelSize="15px" />
                              </div>
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className='download-button'
                            disabled={data.status  !== 'Sucess' || data.totalRecords === data.noOfSuccessRecords}
                          ><a href={`https://d293laha5n7chi.cloudfront.net/${data.failedDataFilePath}`} >
                              <MdDownload /></a>
                          </button>
                        </td>
                      </tr>
                    ))) : (
                    <tr>
                      <td colSpan='9'>No history available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerUploadHistory;