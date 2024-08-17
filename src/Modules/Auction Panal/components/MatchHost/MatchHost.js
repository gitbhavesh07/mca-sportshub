
import React, { useState, useEffect } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../MatchHost/MatchHost.css';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { RESET_AUCTION_DATA, REAUCTION_FOR_UNSOLD, LIVE } from '../../../../Graphql/Mutation/Mutations';
import { FIND_TEAM_STATISTICS, FIND_PLAYER_STATISTICS, GET_LIVE } from '../../../../Graphql/Query/Querys';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../../../../App';
import { socket } from '../../../../contexts/WebSocketContext';
import ToastMessage from '../../../../toast';

const MatchHost = () => {

  const { isSuccess, isError } = ToastMessage();
  const { auctionId } = useUserContext();
  const [activeDiv, setActiveDiv] = useState(null);
  const [liveDiv, setLiveDiv] = useState(localStorage.getItem('LiveDiv'));
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState([]);
  const [teamplayer, setTeamPlayer] = useState([]);
  const [count, setCount] = useState([]);
  const [liveDataStarted, setLiveDataStarted] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [roomId, setRoomId] = useState('');
  Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  const timer = 2000;

  useEffect(() => {
    localStorage.setItem('LiveDiv', liveDiv);
  }, [liveDiv]);

  const handleToggleDiv = divName => {
    setActiveDiv(prevActiveDiv => {
      if (prevActiveDiv === divName) {
        return null;
      } else {
        return divName;
      }
    });
  };

  const handleLiveToggle = divName => {
    setLiveDiv(prevActiveDiv => {
      if (prevActiveDiv === divName) {
        return null;
      } else {
        return divName;
      }
    });
  };
  const [resetAuctionData] = useMutation(RESET_AUCTION_DATA, {
    onCompleted: data => {
      console.log('reset',data);
      isSuccess(data.resetAuction);
      setLoading(false);
    },
    onError: err => {
      isError(err.message);
      setLoading(false);
    }});

  const [UnsoldreAuction] = useMutation(REAUCTION_FOR_UNSOLD, {
    onCompleted: data => {
      isSuccess(data.unsoldReauction);
      setLoading(false);
    },
    onError: err => {
      isError(err.message);
      setLoading(false);
    }});

  const handleReset = () => {
    setLoading(true);
    resetAuctionData({
      variables: {
        id: auctionId}});
  };

  const handleUnSold = () => {
    setLoading(true);
    UnsoldreAuction({
      variables: {
        id: auctionId}});
  };

  const [teamstatistics] = useLazyQuery(FIND_TEAM_STATISTICS, {
    onCompleted: data => {
      const teamNames = data.teamstatistics.map(team => team.teamname);
      setTeamName(teamNames);
      const playercounts = data.teamstatistics.map(team => team.playercount);
      setTeamPlayer(playercounts);
      setLoading(false);
    },
    onError: error => {
      isError(error.message);
      setLoading(false);
    },
    pollInterval: 5000});

  const [playerstatistics] = useLazyQuery(FIND_PLAYER_STATISTICS, {
    onCompleted: data => {
      const nullCount = data.playerstatistics.filter(player => player.playerstatus === null).length;
      const soldCount = data.playerstatistics.filter(player => player.playerstatus === 'SOLD').length;
      const unsoldCount = data.playerstatistics.filter(player => player.playerstatus === 'UNSOLD').length;
      setCount([soldCount, unsoldCount, nullCount]);
      setLoading(false);
    },
    onError: error => {
      isError(error.message);
      setLoading(false);
    },
    pollInterval: 5000});


  const { data: livedata, loading: liveloading, refetch: liverefetch } = useQuery(GET_LIVE, {
  });

  useEffect(() => {
    if (livedata) {
      setRoomId(livedata.getlive[0].room_id);
      setLiveDataStarted(livedata.getlive[0].livestate);
      if (livedata.getlive[0].livestate === true) {
        localStorage.setItem('LiveDiv', 'live');
      } else
        localStorage.setItem('LiveDiv', null);
    }
  }, [livedata, liveloading]);


  const [updatelive] = useMutation(LIVE, {
    onCompleted: data => {
      if (data.updatelive.livestate) {
        isSuccess('Live Started');
        window.open('/websocket', '_blank');
        socket.connect();
        socket.emit('start_live', auctionId);
      } else {
        if (socket) {
          isSuccess('Live stopped');
          socket.disconnect();
        }
      }
      liverefetch();
    },
    onError: error => {
      console.log(error);
    }});


  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected');
      });
      socket.on('disconnect', () => {
        console.log('disconnected');
      });
    }
  }, [socket]);

  const handleTeam = () => {
    setLoading(true);
    teamstatistics(
      {
        variables: {
          'id': auctionId}});
  };

  const handlePlayer = () => {
    setLoading(true);
    playerstatistics(
      {
        variables: {
          'id': auctionId}});
  };



  const teamdata = {
    labels: teamName,
    datasets: [
      {
        label: 'No.Of.Players',
        color: 'blue',
        data: teamplayer,
        backgroundColor: '#ffbd42',
        borderColor: 'black',
        borderWidth: 1}]};

  const playerdata = {
    labels: ['SOLD', 'UNSOLD', 'NULL'],
    datasets: [
      {
        label: 'No.Of.Players',
        data: count,
        backgroundColor: ['green', '#ff0000', '#cccccc'],
        borderColor: 'black',
        borderWidth: 1}]};

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'black'}},
      y: {
        ticks: {
          color: 'black'}}},
    datasets: {
      bar: {
        barPercentage: 0.6}}};


  const handleLive = () => {
    if (!liveDataStarted) {
      updatelive({
        variables: {
          livestate: true,
          room_id: auctionId}});
    } else {
      if (liveDataStarted) {
        updatelive({
          variables: {
            livestate: false,
            room_id: auctionId}});
      }
    }
  };

  const copyToClipboard = text => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    if (text === roomId) {
      setCopiedId(true);
      setTimeout(() => {
        setCopiedId(false);
      }, timer);
    } else {
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
      }, timer);
    }
  };

  return (
    <div className='matchhost-container'>
      <div className='matchhost-header'>
        <h1>MANAGE FEATURES</h1>
      </div>
      <div className='matchhost-navigate'>
        <div className='matchhost-navigate-left'>
          <button onClick={() => { handleToggleDiv('teamStats'); handleTeam(); }} data-testid='TeamStatistics'>
            <div className='matchhost-navigate-left-div'>
              Team Statistics
            </div></button>
          <button
            onClick={() => {
              handleToggleDiv('playerStats');
              handlePlayer();
            }}
            data-testid='PlayerStatistics'
          ><div className='matchhost-navigate-left-div'>Player Statistics</div></button>
          <button onClick={() => { handleReset(); }} disabled={loading} data-testid='Reset'><div className='matchhost-navigate-left-div'>Reset</div></button>
          <button
            onClick={() => {
              handleUnSold();
            }}
            disabled={loading} data-testid='Reauction'
          ><div className='matchhost-navigate-left-div'>Reauction For Unsold</div></button>
          <button
            onClick={() => {
              handleLiveToggle('live');
              handleLive();
            }}
            data-testid='Live'
          ><div className='matchhost-navigate-left-div'>{liveDataStarted ? 'Stop Live' : 'Start Live'}</div></button>
        </div>
        {activeDiv && (
          <div className='matchhost-navigate-right'>
            {activeDiv === 'teamStats' && <div data-testid='team-stats-bar'>
              <Bar style={{ padding: '2px', width: '100%', height: '280px' }} data={teamdata} options={options}>
              </Bar>
            </div>}
            {activeDiv === 'playerStats' && <div data-testid='player-stats-bar'>
              <Bar style={{ padding: '2px', width: '100%', height: '280px' }} data={playerdata} options={options}>
              </Bar>
            </div>}
          </div>
        )}
        {liveDiv === 'live' && activeDiv === null &&
          <div className='live_info'>
            <div><h2>LIVE LINK</h2></div>
            {/* <div> <button onClick={() => copyToClipboard('https://d293laha5n7chi.cloudfront.net/websocket')}> */}
          <div> <button onClick={() => copyToClipboard('http://localhost:3000/websocket')}>
              {copiedLink ? 'Copied!' : 'Copy to Clipboard'}
            </button></div>
            <div><h2>ROOM ID</h2></div>
            <div> <button onClick={() => copyToClipboard(roomId)}>
              {copiedId ? 'Copied!' : 'Copy to Clipboard'}
            </button></div></div>}
      </div>
    </div>
  );
};

export default MatchHost;
