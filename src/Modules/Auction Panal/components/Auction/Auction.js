import React, { useEffect, useState } from 'react';
import './Auction.css';
import 'react-toastify/dist/ReactToastify.css';
import pprofile from '../../../../Images/playerprofile.jpg';
import tprofile from '../../../../Images/teamProfile.jpg';
import ReactLoading from 'react-loading';
import { UPDATE_SOLD_PLAYER, UPDATE_UNSOLD_PLAYER } from '../../../../Graphql/Mutation/Mutations';
import { FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import { useQuery, useMutation } from '@apollo/client';
import { socket } from '../../../../contexts/WebSocketContext';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';

const Auction = () => {

  const { isSuccess, isError } = ToastMessage();
  const { auctionId, userOption } = useUserContext();
  const [auctionData, setAuctionData] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [teamsData, setTeamsData] = useState({});
  const [tempteams, setTempTeams] = useState([]);
  const [pNo, setPNo] = useState('');
  const [playerProfile, setPlayerProfile] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerStatus, setPlayerStatus] = useState('');
  const [category, setCategory] = useState('');
  const [points, setPoints] = useState(0);
  const [teamId, setTeamId] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const timer = 5000;
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Batting');
  const [search, setSearch] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const { data: findAuctionData, loading: findAuctionLoading, refetch } = useQuery(FIND_AUCTION, {
    variables: {
      'id': auctionId
    }
  });

  useEffect(() => {
    if (!findAuctionLoading) {
      console.log('fetchdata:', findAuctionData.findAuction);

      setAuctionData(findAuctionData.findAuction);
      setOptions(findAuctionData.findAuction.category);
      // setSelectedOption(findAuctionData.findAuction.category[0]);
      console.log(options[0]);
      const availablePlayers = findAuctionData.findAuction.player.filter(item => item.playerstatus !== 'SOLD' && item.playerstatus !== 'UNSOLD');
      if (userOption === 'category') {
        const filteredPlayers = selectedOption.length === 0
          ? availablePlayers.filter(item => item.playercategory === findAuctionData.findAuction.category[0])
          : availablePlayers.filter(item => item.playercategory === selectedOption);

        setPlayerData(filteredPlayers);
      } else {
        setPlayerData(availablePlayers);
      }
      setTeamsData(findAuctionData.findAuction.team);
      setTempTeams(findAuctionData.findAuction.team);
      setPoints(findAuctionData.findAuction.minbid);
      setLoading(false);
      if (socket) {
        const teamsDetails = findAuctionData.findAuction.team.map(team => ({
          teamId: team.id,
          teamshortname: team.teamshortname,
          teampoint: team.availablepoints,
          teamfilename: team.teamfilename
        }));
        socket.emit('teams_details', teamsDetails);
      }
    }
  }, [auctionId, findAuctionData, selectedOption]);

  useEffect(() => {
    setPNo('');
    refetch();
  }, [refresh]);

  const removeContent = () => {
    setTempTeams([]);
    setTeamId('');
    setRefresh(!refresh);
    setShowNoResults(false);
  };

  const generatePlayer = () => {
    if (playerData.length === 0) {
      isError('No Players Available.');
      return;
    }

    if (search) {
      handleSearchPlayer();
    } else {
      generateRandomPlayer();
    }
  };

  const generateRandomPlayer = () => {
    const getRandomIndex = max => {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      return randomArray[0] % max;
    };

    const randomIndex = getRandomIndex(playerData.length);
    const randomPlayer = playerData[randomIndex];
    setPNo(randomPlayer.id);
    setPlayerProfile(randomPlayer.playerfilename);
    setPlayerName(randomPlayer.playername);
    setCategory(randomPlayer.playercategory);
    setPlayerStatus('');
    setSearch(false);
    setShowNoResults(true);

    if (socket) {
      socket.emit('new_player', {
        id: randomPlayer.id,
        playername: randomPlayer.playername,
        playerfilename: randomPlayer.playerfilename,
        category: randomPlayer.playercategory,
        playerstatus: '',
        points
      });
    }
  };

  const handleSearchPlayer = () => {

    const searchPlayer = playerData.find(item => item.id === pNo);

    if (searchPlayer) {
      setPNo(searchPlayer.id);
      setPlayerProfile(searchPlayer.playerfilename);
      setPlayerName(searchPlayer.playername);
      setCategory(searchPlayer.playercategory);
      setPlayerStatus('');
      setSearch(false);
      setShowNoResults(true);
    } else {
      isError('No player found in this category.');
      setSearch(false);
    }
  };

  const handleIncrease = () => {
    if (pNo.length === 0) {
      return;
    }
    const initialIncrease = auctionData.bidincrease;
    setPoints(points + initialIncrease);
    if (socket) {
      socket.emit('points', points + initialIncrease);
    }
  };

  const handlesetTeamId = teamid => {
    if (teamid.length === 0) {
      setTeamId('');
    }
    setTeamId(teamid);
    if (socket) {
      socket.emit('selected_team', teamid);
    }
  };

  const [updateSoldPlayer] = useMutation(UPDATE_SOLD_PLAYER, {
    onCompleted: data => {
      const res = data.updateSoldPlayer;
      setPlayerStatus('SOLD');
      isSuccess(res);
      setTimeout(() => {
        removeContent();
      }, timer);
    },
    onError: error => {
      isError(error.message);
    }
  });

  const handleSold = async () => {
    if (!validate()) {
      return;
    }
    updateSoldPlayer({
      variables: {
        'UpdatePlayerInput': {
          'id': pNo,
          'team_id': teamId,
          'playerstatus': 'SOLD'
        },
        'UpdateTeamInput': {
          'id': teamId,
          'playercount': 1,
          'availablepoints': points
        }
      }
    });
    if (socket) {
      socket.emit('player_sold', {
        player_id: pNo,
        team_id: teamId,
        playerstatus: 'SOLD'
      });
    }
  };

  const validate = () => {
    if (teamId.length === 0) {
      isError('Please select Team');
      return false;
    }
    return true;
  };
  const [updateUnsoldPlayer] = useMutation(UPDATE_UNSOLD_PLAYER, {
    onCompleted: data => {
      const res = data.updateUnsoldPlayer;
      setPlayerStatus('UNSOLD');
      isSuccess(res);
      setTimeout(() => {
        removeContent();
      }, timer);
    },
    onError: error => {
      isError(error.message);
    }
  });

  const handleUnSold = async () => {
    updateUnsoldPlayer({
      variables: {
        'UpdatePlayerInput': {
          'id': pNo,
          'playerstatus': 'UNSOLD'
        }
      }
    });
    if (socket) {
      socket.emit('player_unsold', {
        player_id: pNo,
        playerstatus: 'UNSOLD'
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected');
      });
    }
  }, [socket]);

  const handleClick = value => {
    handleIncrease();
    handlesetTeamId(value);
  };

  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);
    removeContent();
  };

  if (loading) {
    return (
      <div className='loading'>
        <ReactLoading type='bars' color='rgb(255, 196, 0)'
          height={100} width={50} />
      </div>
    );
  } else {
    return (
      <div className='split-container'>
        <div className='Auction-container'>
          <div className='Auction-menu'>
            <div className='controls'>
              <div className='auction-control'>
                <input type='text' value={pNo} placeholder='PNo' className='input-PNo' onChange={e => { setPNo(e.target.value); setSearch(true); setShowNoResults(false); }} />
                <button onClick={generatePlayer} className='new-player' disabled={teamId}>New Player</button>
                <input type='text' value={pNo && points} placeholder='Points' className='input-point' readOnly />
                <button onClick={handleSold} className={showNoResults && 'sold'} disabled={!showNoResults}>SOLD</button>
                <button onClick={handleUnSold} className={showNoResults && 'unsold'} disabled={!showNoResults}>UNSOLD</button>
              </div>
              {userOption === 'category' &&
                <div className='option-control1'>
                  {options.map((item, index) => (
                    <button key={index} className={selectedOption === item ? 'button selectedButton' : 'button'} onClick={() => handleChange(item)}>{item}</button>
                  ))}
                  {/* <Select onChange={handleChange} options={options} className='dropdown' defaultValue={options[0]}/> */}
                </div>
              }
            </div>
            <div className='teamNames'>
              {showNoResults && teamsData.map((item, index) => (
                <button key={index} className='teams' onClick={() => { handleClick(item.id); }}>
                  {item.teamshortname}
                </button>
              ))}
            </div>
          </div>
          <div className='Auction-content'>
            {showNoResults && (
              <div className='Auction-player-content'>
                <div className='Auction-player'>
                  <div className='Auction-default-image'>
                    <img
                      src={`https://d293laha5n7chi.cloudfront.net/${playerProfile}`}
                      alt={playerName}
                      onError={e => {
                        e.target.src = pprofile;
                      }}
                    />
                  </div>
                  {playerStatus && <h3 className='Auction-PlayerStatus' data-testid='sold'>{playerStatus}</h3>}
                  <span className='Auction-playerContent'>
                    <h2>{pNo}</h2>
                    <h3>{playerName}</h3>
                    <p>{category}</p>
                  </span>
                </div>
              </div>
            )}
            {showNoResults && teamId && (
              tempteams
                .filter(item => item.id === teamId)
                .map(item => (
                  <div className='Auction-Team-content'>
                    <div className='Auction-Team' key={item.id}>
                      <div className='Auction-default-image'>
                        <img
                          src={`https://d293laha5n7chi.cloudfront.net/${item.teamfilename}`}
                          alt={item.teamname}
                          onError={e => {
                            e.target.src = tprofile;
                          }}
                        />
                      </div>
                      <span className='Auction-TeamContent'>
                        <h1>{item.teamname}</h1>
                        <p>{item.playercount}</p>
                        <p>Max Points: {item.availablepoints}</p>
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
        {userOption === 'category' &&
          <div className='option-control2'>
            <h2> Choose Category</h2>
            <div className='option-button'>
              {options.map((item, index) => (
                <button key={index} className={selectedOption === item ? 'button selectedButton' : 'button'} onClick={() => handleChange(item)}>{item}</button>
              ))}
            </div>
          </div>
        }
      </div>
    );
  }
};

export default Auction;
