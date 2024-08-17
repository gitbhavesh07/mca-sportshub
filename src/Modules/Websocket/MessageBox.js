import React, { useState, useEffect,useRef } from 'react';
import './MessageBox.css';
import { BsSendFill } from 'react-icons/bs';
import { socket } from '../../contexts/WebSocketContext';

const MessageBox = ({name}) => {
    const [isOpen, setIsopen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChatMessage] = useState([]);
    const toggele = () => {
        setIsopen(!isOpen);
    };

    const sendMessage = () => {
        if (socket) {
            const data = {
                name,
                content: message};
            socket.emit('newMessage', data);
            setMessage('');
        }
    };

    const handleMessage = data => {
        console.log(data);
        const result=[...chat,data];
        console.log('resuslt',result);
        setChatMessage(result);
    };

    useEffect(() => {
        socket.on('onMessage', handleMessage);
        return () => {
            socket.off('onMessage', handleMessage);
        };
    }, [chat]);

    return (
        <div className='messageBox-container'>
            <div className={isOpen ? 'message-sidebar' : 'message-sidebar-close'} data-TestId='toggle' onClick={toggele}>
                <p>Message</p>
            </div>
            <div className={isOpen ? 'message-bar' : 'message-bar-close'}>
                <div className={isOpen ? 'chat-message' : 'chat-message-close'}>
                    <div className='chat-content'>
                    {chat.map((chatMessage, index) => (                              
                          <div key={index} className={`chat-user-content`}>
                                <p className={`chat-username ${chatMessage.name === name ? 'right' : 'left'}`}>{chatMessage.name}</p>
                                <p className={`user-message ${chatMessage.name === name ? 'right' : 'left'}`}>{chatMessage.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={isOpen ? 'chat-input' : 'chat-input-close'}>
                    <input type='text' placeholder='Message' value={message}
                        onChange={e => setMessage(e.target.value)} />
                    <BsSendFill className='send' onClick={sendMessage} data-testid='sendMessage'/>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
