import React from 'react'
// import Message from './Message'


const Message = ({ message }) => {
    return (
        <div className='message owner'>
        <div className='messageInfo'>
            {/* can add username here or timestamp */}
            <span>{message.timestamp}</span>
        </div>
        <div className='messageContent'>
            <p>{message.message}</p>
        </div>
        </div>
    )
}


const Messages = ({ messages }) => {
    // messages is array of messages 
    return (
        <div className='messages'>
            <Message message={{message: "Hello World", timestamp: "just now"}}/>
            <Message message={{message: "Hello World", timestamp: "just now"}}/>
            <Message message={{message: "Hello World", timestamp: "just now"}}/>
        </div>
    );

    let list = [];
    let message;
    for (message of messages) {
        list.push(<Message message={message}/>)
    }
}

export default Messages