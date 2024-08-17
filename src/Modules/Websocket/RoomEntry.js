
import React, { useState } from 'react';
import  './RoomEntry.css';
const RoomEntry = ({ onRoomEntry }) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');



  const handleEnterRoom = () => {
    if (roomId.trim() === '' || username.trim() === '') {
      setError('Both room ID and username are required.');
      return;
    }
    onRoomEntry(roomId, username);
  };
  return (
    <div className='room'>
    <div className="room-entry-container">
      <h2>Enter a Room</h2>
      <div className="room-entry-form">
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={handleEnterRoom}>Enter Room</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
    </div>
  );
};

export default RoomEntry;
