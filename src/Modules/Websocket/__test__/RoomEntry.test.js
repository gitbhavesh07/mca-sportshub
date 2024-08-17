import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import RoomEntry from '../RoomEntry';
import "@testing-library/jest-dom/extend-expect";
import { toast } from "react-toastify";

describe('<RoomEntry>', () => {
    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <RoomEntry/>
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        
    });

    test('Room Entry success', async() => {
        const onRoomEntry = jest.fn();
        const toastSuccessSpy = jest.spyOn(toast, "success");
        render(
            <BrowserRouter>
                <MockedProvider>
                    <RoomEntry onRoomEntry={onRoomEntry}/>
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        
        const roomId = screen.getByPlaceholderText('Room ID');
        fireEvent.change(roomId, {target:{value:'5a71defd-ae16-4412-a405-8b128b3b9f66'}});
       
        const userName = screen.getByPlaceholderText('Username');
        fireEvent.change(userName, {target:{value:'NITHISH'}});

        const handleEnterRoom = screen.getByText('Enter Room');
        fireEvent.click(handleEnterRoom);
    });

    test('Room Entry error', () => {
        const onRoomEntry = jest.fn();
        render(
            <BrowserRouter>
                <MockedProvider>
                    <RoomEntry onRoomEntry={onRoomEntry}/>
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        
        const roomId = screen.getByPlaceholderText('Room ID');
        fireEvent.change(roomId, {target:{value:''}});
       
        const userName = screen.getByPlaceholderText('Username');
        fireEvent.change(userName, {target:{value:''}});

        const handleEnterRoom = screen.getByText('Enter Room');
        fireEvent.click(handleEnterRoom);

        expect(screen.getByText('Both room ID and username are required.')).toBeInTheDocument();
    });

});
