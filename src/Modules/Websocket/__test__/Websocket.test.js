import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Websocket from '../Websocket';
import { socket } from '../../../contexts/WebSocketContext'; 
import { toast } from "react-toastify";
import React, { useState } from 'react';
import {RoomEntry} from '../RoomEntry'
import io from 'socket.io-client';
jest.mock('../../../contexts/WebSocketContext', () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}));
// jest.mock('react', () => ({
//   ...jest.requireActual('react'),
//   useState: jest.fn(),
// }));
describe('Websocket Component', () => {
  it('renders the component when not entered in a room', () => {
    const { container } = render(<Websocket />);
    expect(container).toBeInTheDocument;
  });

  it('handles room entry successfully', async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const roomId = '5a71defd-ae16-4412-a405-8b128b3b9f66';

    const socketOnSpy = jest.spyOn(socket, 'on');
    socketOnSpy.mockImplementationOnce((event, callback) => {
      if (event === 'room_id') {
        callback(roomId);
      }
    });
    
    render(<Websocket />);
    
    const _roomId = screen.getByPlaceholderText('Room ID');
    fireEvent.change(_roomId, { target: { value: roomId } });

    const userName = screen.getByPlaceholderText('Username');
    fireEvent.change(userName, { target: { value: 'NITHISH' } });

    fireEvent.click(screen.getByText('Enter Room'));
    
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith('Successfully Entered the room');
    });
  });

  it('validate input', async() => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const onRoomEntry = jest.fn();
    render(<Websocket />);
    const roomIdInput = screen.getByPlaceholderText('Room ID');
  const usernameInput = screen.getByPlaceholderText('Username');
  fireEvent.change(roomIdInput, { target: { value: '' } });
  fireEvent.change(usernameInput, { target: { value: '' } });
  
    fireEvent.click(screen.getByText('Enter Room'));
    await waitFor(() => {
      expect(screen.getByText('Both room ID and username are required.')).toBeInTheDocument;
    }); 
   });

  it('handles invalid room entry', async() => {
    const toastErrorSpy = jest.spyOn(toast, "error");
    const { getByText } = render(<Websocket />);
    const _roomId = screen.getByPlaceholderText('Room ID');
    fireEvent.change(_roomId, {target:{value:'5876565'}});
    const roomId='5a71defd-ae16-4412-a405-8b128b3b9f66';
    const userName = screen.getByPlaceholderText('Username');
    fireEvent.change(userName, {target:{value:'NITHISH'}});
    fireEvent.click(getByText('Enter Room'));
    await waitFor(() => {
    expect(toastErrorSpy).toHaveBeenCalledWith('Invalid Room ID',{
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark'
  });
  });
  });
  it('handles new_player_broadcast event', async () => {
    const playerDetails = {
      id: '59879',
      playername: 'bhuvana',
      playercategory: 'batting'
    };

    const socketOnSpy = jest.spyOn(socket, 'on');
    socketOnSpy.mockImplementationOnce((event, callback) => {
      if (event === 'new_player_broadcast') {
        callback(playerDetails);
      }
    });

    const { getByText } = render(<Websocket />);
      await waitFor(() => {
      expect(socket.on).toHaveBeenCalledWith('new_player_broadcast', expect.any(Function));
      expect(getByText(playerDetails.playername)).toBeInTheDocument();
      expect(getByText(playerDetails.playercategory)).toBeInTheDocument();
    });
  });

});
