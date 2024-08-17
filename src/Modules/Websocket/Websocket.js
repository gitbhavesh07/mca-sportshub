import React, { useEffect, useState } from 'react';
import projectlogo from '../../Images/Logo.png';
import './Websocket.css';
import MessageBox from './MessageBox';
import { socket } from '../../contexts/WebSocketContext';
import pprofile from '../../Images/playerprofile.jpg';
import tprofile from '../../Images/teamProfile.jpg';
import ConfettiExplosion from 'react-confetti-explosion';
import RoomEntry from './RoomEntry';
import 'react-toastify/dist/ReactToastify.css';
import ToastMessage from '../../toast';

const Websocket = () => {

  const { isSuccess, isError } = ToastMessage();
  const [player, setPlayer] = useState([]);
  const [status, setStatus] = useState('');
  const [points, setPoints] = useState(0);
  const [team, setTeams] = useState([]);
  const [selectedTeam,setSelectedteam]=useState(null);
  const [enteredRoom, setEnteredRoom] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const updateTeamPoints = (teamId, newPoints) => {
    setTeams(prevTeams => {
      return prevTeams.map(team => {
        if (team.id === teamId) {
          return { ...team, teampoint: newPoints };
        }
        return team;
      });
    });
  };

  useEffect(() => {
    console.log(socket);
    if (socket) {
      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('new_player_broadcast', playerDetails => {
        console.log('Received new player details:', playerDetails);
        setPlayer(playerDetails);
        setPoints(playerDetails.points);
        setStatus(playerDetails.playerstatus);
        setSelectedteam(null);
      });

      socket.on('player_sold_broadcast', playerDetails => {
        console.log('Player sold:', playerDetails);
        setStatus(playerDetails.playerstatus);
        updateTeamPoints(playerDetails.team_id, points);
        setTimeout(() => {
          setPlayer([]);
          setPoints(0);
          setStatus('');
          setSelectedteam(null);
        }, 100000);
      });

      socket.on('player_unsold_broadcast', playerDetails => {
        console.log('Player unsold:', playerDetails);
        setStatus(playerDetails.playerstatus);
        setTimeout(() => {
          setPlayer([]);
          setPoints(0);
          setStatus('');
          setSelectedteam(null);
        }, 100000);
      });

      socket.on('points_broadcast', point => {
        console.log('points:', point);
        setPoints(point);
      });

      socket.on('selected_team_broadcast', teamid => {
        console.log('teams:', teamid);
        setSelectedteam(teamid);
      });

      socket.on('team_broadcast', teams => {
        console.log('teams;', teams);
        setTeams(teams);
      });

      socket.on('room_id', _roomId =>{
          setRoomId(_roomId);
          console.log('roomid:',_roomId);
        });

      return () => {
        console.log('unregeistering events...');
        socket.off('connect');
      };
    }
  }, [socket]);

  const bigExplodeProps = {
    force: 1.0,
    duration: 5000,
    particleCount: 700,
    floorHeight: 4600,
    width:7000};

  const handleRoomEntry = (_roomId, username) => {
    console.log(_roomId,username);
        if(roomId===_roomId){
          setEnteredRoom(true);
          console.log(roomId);
          console.log(_roomId);
          isSuccess('Successfully Entered the room');
        } else{
          console.log(roomId);
          console.log(_roomId);
          setEnteredRoom(false);
          isError('Invalid Room ID');

        }
    setRoomId(roomId);
    setUsername(username);
  };

  return (
    <>
      <div className='live-header'>
        <img src={projectlogo} className='live-logo' alt='Project Logo' />
      </div>
      {/* <input type='text' placeholder='Bid Point'/> */}
      {enteredRoom?(
      <div className='live-container'>
        <MessageBox name={username} />
        <div className='live-content'>
        {status==='SOLD'&& <ConfettiExplosion {...bigExplodeProps} />}
          <div className='live-player-container'>
            <div className='point'>
              <div className='point-label'>Bid Point</div>
              <div className='point-value'>{points}</div>
            </div>
            <div className='live-player'>
              <div className='live-default-image'>
                <img
                  src={`https://d293laha5n7chi.cloudfront.net/${player.playerfilename}`}
                  alt={player.playername}
                  onError={e => {
                    e.target.src = pprofile;
                  }}
                />
              </div>
              {status !== '' && <h3 className={`live-PlayerStatus ${status==='UNSOLD'?'unsold':''}`}>{status}</h3>}
              <span className='live-playerContent'>
                <h2>{player.id}</h2>
                <h3>{player.playername}</h3>
                <p>{player.playercategory}</p>
              </span>
            </div>
          </div>
          <div className='live-team'>
            {team.map(teamInfo => (
              <div className={`live-team-box  ${selectedTeam === teamInfo.teamId ? 'selected' : ''}`} key={teamInfo.id}>
                <img
                  src={`https://d293laha5n7chi.cloudfront.net/${teamInfo.teamfilename}`}
                  alt={teamInfo.teamname}
                  onError={e => {
                    e.target.src = tprofile;
                  }}
                />
                <div className='box-content'>
                  <p>{teamInfo.teamshortname}</p>
                  <h2>{teamInfo.teampoint}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      ):(
        <div>
        <RoomEntry onRoomEntry={handleRoomEntry}></RoomEntry>
        </div>
      )}
    </>
  );
};

export default Websocket;
