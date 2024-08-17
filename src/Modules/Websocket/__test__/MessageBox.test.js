import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MessageBox from '../MessageBox';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { socket } from '../../../contexts/WebSocketContext';

jest.mock('../../../contexts/WebSocketContext', () => ({
  socket: {
    emit: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
}));

describe('<MessageBox>', () => {
  test('renders or not', () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <MessageBox name={'NITHISH'} />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);
  });
  test('toggle button',()=>{
    render(
    <BrowserRouter>
    <MockedProvider>
    <MessageBox name={'NITHISH'} />
    </MockedProvider>
    </BrowserRouter>
    );
    const togglebutton= screen.getByTestId('toggle');
    fireEvent.click(togglebutton);
    });
  test('MessageBar Functions', async() => {
    const handleMessage = jest.fn();
    render(
      <BrowserRouter>
        <MockedProvider>
          <MessageBox name={'NITHISH'} />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);
    const testData = {
      name: 'NITHISH',
      content: 'HII',
    };
    const message = screen.getByPlaceholderText('Message');
    fireEvent.change(message, { target: { value:testData.content } });

    const sendMessage = screen.getByTestId('sendMessage');
    fireEvent.click(sendMessage);

    await waitFor(() => {
      expect(socket.emit).toHaveBeenCalledWith('newMessage', {
        name: testData.name,
        content: testData.content
      });

      expect(socket.on).toHaveBeenCalledWith('onMessage', expect.any(Function));
      expect(handleMessage).toHaveBeenCalledWith(testData); 
    })


    // expect(socket.off).toHaveBeenCalledWith('onMessage', expect.any(Function));
  });
});